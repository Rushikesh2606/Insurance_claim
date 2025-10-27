# claims_routes.py
from flask import Blueprint, jsonify, request
from bson import ObjectId
from datetime import datetime
from services.claims_service import (
    get_claims, get_status_summary, seed_claims, create_claim
)

claims_bp = Blueprint("claims", __name__)

@claims_bp.route("/claims", methods=["GET"])
def api_get_claims():
    return jsonify(get_claims())

@claims_bp.route("/claims/status-summary", methods=["GET"])
def api_status_summary():
    return jsonify(get_status_summary())

@claims_bp.route("/claims/seed", methods=["POST"])
def api_seed_claims():
    return jsonify(seed_claims())

@claims_bp.route("/claims", methods=["POST"])
def api_create_claim():
    try:
        data = request.get_json() or {}
        result = create_claim(data)
        return jsonify(result), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

# ---------- NEW ----------
@claims_bp.route("/claims/<id>", methods=["GET"])
def api_get_claim(id):
    # reuse the same collection reference already inside the service
    from services.claims_service import claims_col, ObjectId
    doc = claims_col.find_one({"_id": ObjectId(id)})
    if not doc:
        return jsonify({"error": "Not found"}), 404
    doc["_id"] = str(doc["_id"])
    return jsonify(doc)

@claims_bp.route("/claims/<id>", methods=["PUT"])
def api_update_claim(id):
    from services.claims_service import claims_col
    data = request.get_json() or {}

    result = claims_col.update_one(
        {"_id": ObjectId(id)},
        {"$set": {
            "claimNumber": data.get("claimNumber"),
            "policyNumber": data.get("policyNumber"),
            "type": data.get("type"),
            "status": data.get("status"),
            "priority": data.get("priority"),
            "amount": float(data.get("amount", 0)),
            "customer": data.get("customer"),
            "customerEmail": data.get("customerEmail"),
            "description": data.get("description"),
            "updatedAt": datetime.utcnow().isoformat()
        }}
    )

    if result.modified_count == 0:
        return jsonify({"error": "No claim updated"}), 404
    return jsonify({"message": "Claim updated successfully"})
@claims_bp.route("/claims/<id>", methods=["DELETE"])
def api_delete_claim(id):
    from services.claims_service import claims_col

    result = claims_col.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        return jsonify({"error": "Claim not found"}), 404

    return jsonify({"message": "Claim deleted successfully"}), 200
