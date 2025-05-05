from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from app.core.database import get_db
from app.models import Employee, Household, InvoiceDetail, AccountHousehold, Service, Payment,ServiceRegistration, HouseholdStatus, Notification
from app.models.invoice import Invoice, InvoiceStatus
from app.models.service_registration import ServiceRegistrationStatus
from app.models.service import ServiceStatus
from datetime import date, datetime
from enum import Enum
import uuid
from typing import Optional
from app.routers.auto_generate_invoice import create_monthly_invoices_job

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
    # Get current date for comparison
    current_date = date.today()

    # Query overdue, unpaid invoices
    overdue_invoices = (
        db.query(Invoice)
        .filter(
            Invoice.due_date <= current_date,
            Invoice.status != InvoiceStatus.paid  # Not paid
        )
        .all()
    )

    if not overdue_invoices:
        return {"message": "No overdue invoices found", "notifications_created": 0}

    # Track created notifications
    notifications_created = 0
    created_notifications = []

    for invoice in overdue_invoices:
        # Verify household exists
        household = db.query(Household).filter(Household.household_id == invoice.household_id).first()
        if not household:
            continue  # Skip if household doesn't exist

        # Check for existing notification for this invoice
        existing_notification = (
            db.query(Notification)
            .filter(
                Notification.invoice_id == invoice.invoice_id,
                Notification.message.ilike(f"%overdue%")  # Case-insensitive check for "overdue"
            )
            .first()
        )

        if existing_notification:
            continue  # Skip if notification already exists

        # Generate unique notification_id
        notification_id = f"NOT{uuid.uuid4().hex[:8]}"  # Example: NOT12345678

        # Create notification
        notification = Notification(
            notification_id=notification_id,
            invoice_id=invoice.invoice_id,
            household_id=invoice.household_id,
            payment_id=None,  # No payment yet
            message=f"Invoice {invoice.invoice_id} is overdue. Please pay ${invoice.amount} by {invoice.due_date}."
        )

        db.add(notification)
        notifications_created += 1
        created_notifications.append({
            "notification_id": notification.notification_id,
            "invoice_id": notification.invoice_id,
            "household_id": notification.household_id,
            "message": notification.message
        })

    # Commit changes to the database
    db.commit()

    return {
        "message": f"Created {notifications_created} notifications for overdue invoices",
        "notifications_created": notifications_created,
        "notifications": created_notifications
    }


@household_router.get("/services")
def get_all_services(db: Session = Depends(get_db)):
    # Query all services
    services = db.query(Service).all()

    # Build the response
    response = [
        {
            "service_id": service.service_id,
            "service_name": service.service_name,
            "price": service.price,
            "status": service.status.value  # Convert Enum to string
        }
        for service in services
    ]

    return response

@household_router.patch("/services/registration_{service_id}")
def set_service_registration(
    household_id: str,
    service_id: str,
    status: ServiceRegistrationStatus = ServiceRegistrationStatus.in_use,
    db: Session = Depends(get_db)
):
    """
    Set or update a service registration for a household.
    
    Args:
        household_id: ID of the household.
        service_id: ID of the service to register.
        status: Status of the registration (in_use or cancelled). Defaults to in_use.
        db: Database session.
    
    Returns:
        Details of the created or updated service registration, or existing registration if no changes needed.
    
    Raises:
        HTTPException: If housework or service is not found, or if the operation fails.
    """
    # Validate household
    household = db.query(Household).filter(
        Household.household_id == household_id,
        Household.status == HouseholdStatus.active
    ).first()
    if not household:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Household not found or inactive"
        )

    # Validate service
    service = db.query(Service).filter(
        Service.service_id == service_id,
        Service.status == ServiceStatus.active
    ).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found or inactive"
        )

    # Check for existing registration
    registration = db.query(ServiceRegistration).filter(
        ServiceRegistration.household_id == household_id,
        ServiceRegistration.service_id == service_id
    ).first()

    if registration and registration.status == ServiceRegistrationStatus.in_use and status == ServiceRegistrationStatus.in_use:
        # No changes needed if existing registration is in_use and input status is in_use
        return {
            "service_registration_id": registration.service_registration_id,
            "household_id": registration.household_id,
            "service_id": registration.service_id,
            "start_date": registration.start_date,
            "status": registration.status.value
        }
    else:
        # Create new registration if none exists or existing is cancelled
        if not registration or registration.status == ServiceRegistrationStatus.cancelled:
            registration = ServiceRegistration(
                household_id=household_id,
                service_id=service_id,
                start_date=date.today(),
                status=status
            )
            db.add(registration)
        else:
            # Update existing registration (e.g., change from in_use to cancelled)
            registration.status = status
    try:
        db.commit()
        db.refresh(registration)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update registration: {str(e)}"
        )

    return {
        "service_registration_id": registration.service_registration_id,
        "household_id": registration.household_id,
        "service_id": registration.service_id,
        "start_date": registration.start_date,
        "status": registration.status.value
    }