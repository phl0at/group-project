from flask import Blueprint, request
from app.models import db, Reaction
from flask_login import current_user, login_required


reactions_routes = Blueprint("reactions", __name__)


@reactions_routes.route("/<int:message_id>", methods=["POST"])
@login_required
def create_reaction(message_id):

    data = request.get_json()

    valid_reactions = ["smile", "thumbsup", "thumbsdown"]

    if not data:
        return {"error": "Please try again"}, 400
    elif data.get("type") not in valid_reactions:
        return {"error": "Invalid reaction"}, 400
    else:
        reaction = Reaction(
            channel_id=data['channel_id'],
            message_id=message_id,
            user_id=current_user.id,
            type=data["type"]
        )
        db.session.add(reaction)
        db.session.commit()

        return reaction.to_dict(), 201


@reactions_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_reaction(id):
    reaction = Reaction.query.get(id)

    if not reaction:
        return {"error": "Reaction not found"}, 404

    if reaction.user_id != current_user.id:
         return {"error": "Unauthorized"}, 403

    db.session.delete(reaction)
    db.session.commit()

    return {"message": "Reaction deleted successfully"}, 200


@reactions_routes.route("/<int:channel_id>", methods=["GET"])
@login_required
def get_all_reactions(channel_id):
        reactions = Reaction.query.filter(Reaction.channel_id == channel_id)
        reactions_list = [reaction.to_dict() for reaction in reactions]

        return {"reactions": reactions_list}, 200
