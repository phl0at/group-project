from flask import Blueprint, request
from app.models import db, Reaction, User
from flask_login import current_user, login_required


reactions_routes = Blueprint("reactions", __name__)


@reactions_routes.route("/<int:message_id>", methods=["POST"])
@login_required
def create_reaction(message_id):
    try:
        data = request.get_json()
        # print(f"Received data: {data}")
        valid_reactions = ["👍", "👎", "😊"]   

        if not data:
            return {"error": "Please try again"}, 400
        elif data["type"] not in valid_reactions:
            # print(f"Invalid reaction: {data['type']}")

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
    except Exception as e:
        db.session.rollback()
        print(f"Error creating reaction: {str(e)}")
        return {"error": str(e)}, 500
    

@reactions_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_reaction(id):

    reaction = Reaction.query.get(id)
    if not reaction:
        return {"error": "Reaction not found"}, 404

    if reaction.user_id != current_user.id:
         return {"error": "Unauthorized"}, 403

    try:
        db.session.delete(reaction)
        db.session.commit()

        return {"message": "Reaction deleted successfully"}, 200

    except Exception as e:
        db.session.rollback()
        return {"error": "An error occurred while deleting the reaction"}

