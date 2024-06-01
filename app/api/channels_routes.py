from flask import Blueprint, request
from app.models import db
from flask_login import current_user


channels_routes = Blueprint("channels", __name__)


@channels_routes.route("/<int:id>")
def get_channel(id):
    pass


@channels_routes.route("/", methods=["POST"])
def create_channel():
    pass


@channels_routes.route("/<int:id>")
def delete_channel(id):
    pass


@channels_routes.route("/<int:id>/messages")
def get_all_messages(id):
    pass


@channels_routes.route("/<int:id>/messages", methods=["POST"])
def create_message(id):
    pass
