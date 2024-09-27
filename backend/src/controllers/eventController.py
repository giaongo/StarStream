from quart import g
from pytz import timezone

from src import QuartSIO
from ..models.types import App, EventData


async def retrieve_events_for_today(isAdmin: bool, streaming_url: str) -> list[dict] | None:
    """Retrive events for today

    Args:
        today (datetime)
        isAdmin (bool)

    Returns:
        dict|None
    """
    try:
        events = await g.connection.fetch_all("""SELECT * 
                                              FROM events WHERE DATE(event_start_date) <= CAST(CURRENT_TIMESTAMP AS DATE) 
                                              AND CAST(CURRENT_TIMESTAMP AS DATE) <= DATE(event_end_date) ORDER BY event_start_date:: timestamp :: time;""")
        if events:
            event_list = [EventData(
                id=event["id"],
                title=event["title"],
                start_date=event["event_start_date"].strftime(
                    '%Y-%m-%d %H:%M:%S'),
                end_date=event["event_end_date"].strftime('%Y-%m-%d %H:%M:%S'),
                event_image=event["event_image"],
                streaming_key=event["streaming_key"],
                streaming_url=streaming_url).__dict__ for event in events]
            if isAdmin:
                return event_list
            removed_keys = ['streaming_key', 'streaming_url']
            return [{key: event[key] for key in event if key not in removed_keys} for event in event_list]
        return None
    except Exception as error:
        print(f'Error retrieving events for today {error}')
        return None


async def get_streaming_key(event_id: int) -> str | None:
    """ Retrieve streaming key from database

    Args:
        event_id (int)

    Returns:
        str | None
    """
    try:
        result = await g.connection.fetch_one("SELECT streaming_key FROM events WHERE id = :id", {"id": event_id})
        return result["streaming_key"]
    except Exception as error:
        print(f'Error getting streaming key {error}')
        return None


async def get_viewing_url(event_id: int, app: QuartSIO) -> str | None:
    """ generate viewing url from streaming url and streaming key

    Args:
        event_id (int)

    Returns:
        str | None
    """
    key = await get_streaming_key(event_id)
    url = app.streaming_url
    if (key and url):
        return f'http://{url}/hls/{key}.m3u8'
    else:
        return None
