from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.orm import validates


class Image(db.Model):

    __tablename__ = 'images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    type_id = db.Column(db.Integer, nullable=False)
    img_url = db.Column(db.String(250), nullable=False)

    @validates("type")
    def validate_type(self, key, images):
        valid_tables = ['users', 'servers', 'messages']
        if [table for table in valid_tables] in images:
            raise ValueError("WTF M8")
        return images

    __mapper_args__ = {
        "polymorphic_on": type,
        "polymorphic_identity": "image"
    }

    def to_dict(self):
        return {
            'id': self.id,
            'type': self.type,
            'type_id': self.type_id,
            'img_url': self.img_url
        }


class User(db.Model, UserMixin, Image):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    servers = db.relationship("Server", backref="user", cascade='all, delete-orphan')
    messages = db.relationship("Message", backref="user", cascade='all, delete-orphan')
    reactions = db.relationship("Reaction", backref="user", cascade='all, delete-orphan')

    __mapper_arg__ = {
        "polymorphic_identity": "user"
    }

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'servers': self.servers,
            'messages': self.messages,
            'reactions': self.reactions,
        }


class Server(db.Model, Image):

    __tablename__ = "servers"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    DM = db.Column(db.Boolean, nullable=False, default=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)

    __mapper_arg__ = {
        "polymorphic_identity": "server"
    }

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'DM': self.DM,
            'owner': self.owner_id
        }



class Channel(db.Model):

    __tablename__ = "channels"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('servers.id')), nullable=False)
    name = db.Column(db.String(50), nullable=False)

    messages = db.relationship("Message", backref='channel', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'server': self.server_id,
            'name': self.name,
            'messages': self.messages
        }




class Message(db.Model, Image):

    __tablename__ = "messages"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('channels.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    text = db.Column(db.String(250), nullable=False)

    reactions = db.relationship("Reaction", backref='message', cascade='all, delete-orphan')

    __mapper_arg__ = {
        "polymorphic_identity": "message"
    }

    def to_dict(self):
        return {
            'id': self.id,
            'channel': self.channel_id,
            'user': self.user_id,
            'text': self.text,
            'reactions': self.reactions
        }




class Reaction(db.Model):

    __tablename__ = 'reactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('messages.id')), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    type = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message_id,
            'user': self.user_id,
            'type': self.type
        }
