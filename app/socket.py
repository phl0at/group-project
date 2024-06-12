from flask_socketio import SocketIO, emit, join_room, leave_room
import os


if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://hypercomm.onrender.com",
        "https://hypercomm.onrender.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)


@socketio.on('join')
def join(data):
    print(f"\n!!!!!!!!!!!!!!!!!!!!!JOINING ROOM:${data['room']}")
    join_room(data['room'])

@socketio.on('leave')
def leave(data):
    leave_room(data['room'])

@socketio.on('message')
def message(data):
    emit('message', data, broadcast=True, to=data['room'], include_self=False)
    print(f'\n\n!!!!!!!!!!!!!!!!MESSAGE DATA: ${data}')
