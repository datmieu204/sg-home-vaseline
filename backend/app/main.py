from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.auto_generate_invoice import run_invoice_job
# from app.auth import verify_password, create_access_token
from app.models import Employee, Household, AccountEmployee, AccountHousehold, Task, EmployeePosition, TaskStatus, EmployeeStatus, HouseholdStatus
from app.routers import admin, household, manager, staff
from apscheduler.schedulers.background import BackgroundScheduler
from app.routers.auto_extend_service_registration import run_renew_service_registrations_job

from fastapi.middleware.cors import CORSMiddleware  

app = FastAPI()


# Schedule the job to run on the last day of each month at 23:59
scheduler = BackgroundScheduler()
db_session = next(get_db())

scheduler.add_job(
    run_invoice_job,
    "cron",
    day="last",  # Last day of the month
    hour=23,
    minute=59
)

scheduler.add_job(
    run_renew_service_registrations_job, 
    'cron', 
    day="last", 
    hour=0, 
    minute=0,
)

scheduler.start()

# Ensure scheduler shuts down when app stops
@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import admin, household, manager, staff, login

app.include_router(login.login_router)
app.include_router(admin.admin_router)
app.include_router(manager.manager_router)
app.include_router(staff.staff_router)
app.include_router(household.household_router)
