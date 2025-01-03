import os
from flask import Flask, jsonify, redirect, render_template, request, session, url_for
from data import features, latest_reads, last_online, legal_occupations
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

from database import SQLiteDatabase
from utils import parse_user_data, validate_user_data

# Load environment variables
load_dotenv(".env.local")

# Initialize app and secret key
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET")

# Initialize SQLite database instance
db = SQLiteDatabase()


# Route for landing page
@app.route("/")
def landing():
    return render_template("landing.html", features=features)


# Route for initializing database
@app.route("/init-database", methods=["GET"])
def init_database():
    # Initialize database
    status = db.initialize_db()

    # Delete all session variables
    session.clear()

    # Return JSON status w/ appropriate status code
    return jsonify(status), 200 if status["success"] else 500


# Route for register page
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # Parse user data into a dictionary
        user_data = parse_user_data(
            request, "full_name", "email", "occupation", "password", "confirm_password"
        )

        # Validate user data
        validation_result = validate_user_data(user_data)
        if not validation_result["success"]:
            return (
                jsonify({"success": False, "message": validation_result["message"]}),
                400,
            )

        # Hash password
        hashed_password = generate_password_hash(user_data["password"])

        # Update occupation via dictionary
        user_data["occupation"] = legal_occupations[user_data["occupation"]]

        # Insert user into database
        status = db.insert_user(user_data, hashed_password)

        # Return JSON status w/ appropriate status code
        return jsonify(status), 200 if status["success"] else 500

    return render_template("register.html", legal_occupations=legal_occupations)


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Parse user data into a dictionary
        user_data = parse_user_data(request, "email", "password")

        # Select user from database
        status = db.select_user(email=user_data["email"])

        # Check if selection failed
        if not status["success"]:
            return jsonify(status), 500

        # Check if password is correct
        if not check_password_hash(status["user"]["password"], user_data["password"]):
            status = {
                "success": False,
                "message": "Incorrect password, please try again.",
            }
            return jsonify(status), 400

        # Set session variables
        session["user_id"] = status["user"]["id"]
        session["user_email"] = status["user"]["email"]

        # Return JSON status
        return jsonify(status), 200

    # Redirect user if already logged in
    elif "user_id" in session:
        return redirect(url_for("dashboard"))

    return render_template("login.html")


@app.route("/dashboard", methods=["GET"])
def dashboard():
    # Check if user is not logged in
    if "user_id" not in session:
        return redirect(url_for("login"))

    # Select user from database
    status = db.select_user(user_id=session["user_id"])

    # Return to login page if selection failed
    if not status["success"]:
        return redirect(url_for("login"))

    # Prepare user data
    user = {
        "first_name": status["user"]["full_name"].split()[0].capitalize(),
        "full_name": status["user"]["full_name"],
        "email": status["user"]["email"],
        "occupation": status["user"]["occupation"],
    }

    # Render dashboard template w/ user data
    return render_template(
        "dashboard.html",
        user=user,
        legal_occupations=legal_occupations,
        latest_reads=latest_reads,
        last_online=last_online,
    )


@app.route("/logout", methods=["GET"])
def logout():
    # Check if user is not logged in
    if "user_id" not in session:
        return redirect(url_for("login"))

    # Remove session variables
    session.pop("user_id", None)
    session.pop("user_email", None)

    # Redirect to landing page
    return redirect(url_for("landing"))


@app.route("/edit_profile", methods=["POST"])
def edit_profile():
    # Check if user is not logged in
    if "user_id" not in session:
        return redirect(url_for("login"))

    # Parse user data into a dictionary
    user_data = parse_user_data(
        request, "full_name", "email", "occupation", "password", "confirm_password"
    )

    # Validate user data
    validation_result = validate_user_data(user_data)
    if not validation_result["success"]:
        return (
            jsonify({"success": False, "message": validation_result["message"]}),
            400,
        )

    # Hash password
    hashed_password = generate_password_hash(user_data["password"])

    # Update occupation via dictionary
    user_data["occupation"] = legal_occupations[user_data["occupation"]]

    # Update user in database
    status = db.update_user(session["user_id"], user_data, hashed_password)

    # Update session email if successful
    if status["success"]:
        session["user_email"] = user_data["email"]

    # Return JSON status w/ appropriate status code
    return jsonify(status), 200 if status["success"] else 500


@app.route("/delete_account", methods=["POST"])
def delete_account():
    # Check if user is not logged in
    if "user_id" not in session:
        return redirect(url_for("login"))

    # Delete user from database
    status = db.delete_user(session["user_id"])

    # Remove session variables
    session.pop("user_id", None)
    session.pop("user_email", None)

    # Return JSON status w/ appropriate status code
    return jsonify(status), 200 if status["success"] else 500


if __name__ == "__main__":
    app.run(debug=True)
