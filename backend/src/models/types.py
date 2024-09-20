from dataclasses import dataclass
from datetime import datetime
from typing import TypeAlias
from quart import Quart
from wtforms import DateTimeLocalField, FileField, Form, PasswordField, StringField, URLField, validators


App: TypeAlias = Quart


@dataclass
class User:
    email: str
    password: str
    id: int = 0


@dataclass
class EventData:
    title: str
    start_date: datetime
    end_date: datetime
    event_image: str
    streaming_key: str | None = None
    streaming_url: str | None = None
    id: int = 0


class LoginForm(Form):
    """ Login form validation"""
    email = StringField('Email', validators=[
        validators.DataRequired(),
        validators.Email(message="Invalid email address.")
    ])
    password = PasswordField('Password', validators=[
        validators.DataRequired(),
        validators.Length(
            min=6, message="Password must be at least 6 characters long.")
    ])


class AddEventForm(Form):
    """ Add event form validation
    """
    title = StringField('Title', validators=[
        validators.DataRequired(message="Title is required.")
    ])
    start_date = DateTimeLocalField('Start Date', format='%Y-%m-%dT%H:%M', validators=[
        validators.DataRequired(message="Start date is required.")
    ])
    end_date = DateTimeLocalField('End Date', format='%Y-%m-%dT%H:%M', validators=[
        validators.DataRequired(message="End date is required.")
    ])
    event_image = FileField('Event Image')
    streaming_key = StringField('Streaming Key', validators=[
                                validators.DataRequired(message="Streaming key is required.")])


class StreamingURLUpdateForm(Form):
    """ Streaming form validation
    """
    streaming_url = URLField('Streaming URL', validators=[
        validators.DataRequired(message="Streaming url is required."), validators.URL()])
