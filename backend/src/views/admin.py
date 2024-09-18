from datetime import timedelta
import os
from pathlib import Path
from dotenv import find_dotenv, load_dotenv
from  ..controllers.adminController import check_login, validate_image_extension, store_thumbnail
from quart import Blueprint, request
from ..models.types import AddEventForm, LoginForm, User
from quart_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

admin = Blueprint('admin', __name__)
load_dotenv(find_dotenv())
THUMBNAIL_FOLDER = Path().cwd() / 'thumbnails'

@admin.post('/login')
async def login(): 
    """login user
    """
    form = LoginForm(await request.form)
    if form.validate():
        user = User(email=form.email.data, password=form.password.data)
        found_user = await check_login(user)
        if found_user: 
            user = {'id': found_user.id, 'email': found_user.email}
            access_token = create_access_token(user)
            return {'msg': f'token {access_token}'}, 200
        return {'msg': 'Login failed'}, 401   
    return {'msg': f'Not validated request'}, 400


@admin.post('/event')
@jwt_required
async def add_event():
    """ add event
    """
    decoded_user = get_jwt_identity()
    form = AddEventForm(await request.form)
    
    # print('start data', form.start_date.data)
    if form.validate():
        file = (await request.files).get('event_image')
        secured_name = str(secure_filename(filename=file.filename))
        
        if not validate_image_extension(secured_name):
            return {'msg': 'invalid image extension'}, 400
        
        thumbnail_path = os.path.join(THUMBNAIL_FOLDER, secured_name)
        
        store_result = store_thumbnail(file, thumbnail_path)
        
        if not store_result:
            return {'msg': 'error storing thumbnail'}, 400    
                    
        return {'msg': 'upload successfully'}, 200
    
    return {'msg': 'form is not validated'}, 400


@admin.delete('/event/<int:event_id>')
async def delete_event(event_id):
    return {'admin': f'delete event ${event_id} successfully'}, 200