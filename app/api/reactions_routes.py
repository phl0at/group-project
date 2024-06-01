from flask import Blueprint, request
from app.models import db
from flask_login import current_user, login_required


reactions_routes = Blueprint("reactions", __name__)


@reactions_routes.route("/<int:id>", methods=["POST"])
@login_required
def create_reaction(id):
    pass


@reactions_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_reaction(id):
    pass
