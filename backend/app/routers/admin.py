from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from app.core.database import get_db
from app.models import Employee, Household, Account, Task, EmployeePosition, TaskStatus, EmployeeStatus, AccountStatus, HouseholdStatus
from pydantic import BaseModel
from datetime import datetime, date
from enum import Enum
from typing import Optional

admin_router = APIRouter(prefix="/admin", tags=["admin"])


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
   

class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class TaskSchema(BaseModel):
    task_id: str
    name_task: str
    assigner_id: str
    assignee_id: str
    assigned_time: datetime
    description: str
    deadline: Optional[datetime] = None
    status: TaskStatus

    class Config:
        from_attributes = True


# class EmployeeUpdateSchema(BaseModel):
#     employee_name: Optional[str] = None
#     department_id: Optional[str] = None
#     phone: Optional[str] = None
#     address: Optional[str] = None
#     status: Optional[EmployeeStatus] = None

#     class Config:
#         from_attributes = True


class DisableResponseSchema(BaseModel):
    employee_id: str
    employee_status: str
    account_id: str
    account_status: str

    class Config:
        from_attributes = True



class AdminProfileUpdate(BaseModel):
    password: Optional[str] = None
    employee_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    begin_date: Optional[date] = None


class ManagerCreate(BaseModel):
    employee_id: str
    employee_name: str
    department_id: str
    username: str
    password: str
    phone: str
    address: str


# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------

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

# -------------------------------------------------------------

@admin_router.get("/households")
def get_households(db: Session = Depends(get_db)):
    # Lấy danh sách hộ gia đình
    households = db.query(Household).all()
    return {"households": households}


@admin_router.get("/households/{household_id}")
def get_household_by_id(household_id: str, db: Session = Depends(get_db)):
    # Lấy thông tin hộ gia đình theo ID
    household = db.query(Household).filter(Household.household_id == household_id).first()
    
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")
    
    return {"household": household}


@admin_router.put("/households/{household_id}")
def disable_household(household_id: str, db: Session = Depends(get_db)):
    # Kiểm tra hộ gia đình có status là active => disable household and account household
    household = db.query(Household).filter(Household.household_id == household_id, Household.status == HouseholdStatus.active).first()
    
    if not household:
        raise HTTPException(status_code=404, detail="Household not found or already inactive")
    
    account = db.query(Account).filter(Account.account_id == household.account_id, Account.status == AccountStatus.active).first()
    
    if not account:
        raise HTTPException(status_code=404, detail="Active account not found for this household")
    
    household.status = HouseholdStatus.inactive
    account.status = AccountStatus.inactive
    
    db.commit()
    db.refresh(household)
    db.refresh(account)
    
    return {
        "household_id": household.household_id,
        "household_status": household.status.value,
        "account_id": account.account_id,
        "account_status": account.status.value
    }

# -------------------------------------------------------------

@admin_router.get("/tasks/managers")
def get_tasks(db: Session = Depends(get_db)):
    # Lấy danh sách công việc mà assigner là head_manager và assignee là manager
    EmployeeAssigner = aliased(Employee, name="employees_assigner")
    EmployeeAssignee = aliased(Employee, name="employees_assignee")
    
    tasks = db.query(Task)\
        .join(EmployeeAssigner, Task.assigner_id == EmployeeAssigner.employee_id)\
        .filter(EmployeeAssigner.position == EmployeePosition.head_manager)\
        .join(EmployeeAssignee, Task.assignee_id == EmployeeAssignee.employee_id)\
        .filter(EmployeeAssignee.position == EmployeePosition.manager)\
        .all()
    
    task_list = [{"name_task": task.name_task, "deadline": task.deadline, "status": task.status.value} for task in tasks]
    
    return {"tasks": task_list}



@admin_router.get("/tasks/managers/receptions")
def get_reception_tasks(db: Session = Depends(get_db)):
    # Lấy danh sách công việc mà assigner là head_manager và assignee là reception
    EmployeeAssigner = aliased(Employee, name="employees_assigner")
    EmployeeAssignee = aliased(Employee, name="employees_assignee")


    tasks = db.query(Task)\
        .join(EmployeeAssigner, Task.assigner_id == EmployeeAssigner.employee_id)\
        .filter(EmployeeAssigner.position == EmployeePosition.head_manager)\
        .join(EmployeeAssignee, Task.assignee_id == EmployeeAssignee.employee_id)\
        .filter(EmployeeAssignee.position == EmployeePosition.reception)\
        .all()

    task_list = [{"name_task": task.name_task, "deadline": task.deadline, "status": task.status.value} for task in tasks]
    
    return {"tasks": task_list}


