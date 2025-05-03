from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum

class AccountRole(enum.Enum):
    admin = "admin"
    manager = "manager"
    staff = "staff"
    manager_accounting = "manager_accounting"
    staff_accounting = "staff_accounting"
    manager_reception = "manager_reception"
    staff_reception = "staff_reception"
    household = "household"


class AccountStatus(enum.Enum):
    active = "active"
    inactive = "inactive"


class Account(Base):
    __tablename__ = "accounts"
    #
    account_id = Column(String, primary_key=True, index=True, nullable=False)
    username = Column(String, nullable=False, index=True)
    password = Column(String, nullable=False)
    status = Column(Enum(AccountStatus), default=AccountStatus.active, nullable=False)