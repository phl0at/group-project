from flask_socketio import SocketIO, emit, join_room, leave_room
import os


if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://hypercomm.onrender.com",
        "https://hypercomm.onrender.com",
        "ws://hypercomm.onrender.com",
        "wss://hypercomm.onrender.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)


@socketio.on('join')
def join(data):
    print('\n********** JOINING ROOM: ', data['room'])
    join_room(data['room'])

@socketio.on('leave')
def leave(data):
    print('\n********** LEAVING ROOM: ', data['room'])
    leave_room(data['room'])

@socketio.on('message')
def message(data):
    print('\n********** MESSAGE TEXT: ', data['message'], 'TO ROOM: ', data['room'])
    emit('message', data, broadcast=True, to=data['room'], include_self=False)
