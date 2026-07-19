from models.user import users_collection
from utils.security import hash_password, verify_password


def get_user_by_email(email: str):
    """
    Find a user by email
    """
    return users_collection.find_one({"email": email})


def create_user(user_data: dict):
    """
    Create a new user
    """

    # Hash password
    user_data["password"] = hash_password(user_data["password"])

    # Insert into MongoDB
    result = users_collection.insert_one(user_data)

    return str(result.inserted_id)


def login_user(email: str, password: str):
    """
    Login user
    """

    user = users_collection.find_one({"email": email})

    if not user:
        return None

    if not verify_password(password, user["password"]):
        return None

    return user