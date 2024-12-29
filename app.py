import os
from flask import Flask, jsonify, redirect, render_template, request, url_for
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


# Initialize database connection
def get_db_connection(database_url=None):
    if not database_url:
        database_url = os.getenv("DATABASE_URL")
    conn = sqlite3.connect(database_url)
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

    try:
        # Drop and create users table
        conn.execute("DROP TABLE IF EXISTS users")
        conn.execute(
            "CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, occupation TEXT, password TEXT)"
        )

        # Commit changes
        conn.commit()

        # Close database connection
        conn.close()

        # Return success message
        return jsonify({"success": True}), 200

    except sqlite3.Error as e:
        # Return error message
        return jsonify({"error": str(e)}), 500


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
        hashed_password = generate_password_hash(user_data["password"], method="sha256")

        # Get database connection
        conn = get_db_connection()

        try:
            # Try to insert user into database
            conn.execute(
                "INSERT INTO users (email, occupation, password) VALUES (?, ?, ?)",
                (user_data["email"], user_data["occupation"], hashed_password),
            )
            conn.commit()

            # Close database connection
            conn.close()

            # Return success
            return jsonify({"success": True}), 200

        except sqlite3.IntegrityError:
            # Otherwise, return error due to user already existing
            return (
                jsonify(
                    {
                        "error": "User already exists, please try again with a different email."
                    }
                ),
                400,
            )

    return render_template("register.html", legal_occupations=legal_occupations)


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/dashboard")
def dashboard():
    return render_template(
        "dashboard.html", user=user, latest_reads=latest_reads, last_online=last_online
    )


if __name__ == "__main__":
    app.run(debug=True)
