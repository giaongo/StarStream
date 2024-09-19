from quart import Blueprint
from quart_jwt_extended import jwt_optional, get_jwt_identity
from ..controllers.eventController import retrieve_events
event = Blueprint('event', __name__)


# this routing is partially protected. Can be either admin or public user

@event.route('/', methods=['GET'])
@jwt_optional
async def get_events_today():
    current_user = get_jwt_identity()
    await retrieve_events()
    if current_user:
        return {'msg': 'request as admin'}, 200
    else:
        return {'msg': 'request as public user'}, 200


@event.route('/archives', methods=['GET'])
async def get_archives():
    return {'archives': 'Here is the list of archives'}, 200
