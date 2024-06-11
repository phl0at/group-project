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


@socketio.on('chat')
def handle_chat(data):
    emit('chat', data, broadcast=False, to=data['room'], include_self=False)

@socketio.on('leave')
def handle_leave(data):
    leave_room(data['room'])

@socketio.on('join')
def handle_join(data):
    join_room(data['room'])
@socketio.on('message')
def new_chat(message):
    print("NEW MESSAGE:", message)
