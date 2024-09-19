from quart import g
from datetime import datetime
from pytz import timezone


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


async def retrieve_events():
    """ get events today
    """
    compare_date_time()
