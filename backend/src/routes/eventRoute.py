from quart import Blueprint, request, send_from_directory
from quart_jwt_extended import jwt_optional, get_jwt_identity
from .. import QuartSIO
from .adminRoute import THUMBNAIL_FOLDER
from ..controllers.eventController import add_video_archive, get_video_archives, get_viewing_url, retrieve_events_for_today

event = Blueprint('event', __name__)


@event.route('/today', methods=['GET'])
@jwt_optional
async def get_events_today():
    """ Retrieve all events for today either admin or public user

    Returns:
        _type_: object
    """
    current_user = get_jwt_identity()
    isAdmin = False
    if current_user:
        isAdmin = True

    result: list[dict] = await retrieve_events_for_today(isAdmin=isAdmin,
                                                         streaming_url=QuartSIO.get_instance().streaming_url)

    if not result:
        return {'msg': 'No events for today'}, 404
    return {'events': result}, 200


@event.get('/thumbnail/<string:filename>')
async def serve_thumbnail(filename: str):
    """ Send thumbnail file

    Args:
        filename (str)

    Returns:
        _type_: object
    """
    return await send_from_directory(THUMBNAIL_FOLDER, filename)


@event.get('/viewing/<int:event_id>')
async def get_viewing_url_by_eventId(event_id):
    """ Fetch viewing url by event id

    Args:
        event_id (_type_):int

    Returns:
        _type_: object
    """
    viewing_url = await get_viewing_url(event_id=event_id, app=QuartSIO.get_instance())

    if not viewing_url:
        return {'msg': 'Viewing url not found'}, 404
    return {'url': viewing_url}, 200


@event.route('/archives', methods=['GET'])
async def get_archives():
    """ Get all video archives from database

    Returns:
        _type_: object
    """
    result: list[dict] | None = await get_video_archives()
    if not result:
        return {'msg': 'No archives found'}, 404

    return {'archives': result}, 200


@event.post('/archives')
async def insert_video_archive_info():
    """ Insert video archive info to database
    """

    data = await request.get_json()

    result = await add_video_archive(video_url=data['video_url'],
                                     streaming_key=data['streaming_key'],
                                     combined_name=data['combined_name'],
                                     subtitle_url=data['subtitle_url']
                                     )

    if not result:
        return {'msg': 'error adding video archive'}, 400

    return {'msg': 'video archive added successfully'}, 200
