import quart_flask_patch
from src.models.types import User
from src.controllers.adminController import data_initial_setup
from dotenv import find_dotenv, load_dotenv
from src import QuartSIO, create_app
import os

app = QuartSIO.get_instance()
load_dotenv(find_dotenv())


@app.before_serving
async def initial_setup():
    """
    Initialize data setup when app starts serving requests.
    """
    try:
        setup_result = await data_initial_setup(app=app,
                                                defaultUser=User(
                                                    email=os.getenv(
                                                        "ADMIN_EMAIL"),
                                                    password=os.getenv("ADMIN_PASSWORD")),
                                                dbUrl=f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@{os.getenv('POSTGRES_URL')}/{os.getenv('POSTGRES_DB')}")
        print('setup result', setup_result)

    except Exception as error:
        print('Error serving the app ', error)


@app.event
async def connect(sid, environ):
    print('Connected')


@app.event
async def disconnect(sid):
    print('Disconnected')


@app.event
async def message(sid, data):
    print('Message:', data)
    await app.emit('message', data, room=data['room'])


@app.event
async def join(sid, event_id):
    print('Entering room', event_id)
    await app.enter_room(sid, event_id)


@app.event
async def leave(sid, event_id):
    print('Exiting room', event_id)
    await app.leave_room(sid, event_id)

if __name__ == '__main__':
    app.run('0.0.0.0', 5001)
