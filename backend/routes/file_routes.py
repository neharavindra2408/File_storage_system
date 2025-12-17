import os
import uuid
from flask import Blueprint, request, jsonify, send_file, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.models import db, File

files_bp = Blueprint("files", __name__)

@files_bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    user_id = get_jwt_identity()
    return jsonify({
        "msg": "Access granted",
        "user_id": user_id
    })

# -------------------------
# File upload route
#--------------------------
@files_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_file():
    user_id = int(get_jwt_identity())

    if "file" not in request.files:
        return jsonify({"msg": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"msg": "No selected file"}), 400

    # Create unique filename
    unique_name = f"{uuid.uuid4()}_{file.filename}"
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(upload_folder, unique_name)
    file.save(file_path)

    new_file = File(
        original_filename=file.filename,
        stored_filename=unique_name,
        file_path=file_path,
        user_id=user_id
    )

    db.session.add(new_file)
    db.session.commit()

    return jsonify({"msg": "File uploaded successfully"}), 201

#--------------------------
# List user files
#--------------------------
@files_bp.route("/list", methods=["GET"])
@jwt_required()
def list_files():
    user_id = int(get_jwt_identity())

    files = File.query.filter_by(user_id=user_id).all()

    result = []
    for f in files:
        result.append({
            "id": f.id,
            "filename": f.original_filename,
            "uploaded_at": f.uploaded_at
        })

    return jsonify(result), 200

#----------------------------
# Download user file
#----------------------------
@files_bp.route("/download/<int:file_id>", methods=["GET"])
@jwt_required()
def download_file(file_id):
    user_id = int(get_jwt_identity())

    file = File.query.filter_by(id=file_id, user_id=user_id).first()
    if not file:
        return jsonify({"msg": "File not found"}), 404

    return send_file(
        file.file_path,
        as_attachment=True,
        download_name=file.original_filename
    )

#---------------------------
# Delete user files
#---------------------------
@files_bp.route("/delete/<int:file_id>", methods=["DELETE"])
@jwt_required()
def delete_file(file_id):
    user_id = int(get_jwt_identity())

    file = File.query.filter_by(id=file_id, user_id=user_id).first()
    if not file:
        return jsonify({"msg": "File not found"}), 404

    if os.path.exists(file.file_path):
        os.remove(file.file_path)

    db.session.delete(file)
    db.session.commit()

    return jsonify({"msg": "File deleted"}), 200

