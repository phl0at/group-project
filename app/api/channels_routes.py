from flask import Blueprint, request
from app.models import db, Channel, Server, Message
from flask_login import current_user, login_required


channels_routes = Blueprint("channels", __name__)


@channels_routes.route("/<int:server_id>")
@login_required
def get_server_channels(server_id):
    channels = Channel.query.filter(Channel.server_id == server_id)
    return [channel.to_dict() for channel in channels]


@channels_routes.route("/", methods=["POST"])
@login_required
def create_channel():
    data = request.get_json()

    server_id = data.get('server_id')
    name = data.get('name')

    if not server_id or not name:
        return {"error": "Server ID and Name are required"}, 400

    if len(name) < 1 or len(name) > 50:
        return {"error": "Name must be between 1 and 50 characters"}, 400

    server = Server.query.get(server_id)
    if not server:
        return {"error": "Server not found"}, 404

    if server.owner_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    try:
        new_channel = Channel(
            server_id=server_id,
            name=name
        )
        db.session.add(new_channel)
        db.session.commit()

        return new_channel.to_dict(), 201

    except Exception as e:
        db.session.rollback()
        return {"error": "An error occurred while creating the channel"}, 500


@channels_routes.route("/<int:id>", methods=['PUT'])
@login_required
def edit_channel(id):

    channel = Channel.query.get(id)
    if not channel:
        return {"error": "Channel not found"}, 404

    server = Server.query.get(channel.server_id)
    if server.owner_id != current_user.id:
        return {"error": "Unauthorized"}, 403

    data = request.get_json()
    if not data:
        return {"error": "Invalid input"}, 400

    name = data.get('name')
    if not name or len(name) < 1 or len(name) > 50:
        return {"error": "Name must be between 1 and 50 characters"}, 400

    try:
        channel.name = name
        db.session.commit()

        return {
            'id': channel.id,
            'server_id': channel.server_id,
            'name': channel.name
        }
    except Exception as e:
        db.session.rollback()
        return {"error": "An error occurred while updating the channel"}, 500



@channels_routes.route("/<int:id>")
@login_required
def delete_channel(id):
    pass


@channels_routes.route("/<int:channel_id>/messages")
@login_required
def get_all_messages(channel_id):
    messages = Message.query.filter(Message.channel_id == channel_id)
    return [message.to_dict() for message in messages]

@channels_routes.route("/<int:id>/messages", methods=["POST"])
@login_required
def create_message(id):
    data = request.get_json()

    if data["text"].isspace():
        return { "errors": "Message text required"}, 400

    if len(data["text"]) < 1 or len(data["text"]) > 140:
        return { "errors": "Message must be between 1 and 250 characters"}, 400


    newMessage = Message(
        channel_id = id,
        user_id = current_user.id,
        text = data["text"]
    )
    db.session.add(newMessage)
    db.session.commit()

    return newMessage.to_dict()
