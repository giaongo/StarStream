from quart import g
from .. import QuartSIO
from ..models.types import EventData, VideoArchive


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
                                              FROM events 
                                              WHERE DATE(event_start_date) <= CAST(CURRENT_TIMESTAMP AS DATE) 
                                              AND CAST(CURRENT_TIMESTAMP AS DATE) <= DATE(event_end_date) 
                                              ORDER BY event_start_date:: timestamp :: time;""")
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
    """ Generate viewing url from streaming url and streaming key

    Args:
        event_id (int)

    Returns:
        str | None
    """
    try:
        key = await get_streaming_key(event_id)
        result = await g.connection.fetch_one("SELECT viewing_url FROM streaming_setting")
        if (key and result):
            return f'{result["viewing_url"]}/{key}.flv'
        else:
            return None

    except Exception as error:
        print(f'Error getting viewing url {error}')
        return None


async def add_video_archive(video_url: str, streaming_key: str, combined_name: str) -> bool:
    """ Add video archive url and streaming key to database

    Args:
        video_url (str)
        streaming_key (str)

    Returns:
        bool
    """

    try:
        result = await g.connection.execute("""INSERT INTO videos_archives (video_path, key_name, file_name) 
                                            VALUES (:video_url, :streaming_key, :combined_name)""",
                                            {'video_url': video_url,
                                             'streaming_key': streaming_key,
                                             'combined_name': combined_name
                                             })
        if result:
            print(f'Video archive added successfully ', result)
            return True
        return False
    except Exception as error:
        print(f'Error adding video archive {error}')
        return False


async def get_video_archives() -> list[dict] | None:
    """ get video archives from database

    Returns:
        list[VideoArchive] | None
    """
    try:
        archives = await g.connection.fetch_all("""SELECT id as event_id, 
                                                title,
                                                event_start_date,
                                                event_end_date, 
                                                event_image, 
                                                streaming_key, 
                                                video_id, 
                                                video_path, 
                                                file_name  
                                                FROM events INNER JOIN videos_archives 
                                                ON events.streaming_key = videos_archives.key_name
                                                ORDER BY event_start_date DESC;
                                                """)
        if archives:
            video_archives = [VideoArchive(
                event_id=archive["event_id"],
                title=archive["title"],
                event_start_date=archive["event_start_date"].strftime(
                    '%Y-%m-%d %H:%M:%S'),
                event_end_date=archive["event_end_date"].strftime(
                    '%Y-%m-%d %H:%M:%S'),
                event_image=archive["event_image"],
                streaming_key=archive["streaming_key"],
                video_id=archive["video_id"],
                video_path=archive["video_path"],
                file_name=archive["file_name"]
            ).__dict__ for archive in archives]
            return video_archives
    except Exception as error:
        print(f'Error getting video archives {error}')
        return None
