from dataclasses import dataclass
from datetime import datetime
from typing import TypeAlias
from quart import Quart
from wtforms import DateTimeLocalField, FileField, Form, PasswordField, StringField, URLField, ValidationError, validators


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


@dataclass
class VideoArchive:
    event_id: int
    title: str
    event_start_date: datetime
    event_end_date: datetime
    event_image: str
    streaming_key: str
    video_id: int
    video_path: str
    video_file_name: str
    subtitle_path: str


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

    def validate_end_date(form, field):
        if (field.data < form.start_date.data):
            raise ValidationError(
                "End date has to be larger than start date to be added")


class StreamingURLUpdateForm(Form):
    """ Streaming form validation
    """
    streaming_url = URLField('Streaming URL', validators=[
        validators.DataRequired(message="Streaming url is required."), validators.URL()])


class ViewingURLUpdateForm(Form):
    """ Viewing form validation
    """
    viewing_url = URLField('Viewing URL', validators=[
        validators.DataRequired(message="Viewing url is required."), validators.URL()])
