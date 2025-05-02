from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float
from app.core.database import Base

class Account(Base):
    __tablename__ = "accounts"
    #
    account_id = Column(String, primary_key=True, index=True, nullable=False)
    username = Column(String, nullable=False, index=True)
    password = Column(String, nullable=False)