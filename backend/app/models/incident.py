from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum


class IncidentStatus(enum.Enum):
    in_progress = "in_progress"
    resolved = "resolved"

class Incident(Base):
    __tablename__ = "incidents"
    #
    incident_id = Column(String, primary_key=True, index=True)
    incident_name = Column(String, index=True, nullable=False)
    responsible_id = Column(Integer, ForeignKey("employees.employee_id"), nullable=False)
    report_time = Column(DateTime, nullable=False)
    reporter_id = Column(Integer, ForeignKey("employees.employee_id"), nullable=False)
    description = Column(String, nullable=True)
    status = Column(Enum(IncidentStatus), nullable=False, default=IncidentStatus.in_progress)