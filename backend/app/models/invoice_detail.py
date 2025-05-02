from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float
from app.core.database import Base

class InvoiceDetail(Base):
    __tablename__ = "invoice_details"
    #
    invoice_detail_id = Column(String, primary_key=True, index=True, nullable=False)
    invoice_id = Column(String, ForeignKey("invoices.invoice_id"), nullable=False)
    service_id = Column(String, ForeignKey("services.service_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    total = Column(Float, nullable=False)