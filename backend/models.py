from sqlalchemy import Column, Integer, BigInteger, String, Boolean, DateTime, SmallInteger, Text, Float, TIMESTAMP, \
    ForeignKey, UniqueConstraint, select, join, and_, desc, create_engine, func
from sqlalchemy.orm import relationship, declarative_base, remote, foreign, sessionmaker
from marshmallow import Schema, fields

import os
import time
import datetime

from dotenv import load_dotenv

def create_db_connection():
    load_dotenv()
    db_service = os.getenv('dbservice')
    db_host = os.getenv('host')
    db_user = os.getenv('user')
    db_password = os.getenv('password')
    db_port = int(os.getenv('port'))
    db_name = os.getenv('database')

    # connect to the database, show the queries with the echo
    database_url = f"{db_service}://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    engine = create_engine(database_url, echo=False)
    session = sessionmaker(bind=engine)
    return session()

Base = declarative_base()

class Todo(Base):
    __tablename__ = 'todos'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.datetime.now)


class TodoSchema(Schema):
    id = fields.Integer(dump_only=True)
    title = fields.String(required=True)
    created_at = fields.DateTime(dump_only=True)
