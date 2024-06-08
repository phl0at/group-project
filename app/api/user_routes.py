from flask import Blueprint,request
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from app.aws_helper import get_unique_filename, upload_file_to_s3, remove_file_from_s3
from app.models import db, User

user_routes = Blueprint('users', __name__)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(user_id)

    if not user:
        return {"error": "User not found"}, 404

    if user.id != current_user.id:
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

                if user.image_url:
                    remove_file_from_s3(user.image_url)

                user.image_url = upload_response["url"]

        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)

        db.session.commit()
        return user.to_dict(), 200

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500
    