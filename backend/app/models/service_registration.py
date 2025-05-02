from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum

class ServiceRegistrationStatus(enum.Enum):
    in_use = "in_use"
    cancelled = "cancelled"

class ServiceRegistration(Base):
    __tablename__ = "service_registrations"
    #
    service_registration_id = Column(Integer, primary_key=True, index=True, nullable=False)
    household_id = Column(Integer, ForeignKey("households.household_id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.service_id"), nullable=False)
    start_date = Column(Date, nullable=False)
    status = Column(Enum(ServiceRegistrationStatus), nullable=False, default=ServiceRegistrationStatus.in_use, index=True)