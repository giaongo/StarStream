import os
from pathlib import Path
from dotenv import find_dotenv, load_dotenv
from quart import current_app
from ..controllers.adminController import add_event_to_db, check_login, delete_event_from_db, get_event_filename_by_id, update_streaming_url, update_viewing_url, validate_image_extension, store_thumbnail
from quart import Blueprint, request
from ..models.types import AddEventForm, EventData, LoginForm, StreamingURLUpdateForm, User, ViewingURLUpdateForm
from quart_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

admin = Blueprint('admin', __name__)
load_dotenv(find_dotenv())
THUMBNAIL_FOLDER = os.path.join(Path().cwd(), 'thumbnails')


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
            return {'token': access_token}, 200
        return {'msg': 'Login failed'}, 401
    return {'msg': f'Not validated request'}, 400


@admin.post('/event')
@jwt_required
async def add_event():
    """ add event
    """
    form = AddEventForm(await request.form)

    # print('start data', form.start_date.data)
    if form.validate():
        file = (await request.files).get('event_image')
        secured_name = str(secure_filename(filename=file.filename))

        if not validate_image_extension(secured_name):
            return {'msg': 'invalid image extension'}, 406

        unique_name = f'{form.title.data}_{secured_name}'
        thumbnail_path = os.path.join(THUMBNAIL_FOLDER, unique_name)

        if not store_thumbnail(file, thumbnail_path):
            return {'msg': 'error storing thumbnail'}, 400

        event = EventData(title=form.title.data,
                          start_date=form.start_date.data,
                          end_date=form.end_date.data,
                          event_image=unique_name,
                          streaming_key=form.streaming_key.data)

        add_event_result = await add_event_to_db(event.__dict__)

        if not add_event_result:
            return {'msg': 'error adding event to db'}, 400

        return {'msg': f'upload event successfully'}, 200

    return {'msg': 'form is not validated'}, 406


@admin.delete('/event/<int:event_id>')
@jwt_required
async def delete_event(event_id):
    """delete event from db and its associated thumbnail
    """
    filename = await get_event_filename_by_id(event_id)
    if filename:
        delete_event_result = await delete_event_from_db(event_id)
        os.remove(os.path.join(THUMBNAIL_FOLDER, filename))
        if not delete_event_result:
            return {'msg': f'error deleting event ${event_id} from database'}, 400

        return {'msg': f'delete event ${event_id} successfully'}, 200
    return {'msg': f'event thumbnail not found'}, 404


@admin.post('/event/streamingurl')
@jwt_required
async def edit_streaming_url():
    """edit streaming url
    """
    form = StreamingURLUpdateForm(await request.form)
    if form.validate():
        current_app.streaming_url = form.streaming_url.data
        edit_result = await update_streaming_url(form.streaming_url.data)
        if not edit_result:
            return {'msg': 'error updating streaming url'}, 400
        return {'msg': f'streaming url updated successfully with url {current_app.streaming_url}'}, 200
    return {'msg': 'invalid streaming url'}, 406


@admin.post('/event/viewingurl')
@jwt_required
async def edit_viewing_url():
    """edit viewing url
    """
    form = ViewingURLUpdateForm(await request.form)
    if form.validate():
        current_app.viewing_url = form.viewing_url.data
        edit_result = await update_viewing_url(form.viewing_url.data)
        if not edit_result:
            return {'msg': 'error updating viewing url'}, 400
        return {'msg': f'viewing url updated successfully with url {current_app.viewing_url}'}, 200
    return {'msg': 'invalid viewing url'}, 406


@admin.get('/token')
@jwt_required
async def check_token():
    """check token validity

    Args:
        token (str)
    """
    current_user = get_jwt_identity()
    if current_user:
        return {'msg': 'token is valid'}, 200

    return {'msg': 'token is invalid'}, 401
