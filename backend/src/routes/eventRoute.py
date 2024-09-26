from quart import Blueprint, current_app, send_from_directory
from quart_jwt_extended import jwt_optional, get_jwt_identity
from .adminRoute import THUMBNAIL_FOLDER
from ..controllers.eventController import get_viewing_url, retrieve_events_for_today

event = Blueprint('event', __name__)


# this routing is partially protected. Can be either admin or public user

@event.route('/today', methods=['GET'])
@jwt_optional
async def get_events_today():
    current_user = get_jwt_identity()
    isAdmin = False
    if current_user:
        isAdmin = True

    result: list[dict] = await retrieve_events_for_today(isAdmin=isAdmin,
                                                         streaming_url=current_app.streaming_url)

    if not result:
        return {'msg': 'No events for today'}, 404
    return {'events': result}, 200


@event.route('/archives', methods=['GET'])
async def get_archives():
    return {'archives': 'Here is the list of archives'}, 200


@event.get('/thumbnail/<string:filename>')
async def serve_thumbnail(filename: str):
    return await send_from_directory(THUMBNAIL_FOLDER, filename)


@event.get('/viewing/<int:event_id>')
async def getViewingUrlByEventId(event_id):
    viewing_url = await get_viewing_url(event_id=event_id, app=current_app)

    if not viewing_url:
        return {'msg': 'Viewing url not found'}, 404
    return {'url': viewing_url}, 200
