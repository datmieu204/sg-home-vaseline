from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from app.core.database import get_db
from app.models import Employee, Household, InvoiceDetail, AccountHousehold, Service, Payment,ServiceRegistration, HouseholdStatus, Notification
from app.models.invoice import Invoice
from app.models.service_registration import ServiceRegistrationStatus
from datetime import datetime
import uuid
from dateutil.relativedelta import relativedelta
from pydantic import BaseModel, Field
from sqlalchemy import and_
from typing import Optional

household_router = APIRouter(prefix="/household", tags=["household"])

@household_router.get("/profile")
def get_profile(household_id: str ,db: Session = Depends(get_db)):
    """
    Get household profile by household_id.
    """
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

# ------------------------------------------------------------------------
# Update household profile

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    room_number: Optional[str] = None
    status: Optional[HouseholdStatus] = None
    username: Optional[str] = None
    password: Optional[str] = None


@household_router.patch("/profile")
def modify_profile(
    update_data: UpdateProfileRequest,
    household_id: str,
    db: Session = Depends(get_db)
):
    """
    Update household profile by household_id.
    """
    household = db.query(Household).filter(Household.household_id == household_id).first()
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")
    
    # Update household fields
    if update_data.name:
        household.name = update_data.name
    if update_data.phone:
        household.phone = update_data.phone
    if update_data.room_number:
        household.room_number = update_data.room_number
    if update_data.status:
        household.status = update_data.status

    # Update account fields
    account_household = db.query(AccountHousehold).filter(AccountHousehold.household_id == household_id).first()
    if not account_household:
        raise HTTPException(status_code=404, detail="Account for household not found")
    
    if update_data.username:
        account_household.username = update_data.username
    if update_data.password:
        account_household.password = update_data.password

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

# @household_router.patch("/profile/modify")
# def modify_profile(household_id: str, name: Optional[str] = None, phone: Optional[str] = None, room_number: Optional[str] = None, status: Optional[HouseholdStatus] = None, username: Optional[str] = None, password: Optional[str] = None, db: Session = Depends(get_db)):
#     household = db.query(Household).filter(Household.household_id == household_id).first()
#     if not household:
#         raise HTTPException(status_code=404, detail="Household not found")
    
#     if name:
#         household.name = name
#     if phone:
#         household.phone = phone
#     if room_number:
#         household.room_number = room_number
#     if status:
#         household.status = status

#     account_household = db.query(AccountHousehold).filter(AccountHousehold.household_id == household_id).first()
#     if not account_household:
#         raise HTTPException(status_code=404, detail="Account for household not found")
    
#     if username:
#         account_household.username = username
#     if password:
#         account_household.password = password

#     db.commit()
#     db.refresh(household)
#     db.refresh(account_household)
#     return {
#         "id": household.household_id,
#         "name": household.name,
#         "number_of_members": household.number_of_members,
#         "phone": household.phone,
#         "room_number": household.room_number,
#         "status": household.status,
#         "account": account_household.account_id,
#         "username": account_household.username,
#         "password": account_household.password
#     }


@household_router.get("/notifications")
def get_all_notifications(household_id: str, db: Session = Depends(get_db)):
    """
    Get all notifications for a household.
    """
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
    """
    Get a specific notification by ID.
    """
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

    response = {
        "message": notification.message,
        "payment_date": payment.date if payment else None,
        "confirmed_by": employee.employee_name if employee and payment else None,
        "services": services
    }

    return response
    

@household_router.get("/services")
def get_all_services(db: Session = Depends(get_db)):
    """
    Get all services.
    """
    # Query all services
    services = db.query(Service).all()

    # Build the response
    response = [
        {
            "service_id": service.service_id,
            "service_name": service.service_name,
            "price": service.price,
            "status": service.status.value,  # Convert Enum to string
            "description": service.description
        }
        for service in services
    ]

    return response

