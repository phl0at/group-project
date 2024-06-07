from flask import Blueprint, request
from app.models import db, Message
from flask_login import current_user, login_required


messages_routes = Blueprint("messages", __name__)


@messages_routes.route("/<int:id>", methods=["PUT"])
@login_required
def edit_message(id):
    data = request.get_json()

    if not data.get('text'):
        return {"error": "Message text is required"}, 400

    if len(data["text"]) < 1 or len(data["text"]) > 140:
        return {"error": "Message must be between 1 and 140 characters"}, 400

    message = Message.query.get(id)

    if not message:
        return {"error": "Message not found"}, 404

    if message.user_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    try:
        message.text = data["text"]
        db.session.commit()
        return message.to_dict(), 200
    except Exception as e:
        db.session.rollback()
        return {"error": "An error occurred while updating the message"}, 500


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
