import asyncio
from datetime import timedelta
from dotenv import find_dotenv, load_dotenv
from quart_bcrypt import Bcrypt
from quart_db import QuartDB
from quart_schema import QuartSchema
import socketio
import uvicorn
from .models.types import App
from quart import Quart
from quart_cors import cors
import os
from quart_jwt_extended import (
    JWTManager
)

load_dotenv(find_dotenv())


def create_app() -> App:
    """ Initial app setup

    Returns: App 
    """
    app = Quart(__name__)
    app = cors(app, allow_origin='*')

    # request, response validation and automatic documentation
    QuartSchema(app)

    # database setup
    app.db = QuartDB(
        app, url=f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@postgresql:5432/{os.getenv('POSTGRES_DB')}")

    # brcypt hashing setup
    Bcrypt(app)
    app.secret_key = os.getenv('APP_SECRET')

    # JWT authentication
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=3)
    app.jwt = JWTManager(app)

    # register routing blueprints
    from .routes.eventRoute import event
    from .routes.adminRoute import admin
    from .routes.videoRoute import video

    app.register_blueprint(event, url_prefix='/events')
    app.register_blueprint(admin, url_prefix='/admin')
    app.register_blueprint(video, url_prefix='/video')
    return app


class QuartSIO:
    _instance = None

    def __init__(self, app: App) -> None:
        self._sio = socketio.AsyncServer(
            async_mode="asgi", cors_allowed_origins="*"
        )
        self._quart_app = app
        self._sio_app = socketio.ASGIApp(self._sio, self._quart_app)
        self.route = self._quart_app.route
        self.event = self._sio.event
        self.emit = self._sio.emit
        self.before_serving = self._quart_app.before_serving
        self.streaming_url = ""
        self.enter_room = self._sio.enter_room
        self.leave_room = self._sio.leave_room

    async def _run(self, host: str, port: int):
        try:
            uvconfig = uvicorn.Config(self._sio_app, host=host, port=port)
            server = uvicorn.Server(config=uvconfig)
            await server.serve()
        except KeyboardInterrupt:
            print("Shutting down")
        finally:
            print("Bye!")

    def run(self, host: str, port: int):
        asyncio.run(self._run(host, port))

    @classmethod
    def get_instance(self):
        if self._instance is None:
            self._instance = QuartSIO(app=create_app())
        return self._instance
