from flask import Flask
from flask_socketio import SocketIO, emit, join_room, leave_room
import os 

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://actual-app-url.herokuapp.com",
        "https://actual-app-url.herokuapp.com"
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins="*")

@socketio.on('connect')
def test_connect():
    print('Client connected')
    emit('response', {'data': 'Connected'})

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('test_message')
def handle_test_message(data):
    print('Received test message:', data)
    emit('response', {'data': 'Message received'})

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=8000)
