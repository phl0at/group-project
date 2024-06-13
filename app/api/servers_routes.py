from flask import Blueprint, request
from app.models import db, Server, User
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename
from app.forms import CreateServerForm
from app.aws_helper import get_unique_filename, upload_file_to_s3, remove_file_from_s3

servers_routes = Blueprint("servers", __name__)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@servers_routes.route("/")
@login_required
def all_servers():
    all_servers = Server.query.filter(Server.DM == False)
    return [server.to_dict() for server in all_servers]

@servers_routes.route("/direct")
@login_required
def direct_messages():
    dms = Server.query.filter(Server.DM == 1).filter(Server.owner_id == current_user.id)
    return [dm.to_dict() for dm in dms]

@servers_routes.route("/current")
@login_required
def users_servers():
    pass


@servers_routes.route("/<int:id>")
@login_required
def one_server(id):
    server = Server.query.get(id)

    if not server:
        return {'error': 'Server Not Found'}, 404

    return server.to_dict()


@servers_routes.route("/", methods=["POST"])
@login_required
def create_server():
    form = CreateServerForm()
    server = Server(
        name = form.data['serverName'],
        owner_id=form.data['ownerId'],
        image_url=form.data['image_url']
        )

    if server.name.isspace():
        return { "errors": 'server name required'}, 400

    if len(server.name) < 1 or len(server.name) > 50:
        return {"errors": "Name must be between 1 and 50 characters"}, 400

    else:
        db.session.add(server)
        db.session.commit()
        return server.to_dict(), 200



@servers_routes.route('/<int:server_id>', methods=['PUT'])
@login_required
def update_server(server_id):
    server = Server.query.get(server_id)
    if not server:
        return {"error": "Server not found"}, 404

    try:
        data = request.form if request.form else request.json

        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                unique_filename = get_unique_filename(filename)
                file.filename = unique_filename
                upload_response = upload_file_to_s3(file)

                if "errors" in upload_response:
                    return upload_response, 400

                if server.image_url:
                    remove_file_from_s3(server.image_url)

                server.image_url = upload_response["url"]

        server.name = data.get('name', server.name)

        db.session.commit()
        return server.to_dict(), 200

    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}, 500







@servers_routes.route("/<int:id>", methods=["DELETE"])
@login_required
def delete_server(id):
    server = Server.query.get(id)

    if not server:
        return { "error": "Server not found" }, 404
    elif server.to_dict()['owner_id'] is not current_user.id:
        return { "error": "Forbidden"}, 403
    else:
        db.session.delete(server)
        db.session.commit()
        return { "message": "Successfully deleted"}, 200
