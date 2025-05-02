from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Employee, Household, Account
from pydantic import BaseModel
from datetime import datetime, date


admin_router = APIRouter(prefix="/admin", tags=["admin"])

class EmployeeCreate(BaseModel):
    employee_id: str
    employee_name: str
    department_id: str
    username: str
    password: str
    position: str
    phone: str
    address: str


class AdminSchema(BaseModel):
    employee_id: str
    employee_name: str
    position: str
    phone: str
    address: str
    status: str
    begin_date: date

    class Config:
        from_attributes = True
   

@admin_router.get("/profile")
def get_profile(db: Session = Depends(get_db)):
    # Lấy thông tin admin

    admin_account = db.query(Account).filter(Account.username == "admin").first()
    if not admin_account:
        raise HTTPException(status_code=404, detail="Admin not found")

    admin_employee = db.query(Employee).filter(Employee.account_id == admin_account.account_id).first()
    if not admin_employee:
        raise HTTPException(status_code=404, detail="Admin employee not found")

    admin_profile = AdminSchema.from_orm(admin_employee)

    return {"message": "This is admin's profile", "admin": admin_profile}

    return {"message": "This is admin's profile", "admin": adminx}


@admin_router.get("/households")
def get_households(db: Session = Depends(get_db)):
    # Lấy danh sách hộ gia đình
    households = db.query(Household).all()
    return {"households": households}


@admin_router.get("/employees")
def get_employees(db: Session = Depends(get_db)):
    # Lấy danh sách nhân viên
    employees = db.query(Employee).all()
    return {"employees": employees}



@admin_router.put("/profile")
def update_profile(updated_data: dict, db: Session = Depends(get_db)):
    # Cập nhật thông tin admin (không cần check role)
    admin = db.query(Account).filter(Account.username == "admin").first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    for key, value in updated_data.items():
        setattr(admin, key, value)
    db.commit()
    return admin

@admin_router.post("/department-heads")
def create_department_head(employee: EmployeeCreate, db: Session = Depends(get_db)):
    # Tạo department head mới (lưu tài khoản vào DB)
    account = Account(username=employee.username, password=employee.password)  
    db.add(account)
    db.commit()
    db.refresh(account)
    new_employee = Employee(
        employee_id=employee.employee_id,
        employee_name=employee.employee_name,
        department_id=employee.department_id,
        account_id=account.account_id,
        position="manager",  # Department heads are managers
        phone=employee.phone,
        address=employee.address,
        begin_date=datetime.now().date(),
        status="active"
    )
    db.add(new_employee)
    db.commit()
    return new_employee

