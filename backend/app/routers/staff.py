from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from app.core.database import get_db
from app.models import Employee, Household, Task, EmployeePosition, TaskStatus, EmployeeStatus, HouseholdStatus, AccountHousehold, AccountEmployee, DepartmentType, Incident, IncidentStatus
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import List, Dict
from enum import Enum
from typing import Optional

staff_router = APIRouter(prefix="/staff", tags=["staff"])

# --------------------------------------------------------------------------
# View staff profile

class StaffIDRequest(BaseModel):
    employee_id: str

class StaffProfile(BaseModel):
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


@staff_router.get("/profile", response_model=StaffProfile)
def get_staff_profile(employee_id: str, db: Session = Depends(get_db)):
    """
    Lấy thông tin profile của staff dựa trên employee_id (staff ID).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Staff not found or not active")
    
    account = db.query(AccountEmployee).filter(
        AccountEmployee.employee_id == employee.employee_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found for this staff")

    return StaffProfile(
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
# Update staff profile

class StaffProfileUpdate(BaseModel):
    employee_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    status: Optional[EmployeeStatus] = None
    username: Optional[str] = None
    password: Optional[str] = None

    class Config:
        from_attributes = True  


@staff_router.put("/profile", response_model=StaffProfile)
def update_staff_profile(employee_id: str, staff_profile: StaffProfileUpdate, db: Session = Depends(get_db)):
    """
    Cập nhật thông tin profile của staff dựa trên employee_id (staff ID).
    """

    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Staff not found or not active")

    account = db.query(AccountEmployee).filter(
        AccountEmployee.employee_id == employee.employee_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found for this staff")

    if staff_profile.employee_name is not None:
        employee.employee_name = staff_profile.employee_name
    if staff_profile.phone is not None:
        employee.phone = staff_profile.phone
    if staff_profile.address is not None:
        employee.address = staff_profile.address
    if staff_profile.status is not None:
        employee.status = staff_profile.status

    if staff_profile.username is not None:
        account.username = staff_profile.username
    if staff_profile.password is not None:
        account.password = staff_profile.password


    db.commit()
    db.refresh(employee)
    db.refresh(account)


    return StaffProfile(
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
# View staff tasks


class TaskStatusEnum(str, Enum):
    in_progress = "in_progress"
    completed = "completed"

class TaskResponse(BaseModel):
    task_id: str
    name_task: str
    assigner_id: str
    assignee_id: str
    assigned_time: datetime
    description: str
    deadline: Optional[datetime] = None
    status: TaskStatusEnum

    class Config:
        from_attributes = True  


@staff_router.get("/tasks", response_model=List[TaskResponse])
def get_staff_tasks(employee_id: str, db: Session = Depends(get_db)):
    """
    Lấy danh sách các task của staff dựa trên employee_id (staff ID).
    """
    tasks = db.query(Task).filter(
        Task.assignee_id == employee_id,
        Task.status == TaskStatus.in_progress
    ).all()

    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found for this staff")

    return [TaskResponse.from_orm(task) for task in tasks]

# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
# View task details of a staff

class TaskDetailResponse(BaseModel):
    task_id: str
    name_task: str
    assigner_id: str
    assignee_id: str
    assigned_time: datetime
    description: str
    deadline: Optional[datetime] = None
    status: TaskStatusEnum

    class Config:
        from_attributes = True


@staff_router.get("/tasks/{task_id}", response_model=TaskDetailResponse)
def get_task_detail(employee_id: str, task_id: str, db: Session = Depends(get_db)):
    """
    Lấy thông tin chi tiết của task dựa trên task_id.
    """
    task = db.query(Task).filter(
        Task.task_id == task_id,
        Task.assignee_id == employee_id,
        Task.status == TaskStatus.in_progress
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not assigned to this staff")

    return TaskDetailResponse.from_orm(task)

# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
class IncidentResponse(BaseModel):
    incident_id: str
    incident_name: str
    responsible_id: str
    report_time: datetime
    description: Optional[str]
    status: IncidentStatus

    class Config:
        from_attributes = True

@staff_router.get("/incidents/reported", response_model=List[IncidentResponse])
def get_reported_incidents(employee_id: str, db: Session = Depends(get_db)):
    """
    Lấy danh sách sự cố được báo cáo bởi nhân viên (position = staff) dựa trên employee_id.
    """
    # Xác thực employee có tồn tại và là staff
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Staff not found or not valid position")

    # Lấy danh sách incident đã report bởi staff này
    incidents = db.query(Incident).filter(
        Incident.reporter_id == employee_id
    ).order_by(Incident.report_time.desc()).all()

    return [IncidentResponse.from_orm(incident) for incident in incidents]

# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
# Add incident of a staff

class IncidentCreateRequest(BaseModel):
    incident_name: str
    description: Optional[str]

@staff_router.post("/incidents", response_model=IncidentResponse)
def create_incident_report(
    employee_id: str,
    incident_data: IncidentCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Tạo một sự cố mới được báo cáo bởi nhân viên (position = staff).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Staff not found or invalid position")

    manager = db.query(Employee).filter(
        Employee.department_id == employee.department_id,
        Employee.position == EmployeePosition.manager
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="No manager found in the same department")

    new_incident_id = f'INC' + str(db.query(Incident).count() + 1)

    new_incident = Incident(
        incident_id=new_incident_id,
        incident_name=incident_data.incident_name,
        responsible_id=manager.employee_id,
        reporter_id=employee.employee_id,
        report_time=datetime.now(),
        description=incident_data.description,
        status=IncidentStatus.in_progress
    )

    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)

    return IncidentResponse.from_orm(new_incident)
