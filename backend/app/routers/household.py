from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from app.core.database import get_db
from app.models import Employee, Household, InvoiceDetail, AccountHousehold, Service, Payment, Invoice, HouseholdStatus, Notification
from pydantic import BaseModel
from datetime import datetime, date
from enum import Enum
from typing import Optional

household_router = APIRouter(prefix="/household", tags=["household"])

@household_router.get("/profile")
def get_profile(household_id: str ,db: Session = Depends(get_db)):
    household = db.query(Household).filter(Household.household_id == household_id).first()
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")
    return {
        "id": household.household_id,
        "name": household.name,
        "number_of_members": household.number_of_members,
        "phone": household.phone,
        "room_number": household.room_number,
        "status": household.status,
    }

@household_router.patch("/profile/modify")
def modify_profile(household_id: str, name: Optional[str] = None, phone: Optional[str] = None, room_number: Optional[str] = None, status: Optional[HouseholdStatus] = None, username: Optional[str] = None, password: Optional[str] = None, db: Session = Depends(get_db)):
    household = db.query(Household).filter(Household.household_id == household_id).first()
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")
    
    if name:
        household.name = name
    if phone:
        household.phone = phone
    if room_number:
        household.room_number = room_number
    if status:
        household.status = status

    account_household = db.query(AccountHousehold).filter(AccountHousehold.household_id == household_id).first()
    if not account_household:
        raise HTTPException(status_code=404, detail="Account for household not found")
    
    if username:
        account_household.username = username
    if password:
        account_household.password = password

    db.commit()
    db.refresh(household)
    db.refresh(account_household)
    return {
        "id": household.household_id,
        "name": household.name,
        "number_of_members": household.number_of_members,
        "phone": household.phone,
        "room_number": household.room_number,
        "status": household.status,
        "account": account_household.account_id,
        "username": account_household.username,
        "password": account_household.password
    }


@household_router.get("/notifications")
def get_all_notifications(household_id: str, db: Session = Depends(get_db)):
    # Check if household exists
    household = db.query(Household).filter(Household.household_id == household_id).first()
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")

    # Query notifications with joined Invoice and Payment data
    notifications = (
        db.query(Notification, Invoice, Payment)
        .outerjoin(Invoice, Notification.invoice_id == Invoice.invoice_id)
        .outerjoin(Payment, Notification.payment_id == Payment.payment_id)
        .filter(Notification.household_id == household_id)
        .all()
    )

    return [
        {
            "notification_id": notification.notification_id,
            "message": notification.message,
            "time": payment.date if payment else None
        }
        for notification, invoice, payment in notifications
    ]


@household_router.get("/notifications/{notification_id}")
def get_notification_by_id(notification_id: str, db: Session = Depends(get_db)):
    # Query the notification with joined Invoice, Payment, and Employee data
    notification_data = (
        db.query(Notification, Invoice, Payment, Employee)
        .outerjoin(Invoice, Notification.invoice_id == Invoice.invoice_id)
        .outerjoin(Payment, Notification.payment_id == Payment.payment_id)
        .outerjoin(Employee, Payment.confirmed_by == Employee.employee_id)
        .filter(Notification.notification_id == notification_id)
        .first()
    )

    # Check if notification exists
    if not notification_data:
        raise HTTPException(status_code=404, detail="Notification not found")

    # Unpack the tuple
    notification, invoice, payment, employee = notification_data

    # Fetch InvoiceDetail records joined with Service if invoice exists
    services = []
    if invoice:
        invoice_details = (
            db.query(InvoiceDetail, Service)
            .join(Service, InvoiceDetail.service_id == Service.service_id)
            .filter(InvoiceDetail.invoice_id == invoice.invoice_id)
            .all()
        )
        services = [
            {
                "service_name": service.service_name,
                "quantity": invoice_detail.quantity,
                "total": invoice_detail.total
            }
            for invoice_detail, service in invoice_details
        ]

    # Build the response
    response = {
        "message": notification.message,
        "payment_date": payment.date if payment else None,
        "confirmed_by": employee.employee_name if employee and payment else None,
        "services": services
    }

    return response


