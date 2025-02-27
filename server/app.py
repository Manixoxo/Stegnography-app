from flask import Flask
from flask_cors import CORS
from .config.config import Config
from .routes.stego_routes import stego_bp
import os

app = Flask(__name__)
CORS(app)

# Ensure temp directory exists
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

# Register routes
app.register_blueprint(stego_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.PORT, debug=True)