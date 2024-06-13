from flask import Blueprint, request
from app.models import db, Reaction
from flask_login import current_user, login_required


reactions_routes = Blueprint("reactions", __name__)


@reactions_routes.route("/<int:message_id>", methods=["POST"])
@login_required
def create_reaction(message_id):
    # try:
    data = request.get_json()

    valid_reactions = ["👍", "👎", "😊"]

    if not data:
        return {"error": "Please try again"}, 400
    elif data.get("type") not in valid_reactions:
        return {"error": "Invalid reaction"}, 400
    else:
        reaction = Reaction(
            message_id=message_id,
            user_id=current_user.id,
            type=data["type"]
        )
        db.session.add(reaction)
        db.session.commit()

        return reaction.to_dict(), 201
    # except Exception as e:
    #     db.session.rollback()
    #     print(f"Error creating reaction: {str(e)}")
    #     return {"error": str(e)}, 500

@reactions_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_reaction(id):

    reaction = Reaction.query.get(id)
    if not reaction:
        return {"error": "Reaction not found"}, 404

    if reaction.user_id != current_user.id:
         return {"error": "Unauthorized"}, 403

    # try:
    db.session.delete(reaction)
    db.session.commit()

    return {"message": "Reaction deleted successfully"}, 200

    # except Exception as e:
    #     db.session.rollback()
    #     return {"error": "An error occurred while deleting the reaction"}


@reactions_routes.route("/", methods=["GET"])
@login_required
def get_all_reactions():
    # try:
        reactions = Reaction.query.all()
        reactions_list = [reaction.to_dict() for reaction in reactions]

        return {"reactions": reactions_list}, 200
    # except Exception as e:
    #     return {"error": "An error occurred while fetching reactions"}, 500
