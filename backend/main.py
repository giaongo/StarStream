import quart_flask_patch
from src.models.types import User
from src.controllers.adminController import add_default_admin
from dotenv import find_dotenv, load_dotenv
from src import create_app
import os

app = create_app()
load_dotenv(find_dotenv())

@app.before_serving
async def check_and_add_admin():
    """this function will checks whether the admin account exists in the database or not. If not, add the admin account. 
    This setup should run once before the app starts serving requests.
    """
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_pass = os.getenv("ADMIN_PASSWORD")
    url=f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@postgresql:5432/{os.getenv('POSTGRES_DB')}"  
  
    try: 
        result = await add_default_admin(defaultUser=User(email=admin_email, password=admin_pass),dbUrl=url)
        print('check_and_add_admin result ', result)
    except Exception as error:
        print('Error serving the app ', error) 
                
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)