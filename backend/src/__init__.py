from quart import Quart
from quart_cors import cors

def create_app():
    app = Quart(__name__)     
    app = cors(app, allow_origin='*')  
    return app
