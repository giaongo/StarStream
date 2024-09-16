from quart import Blueprint


event = Blueprint('event', __name__)


@event.route('/', methods=['GET'])
async def get_events_today():
    return {'events': 'Here is the list of event'}, 200

@event.route('/archives', methods=['GET'])
async def get_archives():
    return {'archives': 'Here is the list of archives'}, 200
    
