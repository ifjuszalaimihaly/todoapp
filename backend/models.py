from sqlalchemy import Column, Integer, BigInteger, String, Boolean, DateTime, SmallInteger, Text, Float, TIMESTAMP, \
    ForeignKey, UniqueConstraint, select, join, and_, desc, create_engine, func
from sqlalchemy.orm import relationship, declarative_base, remote, foreign, sessionmaker
from werkzeug.security import generate_password_hash, check_password_hash
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

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(80), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.now)

    # Kapcsolat a todos táblával
    todos = relationship('Todo', back_populates='user', cascade="all, delete-orphan")

    # Jelszó beállítása
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Jelszó ellenőrzése
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Todo(Base):
    __tablename__ = 'todos'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False, unique=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.now)

        
    # Idegen kulcs, amely a User táblára hivatkozik
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    # Kapcsolat a User táblával
    user = relationship('User', back_populates='todos')

class TodoSchema(Schema):
    id = fields.Integer(dump_only=True)
    title = fields.String(required=True)
    completed = fields.Boolean(required=True)
    created_at = fields.DateTime(dump_only=True)