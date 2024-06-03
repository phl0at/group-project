from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class CreateServerForm(FlaskForm):
    serverName = StringField('serverName', validators=[DataRequired()])
    ownerId = IntegerField('ownerId', validators=[DataRequired()])
