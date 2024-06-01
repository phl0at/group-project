from flask import Blueprint, request
from app.models import db
from flask_login import current_user, login_required


channels_routes = Blueprint("channels", __name__)


@channels_routes.route("/<int:id>")
@login_required
def get_channel(id):
    pass


@channels_routes.route("/", methods=["POST"])
@login_required
def create_channel():
    pass


@channels_routes.route("/<int:id>")
@login_required
def delete_channel(id):
    pass


@channels_routes.route("/<int:id>/messages")
@login_required
def get_all_messages(id):
    pass


@channels_routes.route("/<int:id>/messages", methods=["POST"])
@login_required
def create_message(id):
    pass
