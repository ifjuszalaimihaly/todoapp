from flask import jsonify
import datetime
import time
from dotenv import load_dotenv
import os
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

def convert_due_date(due_date_str):
    print(due_date_str)
    # Dátum konvertálása az ISO 8601 formátumból (pl. 2024-09-11T22:00:00.000Z) YYYY-MM-DD formátumra        
    if isinstance(due_date_str, str):
        try:
            # Konvertáljuk a string formátumú dátumot 'YYYY-MM-DD' formátumra
            due_date = datetime.datetime.strptime(due_date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
            # Időzóna konvertálása
            due_date = convert_utc_to_timzone(due_date)
            # Ha már datetime objektum, csak a date részt nyerjük ki
            due_date = due_date.date()
            return due_date  # Visszaadjuk a konvertált dátumot
        except ValueError as e:
            # Kivétel dobása, hogy a hívó függvény tudja kezelni
            raise ValueError("Invalid date format: " + str(e))
    elif isinstance(due_date_str, datetime.datetime):
        # Időzóna konvertálása
        due_date = convert_utc_to_timzone(due_date_str)
        # Ha már datetime objektum, csak a date részt nyerjük ki
        return due_date.date()
    else:
        raise ValueError("Invalid date format")

