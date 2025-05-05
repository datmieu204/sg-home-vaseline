from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum


class HouseholdStatus(enum.Enum):
    active = "active"
    inactive = "inactive"


class Household(Base):
    __tablename__ = "households"
    #
    household_id = Column(String, primary_key=True, index=True, autoincrement=True, nullable=False)
    number_of_members = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    room_number = Column(String, nullable=False)
    status = Column(Enum(HouseholdStatus), default=HouseholdStatus.active, nullable=False)
