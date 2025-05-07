from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"
    #
    notification_id = Column(String, primary_key=True, index=True, nullable=False)
    invoice_id = Column(String, ForeignKey("invoices.invoice_id"), nullable=False)
    household_id = Column(String, ForeignKey("households.household_id"), nullable=False)
    payment_id = Column(String, ForeignKey("payments.payment_id"), nullable=False)
    message = Column(String, nullable=False)