from flask import Blueprint, request
from app.models import db, Server, User
from flask_login import current_user


servers_routes = Blueprint("servers", __name__)


@servers_routes.route("/")
def all_servers():
    all_servers = Server.query.all()
    return [server.to_dict() for server in all_servers]


@servers_routes.route("/current")
def users_servers():
    pass


@servers_routes.route("/<int:id>")
def one_server(id):
    ## GET all servers where id = id, include channels, messages, reactions
    pass


@servers_routes.route("/", methods=["POST"])
def create_server():
    pass


@servers_routes.route("/<int:id>", methods=["PUT"])
def edit_server(id):
    pass


@servers_routes.route("/<int:id>", methods=["DELETE"])
def delete_server(id):
    pass
