import os
from flask import Flask, jsonify, redirect, render_template, request, session, url_for
from data import features, user, latest_reads, last_online, legal_occupations
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from dotenv import load_dotenv

from utls import parse_user_data, validate_registration_data

# Load environment variables
load_dotenv(".env.local")

# Initialize app and secret key
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET")


def get_db_connection(database_url=None):
    # Establish a new SQLite connection
    if not database_url:
        database_url = os.getenv("DATABASE_URL")
    conn = sqlite3.connect(database_url)

    # Enable row factory to access columns by name
    conn.row_factory = sqlite3.Row

    return conn


# Route for landing page
@app.route("/")
def landing():
    return render_template("landing.html", features=features)


# Route for resetting dataabase
@app.route("/reset-database", methods=["GET"])
def reset_database():
    # Get database connection
    conn = get_db_connection()

    return_tuple = None
    try:
        # Drop and create users table
        conn.execute("DROP TABLE IF EXISTS users")
        conn.execute(
            "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, occupation TEXT, password TEXT)"
        )
        conn.commit()

        # Save success
        return_tuple = jsonify({"success": True}), 200

    except sqlite3.Error as e:
        # Save error
        return_tuple = jsonify({"error": str(e)}), 500

    # Close database connection
    conn.close()

    return return_tuple


# Route for register page
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # Parse user data (into a dictionary)
        user_data = parse_user_data(
            request, "email", "occupation", "password", "confirmPassword"
        )

        # Validate user data
        validation_result = validate_registration_data(user_data)
        if validation_result:
            return validation_result

        # Hash password
        hashed_password = generate_password_hash(user_data["password"])

        # Get database connection
        conn = get_db_connection()

        return_tuple = None
        try:
            # Try to insert user into database
            conn.execute(
                "INSERT INTO users (email, occupation, password) VALUES (?, ?, ?)",
                (user_data["email"], user_data["occupation"], hashed_password),
            )
            conn.commit()

            # Save success
            return_tuple = jsonify({"success": True}), 200

        except sqlite3.IntegrityError:
            # Save error
            return_tuple = (
                jsonify(
                    {
                        "error": "User already exists, please try again with a different email."
                    }
                ),
                400,
            )

        except sqlite3.Error as e:
            # Save error
            return_tuple = jsonify({"error": str(e)}), 500

        # Close database connection
        conn.close()

        return return_tuple

    return render_template("register.html", legal_occupations=legal_occupations)


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Parse user data (into a dictionary)
        user_data = parse_user_data(request, "email", "password")

        # Get database connection
        conn = get_db_connection()

        return_tuple = None
        try:
            # Get user from database
            user = conn.execute(
                "SELECT * FROM users WHERE email = ?", (user_data["email"],)
            ).fetchone()

            # If user does not exist, save error
            if user is None:
                return_tuple = (
                    jsonify({"error": "User does not exist, please register first."}),
                    400,
                )

            # If password is incorrect, save error
            if not check_password_hash(user["password"], user_data["password"]):
                return_tuple = (
                    jsonify({"error": "Password is incorrect, please try again."}),
                    400,
                )

            # Otherwise, save user data in session
            session["user_id"] = user["id"]
            session["user_email"] = user["email"]

            # Save success
            return_tuple = jsonify({"success": True}), 200

        except sqlite3.Error as e:
            # Save error
            return_tuple = jsonify({"error": str(e)}), 500

        # Close database connection
        conn.close()

        return return_tuple

    elif "user_id" in session:
        return redirect(url_for("dashboard"))

    return render_template("login.html")


@app.route("/dashboard", methods=["GET"])
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("login"))

    return render_template(
        "dashboard.html", user=user, latest_reads=latest_reads, last_online=last_online
    )


@app.route("/logout", methods=["GET"])
def logout():
    session.pop("user_id", None)
    session.pop("user_email", None)

    return redirect(url_for("landing"))


if __name__ == "__main__":
    app.run(debug=True)
