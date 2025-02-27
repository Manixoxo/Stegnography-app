from stegano import lsb
import os

def encode_image(image_path, message, output_path):
    """Encode a message into an image using LSB steganography."""
    print(f"Input image exists: {os.path.exists(image_path)}")
    print(f"Output path: {output_path}")
    print(f"Output directory writable: {os.access(os.path.dirname(output_path), os.W_OK)}")
    secret = lsb.hide(image_path, message)
    secret.save(output_path)
    print(f"Output saved: {os.path.exists(output_path)}")
    return output_path

def decode_image(image_path):
    """Decode a message from an image."""
    return lsb.reveal(image_path)

def cleanup_files(*file_paths):
    """Remove temporary files."""
    for file_path in file_paths:
        if os.path.exists(file_path):
            os.remove(file_path)