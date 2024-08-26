from sqlalchemy import *
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
load_dotenv()
import os
import os.path
import json
import app


HOSTNAME = os.environ.get('host')
PORT = os.environ.get('port')
USERNAME = os.environ.get('user')
PASSWORD = os.environ.get('password')
DBNAME = os.environ.get('database')

DB_URL = f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DBNAME}'


class db_conn:
    def __init__(self):
        self.engine = create_engine(DB_URL, pool_recycle=500)

    def sessionmaker(self):
        Session = sessionmaker(bind=self.engine)
        session = Session()
        return session
    
    def connection(self):
        conn = self.engine.connection()
        return conn