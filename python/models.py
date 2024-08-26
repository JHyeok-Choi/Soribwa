from sqlalchemy import Column, String, INT, TEXT
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User_info(Base):
    __tablename__ = 'user_info'

    UUID = Column(TEXT, nullable=False, primary_key=True)
    EMAIL = Column(TEXT, nullable=False, unique=True)
    PASSWORD = Column(TEXT, nullable=False)
    NAME = Column(TEXT, nullable=False)
    ROLE = Column(TEXT, nullable=False)
    EXPIRE_DATE = Column(TEXT, nullable=True)
    USER_AVATAR = Column(TEXT, nullable=True)