@household_router.get("/services/get/{service_id}")
def get_service_by_id(service_id: str, db: Session = Depends(get_db)):
    """
    Get a specific service by ID.
    """
    # Query the service
    service = db.query(Service).filter(Service.service_id == service_id).first()

    # Check if service exists
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # Build the response
    response = {
        "service_id": service.service_id,
        "service_name": service.service_name,
        "price": service.price,
        "status": service.status.value,  # Convert Enum to string
        "description": service.description
    }

    return response


@household_router.get("/services/myregister")
def get_my_registered_services(household_id: str, db: Session = Depends(get_db)):
    """
    Get all registered services for a household.
    """
    # Check if household exists
    household = db.query(Household).filter(Household.household_id == household_id).first()
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")

    # Join ServiceRegistration with Service
    registered_services = (
        db.query(ServiceRegistration, Service)
        .join(Service, ServiceRegistration.service_id == Service.service_id)
        .filter(ServiceRegistration.household_id == household_id)
        .all()
    )

    # Build the response
    response = [
        {
            "service_registration_id": sr.service_registration_id,
            "service_id": sr.service_id,
            "status": sr.status.value,
            "start_date": sr.start_date,
            "end_date": sr.end_date,
            "service_name": s.service_name,
            "price": s.price
        }
        for sr, s in registered_services
    ]

    return response

@household_router.patch("/services/myregister/{service_registration_id}")
def cancel_service_registration(
    service_registration_id: int,
    db: Session = Depends(get_db)
):
    """
    Cancel a service registration by ID.
    """
    # Tìm đăng ký dịch vụ
    service_registration = db.query(ServiceRegistration).filter(
        ServiceRegistration.service_registration_id == service_registration_id
    ).first()

    if not service_registration:
        raise HTTPException(status_code=404, detail="Service registration not found")

    # Tìm household để xác nhận tồn tại (không bắt buộc nếu không cần kiểm tra)
    household = db.query(Household).filter(
        Household.household_id == service_registration.household_id
    ).first()
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")

    # Hủy đăng ký dịch vụ
    service_registration.status = ServiceRegistrationStatus.cancelled
    db.commit()

    return {
        "message": "Service registration cancelled successfully",
        "service_registration_id": service_registration.service_registration_id,
        "household_id": service_registration.household_id,
        "service_id": service_registration.service_id,
        "status": service_registration.status.value
    }
   
@household_router.post("/services/register/{service_id}")
def register_service(
    household_id: str,
    service_id: str,
    quantity: int,
    db: Session = Depends(get_db)
):
    """
    Register a service for a household.
    """
    # Validate household exists
    household = db.query(Household).filter(Household.household_id == household_id).first()
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")
    
    # Validate service exists
    service = db.query(Service).filter(Service.service_id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Validate quantity
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be positive")
    
    # Get current date and calculate end of month
    current_date = datetime.now().date()
    last_day_of_month = current_date + relativedelta(months=1, day=1) - relativedelta(days=1)
    
    # Check for existing registration in the same month
    existing_registration = db.query(ServiceRegistration).filter(
        and_(
            ServiceRegistration.household_id == household_id,
            ServiceRegistration.service_id == service_id,
            ServiceRegistration.start_date >= current_date.replace(day=1),
            ServiceRegistration.end_date <= last_day_of_month
        )
    ).first()
    
    if existing_registration:
        # Update existing registration if it was cancelled
        if existing_registration.status == ServiceRegistrationStatus.cancelled:
            existing_registration.status = ServiceRegistrationStatus.in_use
            existing_registration.quantity = quantity
            existing_registration.start_date = current_date
            existing_registration.end_date = last_day_of_month
            db.commit()
            db.refresh(existing_registration)
            return existing_registration
        else:
            raise HTTPException(status_code=400, detail="Active registration already exists for this service in this month")
    
    # Create new registration
    new_registration = ServiceRegistration(
        household_id=household_id,
        service_id=service_id,
        quantity=quantity,
        start_date=current_date,
        end_date=last_day_of_month,
        status=ServiceRegistrationStatus.in_use
    )
    
    db.add(new_registration)
    db.commit()
    db.refresh(new_registration)
    
    return new_registration