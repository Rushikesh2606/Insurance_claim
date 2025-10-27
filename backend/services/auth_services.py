from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from extensions import mongo
from bson import ObjectId

# Database & collection
db  = mongo.get_database()
col = db["users"]

# ---------- optional robustness ----------
try:
    col.find_one({})          # cheap no-op: guarantees connection / index cache
except Exception as e:
    print("⚠️  Mongo ping failed:", e)   # keeps running even if DB down
# -----------------------------------------

def login_user(data: dict):
    email = data["email"].lower()
    user = col.find_one({"email": email})

    if not user:
        return False, "Invalid credentials", None

    if check_password_hash(user["password"], data["password"]):
        role = user.get("role", "admin").lower()  # default to Employee if missing
        # Decide dashboard based on role
        dashboard=""
        if role == "admin":
            dashboard = "/Dashboard"
        elif role == "manager":
            dashboard = "/Manager_Dashboard"
        print("hello"+dashboard)
        return True, "fake-jwt-token", dashboard

    return False, "Invalid credentials", None

def register_user(data: dict):
    print("DB   :", db)   # temporary debug
    print("COL  :", col)
    email = data["email"].lower()
    if col.find_one({"email": email}):
        return False, "Email already registered"

    doc = {
        "fullName": data.get("fullName", ""),
        "email":    email,
        "password": generate_password_hash(data["password"]),
        "role":     data.get("role", "Employee"),
        "createdAt": datetime.utcnow(),
    }
    res = col.insert_one(doc)
    return True, "fake-jwt-token"
