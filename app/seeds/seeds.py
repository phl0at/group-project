from app.models import db, User, Server, Channel, Message, Image, Reaction, environment, SCHEMA
from sqlalchemy.sql import text
from werkzeug.security import generate_password_hash

# Adds a demo user, you can add other users here if you want
def create_seeder():

    ## SEED IMAGES
    images_list = [
        {'type': 'user', 'type_id': 1, 'img_url': ''},
        {'type': 'user', 'type_id': 2, 'img_url': ''},
        {'type': 'user', 'type_id': 3, 'img_url': ''},
        {'type': 'server', 'type_id': 1, 'img_url': ''},
        {'type': 'server', 'type_id': 2, 'img_url': ''},
        {'type': 'server', 'type_id': 3, 'img_url': ''},
        {'type': 'message', 'type_id': 1, 'img_url': ''},
        {'type': 'message', 'type_id': 2, 'img_url': ''},
        {'type': 'message', 'type_id': 3, 'img_url': ''}
    ]

    for image_data in images_list:
        image = Image(
            type=image_data['type'],
            type_id=image_data['type_id'],
            img_url=image_data['img_url']
        )
        db.session.add(image)
    db.session.commit()

    ## SEED USERS
    user_list = [
        {'username': 'Demo', 'email': 'demo@aa.io', 'password': generate_password_hash("password"), 'type_id': 1},
        {'username': 'marnie', 'email': 'marnie@aa.io', 'password': generate_password_hash("password"), 'type_id': 2},
        {'username': 'bobbie', 'email': 'bobbie@aa.io', 'password': generate_password_hash("password"), 'type_id': 3}
    ]

    for user_data in user_list:
        user = User(
            username=user_data['username'],
            email=user_data['email'],
            hashed_password=user_data['password'],
            type='user',
            type_id=user_data['type_id']
        )
        db.session.add(user)
    db.session.commit()

    ## SEED SERVERS
    server_list = [
        {'name': 'test_server', 'DM': False, 'owner_id': 1, 'type_id': 1},
        {'name': 'AppAcademy', 'DM': False, 'owner_id': 2, 'type_id': 2},
        {'name': 'user_1: 1, user_2: 2', 'DM': True, 'owner_id': 1, 'type_id': 3}
    ]

    for server_data in server_list:
        server = Server(
            name=server_data['name'],
            DM=server_data['DM'],
            owner_id=server_data['owner_id'],
            type='server',
            type_id=server_data['type_id']
        )
        db.session.add(server)
    db.session.commit()

    ## SEED CHANNELS
    channel_list = [
        {'server_id': 1, 'name': 'General'},
        {'server_id': 1, 'name': 'Announcements'},
        {'server_id': 2, 'name': 'Wins'},
        {'server_id': 2, 'name': 'Questions'},
        {'server_id': 3, 'name': 'direct_message'},
    ]

    for channel_data in channel_list:
        channel = Channel(
            server_id=channel_data['server_id'],
            name=channel_data['name']
        )
        db.session.add(channel)
    db.session.commit()

    ## SEED MESSAGES
    message_list = [
        {'channel_id': 1, 'user_id': 1, 'text': 'Hello World!', 'type_id': 1},
        {'channel_id': 3, 'user_id': 2, 'text': 'Hello World!', 'type_id': 2},
        {'channel_id': 5, 'user_id': 3, 'text': 'Hello World!', 'type_id': 3}
    ]

    for message_data in message_list:
        message = Message(
            channel_id=message_data['channel_id'],
            user_id=message_data['user_id'],
            text=message_data['text'],
            type='message',
            type_id=message_data['type_id']
        )
        db.session.add(message)
    db.session.commit()

    ## SEED REACTIONS
    reaction_list = [
        {'message_id':1, 'user_id':3, 'type':'😊'},
        {'message_id':2, 'user_id':2, 'type':'👍'},
        {'message_id':3, 'user_id':1, 'type':'👍'},
    ]

    for reaction_data in reaction_list:
        reaction = Reaction(
            message_id=reaction_data['message_id'],
            user_id=reaction_data['user_id'],
            type=reaction_data['type']
        )
        db.session.add(reaction)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_seeder():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.servers RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.reactions RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        db.session.execute(text("DELETE FROM servers"))
        db.session.execute(text("DELETE FROM channels"))
        db.session.execute(text("DELETE FROM messages"))
        db.session.execute(text("DELETE FROM reactions"))
        db.session.execute(text("DELETE FROM images"))

    db.session.commit()
