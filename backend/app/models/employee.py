from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum
from sqlalchemy.orm import relationship

class EmployeeStatus(enum.Enum):
    active = "active"
    inactive = "inactive"

class EmployeePosition(enum.Enum):
    manager = "manager"
    staff = "staff"
    head_manager = "head_manager"

class Employee(Base):
    __tablename__ = "employees"
    #
    employee_id = Column(String, primary_key=True, index=True, nullable=False)
    employee_name = Column(String, nullable=False, index=True)
    department_id = Column(String, ForeignKey("departments.department_id"), nullable=True, index=True)
    begin_date = Column(Date, default=func.now(), nullable=False)
    position = Column(Enum(EmployeePosition), nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=False)
    status = Column(Enum(EmployeeStatus), nullable=False, default=EmployeeStatus.active)