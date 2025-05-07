from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum

class AccountEmployee(Base):
    __tablename__ = "accounts_employee"
    #
    account_id = Column(String, primary_key=True, index=True, nullable=False)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False)
    username = Column(String, nullable=False, index=True)
    password = Column(String, nullable=False)
