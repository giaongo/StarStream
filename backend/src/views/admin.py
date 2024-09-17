import logging
from dotenv import find_dotenv, load_dotenv
from  ..controllers.adminController import check_login
from quart import Blueprint
from ..models.types import User
from quart_jwt_extended import create_access_token, jwt_required, get_jwt_identity

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
        user = {'email': 'eugine@email.com', 'id': 2}
        # token = current_app.auth_manager.dump_token(user)
        access_token = create_access_token(user)
        return {'message': f'login {result} with token {access_token}'}, 200
    
    return {'message': f'failed login'}, 401

   
@admin.get('/profile')
@jwt_required
async def profile():
    decoded_user = get_jwt_identity()
    return {'admin': f'current user is {decoded_user}'}, 200

@admin.post('/logout')
async def logout():
    return {'admin': 'logout successfully'}, 200

@admin.post('/event')
async def add_event():
    return {'admin': 'add event successfully'}, 200

@admin.delete('/event/<int:event_id>')
async def delete_event(event_id):
    return {'admin': f'delete event ${event_id} successfully'}, 200