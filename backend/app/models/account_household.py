from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum

class AccountHousehold(Base):
    __tablename__ = "accounts_household"
    #
    account_id = Column(String, primary_key=True, index=True, nullable=False)
    household_id = Column(String, ForeignKey("households.household_id"), nullable=False)
    username = Column(String, nullable=False, index=True)
    password = Column(String, nullable=False)
