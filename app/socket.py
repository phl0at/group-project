from flask_socketio import SocketIO, emit, join_room, leave_room
import os

socketio = SocketIO()

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://",
        "https://"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)


socketio.on('message')
def new_chat(message):
    print("NEW MESSAGE:", message)
