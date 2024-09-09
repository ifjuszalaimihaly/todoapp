from datetime import datetime
import time
from dotenv import load_dotenv
import os


def set_time_zone():
    load_dotenv()
    timezone = os.getenv('TZ')
    os.environ['TZ'] = timezone
    time.tzset()