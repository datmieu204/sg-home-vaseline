from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum

class InvoiceStatus(enum.Enum):
    paid = "paid"
    overdue = "overdue"
    pending = "pending"


class Invoice(Base):
    __tablename__ = "invoices"
    #
    invoice_id = Column(String, primary_key=True, index=True, nullable=False)
    household_id = Column(String, ForeignKey("households.household_id"), nullable=False)
    amount = Column(Float, nullable=False)
    month_date = Column(Date, nullable=False)
    created_date = Column(DateTime, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(Enum(InvoiceStatus), nullable=False, default=InvoiceStatus.pending)

