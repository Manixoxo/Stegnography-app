from flask import Blueprint
from ..controllers.stegoController import encode, decode

stego_bp = Blueprint("stego", __name__)

stego_bp.route("/encode", methods=["POST"])(encode)
stego_bp.route("/decode", methods=["POST"])(decode)