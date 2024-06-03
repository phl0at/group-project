from flask import Blueprint, request
from app.models import db, Reaction, User
from flask_login import current_user, login_required


reactions_routes = Blueprint("reactions", __name__)


@reactions_routes.route("/<int:id>", methods=["POST"])
@login_required
def create_reaction(id):
    pass


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

        
    
