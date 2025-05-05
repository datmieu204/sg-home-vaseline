from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float, Enum
from app.core.database import Base
import enum

class PaymentMethod(enum.Enum):
    cash = "cash"
    bank = "bank"

class Payment(Base):
    __tablename__ = "payments"
    #
    payment_id = Column(String, primary_key=True, index=True, nullable=False)
    invoice_id = Column(String, ForeignKey("invoices.invoice_id"), nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)
    method = Column(Enum(PaymentMethod), nullable=False)
    confirmed_by = Column(String, ForeignKey("employees.employee_id"), nullable=False)