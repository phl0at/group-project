from flask import Blueprint, request
from app.models import db, Server, User, Channel
from flask_login import current_user, login_required
from werkzeug.utils import secure_filename
from app.forms import CreateServerForm
from app.aws_helper import get_unique_filename, upload_file_to_s3, remove_file_from_s3

servers_routes = Blueprint("servers", __name__)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@servers_routes.route("/init_load")
@login_required
def init_load():
    all_servers = Server.query.filter(Server.DM == False)
    first_server = [server.to_dict() for server in all_servers][0]

    return { 'servers': [server.to_dict() for server in all_servers],
            'first_server': first_server, 'channels': first_server['channels'],
            'messages': first_server['channels'][0]['messages'],
            'reactions': first_server['channels'][0]['reactions'] }


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
    try:
        print('!!!!!!!!!!!!!!!!!!!! Inside create route')
        data = request.form if request.form else request.json

        if 'file' not in request.files:
            print('!!!!!!!!!!!! File not in request.files')
            return {"errors": "File is required"}, 400

        print('!!!!!!!!!!!!!!!!!!! Request files: ', request.files)

        file = request.files['file']
        if file and allowed_file(file.filename):
            print('!!!!!!!!!!!!!!!!!!!!!! File is good')
            filename = secure_filename(file.filename)
            unique_filename = get_unique_filename(filename)
            file.filename = unique_filename
            upload_response = upload_file_to_s3(file)
            print('!!!!!!!!!!!! Upload response: ', upload_response)
            if "errors" in upload_response:
                return upload_response, 400
            image_url = upload_response["url"]
            print('!!!!!!!!!!!!!!!!!!!! Image URL: ', image_url)
        else:
            print('!!!!!!!!!!!! Invalid file type')
            return {"errors": "Invalid file type"}, 400

        server_name = request.form.get('serverName')
        owner_id = request.form.get('ownerId')

        print('!!!!!!!!!!!! Server name: ', server_name)
        print('!!!!!!!!!!!! Owner ID: ', owner_id)

        if not server_name or server_name.isspace():
            return {"errors": "Server name is required"}, 400

        server = Server(
            name=server_name,
            owner_id=owner_id,
            image_url=image_url
        )

        db.session.add(server)
        db.session.commit()

        print(server.to_dict())
        general_channel = Channel(
            server_id=server.to_dict()['id'],
            name='General'
        )
        print("!!!!!!!!!!General CHANNEL", general_channel)

        db.session.add(general_channel)
        db.session.commit()

        return server.to_dict(), 200

    except Exception as e:
        print("!!!!!!!!!!!! Exception: ", str(e))
        return {"errors": str(e)}, 500



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
