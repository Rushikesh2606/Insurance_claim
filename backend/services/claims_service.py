from datetime import datetime
from extensions import mongo
from bson import ObjectId

db = mongo.get_database()
claims_col = db["claims"]

# ---------- helpers ----------
def generate_hex_id() -> str:
    return str(ObjectId())

def seed_claims() -> dict:
    claims_col.delete_many({})
    sample = [
        {
            "_id"        : generate_hex_id(),
            "claimNumber": "C-1001",
            "customer"   : "John Doe",
            "type"       : "Health",
            "status"     : "open",
            "priority"   : "High",
            "date"       : "2025-10-01",
            "amount"     : 1200,
        },
        {
            "_id"        : generate_hex_id(),
            "claimNumber": "C-1002",
            "customer"   : "Jane Smith",
            "type"       : "Auto",
            "status"     : "closed",
            "priority"   : "Low",
            "date"       : "2025-09-20",
            "amount"     : 3400,
        },
    ]
    claims_col.insert_many(sample)
    return {"message": "Dummy claims seeded"}

def get_status_summary() -> dict:
    pipeline = [{"$group": {"_id": "$status", "count": {"$sum": 1}}}]
    summary = list(claims_col.aggregate(pipeline))
    return {item["_id"].lower(): item["count"] for item in summary}

def get_claims() -> list:
    claims = list(claims_col.find({}))
    for c in claims:
        c["_id"] = str(c["_id"])
    return claims

def create_claim(data: dict) -> dict:
    required = [
        "claimNumber", "policyNumber", "customerName",
        "customerEmail", "claimAmount", "status", "priority", "description"
    ]
    for key in required:
        if key not in data:
            raise ValueError(f"{key} is required")

    doc = {
        **data,
        "_id"        : generate_hex_id(),
        "customer"   : data["customerName"],
        "amount"     : float(data["claimAmount"]),
        "type"       : data.get("type", "Home"),
        "date"       : datetime.utcnow().strftime("%Y-%m-%d"),
        "updatedAt"  : datetime.utcnow().isoformat(),
    }
    claims_col.insert_one(doc)
    return {"_id": doc["_id"], "message": "Claim created"}
