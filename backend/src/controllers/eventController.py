from quart import g
from datetime import datetime
from pytz import timezone
from ..models.types import EventData


def compare_date_time():
    expected_date = datetime(2024, 10, 10, 10, 30, 0).astimezone(
        timezone('Europe/Helsinki'))

    print('expected date', expected_date)

    current_date_time = datetime.now(timezone('Europe/Helsinki'))
    print('current date', current_date_time)

    if expected_date > current_date_time:
        print('expected date is greater than current date')

    else:
        print('current date is greater than expected date')

    # print('current date date', current_date_time.date())
    # print('current date time', current_date_time.time())
    # SELECT * FROM events WHERE DATE(event_start_date)= CAST(CURRENT_TIMESTAMP AS DATE);
    # SELECT * FROM events WHERE DATE(event_start_date) <= CAST(CURRENT_TIMESTAMP AS DATE) AND CAST(CURRENT_TIMESTAMP AS DATE) <= DATE(event_start_date);
    # SELECT * FROM events WHERE DATE(event_start_date) <= CAST(CURRENT_TIMESTAMP AS DATE) AND CAST(CURRENT_TIMESTAMP AS DATE) <= DATE(event_start_date) ORDER BY event_start_date:: timestamp :: time;


async def retrieve_events_for_today(today: datetime, isAdmin: bool, streaming_url: str) -> list[dict] | None:
    """Retrive events for today

    Args:
        today (datetime)
        isAdmin (bool)

    Returns:
        dict|None
    """
    try:
        events = await g.connection.fetch_all("SELECT * FROM events WHERE DATE(event_start_date) <= :current_day AND current_day <= DATE(event_end_date) ORDER BY event_start_date:: timestamp :: time;",
                                              {"current_day": today})
        if events:
            event_list = [EventData(id=event["id"],
                                    title=event["title"],
                                    start_date=event["event_start_date"],
                                    end_date=event["event_end_date"],
                                    event_image=event["event_image"],
                                    streaming_key=event["streaming_key"],
                                    streaming_url=streaming_url) for event in events]
            if isAdmin:
                return event_list
            removed_keys = ['streaming_key', 'streaming_url']
            return map(lambda event: (event.pop(key) for key in removed_keys), event_list)
        return None
    except Exception as error:
        print(f'Error retrieving events for today {error}')
        return None
