from dotenv import find_dotenv, load_dotenv
from quart_schema import QuartSchema
from .models.types import App
from quart import Quart
from quart_cors import cors
import os

load_dotenv(find_dotenv())

def create_app() -> App:
    app = Quart(__name__)     
    app = cors(app, allow_origin='*')  
    QuartSchema(app)
    app.secret_key = os.getenv('APP_SECRET')

    from .views.event import event
    from .views.admin import admin
    
    app.register_blueprint(event, url_prefix='/events')
    app.register_blueprint(admin, url_prefix='/admin')
    return app
