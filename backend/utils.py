from datetime import datetime
import time
from dotenv import load_dotenv
import os
import pytz
from pytz import timezone



def set_time_zone():
    load_dotenv()
    timezone = os.getenv('tz')
    os.environ['TZ'] = timezone
    time.tzset()

def convert_utc_to_timzone(utc_time):
    # Ellenőrizzük, hogy a bemenet datetime típusú és tartalmaz-e időzóna információt
    if utc_time.tzinfo is None:
        raise ValueError("The datetime object must be timezone-aware.")

    # Budapest időzóna beállítása
    budapest_tz = timezone(os.getenv('tz'))

    # UTC idő átalakítása Budapest időzónára
    local_time = utc_time.astimezone(budapest_tz)
    
    return local_time

def set_jwt_token():
    load_dotenv()
    jwt_secret_key = os.getenv('jwt_secret_key')
    return jwt_secret_key