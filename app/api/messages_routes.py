from flask import Blueprint, request
from app.models import db
from flask_login import current_user


messages_routes = Blueprint("messages", __name__)


@messages_routes.route("/<int:id>", methods=["POST"])
def edit_message(id):
    pass


@messages_routes.route("<int:id>", methods=["DELETE"])
def delete_message(id):
    pass
