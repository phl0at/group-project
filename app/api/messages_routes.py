from flask import Blueprint, request
from app.models import db, Message
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename
from app.aws_helper import get_unique_filename, upload_file_to_s3, remove_file_from_s3

messages_routes = Blueprint("messages", __name__)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@messages_routes.route('/<int:message_id>', methods=['PUT'])
@login_required
def update_message(message_id):
    message = Message.query.get(message_id)
    if not message:
        return {"error": "Message not found"}, 404

    if message.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    try:
        data = request.form if request.form else request.json

        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_filename = get_unique_filename(filename)
                file.filename = unique_filename
                upload_response = upload_file_to_s3(file)

                if "errors" in upload_response:
                    return upload_response, 400

                if message.image_url:
                    remove_file_from_s3(message.image_url)

                message.image_url = upload_response["url"]

        message.text = data.get('text', message.text)

        db.session.commit()
        return message.to_dict(), 200

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500
    


@messages_routes.route("<int:id>", methods=["DELETE"])
@login_required
def delete_message(id):
    message = Message.query.get(id)

    if not message:
        return { "error": "Message couldn't be found" }, 404
    elif message.to_dict()["user_id"] is not current_user.id:
        return { "error": "Forbidden" }, 403
    else:
        db.session.delete(message)
        db.session.commit()
        return { "message": "Successfully deleted" }, 200
