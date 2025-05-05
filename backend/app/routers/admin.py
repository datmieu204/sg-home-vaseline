from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from app.core.database import get_db
from app.models import Employee, Household, Task, EmployeePosition, TaskStatus, EmployeeStatus, HouseholdStatus, AccountHousehold, AccountEmployee, DepartmentType
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import List, Dict
from enum import Enum
from typing import Optional
import uuid

admin_router = APIRouter(prefix="/admin", tags=["admin"])

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# PROFILE ADMIN

class AdminProfileSchema(BaseModel):
    employee_id: str
    employee_name: str
    position: EmployeePosition
    phone: str
    address: str
    status: EmployeeStatus
    begin_date: date
    username: str

    class Config:
        from_attributes = True

class AdminIDRequest(BaseModel):
    employee_id: str

@admin_router.get("/profile", response_model=AdminProfileSchema)
def get_admin_profile(admin_id_request: AdminIDRequest, db: Session = Depends(get_db)):
    """
    Lấy thông tin profile của admin dựa trên employee_id được cung cấp.
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == admin_id_request.employee_id,
        Employee.position.in_([EmployeePosition.head_manager])
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Admin not found or not authorized")

    account = db.query(AccountEmployee).filter(
        AccountEmployee.employee_id == employee.employee_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found for this admin")

    profile_data = {
        "employee_id": employee.employee_id,
        "employee_name": employee.employee_name,
        "position": employee.position,
        "phone": employee.phone,
        "address": employee.address,
        "status": employee.status,
        "begin_date": employee.begin_date,
        "username": account.username
    }

    return profile_data

# -----------------------------------------------------------------------------
# Update profile admin

class AdminProfileUpdateSchema(BaseModel):
    employee_name: str
    username: str
    password: str
    phone: str
    address: str
    status: EmployeeStatus

@admin_router.put("/profile", response_model=AdminProfileSchema)
def update_admin_profile(
    updated_data: AdminProfileUpdateSchema,
    admin_id_request: AdminIDRequest,
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin profile của admin dựa trên employee_id=admin được cung cấp khi đăng nhập.
    """
    # Tìm employee
    employee = db.query(Employee).filter(
        Employee.employee_id == admin_id_request.employee_id,
        Employee.position == EmployeePosition.head_manager
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Admin not found or not authorized")

    # Tìm account
    account = db.query(AccountEmployee).filter(
        AccountEmployee.employee_id == employee.employee_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found for this admin")

    employee.employee_name = updated_data.employee_name
    employee.phone = updated_data.phone
    employee.address = updated_data.address
    employee.status = updated_data.status
    employee.begin_date = date.today()  

    account.username = updated_data.username
    account.password = updated_data.password  

    db.commit()
    db.refresh(employee)
    db.refresh(account)

    return {
        "employee_id": employee.employee_id,
        "employee_name": employee.employee_name,
        "position": employee.position,
        "phone": employee.phone,
        "address": employee.address,
        "status": employee.status,
        "begin_date": employee.begin_date,
        "username": account.username
    }


# -------------------------------------------------------------------------------
# -------------------------------------------------------------------------------\
# TASKS

@admin_router.get("/tasks/managers")
def get_manager_tasks(db: Session = Depends(get_db)):
    """
    Lấy danh sách công việc mà assigner là head_manager và assignee là manager
    """
    # Alias EmployeeAssigner và EmployeeAssignee để phân biệt giữa assigner và assignee
    EmployeeAssigner = aliased(Employee, name="employees_assigner")
    EmployeeAssignee = aliased(Employee, name="employees_assignee")

    tasks = db.query(Task)\
        .join(EmployeeAssigner, Task.assigner_id == EmployeeAssigner.employee_id)\
        .filter(EmployeeAssigner.position == EmployeePosition.head_manager)\
        .join(EmployeeAssignee, Task.assignee_id == EmployeeAssignee.employee_id)\
        .filter(EmployeeAssignee.position == EmployeePosition.manager)\
        .all()

    task_list = [{"name_task": task.name_task, "deadline": task.deadline, "status": task.status.value, "assignee_id": task.assignee_id} for task in tasks]

    return {"tasks": task_list}
    

@admin_router.get("/tasks/staffs")
def get_staff_tasks(db: Session = Depends(get_db)):
    """
    Lấy danh sách công việc mà assigner là manager và assignee là staff
    """
    # Alias EmployeeAssigner và EmployeeAssignee để phân biệt giữa assigner và assignee
    EmployeeAssigner = aliased(Employee, name="employees_assigner")
    EmployeeAssignee = aliased(Employee, name="employees_assignee")

    tasks = db.query(Task)\
        .join(EmployeeAssigner, Task.assigner_id == EmployeeAssigner.employee_id)\
        .filter(EmployeeAssigner.position == EmployeePosition.manager)\
        .join(EmployeeAssignee, Task.assignee_id == EmployeeAssignee.employee_id)\
        .filter(EmployeeAssignee.position == EmployeePosition.staff)\
        .all()
    
    task_list = [{"name_task": task.name_task, "deadline": task.deadline, "status": task.status.value, "assignee_id": task.assignee_id} for task in tasks]

    return {"tasks": task_list}
    
# -------------------------------------------------------------------------------

class TaskSchema(BaseModel):
    task_id: str
    name_task: str
    deadline: datetime
    assigner_id: str
    assignee_id: str
    assigned_time: datetime
    status: TaskStatus
    description: str

    class Config:
        from_attributes = True


@admin_router.get("/tasks/managers/{task_id}", response_model=TaskSchema)
def get_manager_task_by_id(task_id: str, db: Session = Depends(get_db)):
    """
    Lấy thông tin công việc theo ID mà assigner là head_manager và assignee là manager
    """
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


@admin_router.get("/tasks/staffs/{task_id}", response_model=TaskSchema)
def get_staff_task_by_id(task_id: str, db: Session = Depends(get_db)):
    """
    Lấy thông tin công việc theo ID mà assigner là manager và assignee là staff
    """
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
    
# --------------------------------------------------------------------------

def get_tasks_by_head_manager_department(db: Session, department: DepartmentType):
    EmployeeAssigner = aliased(Employee, name="employees_assigner")
    EmployeeAssignee = aliased(Employee, name="employees_assignee")

    tasks = (
        db.query(Task)
        .join(EmployeeAssigner, Task.assigner_id == EmployeeAssigner.employee_id)
        .filter(EmployeeAssigner.position == EmployeePosition.head_manager)
        .join(EmployeeAssignee, Task.assignee_id == EmployeeAssignee.employee_id)
        .filter(EmployeeAssignee.department_id == department.value)
        .all()
    )

    task_list = [
        {
            "task_id": task.task_id,
            "name_task": task.name_task,
            "deadline": task.deadline,
            "status": task.status.value,
            "assigned_time": task.assigned_time,
            "description": task.description
        }
        for task in tasks
    ]

    return task_list

@admin_router.get("/tasks/{department}/managers")
def get_tasks_manager_by_department(department: DepartmentType, db: Session = Depends(get_db)):
    """
    Lấy danh sách công việc mà assigner là head_manager và assignee là manager và department_id của manager là department
    """

    task_list = get_tasks_by_head_manager_department(db, department)
    return {"tasks": task_list}


def get_tasks_by_manager_department(db: Session, department: DepartmentType):
    EmployeeAssigner = aliased(Employee, name="employees_assigner")
    EmployeeAssignee = aliased(Employee, name="employees_assignee")

    tasks = (
        db.query(Task)
        .join(EmployeeAssigner, Task.assigner_id == EmployeeAssigner.employee_id)
        .filter(EmployeeAssigner.position == EmployeePosition.manager)
        .join(EmployeeAssignee, Task.assignee_id == EmployeeAssignee.employee_id)
        .filter(EmployeeAssignee.department_id == department.value)
        .all()
    )

    task_list = [
        {
            "task_id": task.task_id,
            "name_task": task.name_task,
            "deadline": task.deadline,
            "status": task.status.value,
            "assigned_time": task.assigned_time,
            "description": task.description
        }
        for task in tasks
    ]

    return task_list

@admin_router.get("/tasks/{department}/staffs")
def get_tasks_staff_by_department(department: DepartmentType, db: Session = Depends(get_db)):
    """
    Lấy danh sách công việc mà assigner là manager và assignee là staff và department_id của staff là department
    """
    task_list = get_tasks_by_manager_department(db, department)
    return {"tasks": task_list}

# --------------------------------------------------------------------------

class TaskCreateSchema(BaseModel):
    name_task: str
    assignee_id: str
    assigned_time: datetime
    description: str
    deadline: datetime 

@admin_router.post("/tasks/managers", response_model=TaskSchema)
def create_manager_task(
    task_data: TaskCreateSchema,
    admin_id_request: AdminIDRequest,
    db: Session = Depends(get_db)
):
    """
    Thêm Task cho manager bởi Admin
    """
    assigner_id = admin_id_request.employee_id

    # Validate assigner_id là head_manager
    assigner = db.query(Employee).filter(
        Employee.employee_id == assigner_id,
        Employee.position == EmployeePosition.head_manager
    ).first()

    if not assigner:
        raise HTTPException(status_code=400, detail="Assigner must be a head_manager")

    # Validate assignee_id là manager
    assignee = db.query(Employee).filter(
        Employee.employee_id == task_data.assignee_id,
        Employee.position == EmployeePosition.manager
    ).first()

    if not assignee:
        raise HTTPException(status_code=400, detail="Assignee must be a manager")

    # Tự động tạo task_id
    new_task_id = f'TASK_MANAGER_' + str(db.query(Task).count() + 1)

    new_task = Task(
        task_id=new_task_id,
        name_task=task_data.name_task,
        assigner_id=assigner_id,  # lấy từ admin_id_request
        assignee_id=task_data.assignee_id,
        assigned_time=task_data.assigned_time,
        description=task_data.description,
        deadline=task_data.deadline,
        status=TaskStatus.in_progress
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# TÀI KHOẢN VÀ PROFILE MANAGER


@admin_router.get("/accounts/managers")
def get_manager_accounts(db: Session = Depends(get_db)):
    """
    Lấy danh sách tài khoản của nhân viên có position là manager và status là active, kèm thông tin profile cá nhân.
    """
    results = db.query(AccountEmployee, Employee)\
        .join(Employee, AccountEmployee.employee_id == Employee.employee_id)\
        .filter(
            Employee.position == EmployeePosition.manager,
            Employee.status == EmployeeStatus.active
        ).all()
    
    account_list = []
    for account, employee in results:
        account_info = {
            "account_id": account.account_id,
            "employee_id": employee.employee_id,
            "employee_name": employee.employee_name,
            "department_id": employee.department_id,
            "position": employee.position.value,  # convert enum to string
        
        }
        account_list.append(account_info)

    return {"accounts": account_list}



@admin_router.get("/accounts/managers/{account_id}")
def get_manager_account_by_id(account_id: str, db: Session = Depends(get_db)):
    """
    Xem thông tin tài khoản của nhân viên theo ID mà position là manager và status là active, kèm thông tin profile cá nhân.
    """
    result = db.query(AccountEmployee, Employee)\
        .join(Employee, AccountEmployee.employee_id == Employee.employee_id)\
        .filter(
            AccountEmployee.account_id == account_id,
            Employee.position == EmployeePosition.manager,
            Employee.status == EmployeeStatus.active
        ).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Account not found or not a manager")
    
    account, employee = result
    account_info = {
        "account_id": account.account_id,
        "username": account.username,
        "employee_id": employee.employee_id,
        "employee_name": employee.employee_name,
        "department_id": employee.department_id,
        "position": employee.position.value,
        "phone": employee.phone,
        "address": employee.address,
        "begin_date": employee.begin_date,
        "status": employee.status.value  
    }

    return {"account": account_info}

# --------------------------------------------------------------

class ManagerCreate(BaseModel):
    employee_name: str
    department_id: DepartmentType
    username: str
    password: str
    phone: str
    address: str

@admin_router.post("/accounts/managers")
def create_manager_account(manager: ManagerCreate, db: Session = Depends(get_db)):
    """
    Tạo tài khoản cho nhân viên có position là manager và status là active
    """
    existing_account = db.query(AccountEmployee).filter(AccountEmployee.username == manager.username).first()
    if existing_account:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_account_id = f'ACC_MANAGER' + str(db.query(AccountEmployee).count() + 1)
    new_employee_id = f'EMP' + str(db.query(Employee).count() + 1)

    new_account = AccountEmployee(
        account_id=new_account_id,
        employee_id=new_employee_id,
        username=manager.username,
        password=manager.password, 
    )
    db.add(new_account)

    new_employee = Employee(
        employee_id=new_employee_id,
        employee_name=manager.employee_name,
        department_id=manager.department_id.value,
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

# ------------------------------------------------------------------------
# ------------------------------------------------------------------------
# TÀI KHOẢN VÀ PROFILE STAFF

@admin_router.get("/accounts/staffs")
def get_staff_accounts(db: Session = Depends(get_db)):
    """
    Lấy danh sách tài khoản của nhân viên có position là staff và status là active, kèm thông tin profile cá nhân.
    """
    results = db.query(AccountEmployee, Employee)\
        .join(Employee, AccountEmployee.employee_id == Employee.employee_id)\
        .filter(
            Employee.position == EmployeePosition.staff,
            Employee.status == EmployeeStatus.active
        ).all()
    
    account_list = []
    for account, employee in results:
        account_info = {
            "account_id": account.account_id,
            "employee_id": employee.employee_id,
            "employee_name": employee.employee_name,
            "department_id": employee.department_id,
            "position": employee.position.value,  # convert enum to string
        
        }
        account_list.append(account_info)

    return {"accounts": account_list}   



@admin_router.get("/accounts/staffs/{account_id}")
def get_staff_account_by_id(account_id: str, db: Session = Depends(get_db)):
    """
    Xem thông tin tài khoản của nhân viên theo ID mà position là staff và status là active, kèm thông tin profile cá nhân.
    """
    result = db.query(AccountEmployee, Employee)\
        .join(Employee, AccountEmployee.employee_id == Employee.employee_id)\
        .filter(
            AccountEmployee.account_id == account_id,
            Employee.position == EmployeePosition.staff,
            Employee.status == EmployeeStatus.active
        ).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Account not found or not a staff")
    
    account, employee = result
    account_info = {
        "account_id": account.account_id,
        "username": account.username,
        "employee_id": employee.employee_id,
        "employee_name": employee.employee_name,
        "department_id": employee.department_id,
        "position": employee.position.value,
        "phone": employee.phone,
        "address": employee.address,
        "begin_date": employee.begin_date,
        "status": employee.status.value  
    }

    return {"account": account_info}


# ------------------------------------------------------------------------
# ------------------------------------------------------------------------
# TÀI KHOẢN VÀ PROFILE HOUSEHOLD

@admin_router.get("/accounts/households")
def get_household_accounts(db: Session = Depends(get_db)):
    """
    Lấy danh sách tài khoản của hộ gia đình có status là active, kèm thông tin profile cá nhân.
    """
    results = db.query(AccountHousehold, Household)\
        .join(Household, AccountHousehold.household_id == Household.household_id)\
        .filter(
            Household.status == HouseholdStatus.active
        ).all()
    
    account_list = []
    for account, household in results:
        account_info = {
            "account_id": account.account_id,
            "household_id": household.household_id,
            "name": household.name,
            "room_number": household.room_number,        
        }
        account_list.append(account_info)

    return {"accounts": account_list}


@admin_router.get("/accounts/households/{account_id}")
def get_household_account_by_id(account_id: str, db: Session = Depends(get_db)):
    """
    Xem thông tin tài khoản của hộ gia đình theo ID mà status là active, kèm thông tin profile cá nhân.
    """
    result = db.query(AccountHousehold, Household)\
        .join(Household, AccountHousehold.household_id == Household.household_id)\
        .filter(
            AccountHousehold.account_id == account_id,
            Household.status == HouseholdStatus.active
        ).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Account not found or not a household")
    
    account, household = result
    account_info = {
        "account_id": account.account_id,
        "username": account.username,
        "household_id": household.household_id,
        "name": household.name,
        "number_of_members": household.number_of_members,
        "room_number": household.room_number,
        "status": household.status.value  
    }

    return {"account": account_info}


# ----------------------------------------------------------------------
# ----------------------------------------------------------------------
# DISABLE ACCOUNT MANAGER AND STAFF

@admin_router.put("/accounts/managers/{account_id}/disable")
def disable_manager_account(account_id: str, db: Session = Depends(get_db)):
    """
    Disable tài khoản của nhân viên có position là manager và status là active.
    """
    account = db.query(AccountEmployee).filter(
        AccountEmployee.account_id == account_id
    ).first()
    
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    employee = db.query(Employee).filter(
        Employee.employee_id == account.employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found or not an active manager")
    
    employee.status = EmployeeStatus.inactive
    
    db.commit()
    db.refresh(employee)
    
    return {
        "account_id": account.account_id,
        "employee_id": employee.employee_id,
        "employee_status": employee.status.value
    }



@admin_router.put("/accounts/staffs/{account_id}/disable")
def disable_staff_account(account_id: str, db: Session = Depends(get_db)):
    """
    Disable tài khoản của nhân viên có position là staff và status là active.
    """
    account = db.query(AccountEmployee).filter(
        AccountEmployee.account_id == account_id
    ).first()
    
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    employee = db.query(Employee).filter(
        Employee.employee_id == account.employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.status == EmployeeStatus.active
    ).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found or not an active staff")
    
    employee.status = EmployeeStatus.inactive
    
    db.commit()
    db.refresh(employee)
    
    return {
        "account_id": account.account_id,
        "employee_id": employee.employee_id,
        "employee_status": employee.status.value
    }

# ----------------------------------------------------------------------
# DISABLE ACCOUNT HOUSEHOLD

@admin_router.put("/accounts/households/{account_id}/disable")
def disable_household_account(account_id: str, db: Session = Depends(get_db)):
    """
    Disable tài khoản của hộ gia đình có status là active.
    """
    account = db.query(AccountHousehold).filter(
        AccountHousehold.account_id == account_id
    ).first()
    
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    household = db.query(Household).filter(
        Household.household_id == account.household_id,
        Household.status == HouseholdStatus.active
    ).first()
    
    if not household:
        raise HTTPException(status_code=404, detail="Household not found or not an active household")
    
    household.status = HouseholdStatus.inactive
    
    db.commit()
    db.refresh(household)
    
    return {
        "account_id": account.account_id,
        "household_id": household.household_id,
        "household_status": household.status.value
    }

# ----------------------------------------------------------------------
# ----------------------------------------------------------------------
# DASHBOARD

@admin_router.get("/dashboard/services")
def get_service_count(db: Session = Depends(get_db)):
    pass