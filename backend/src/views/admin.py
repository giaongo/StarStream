import logging
from dotenv import find_dotenv, load_dotenv
from quart import app, current_app
from quart_auth import AuthUser, QuartAuth, current_user, login_required, login_user
from  ..controllers.adminController import check_login
from quart import Blueprint
from ..models.types import User

admin = Blueprint('admin', __name__)
log = logging.getLogger(__name__)
load_dotenv(find_dotenv())
    
@admin.post('/login')
async def login(): 
    """login user

    Returns:
        _type_: _description_
    """
    log.info("login route is called")
    result = await check_login(User(email='admin@starstream.com', password='adminnokia@Stream2024'))
    if result: 
        user = {'email': 'admin@starstream.com', 'id': 1}
        login_user(AuthUser(user))
        token = current_app.auth_manager.dump_token(user)
        return {'message': f'login {result} with token {token}'}, 200
    
    return {'message': f'failed login'}, 401

   
@admin.get('/profile')
@login_required
async def profile():
    return {'admin': f'current user is {current_user}'}, 200

@admin.post('/logout')
async def logout():
    return {'admin': 'logout successfully'}, 200

@admin.post('/event')
async def add_event():
    return {'admin': 'add event successfully'}, 200

@admin.delete('/event/<int:event_id>')
async def delete_event(event_id):
    return {'admin': f'delete event ${event_id} successfully'}, 200