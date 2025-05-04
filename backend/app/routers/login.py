from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from app.core.database import get_db
from app.models import Employee, Household, Task, EmployeePosition, TaskStatus, EmployeeStatus, HouseholdStatus, AccountHousehold, AccountEmployee
from pydantic import BaseModel
from datetime import datetime, date
from enum import Enum
from typing import Optional

login_router = APIRouter(prefix="", tags=["login"])

class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    staff = "staff"
    household = "household"

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    user_id: str  # employee_id hoặc household_id
    username: str
    user_type: UserRole


@login_router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Đăng nhập và trả về thông tin người dùng, xác định loại người dùng (admin, manager, staff, household).
    """
    # Kiểm tra trong bảng AccountEmployee
    account_employee = db.query(AccountEmployee).filter(
        AccountEmployee.username == request.username,
        AccountEmployee.password == request.password  
    ).first()

    if account_employee:
        employee = db.query(Employee).filter(
            Employee.employee_id == account_employee.employee_id,
            Employee.status == EmployeeStatus.active,
        ).first()

        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found or inactive")

        # admin hoặc staff hoặc manager
        user_type = (
            UserRole.admin
            if employee.position in [EmployeePosition.head_manager]
            else UserRole.manager
            if employee.position in [EmployeePosition.manager]
            else UserRole.staff
        )

        return {
            "user_id": account_employee.employee_id,
            "username": account_employee.username,
            "user_type": user_type
        }

    # Kiểm tra trong bảng AccountHousehold
    account_household = db.query(AccountHousehold).filter(
        AccountHousehold.username == request.username,
        AccountHousehold.password == request.password
    ).first()

    if account_household:
        household = db.query(Household).filter(
            Household.household_id == account_household.household_id,
            Household.status == HouseholdStatus.active 
        ).first()

        if not household:
            raise HTTPException(status_code=403, detail="Household not found or inactive")

        return {
            "user_id": account_household.household_id,
            "username": account_household.username,
            "user_type": UserRole.household
        }

    raise HTTPException(status_code=401, detail="Invalid username or password")