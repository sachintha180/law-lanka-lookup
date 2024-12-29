from flask import jsonify
from data import legal_occupations


def parse_user_data(request, *keys):
    # Read user data from JSON
    user_data = {key: request.json.get(key) for key in keys}

    return user_data


def validate_registration_data(user_data):
    # Check if password and confirm password match
    if user_data["password"] != user_data["confirmPassword"]:
        return jsonify({"error": "Passwords do not match, please try again."}), 400

    # Check if password is at least 8 characters long
    if len(user_data["password"]) < 8:
        return (
            jsonify({"error": "Password must be at least 8 characters long."}),
            400,
        )

    # Chcek if occupation is valid
    if user_data["occupation"] not in legal_occupations:
        return jsonify({"error": "Invalid occupation, please try again."}), 400
