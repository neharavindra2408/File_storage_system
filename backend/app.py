import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from flask import Flask
from config import Config
from extensions import bcrypt, db
from database import models
from routes.auth_routes import auth_bp
import pymysql
pymysql.install_as_MySQLdb()
from flask_jwt_extended import JWTManager
from routes.file_routes import files_bp
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    # Init extensions
    bcrypt.init_app(app)
    db.init_app(app)

    # JWT
    jwt = JWTManager(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(files_bp, url_prefix="/files")

    # Create DB tables only in development
    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run()

