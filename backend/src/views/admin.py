from dotenv import find_dotenv, load_dotenv
from quart import app
from  ..controllers.adminController import add_default_admin, test_database
from quart import Blueprint
from ..models.types import User
import os
admin = Blueprint('admin', __name__)

load_dotenv(find_dotenv())

@admin.post('/login')
async def login(): 
    """login user

    Returns:
        _type_: _description_
    """
    result = await test_database()
    print(f'check and add amin result', result)
    return {'admin': 'login successfully'}, 200


@admin.post('/logout')
async def logout():
    return {'admin': 'logout successfully'}, 200

@admin.post('/event')
async def add_event():
    return {'admin': 'add event successfully'}, 200

@admin.delete('/event/<int:event_id>')
async def delete_event(event_id):
    return {'admin': f'delete event ${event_id} successfully'}, 200