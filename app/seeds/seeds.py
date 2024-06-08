from app.models import db, User, Server, Channel, Message, Reaction, environment, SCHEMA
from sqlalchemy.sql import text
from werkzeug.security import generate_password_hash

# Adds a demo user, you can add other users here if you want
def create_seeder():

    ## SEED USERS
    user_list = [
        {'username':'Demo', 'email':'demo@aa.io', 'password':generate_password_hash("password"), 'image_url': ''},
        {'username':'marnie', 'email':'marnie@aa.io', 'password':generate_password_hash("password"), 'image_url': ''},
        {'username':'bobbie', 'email':'bobbie@aa.io', 'password':generate_password_hash("password"), 'image_url': ''},
    ]

    for user in user_list:
        user = User(
            username=user['username'],
            email=user['email'],
            hashed_password=user['password'],
            image_url=user['image_url']
        )
        db.session.add(user)



    ## SEED SERVERS
    server_list = [
        {'name':'test_server', 'DM':False, 'owner_id':1, 'image_url': 'https://i.etsystatic.com/22360457/r/il/8256ab/2199607580/il_570xN.2199607580_g2jf.jpg'},
        {'name':'AppAcademy', 'DM':False, 'owner_id':2, 'image_url': ''},
        {'name':'user_1: 1, user_2: 2', 'DM':True, 'owner_id':1, 'image_url': ''}
    ]

    for server in server_list:
        server = Server(
            name=server['name'],
            DM=server['DM'],
            owner_id=server['owner_id'],
            image_url=server['image_url']
        )
        db.session.add(server)


    ## SEED CHANNELS
    channel_list = [
        {'server_id': 1, 'name': 'General'},
        {'server_id': 1, 'name': 'Announcements'},
        {'server_id': 2, 'name': 'Wins'},
        {'server_id': 2, 'name': 'Questions'},
        {'server_id': 3, 'name': 'direct_message'},
    ]

    for channel in channel_list:
        channel = Channel(
            server_id=channel['server_id'],
            name=channel['name']
        )
        db.session.add(channel)


    ## SEED MESSAGES
    message_list = [
        {'channel_id':1, 'user_id':1, 'text':'Hello World!', 'image_url': ''},
        {'channel_id':3, 'user_id':2, 'text':'Hello World!', 'image_url': ''},
        {'channel_id':5, 'user_id':3, 'text':'Hello World!', 'image_url': "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"},
    ]

    for message in message_list:
        message = Message(
            channel_id=message['channel_id'],
            user_id=message['user_id'],
            text=message['text'],
            image_url=message['image_url']
        )
        db.session.add(message)


    ## SEED REACTIONS
    reaction_list = [
        {'message_id':1, 'user_id':3, 'type':'😊'},
        {'message_id':2, 'user_id':2, 'type':'👍'},
        {'message_id':3, 'user_id':1, 'type':'👍'},
    ]

    for reaction in reaction_list:
        reaction = Reaction(
            message_id=reaction['message_id'],
            user_id=reaction['user_id'],
            type=reaction['type']
        )
        db.session.add(reaction)


    ## SEED IMAGES
    # images_list = [
    #     {'type': 'user', 'type_id': 1, 'img_url': ''},
    #     {'type': 'server', 'type_id': 1, 'img_url': ''},
    #     {'type': 'server', 'type_id': 2, 'img_url': ''},
    #     {'type': 'message', 'type_id': 1, 'img_url': ''}
    # ]

    # for image_data in images_list:
    #     image = Image(
    #         type=image_data['type'],
    #         type_id=image_data['type_id'],
    #         img_url=image_data['img_url']
    #     )
    #     db.session.add(image)

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
    else:
        db.session.execute(text("DELETE FROM users"))
        db.session.execute(text("DELETE FROM servers"))
        db.session.execute(text("DELETE FROM channels"))
        db.session.execute(text("DELETE FROM messages"))
        db.session.execute(text("DELETE FROM reactions"))

    db.session.commit()
