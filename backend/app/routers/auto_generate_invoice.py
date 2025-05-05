from sqlalchemy.orm import Session
from apscheduler.schedulers.background import BackgroundScheduler
from app.core.database import get_db
from app.models.household import Household, HouseholdStatus
from app.models.service_registration import ServiceRegistration, ServiceRegistrationStatus
from app.models.service import Service, ServiceStatus
from app.models.invoice import Invoice, InvoiceStatus
from app.models.invoice_detail import InvoiceDetail
import uuid
from datetime import date, datetime
from dateutil.relativedelta import relativedelta


def get_last_day_of_month(target_date: date) -> date:
    """Calculate the last day of the given month."""
    next_month = target_date.replace(day=1) + relativedelta(months=1)
    last_day = next_month - relativedelta(days=1)
    return last_day

def create_monthly_invoices_job(db: Session):
    try:
        # Target month is the current month
        current_date = date.today()
        month_date = current_date.replace(day=1)  # e.g., 2025-05-01
        last_day = get_last_day_of_month(current_date)  # e.g., 2025-05-31
        due_date = last_day + relativedelta(days=7)  # e.g., 2025-06-07

        # Get all active households
        households = (
            db.query(Household)
            .filter(Household.status == HouseholdStatus.active)
            .all()
        )

        invoices_created = 0
        created_invoices = []

        for household in households:
            # Check for existing invoice for this household and month
            existing_invoice = (
                db.query(Invoice)
                .filter(
                    Invoice.household_id == household.household_id,
                    Invoice.month_date == month_date
                )
                .first()
            )
            if existing_invoice:
                continue

            # Get active service registrations for the household
            registrations = (
                db.query(ServiceRegistration, Service)
                .join(Service, ServiceRegistration.service_id == Service.service_id)
                .filter(
                    ServiceRegistration.household_id == household.household_id,
                    ServiceRegistration.status == ServiceRegistrationStatus.in_use,
                    Service.status == ServiceStatus.active
                )
                .all()
            )

            if not registrations:
                continue  # Skip if no registered services

            # Calculate total amount and create invoice details
            total_amount = 0
            invoice_details = []
            invoice_id = f"INV{uuid.uuid4().hex[:3]}"  # e.g., INV12345678

            for registration, service in registrations:
                quantity = 1  # Default quantity (adjust if usage data available)
                price = service.price
                total = quantity * price
                total_amount += total

                invoice_detail_id = f"IDET{uuid.uuid4().hex[:3]}"  # e.g., IDET12345678
                invoice_detail = InvoiceDetail(
                    invoice_detail_id=invoice_detail_id,
                    invoice_id=invoice_id,
                    service_id=service.service_id,
                    quantity=quantity,
                    price=price,
                    total=total
                )
                invoice_details.append(invoice_detail)

            # Create invoice
            invoice = Invoice(
                invoice_id=invoice_id,
                household_id=household.household_id,
                amount=total_amount,
                month_date=month_date,
                created_date=datetime.now(),
                due_date=due_date,
                status=InvoiceStatus.pending  # Use 'pending' if InvoiceStatus updated
            )

            db.add(invoice)
            db.add_all(invoice_details)
            invoices_created += 1
            created_invoices.append({
                "invoice_id": invoice.invoice_id,
                "household_id": invoice.household_id,
                "amount": invoice.amount,
                "month_date": invoice.month_date,
                "due_date": invoice.due_date,
                "status": invoice.status.value,
                "details": [
                    {
                        "invoice_detail_id": detail.invoice_detail_id,
                        "service_id": detail.service_id,
                        "quantity": detail.quantity,
                        "price": detail.price,
                        "total": detail.total
                    }
                    for detail in invoice_details
                ]
            })

        db.commit()
        print(f"[{current_date}] Created {invoices_created} invoices for {month_date.strftime('%Y-%m')}")
        return {
            "invoices_created": invoices_created,
            "invoices": created_invoices
        }
    except Exception as e:
        db.rollback()
        print(f"Error creating invoices: {e}")
        raise
    finally:
        db.close()


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

