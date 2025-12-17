from extensions import db
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

# db = SQLAlchemy()

def current_time_utc():
    return datetime.now(timezone.utc)

class File(db.Model):
    __tablename__ = "files"

    id = db.Column(db.Integer, primary_key=True)
    original_filename = db.Column(db.String(255), nullable=False)
    stored_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=current_time_utc)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    # created_at = db.Column(db.DateTime, default=current_time_utc)

    files = db.relationship(
        "File",
        backref="user",
        cascade="all, delete",
        lazy=True
    )


