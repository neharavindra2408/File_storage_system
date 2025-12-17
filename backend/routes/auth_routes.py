from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from database.models import db, User
from extensions import bcrypt

auth_bp = Blueprint("auth", __name__)

# --------------------------
# REGISTER
# --------------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    exists = User.query.filter_by(email=email).first()
    if exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(email=email, password=hashed_pw)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201


# --------------------------
# LOGIN
# --------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT token
    token = create_access_token(identity=str(user.id))
    #print("LOGIN DATA:", request.json)
    return jsonify({
        "access_token": token,
        "user_id": user.id
    }), 200
