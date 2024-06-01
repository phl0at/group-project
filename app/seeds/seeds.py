from app.models import db, User, Server, Channel, Message, Reaction, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def create_seeder():

    ## SEED USERS
    user_list = [
        {'username':'Demo', 'email':'demo@aa.io', 'password':'password'},
        {'username':'marnie', 'email':'marnie@aa.io', 'password':'password'},
        {'username':'bobbie', 'email':'bobbie@aa.io', 'password':'password'},
    ]

    for user in user_list:
        user = User(
            username=user['username'],
            email=user['email'],
            hashed_password=user['password']
        )
        db.session.add(user)



    ## SEED SERVERS
    server_list = [
        {'name':'test_server', 'DM':False, 'owner_id':1},
        {'name':'AppAcademy', 'DM':False, 'owner_id':2},
        {'name':'ProjectServer', 'DM':True, 'owner_id':3}
    ]

    for server in server_list:
        server = Server(
            name=server['name'],
            DM=server['DM'],
            owner_id=server['owner_id']
        )
        db.session.add(server)


    ## SEED CHANNELS
    channel_list = [
        {'server_id': 1, 'name': 'General'},
        {'server_id': 1, 'name': 'Announcements'},
        {'server_id': 2, 'name': 'Wins'},
        {'server_id': 2, 'name': 'Questions'},
        {'server_id': 3, 'name': 'off-topic'},
        {'server_id': 3, 'name': 'study-group'},
    ]

    for channel in channel_list:
        channel = Channel(
            server_id=channel['server_id'],
            name=channel['name']
        )
        db.session.add(channel)


    ## SEED MESSAGES
    message_list = [
        {'channel_id':1, 'user_id':1, 'text':'Hello World!'},
        {'channel_id':3, 'user_id':2, 'text':'Hello World!'},
        {'channel_id':5, 'user_id':3, 'text':'Hello World!'},
    ]

    for message in message_list:
        message = Message(
            channel_id=message['channel_id'],
            user_id=message['user_id'],
            text=message['text']
        )
        db.session.add(message)


    ## SEED REACTIONS
    reaction_list = [
        {'message_id':1, 'user_id':3, 'type':'thumbsup'},
        {'message_id':2, 'user_id':2, 'type':'thumbsup'},
        {'message_id':3, 'user_id':1, 'type':'thumbsup'},
    ]

    for reaction in reaction_list:
        reaction = Reaction(
            message_id=reaction['message_id'],
            user_id=reaction['user_id'],
            type=reaction['type']
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
    else:
        db.session.execute(text("DELETE FROM users"))
        db.session.execute(text("DELETE FROM servers"))
        db.session.execute(text("DELETE FROM channels"))
        db.session.execute(text("DELETE FROM messages"))
        db.session.execute(text("DELETE FROM reactions"))

    db.session.commit()