@admin_router.get("/manager_tasks/{task_id}", response_model=TaskSchema)
def get_task_by_id(task_id: str, db: Session = Depends(get_db)):
    # Lấy thông tin công việc theo ID mà assigner là head_manager và assignee là manager
    EmployeeAssigner = aliased(Employee, name="employees_assigner")
    EmployeeAssignee = aliased(Employee, name="employees_assignee")
    
    task = db.query(Task)\
        .join(EmployeeAssigner, Task.assigner_id == EmployeeAssigner.employee_id)\
        .filter(EmployeeAssigner.position == EmployeePosition.head_manager)\
        .join(EmployeeAssignee, Task.assignee_id == EmployeeAssignee.employee_id)\
        .filter(EmployeeAssignee.position == EmployeePosition.manager)\
        .filter(Task.task_id == task_id)\
        .first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not assigned by head_manager to a manager")
    
    return task


@admin_router.get("/staff_tasks")
def get_tasks(db: Session = Depends(get_db)):
    # Lấy danh sách công việc mà assigner là manager và assignee là staff
    EmployeeAssigner = aliased(Employee, name="employees_assigner")
    EmployeeAssignee = aliased(Employee, name="employees_assignee")
    
    tasks = db.query(Task)\
        .join(EmployeeAssigner, Task.assigner_id == EmployeeAssigner.employee_id)\
        .filter(EmployeeAssigner.position == EmployeePosition.manager)\
        .join(EmployeeAssignee, Task.assignee_id == EmployeeAssignee.employee_id)\
        .filter(EmployeeAssignee.position == EmployeePosition.staff)\
        .all()
    
    task_list = [{"name_task": task.name_task, "deadline": task.deadline, "status": task.status.value} for task in tasks]
    
    return {"tasks": task_list}


@admin_router.get("/staff_tasks/{task_id}", response_model=TaskSchema)
def get_task_by_id(task_id: str, db: Session = Depends(get_db)):
    # Lấy thông tin công việc theo ID mà assigner là manager và assignee là staff
    EmployeeAssigner = aliased(Employee, name="employees_assigner")
    EmployeeAssignee = aliased(Employee, name="employees_assignee")
    
    task = db.query(Task)\
        .join(EmployeeAssigner, Task.assigner_id == EmployeeAssigner.employee_id)\
        .filter(EmployeeAssigner.position == EmployeePosition.manager)\
        .join(EmployeeAssignee, Task.assignee_id == EmployeeAssignee.employee_id)\
        .filter(EmployeeAssignee.position == EmployeePosition.staff)\
        .filter(Task.task_id == task_id)\
        .first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not assigned by manager to a staff")
    
    return task

# -------------------------------------------------------------

@admin_router.get("/managers")
def get_managers(db: Session = Depends(get_db)):
    # Lấy danh sách nhân viên có position là manager và status là active
    employees = db.query(Employee)\
        .filter(Employee.position == EmployeePosition.manager, Employee.status == EmployeeStatus.active)\
        .all()
    
    employee_list = [{"employee_id": emp.employee_id, "employee_name": emp.employee_name, "department_id": emp.department_id} for emp in employees]
    
    return {"employees": employee_list}


@admin_router.get("/managers/{employee_id}")
def get_manager_by_id(employee_id: str, db: Session = Depends(get_db)):
    # Lấy thông tin nhân viên theo ID mà position là manager và status là active
    employee = db.query(Employee)\
        .filter(Employee.employee_id == employee_id, Employee.position == EmployeePosition.manager, Employee.status == EmployeeStatus.active)\
        .first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found or not a manager")
    
    return {"employee": employee}


@admin_router.get("/staffs")
def get_staffs(db: Session = Depends(get_db)):
    # Lấy danh sách nhân viên có position là staff và status là active
    employees = db.query(Employee)\
        .filter(Employee.position == EmployeePosition.staff, Employee.status == EmployeeStatus.active)\
        .all()
    
    employee_list = [{"employee_id": emp.employee_id, "employee_name": emp.employee_name, "department_id": emp.department_id} for emp in employees]
    
    return {"employees": employee_list}


@admin_router.get("/staffs/{employee_id}")
def get_staff_by_id(employee_id: str, db: Session = Depends(get_db)):
    # Lấy thông tin nhân viên theo ID mà position là staff và status là active
    employee = db.query(Employee)\
        .filter(Employee.employee_id == employee_id, Employee.position == EmployeePosition.staff, Employee.status == EmployeeStatus.active)\
        .first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found or not a staff")
    
    return {"employee": employee}

# -------------------------------------------------------------

# @admin_router.put("/managers/{employee_id}")
# def update_manager(employee_id: str, updated_data: EmployeeUpdateSchema, db: Session = Depends(get_db)):
#     # Cập nhật thông tin nhân viên mà position là manager và status là active
#     employee = db.query(Employee)\
#         .filter(Employee.employee_id == employee_id, Employee.position == EmployeePosition.manager, Employee.status == EmployeeStatus.active)\
#         .first()
    
#     if not employee:
#         raise HTTPException(status_code=404, detail="Employee not found or not a manager")
    
