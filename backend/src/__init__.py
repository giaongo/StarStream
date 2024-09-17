from dotenv import find_dotenv, load_dotenv
from quart_auth import QuartAuth
from quart_bcrypt import Bcrypt
from quart_db import QuartDB
from quart_schema import QuartSchema
from .models.types import App
from quart import Quart
from quart_cors import cors
import os

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
    QuartDB(app, url=f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@postgresql:5432/{os.getenv('POSTGRES_DB')}")
    
    # brcypt hashing setup
    Bcrypt(app)
    app.secret_key = os.getenv('APP_SECRET')
    
    # #QuartAuth setup
    app.auth_manager = QuartAuth(app)
    app.config['QUART_AUTH_MODE'] = 'bearer'    
    
    # register routing blueprints
    from .views.event import event
    from .views.admin import admin
    
    app.register_blueprint(event, url_prefix='/events')
    app.register_blueprint(admin, url_prefix='/admin')
    return app

