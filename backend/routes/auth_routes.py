from flask import Blueprint, request, jsonify
from backend.services.auth_services import login_user,register_user


auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.post('/login')
def login():
    data = request.get_json()
    ok, token, dashboard = login_user(data)  # unpack 3 values
    if ok:
        return jsonify({'ok': True, 'token': token, 'dashboard': dashboard}), 200
    return jsonify({'ok': False, 'message': token}), 401

@auth_bp.post('/register')
def register():
    data = request.get_json()
    ok, msg_or_token = register_user(data)
    if ok:
        return jsonify({'ok': True, 'token': msg_or_token}), 201
    return jsonify({'ok': False, 'message': msg_or_token}), 400