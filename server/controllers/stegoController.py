from flask import send_file, Response
import os
from ..utils.stego_utils import encode_image, decode_image, cleanup_files
from ..config.config import Config
from ..middleware.file_handler import validate_file
from io import BytesIO

def encode():
    from flask import request
    
    validation_error, status = validate_file()
    if validation_error:
        return validation_error, status

    image = request.files["image"]
    message = request.form.get("message", "")
    if not message:
        return {"error": "No message provided"}, 400

    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    temp_path = os.path.abspath(os.path.join(Config.UPLOAD_FOLDER, "temp.png"))
    output_path = os.path.abspath(os.path.join(Config.UPLOAD_FOLDER, "output.png"))
    print(f"Temp directory exists: {os.path.exists(Config.UPLOAD_FOLDER)}")
    print(f"Temp path: {temp_path}")
    print(f"Output path: {output_path}")

    try:
        image.save(temp_path)
        print(f"Temp file saved: {os.path.exists(temp_path)}")
        encode_image(temp_path, message, output_path)
        print(f"Output file created: {os.path.exists(output_path)}")
        
        # Read the file into memory and clean up immediately
        with open(output_path, 'rb') as f:
            file_data = f.read()
        cleanup_files(temp_path, output_path)  # Clean up before sending
        
        # Send the file data as a response
        return Response(
            file_data,
            mimetype="image/png",
            headers={"Content-Disposition": "attachment; filename=encoded_image.png"}
        )
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        cleanup_files(temp_path, output_path)
        return {"error": f"Encoding failed: {str(e)}"}, 500

def decode():
    from flask import request
    
    validation_error, status = validate_file()
    if validation_error:
        return validation_error, status

    image = request.files["image"]
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    temp_path = os.path.abspath(os.path.join(Config.UPLOAD_FOLDER, "temp.png"))

    try:
        image.save(temp_path)
        message = decode_image(temp_path)
        cleanup_files(temp_path)
        return {"message": message}
    except Exception as e:
        cleanup_files(temp_path)
        return {"error": f"Decoding failed: {str(e)}"}, 500