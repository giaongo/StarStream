from dataclasses import dataclass
from typing import TypeAlias
from quart import Quart
from wtforms import Form, PasswordField, StringField, validators


App: TypeAlias = Quart

@dataclass
class User: 
    email: str
    password: str 
    id: int = 0
    
class LoginForm(Form):
    email = StringField('Email', validators=[
        validators.DataRequired(), 
        validators.Email(message="Invalid email address.")
    ])
    password = PasswordField('Password', validators=[
        validators.DataRequired(),
        validators.Length(min=6, message="Password must be at least 6 characters long.")
    ])