from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum, JSON, ARRAY, TIMESTAMP
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum

class DepartmentType(enum.Enum):
    ACCT = "ACCT"
    RECEP = "RECEP"
    CLEAN = "CLEAN"
    SECUR = "SECUR"
    TECH = "TECH"

class Department(Base):
    __tablename__ = "departments"

    department_id = Column(Enum(DepartmentType), primary_key=True, index=True, nullable=False)
    department_name = Column(String, nullable=False, index=True)
