from datetime import date, datetime
import uuid

from apscheduler.schedulers.background import BackgroundScheduler
from dateutil.relativedelta import relativedelta
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func, Date, Float
from sqlalchemy.orm import Session

from app.core.database import Base, get_db
from app.models.household import Household, HouseholdStatus
from app.models.invoice import Invoice, InvoiceStatus
from app.models.invoice_detail import InvoiceDetail
from app.models.service import Service, ServiceStatus
from app.models.service_registration import ServiceRegistration, ServiceRegistrationStatus




def get_last_day_of_month(target_date: date) -> date:
    """Calculate the last day of the given month."""
    next_month = target_date.replace(day=1) + relativedelta(months=1)
    last_day = next_month - relativedelta(days=1)
    return last_day

def create_monthly_invoices_job(db: Session):
    """
    Automatically generate monthly invoices for all households based on their service registrations.
    Includes service registrations that are 'cancelled' but have an end_date within the invoice month.
    Skips households that already have an invoice for the current month.
    """
    try:
        # Determine the current month and year
        today = datetime.utcnow().date()
        invoice_month = today.replace(day=1)  # First day of the current month

        # Get all households with active status
        households = db.query(Household).filter(Household.status == HouseholdStatus.active).all()

        invoices_created = 0
        invoice_details_created = 0

        # Iterate through each household
        for household in households:
            # Check if an invoice already exists for this household and month
            existing_invoice = db.query(Invoice).filter(
                Invoice.household_id == household.household_id,
                Invoice.month_date == invoice_month
            ).first()

            if existing_invoice:
                continue  # Skip if invoice already exists for this household and month

            # Get all service registrations for the household that are active in the invoice month
            service_registrations = db.query(ServiceRegistration).filter(
                ServiceRegistration.household_id == household.household_id,
                ServiceRegistration.start_date <= invoice_month,
                ServiceRegistration.end_date >= invoice_month
            ).all()

            if not service_registrations:
                continue  # Skip if no service registrations

            # Calculate total amount for the invoice
            total_amount = 0.0
            invoice_details = []

            for registration in service_registrations:
                # Get service details
                service = db.query(Service).filter(Service.service_id == registration.service_id).first()
                if not service:
                    continue  # Skip if service not found

                # Calculate total for this service registration
                detail_total = service.price * registration.quantity
                total_amount += detail_total

                # Create InvoiceDetail
                invoice_detail_id = f"IDET{uuid.uuid4().hex[:3]}"  # e.g., IDET12345678
                invoice_detail = InvoiceDetail(
                    invoice_detail_id=invoice_detail_id,
                    invoice_id=None,  # Will be set after invoice creation
                    service_id=service.service_id,
                    quantity=registration.quantity,
                    price=service.price,
                    total=detail_total
                )
                invoice_details.append(invoice_detail)

            if total_amount <= 0:
                continue  # Skip if no valid invoice details

            # Create Invoice
            invoice_id = f"INV{uuid.uuid4().hex[:3]}"
            invoice = Invoice(
                invoice_id=invoice_id,
                household_id=household.household_id,
                amount=total_amount,
                month_date=invoice_month,
                created_date=datetime.utcnow(),
                due_date=invoice_month + relativedelta(months=1, days=-1),  # Due by end of next month
                status=InvoiceStatus.pending
            )

            # Set invoice_id for each invoice detail
            for detail in invoice_details:
                detail.invoice_id = invoice.invoice_id

            # Add to session
            db.add(invoice)
            for detail in invoice_details:
                db.add(detail)

            invoices_created += 1
            invoice_details_created += len(invoice_details)

        # Commit the transaction
        db.commit()
        return {
            "status": "success",
            "invoices_created": invoices_created,
            "invoice_details_created": invoice_details_created,
            "message": f"Created {invoices_created} invoices with {invoice_details_created} details for month {invoice_month.strftime('%Y-%m')}"
        }

    except Exception as e:
        db.rollback()
        raise Exception(f"Failed to create monthly invoices: {str(e)}")

def run_invoice_job():
    # Extract the database session from the get_db generator
    db_gen = get_db()
    db = next(db_gen)  # Get the session
    try:
        # Call the invoice creation job
        result = create_monthly_invoices_job(db)
        print(f"Invoice job completed: {result}")
    except Exception as e:
        print(f"Error in run_invoice_job: {e}")
        raise
    finally:
        # Ensure the session is closed
        try:
            db.close()
        except Exception:
            pass