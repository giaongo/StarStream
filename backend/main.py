import quart_flask_patch
from quart import websocket
import asyncio
from src.models.broker import Broker
from src.models.types import User
from src.controllers.adminController import data_initial_setup
from src.controllers.chatController import _receive
from dotenv import find_dotenv, load_dotenv
from src import create_app
import os

app = create_app()
broker = Broker()
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
                                                dbUrl=f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@postgresql:5432/{os.getenv('POSTGRES_DB')}")
        print('setup result', setup_result)

    except Exception as error:
        print('Error serving the app ', error)


@app.websocket('/ws')
async def ws():
    print('Websocket connection established')
    try:
        task = asyncio.ensure_future(_receive(broker=broker))

        async for message in broker.subscribe():
            print(f"Sending message: {message}")
            await websocket.send(message)
    except Exception as error:
        print('Error serving the app ', error)
    finally:
        task.cancel()
        await task


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
