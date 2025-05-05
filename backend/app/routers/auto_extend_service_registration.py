from sqlalchemy.orm import Session
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from app.core.database import get_db
from app.models.service_registration import ServiceRegistration, ServiceRegistrationStatus

def get_last_day_of_month(target_date: date) -> date:
    """Calculate the last day of the given month."""
    next_month = target_date.replace(day=1) + relativedelta(months=1)
    return next_month - relativedelta(days=1)

def renew_service_registrations_job(db: Session):
    """
    Automatically renew service registrations for households.
    Runs only on the last day of the current month.
    Renews registrations that are 'in_use' and have an end_date within the current month.
    """
    try:
        # Determine the current date
        today = datetime.now().date()
        first_day = today.replace(day=1)
        last_day = get_last_day_of_month(today)

        # Only proceed if today is the last day of the month
        if today != last_day:
            return {
                "status": "skipped",
                "renewed_count": 0,
                "message": "Renewal job runs only on the last day of the month."
            }

        # Calculate the next-month's last day for renewal
        next_month_start = first_day + relativedelta(months=1)
        new_end_date = get_last_day_of_month(next_month_start)

        # Fetch registrations to renew
        registrations_to_renew = (
            db.query(ServiceRegistration)
              .filter(
                  ServiceRegistration.status == ServiceRegistrationStatus.in_use,
                  ServiceRegistration.end_date <= last_day
              )
              .all()
        )

        renewed_count = 0
        for reg in registrations_to_renew:
            reg.end_date = new_end_date
            renewed_count += 1

        db.commit()
        return {
            "status": "success",
            "renewed_count": renewed_count,
            "message": (
                f"Renewed {renewed_count} registrations. "
                f"New end_date set to {new_end_date.isoformat()}"
            )
        }

    except Exception as e:
        db.rollback()
        raise

def run_renew_service_registrations_job():
    db_gen = get_db()
    db = next(db_gen)
    try:
        result = renew_service_registrations_job(db)  # Giả lập ngày cuối tháng 6
        print(f"Renewal job result: {result}")
        return result
    except Exception as e:
        print(f"Error: {e}")
        raise
    finally:
        db.close()