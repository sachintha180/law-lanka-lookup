from data import legal_occupations


def parse_user_data(request, *keys):
    # Read user data from JSON
    user_data = {key: request.json.get(key) for key in keys}

    return user_data


def validate_user_data(user_data):
    # Check if full name has at least two words
    if len(user_data["full_name"].split()) < 2:
        return {
            "success": False,
            "message": "Full name must have at least two names.",
        }

    # Check if password and confirm password match
    if user_data["password"] != user_data["confirm_password"]:
        return {
            "success": False,
            "message": "Passwords do not match, please try again.",
        }

    # Check if password is at least 8 characters long
    if len(user_data["password"]) < 8:
        return {
            "success": False,
            "message": "Password must be at least 8 characters long.",
        }

    # Chcek if occupation is valid
    if user_data["occupation"] not in legal_occupations:
        return {
            "success": False,
            "message": "Invalid occupation, please try again.",
        }

    return {"success": True, "message": None}
