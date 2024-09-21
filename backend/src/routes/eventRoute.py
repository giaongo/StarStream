from quart import Blueprint, current_app, jsonify, send_from_directory
from quart_jwt_extended import jwt_optional, get_jwt_identity
from .adminRoute import THUMBNAIL_FOLDER
from ..controllers.eventController import retrieve_events_for_today
event = Blueprint('event', __name__)


# this routing is partially protected. Can be either admin or public user

@event.route('/', methods=['GET'])
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
