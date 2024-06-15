from app.models import db, User, Server, Channel, Message, Reaction, environment, SCHEMA
from sqlalchemy.sql import text
from werkzeug.security import generate_password_hash

# Adds a demo user, you can add other users here if you want
def create_seeder():

    ## SEED USERS
    user_list = [
        {'username':'Demo', 'email':'demo@aa.io', 'password':generate_password_hash("password"), 'image_url': ''},
        {'username':'marnie', 'email':'marnie@aa.io', 'password':generate_password_hash("password"), 'image_url': 'https://t3.ftcdn.net/jpg/06/17/13/26/360_F_617132669_YptvM7fIuczaUbYYpMe3VTLimwZwzlWf.jpg'},
        {'username':'GLaDOS', 'email':'cake@aperture.com', 'password':generate_password_hash("nocake123"), 'image_url': 'https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d5c4073a-773c-4845-9014-cb20307c0e2a/width=450/00061-376789901.jpeg'},
    ]

    for user_data in user_list:
        user = User(
            username=user_data['username'],
            email=user_data['email'],
            hashed_password=user_data['password'],
            image_url=user_data['image_url']
        )
        db.session.add(user)
    db.session.commit()

    ## SEED SERVERS
    server_list = [
        {'name':'Aperture Science', 'DM':False, 'owner_id':1, 'image_url': 'https://live.staticflickr.com/3837/14917120181_e630d61231_b.jpg'},
        {'name':'AppAcademy', 'DM':False, 'owner_id':2, 'image_url': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Appacademylogo.png'},
        {'name':'user_1: 1, user_2: 2', 'DM':True, 'owner_id':1, 'image_url': ''}
    ]

    for server_data in server_list:
        server = Server(
            name=server_data['name'],
            DM=server_data['DM'],
            owner_id=server_data['owner_id'],
            image_url=server_data['image_url']
        )
        db.session.add(server)
    db.session.commit()

    ## SEED CHANNELS
    channel_list = [
        {'server_id': 1, 'name': 'General'},
        {'server_id': 1, 'name': 'Testing Room 1'},
        {'server_id': 1, 'name': 'Testing Room 2'},
        {'server_id': 1, 'name': 'Cake'},
        {'server_id': 2, 'name': 'Wins'},
        {'server_id': 2, 'name': 'Questions'},
        {'server_id': 3, 'name': 'General'},
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
        {'channel_id':1, 'user_id':3, 'text': '''Please ensure you have read and understand the rules and your role in them before participating in the testing phase.''', 'image_url': ''},
        {'channel_id':1, 'user_id':2, 'text': '''When do we get cake?''', 'image_url': ''},
        {'channel_id':1, 'user_id':1, 'text': '''Yeah, I'm only here cause they promised cake...''', 'image_url': ''},
        {'channel_id':2, 'user_id':3, 'text': '''Testing will commence in approximately 42 minutes...''', 'image_url': ''},
        {'channel_id':3, 'user_id':3, 'text': '''This test has been temporarily postponed until we have determined the source of the noise coming from the walls in Containment Room 37. Please stand by...''', 'image_url': ''},
        {'channel_id':4, 'user_id':3, 'text': '''This was a triumph. I'm making a note here: HUGE SUCCESS. It's hard to overstate my satisfaction.''', 'image_url': ''},
        {'channel_id':4, 'user_id':3, 'text': '''Aperture Science. We do what we must because we can. For the good of all of us.''', 'image_url': ''},
        {'channel_id':4, 'user_id':3, 'text': '''Except the ones who are dead.''', 'image_url': ''},
        {'channel_id':4, 'user_id':3, 'text': '''But there's no sense crying over every mistake. You just keep on trying till you run out of cake.''', 'image_url': ''},
        {'channel_id':4, 'user_id':3, 'text': '''And the Science gets done. And you make a neat gun for the people who are still alive!''', 'image_url': ''},
        {'channel_id':5, 'user_id':2, 'text':'Hello World!', 'image_url': ''},
        {'channel_id':5, 'user_id':1, 'text':'Howdy!', 'image_url': "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"},
    ]

    for message_data in message_list:
        message = Message(
            channel_id=message_data['channel_id'],
            user_id=message_data['user_id'],
            text=message_data['text'],
            image_url=message_data['image_url']
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
    else:
        db.session.execute(text("DELETE FROM users"))
        db.session.execute(text("DELETE FROM servers"))
        db.session.execute(text("DELETE FROM channels"))
        db.session.execute(text("DELETE FROM messages"))
        db.session.execute(text("DELETE FROM reactions"))

    db.session.commit()
