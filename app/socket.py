from flask_socketio import SocketIO, emit, join_room, leave_room
import os

socketio = SocketIO()

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://hypercomm.onrender.com",
        "https://hypercomm.onrender.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)


@socketio.on('message')
def new_chat(message):
    emit('message', message)