#     updated_dict = updated_data.dict(exclude_unset=True)
    
#     if not updated_dict:
#         raise HTTPException(status_code=400, detail="No data provided for update")
    
#     for key, value in updated_dict.items():
#         setattr(employee, key, value)
    
#     db.commit()
#     db.refresh(employee)
#     return employee

@admin_router.put("/managers/{employee_id}/disable", response_model=DisableResponseSchema)
def disable_manager(employee_id: str, db: Session = Depends(get_db)):
    # Kiểm tra nhân viên có position là manager và status là active => disable manager and account manager
    employee = db.query(Employee)\
        .filter(Employee.employee_id == employee_id, Employee.position == EmployeePosition.manager, Employee.status == EmployeeStatus.active)\
        .first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found, not a manager, or already inactive")
    
    account = db.query(Account)\
        .filter(Account.account_id == employee.account_id, Account.status == AccountStatus.active)\
        .first()
    
    if not account:
        raise HTTPException(status_code=404, detail="Active account not found for this employee")
    
    employee.status = EmployeeStatus.inactive
    account.status = AccountStatus.inactive
    
    db.commit()
    db.refresh(employee)
    db.refresh(account)
    
    return {
        "employee_id": employee.employee_id,
        "employee_status": employee.status.value,
        "account_id": account.account_id,
        "account_status": account.status.value
    }


@admin_router.put("/staffs/{employee_id}/disable", response_model=DisableResponseSchema)
def disable_staff(employee_id: str, db: Session = Depends(get_db)):
    # Kiểm tra nhân viên có position là staff và status là active => disable staff and account staff
    employee = db.query(Employee)\
        .filter(Employee.employee_id == employee_id, Employee.position == EmployeePosition.staff, Employee.status == EmployeeStatus.active)\
        .first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found, not a staff, or already inactive")
    
    account = db.query(Account)\
        .filter(Account.account_id == employee.account_id, Account.status == AccountStatus.active)\
        .first()
    
    if not account:
        raise HTTPException(status_code=404, detail="Active account not found for this employee")
    
    employee.status = EmployeeStatus.inactive
    account.status = AccountStatus.inactive
    
    db.commit()
    db.refresh(employee)
    db.refresh(account)
    
    return {
        "employee_id": employee.employee_id,
        "employee_status": employee.status.value,
        "account_id": account.account_id,
        "account_status": account.status.value
    }


# --------------------------------------------------------------


@admin_router.put("/profile")
def update_profile(updated_data: AdminProfileUpdate, db: Session = Depends(get_db)):
    # Tìm account admin
    admin_account = db.query(Account).filter(Account.username == "admin").first()
    if not admin_account:
        raise HTTPException(status_code=404, detail="Admin account not found")

    # Tìm employee tương ứng với account admin
    admin_employee = db.query(Employee).filter(Employee.account_id == admin_account.account_id).first()
    if not admin_employee:
        raise HTTPException(status_code=404, detail="Admin employee not found")

    # Cập nhật Account fields
    if updated_data.password is not None:
        admin_account.password = updated_data.password

    # Cập nhật Employee fields
    if updated_data.employee_name is not None:
        admin_employee.employee_name = updated_data.employee_name
    if updated_data.phone is not None:
        admin_employee.phone = updated_data.phone
    if updated_data.address is not None:
        admin_employee.address = updated_data.address
    if updated_data.begin_date is not None:
        admin_employee.begin_date = updated_data.begin_date

    db.commit()
    db.refresh(admin_account)
    db.refresh(admin_employee)

    return {
        "account": {
            "account_id": admin_account.account_id,
            "username": admin_account.username,
        },
        "employee": {
            "employee_id": admin_employee.employee_id,
            "employee_name": admin_employee.employee_name,
            "phone": admin_employee.phone,
            "address": admin_employee.address,
            "begin_date": admin_employee.begin_date,
        }
    }



@admin_router.post("/managers")
def create_manager(manager: ManagerCreate, db: Session = Depends(get_db)):
    # Tạo account và profile cho manager
    existing_account = db.query(Account).filter(Account.username == manager.username).first()
    if existing_account:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_account = Account(
        account_id=manager.employee_id,
        username=manager.username,
        password=manager.password, 
        status=AccountStatus.active
    )
    db.add(new_account)

    new_employee = Employee(
        employee_id=manager.employee_id,
        employee_name=manager.employee_name,
        department_id=manager.department_id,
        account_id=new_account.account_id,
        begin_date=date.today(),
        position=EmployeePosition.manager,
        phone=manager.phone,
        address=manager.address,
        status=EmployeeStatus.active
    )
    db.add(new_employee)

    db.commit()
    db.refresh(new_account)
    db.refresh(new_employee)

    return {
        "account_id": new_account.account_id,
        "username": new_account.username,
        "employee_id": new_employee.employee_id,
        "employee_name": new_employee.employee_name,
        "position": new_employee.position.value
    }

