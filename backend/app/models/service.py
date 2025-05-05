from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum

class ServiceStatus(enum.Enum):
    active = "active"
    inactive = "inactive"

class Service(Base):
    __tablename__ = "services"
    #
    service_id = Column(String, primary_key=True, index=True, nullable=False)
    service_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(Enum(ServiceStatus), default=ServiceStatus.active, nullable=False)
    description = Column(String, nullable=True)