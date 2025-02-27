from flask import request
from werkzeug.utils import secure_filename
import os

def validate_file():
    if "image" not in request.files:
        return {"error": "No image uploaded"}, 400

    image = request.files["image"]
    filename = secure_filename(image.filename)
    ext = os.path.splitext(filename)[1].lower()
    valid_extensions = {".png", ".jpg", ".jpeg"}

    if not ext or ext not in valid_extensions:
        return {"error": "Invalid file type. Use PNG or JPG"}, 400

    # Check MIME type (optional, but corrected)
    if image.mimetype and "image" not in image.mimetype:
        return {"error": "File is not an image"}, 400

    # 5MB limit (content_length is for the entire request, not just the file)
    if request.content_length and request.content_length > 5 * 1024 * 1024:
        return {"error": "File size exceeds 5MB"}, 400

    return None, None