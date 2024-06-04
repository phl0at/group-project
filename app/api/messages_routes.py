from flask import Blueprint, request
from app.models import db, Message
from flask_login import current_user, login_required


messages_routes = Blueprint("messages", __name__)


@messages_routes.route("/<int:id>", methods=["POST"])
@login_required
def edit_message(id):
    pass


@messages_routes.route("<int:id>", methods=["DELETE"])
@login_required
def delete_message(id):
    message = Message.query.get(id)

    if not message:
        return { "error": "Message couldn't be found" }, 400
    elif message.to_dict()["user_id"] is not current_user.id:
        return { "error": "Forbidden" }, 403
    else:
        db.session.delete(message)
        db.session.commit()
        return { "message": "Successfully deleted" }, 200
