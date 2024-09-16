
from quart import Blueprint


admin = Blueprint('admin', __name__)


@admin.route('/login', methods=['POST'])
async def login(): 
    """login user

    Returns:
        _type_: _description_
    """
    return {'admin': 'login successfully'}, 200


@admin.route('/logout', methods=['POST'])
async def logout():
    return {'admin': 'logout successfully'}, 200

@admin.route('/event', methods=['POST'])
async def add_event():
    return {'admin': 'add event successfully'}, 200

@admin.route('/event/<int:event_id>', methods=['DELETE'])
async def delete_event(event_id):
    return {'admin': f'delete event ${event_id} successfully'}, 200