from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError


class CreateServerForm(FlaskForm):
    serverName = StringField('serverName', validators=[DataRequired()])
