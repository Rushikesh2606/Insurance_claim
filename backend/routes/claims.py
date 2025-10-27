from flask import Blueprint, jsonify, request
from extensions import mongo
from datetime import datetime

claims_bp = Blueprint("claims", __name__, url_prefix="/api/claims")
claims = mongo.db.claims          # collection

# ---------- UTIL ----------
def status_counter():
    pipeline = [{"$group": {"_id": "$status", "count": {"$sum": 1}}}]
    return {doc["_id"]: doc["count"] for doc in claims.aggregate(pipeline)}

# ---------- ROUTES ----------
@claims_bp.route("/status-summary", methods=["GET"])
def status_summary():
    return jsonify(status_counter())

@claims_bp.route("", methods=["GET"])
def list_claims():
    return jsonify(list(claims.find({}, {"_id": 0})))

@claims_bp.route("/seed", methods=["POST"])
def seed():
    if claims.estimated_document_count():
        return jsonify({"msg": "already seeded"})
    dummy = [
        {"claimNumber": "CAR-2024-001", "customer": "John Smith", "type": "Car Insurance", "status": "open", "priority": "high", "date": "2024-01-15", "amount": 5500},
        {"claimNumber": "CAR-2024-002", "customer": "Sarah Johnson", "type": "Car Insurance", "status": "closed", "priority": "medium", "date": "2024-01-10", "amount": 2300},
        {"claimNumber": "LIFE-2024-001", "customer": "Michael Brown", "type": "Life Insurance", "status": "processing", "priority": "high", "date": "2024-01-05", "amount": 150000},
        {"claimNumber": "HEALTH-2024-001", "customer": "Emily Davis", "type": "Health Insurance", "status": "open", "priority": "high", "date": "2024-01-18", "amount": 8500},
        {"claimNumber": "HEALTH-2024-002", "customer": "Robert Wilson", "type": "Health Insurance", "status": "closed", "priority": "low", "date": "2024-01-12", "amount": 1200},
    ]
    claims.insert_many(dummy)
    return jsonify({"msg": "seeded"})