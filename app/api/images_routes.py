from flask import Blueprint, request
from flask_login import login_required
from werkzeug.utils import secure_filename
from app.aws_helper import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from app.models import db, Image


image_routes = Blueprint('images', __name__)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@image_routes.route('/new', methods=['POST'])
@login_required
def upload_image():
    try:
        if 'file' not in request.files:
            return {"error": "No file part"}, 400

        file = request.files['file']

        if file.filename == '':
            return {"error": "No selected file"}, 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = get_unique_filename(filename)
            file.filename = unique_filename
            upload_response = upload_file_to_s3(file)

            if "errors" in upload_response:
                return upload_response, 400

            form_data = {key.strip(): value.strip() for key, value in request.form.items()}
            image_type = form_data.get('type')
            type_id = form_data.get('type_id')

            if not image_type or not type_id:
                return {"error": "type and type_id are required"}, 400

            # Add the image to the database
            image = Image(
                type=image_type,  # Based on the type (user, server, message)
                type_id=int(type_id),  # Based on the entity ID (user_id, server_id, message_id)
                img_url=upload_response["url"]
            )
            db.session.add(image)
            db.session.commit()

            return image.to_dict(), 201

        return {"error": "File type not allowed"}, 400

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500
    


@image_routes.route('/<int:image_id>', methods=['DELETE'])
@login_required
def delete_image(image_id):
    try:
        image = Image.query.get(image_id)
        if not image:
            return {"error": "Image not found"}, 404

        delete_response = remove_file_from_s3(image.img_url)

        if isinstance(delete_response, dict) and "errors" in delete_response:
            return delete_response, 400

        db.session.delete(image)
        db.session.commit()

        return {"message": "Image deleted successfully"}, 200

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500


@image_routes.route('/', methods=['GET'])
@login_required
def get_all_images():
    try:
        images = Image.query.all()
        print(images)
        return [image.to_dict() for image in images], 200
    except Exception as e:
        return {"error": str(e)}, 500
