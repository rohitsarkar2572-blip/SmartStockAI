from services.auth_service import create_user, get_user_by_email

user = {
    "name": "Rajat",
    "email": "rajat@gmail.com",
    "password": "87654321"
}

existing = get_user_by_email(user["email"])

if existing:
    print("❌ User already exists")
else:
    user_id = create_user(user)
    print("✅ User Created:", user_id)