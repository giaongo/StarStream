import quart_flask_patch
from src.models.types import User
from src.controllers.adminController import add_default_admin, data_initial_setup
from dotenv import find_dotenv, load_dotenv
from src import create_app
import os
from quart_db import QuartDB

app = create_app()
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


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
