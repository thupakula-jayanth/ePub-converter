import os
import tempfile
from flask import Flask, request, send_file, jsonify
import subprocess
from flask_cors import CORS

# Create a directory for file uploads
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app, origins=["https://epubconverter-qyz53niv3-koshikamanis-projects.vercel.app"])
ALLOWED_EXTENSIONS = {"epub", "azw3"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/convert", methods=["POST"])
def convert():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if not file.filename or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    input_path = os.path.join(UPLOAD_FOLDER, file.filename)
    output_path = f"{os.path.splitext(input_path)[0]}.pdf"

    file.save(input_path)

    try:
        subprocess.run(["ebook-convert", input_path, output_path], check=True)
        return send_file(output_path, as_attachment=True)
    except subprocess.CalledProcessError:
        return jsonify({"error": "Conversion failed"}), 500
    finally:
        os.remove(input_path)
        if os.path.exists(output_path):
            os.remove(output_path)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
