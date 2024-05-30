from flask import Blueprint, request
from app.models import db
from flask_login import current_user


reactions_routes = Blueprint("reactions", __name__)


@reactions_routes.route("/<int:id>", methods=["POST"])
def create_reaction(id):
    pass

@reactions_routes.route("/<int:id>", methods=["DELETE"])
def delete_reaction(id):
    pass
