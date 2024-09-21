from quart import g
from pytz import timezone
from ..models.types import EventData


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
