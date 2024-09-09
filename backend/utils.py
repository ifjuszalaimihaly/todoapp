from datetime import datetime
import time
from dotenv import load_dotenv
import os


def set_time_zone():
    load_dotenv()
    timezone = os.getenv('tz')
    os.environ['TZ'] = timezone
    time.tzset()

def set_jwt_token():
    load_dotenv()
    jwt_secret_key = os.getenv('jwt_secret_key')
    return jwt_secret_key