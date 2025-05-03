from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum


class TaskStatus(enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class Task(Base):
    __tablename__ = "tasks"
    #
    task_id = Column(String, primary_key=True, index=True, nullable=False)
    name_task = Column(String, nullable=False, index=True)
    assigner_id = Column(String, ForeignKey("employees.employee_id"), nullable=False)
    assignee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False)
    assigned_time = Column(DateTime, nullable=False)
    description = Column(String, nullable=False)
    deadline = Column(DateTime, nullable=True)
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.pending, index=True)