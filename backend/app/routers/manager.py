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

manager_router = APIRouter(prefix="/manager", tags=["manager"])

# ---------------------------------------------------------------------
# Manager Profile

class ManagerIDRequest(BaseModel):
    employee_id: str

class ManagerProfile(BaseModel):
    employee_id: str
    employee_name: str
    position: EmployeePosition
    phone: str
    address: str
    status: EmployeeStatus
    begin_date: date
    username: str
    department_id: DepartmentType

    class Config:
        from_attributes = True


@manager_router.get("/profile", response_model=ManagerProfile)
def get_manager_profile(employee_id: str, db: Session = Depends(get_db)):
    """
    Lấy thông tin profile của manager dựa trên employee_id (manager ID).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Manager not found or not active")
    
    account = db.query(AccountEmployee).filter(
        AccountEmployee.employee_id == employee.employee_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found for this manager")

    return ManagerProfile(
        employee_id=employee.employee_id,
        employee_name=employee.employee_name,
        position=employee.position,
        phone=employee.phone,
        address=employee.address,
        status=employee.status,
        begin_date=employee.begin_date,
        username=account.username,
        department_id=employee.department_id,
    )

# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
# Update Manager Profile

class UpdateManagerProfile(BaseModel):
    employee_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    status: Optional[EmployeeStatus] = None
    begin_date: Optional[date] = None
    username: Optional[str] = None
    password: Optional[str] = None

    class Config:
        from_attributes = True


@manager_router.put("/profile", response_model=ManagerProfile)
def update_manager_profile(
    employee_id: str,
    profile_data: UpdateManagerProfile,
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin profile của manager.
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Manager not found or not active")

    account = db.query(AccountEmployee).filter(
        AccountEmployee.employee_id == employee.employee_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found for this manager")

    # Cập nhật thông tin cá nhân
    if profile_data.employee_name:
        employee.employee_name = profile_data.employee_name
    if profile_data.phone:
        employee.phone = profile_data.phone
    if profile_data.address:
        employee.address = profile_data.address
    if profile_data.status:
        employee.status = profile_data.status
    if profile_data.begin_date:
        employee.begin_date = profile_data.begin_date

    # Cập nhật thông tin tài khoản
    if profile_data.username:
        account.username = profile_data.username
    if profile_data.password:
        account.password = profile_data.password    

    
    db.commit()
    db.refresh(employee)
    db.refresh(account)

    return ManagerProfile(
        employee_id=employee.employee_id,
        employee_name=employee.employee_name,
        position=employee.position,
        phone=employee.phone,
        address=employee.address,
        status=employee.status,  
        begin_date=employee.begin_date,
        username=account.username,
        department_id=DepartmentType(employee.department_id),
    )

# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
# View Task List for Manager

class TaskListResponse(BaseModel):
    task_id: str
    task_name: str
    assigner_id: str
    assignee_id: str
    status: TaskStatus
    assigned_time: datetime
    deadline: Optional[datetime] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


@manager_router.get("/tasks", response_model=List[TaskListResponse])
def get_tasks(
    employee_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách nhiệm của manager.
    """
    # Kiểm tra employee có phải manager và còn active không
    manager = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found or not active")

    # Lấy danh sách task mà manager là người được giao
    tasks = db.query(Task).filter(
        Task.assignee_id == employee_id
    ).all()

    return [
        TaskListResponse(
            task_id=task.task_id,
            task_name=task.name_task,
            assigner_id=task.assigner_id,
            assignee_id=task.assignee_id,
            status=task.status,
            assigned_time=task.assigned_time,
            deadline=task.deadline,
            description=task.description
        )
        for task in tasks
    ]

# --------------------------------------------------------------------------
# View Task Detail for Manager

class TaskDetailResponse(BaseModel):
    task_id: str
    task_name: str
    assigner_id: str
    assigner_name: str
    assignee_id: str
    assignee_name: str
    status: TaskStatus
    assigned_time: datetime
    deadline: Optional[datetime] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

@manager_router.get("/tasks/{task_id}", response_model=TaskDetailResponse)
def get_task_detail(
    task_id: str,
    employee_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy chi tiết nhiệm vụ của manager dựa trên task_id và employee_id.
    """
    manager = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found or not active")

    task = db.query(Task).filter(
        Task.task_id == task_id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.assigner_id != employee_id and task.assignee_id != employee_id:
        raise HTTPException(status_code=403, detail="Manager does not have permission to view this task")

    assigner = db.query(Employee).filter(
        Employee.employee_id == task.assigner_id
    ).first()

    assignee = db.query(Employee).filter(
        Employee.employee_id == task.assignee_id
    ).first()

    if not assigner or not assignee:
        raise HTTPException(status_code=404, detail="Assigner or assignee not found")

    return TaskDetailResponse(
        task_id=task.task_id,
        task_name=task.name_task,
        assigner_id=task.assigner_id,
        assigner_name=assigner.employee_name,
        assignee_id=task.assignee_id,
        assignee_name=assignee.employee_name,
        status=task.status,
        assigned_time=task.assigned_time,
        deadline=task.deadline,
        description=task.description
    )


# --------------------------------------------------------------------------
# View Task Staff List from Manager

@manager_router.get("/tasks_staffs", response_model=List[TaskListResponse])
def get_tasks_staffs(
    employee_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách nhiệm vụ do manager phân công.
    """
    # Kiểm tra employee có phải manager và còn active không
    manager = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found or not active")

    # Lấy danh sách task mà manager là người phân công
    tasks = db.query(Task).filter(
        Task.assigner_id == employee_id
    ).all()

    return [
        TaskListResponse(
            task_id=task.task_id,
            task_name=task.name_task,
            assigner_id=task.assigner_id,
            assignee_id=task.assignee_id,
            status=task.status,
            assigned_time=task.assigned_time,
            deadline=task.deadline,
            description=task.description
        )
        for task in tasks
    ]

# --------------------------------------------------------------------------
# View Task Staff Detail from Manager
@manager_router.get("/tasks_staffs/{task_id}", response_model=TaskDetailResponse)
def get_task_staff_detail(
    task_id: str,
    employee_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy chi tiết nhiệm vụ do manager phân công dựa trên task_id và employee_id.
    """
    manager = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found or not active")

    task = db.query(Task).filter(
        Task.task_id == task_id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.assigner_id != employee_id:
        raise HTTPException(status_code=403, detail="Manager does not have permission to view this task")

    assigner = db.query(Employee).filter(
        Employee.employee_id == task.assigner_id
    ).first()

    assignee = db.query(Employee).filter(
        Employee.employee_id == task.assignee_id
    ).first()

    if not assigner or not assignee:
        raise HTTPException(status_code=404, detail="Assigner or assignee not found")
    return TaskDetailResponse(
        task_id=task.task_id,
        task_name=task.name_task,
        assigner_id=task.assigner_id,
        assigner_name=assigner.employee_name,
        assignee_id=task.assignee_id,
        assignee_name=assignee.employee_name,
        status=task.status,
        assigned_time=task.assigned_time,
        deadline=task.deadline,
        description=task.description
    )