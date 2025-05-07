from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from app.core.database import get_db
from app.models import Employee, Household, Task, EmployeePosition, TaskStatus, EmployeeStatus, HouseholdStatus, AccountHousehold, AccountEmployee, DepartmentType, Incident, IncidentStatus, Service, ServiceStatus, Invoice, InvoiceDetail, InvoiceStatus, Notification, Payment, PaymentMethod
from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import List, Dict
from enum import Enum
from typing import Optional

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

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Add Task for Staff

class AddTaskRequest(BaseModel):
    task_name: str
    assignee_id: str
    deadline: Optional[datetime] = None
    description: Optional[str] = None


@manager_router.post("/tasks_staffs", response_model=TaskDetailResponse)
def add_task_for_staff(
    employee_id: str,
    task_data: AddTaskRequest,
    db: Session = Depends(get_db)
):
    """
    Manager giao nhiệm vụ cho staff.
    """
    manager = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found or not active")

    staff = db.query(Employee).filter(
        Employee.employee_id == task_data.assignee_id,
        Employee.position == EmployeePosition.staff,
        Employee.status == EmployeeStatus.active
    ).first()

    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found or not active")

    new_task_id = f'TASK_STAFF_' + str(db.query(Task).count() + 1)

    new_task = Task(
        task_id=new_task_id,
        name_task=task_data.task_name,
        assigner_id=employee_id,
        assignee_id=task_data.assignee_id,
        status=TaskStatus.in_progress,
        assigned_time=datetime.utcnow(),
        deadline=task_data.deadline,
        description=task_data.description
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return TaskDetailResponse(
        task_id=new_task.task_id,
        task_name=new_task.name_task,
        assigner_id=new_task.assigner_id,
        assigner_name=manager.employee_name,
        assignee_id=new_task.assignee_id,
        assignee_name=staff.employee_name,
        status=new_task.status,
        assigned_time=new_task.assigned_time,
        deadline=new_task.deadline,
        description=new_task.description
    )

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# View List Accounts of Staffs of Manager

class StaffAccountResponse(BaseModel):
    employee_id: str
    employee_name: str
    phone: str
    address: str
    status: EmployeeStatus
    begin_date: date
    department_id: str
    account_id: str
    position: EmployeePosition
    username: str

    class Config:
        from_attributes = True


@manager_router.get("/accounts/staffs", response_model=List[StaffAccountResponse])
def get_staff_accounts(
    employee_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tài khoản của các nhân viên dưới quyền của manager.
    """
    manager = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found or not active")

    staffs = db.query(Employee).filter(
        Employee.department_id == manager.department_id,
        Employee.position == EmployeePosition.staff,
        Employee.status == EmployeeStatus.active
    ).all()

    staff_accounts = []
    for staff in staffs:
        account = db.query(AccountEmployee).filter(
            AccountEmployee.employee_id == staff.employee_id
        ).first()
        if account:
            staff_accounts.append(StaffAccountResponse(
                employee_id=staff.employee_id,
                employee_name=staff.employee_name,
                phone=staff.phone,
                address=staff.address,
                status=staff.status,
                begin_date=staff.begin_date,
                username=account.username,
                department_id=staff.department_id,
                account_id=account.account_id,
                position=staff.position
            ))

    return staff_accounts

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# View Account Detail of Staffs of Manager

class StaffAccountDetailResponse(BaseModel):
    employee_id: str
    employee_name: str
    phone: str
    address: str
    status: EmployeeStatus
    begin_date: date
    department_id: str
    position: EmployeePosition
    username: str

    class Config:
        from_attributes = True


@manager_router.get("/accounts/staffs/{account_id}", response_model=StaffAccountDetailResponse)
def get_staff_account_detail(
    account_id: str,
    manager_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết tài khoản của nhân viên dưới quyền của manager (dựa vào account_id).
    """
    manager = db.query(Employee).filter(
        Employee.employee_id == manager_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found or not active")

    account = db.query(AccountEmployee).filter(
        AccountEmployee.account_id == account_id
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    staff = db.query(Employee).filter(
        Employee.employee_id == account.employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.status == EmployeeStatus.active
    ).first()

    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found or not active")

    return StaffAccountDetailResponse(
        employee_id=staff.employee_id,
        employee_name=staff.employee_name,
        phone=staff.phone,
        address=staff.address,
        department_id=staff.department_id,
        position=staff.position,
        status=staff.status,
        begin_date=staff.begin_date,
        username=account.username
    )


# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Add Account for Staffs of Manager

class AddStaffAccountRequest(BaseModel):
    employee_name: str
    phone: str
    address: str
    begin_date: date
    username: str
    password: str

    class Config:
        from_attributes = True


@manager_router.post("/accounts/staffs", response_model=StaffAccountDetailResponse)
def add_staff_account(
    employee_id: str,
    account_data: AddStaffAccountRequest,
    db: Session = Depends(get_db)
):
    """
    Thêm tài khoản cho nhân viên dưới quyền của manager.
    """
    manager = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.status == EmployeeStatus.active
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found or not active")

    new_employee_id = f'STAFF_' + str(db.query(Employee).count() + 1)

    new_account_id = f'ACC_STAFF' + str(db.query(AccountEmployee).count() + 1)

    new_employee = Employee(
        employee_id=new_employee_id,
        employee_name=account_data.employee_name,
        phone=account_data.phone,
        address=account_data.address,
        status=EmployeeStatus.active,
        begin_date=account_data.begin_date,
        position=EmployeePosition.staff,
        department_id=manager.department_id
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)


    new_account = AccountEmployee(
        employee_id=new_employee.employee_id,
        username=account_data.username,
        password=account_data.password,
        account_id=new_account_id,
    )

    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return StaffAccountDetailResponse(
        employee_id=new_employee.employee_id,
        employee_name=new_employee.employee_name,
        phone=new_employee.phone,
        address=new_employee.address,
        status=new_employee.status,
        begin_date=new_employee.begin_date,
        username=new_account.username
    )

# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# View Service of a manager have department_id = RECEP


class ServiceResponse(BaseModel):
    service_id: str
    service_name: str
    price: float
    status: ServiceStatus
    description: Optional[str]

    class Config:
        from_attributes = True


@manager_router.get("/services", response_model=List[ServiceResponse])
def view_services(employee_id: str, db: Session = Depends(get_db)):
    """
    Xem danh sách dịch vụ (chỉ cho manager trong phòng RECEP).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.department_id == 'RECEP'
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not a manager in RECEP")

    services = db.query(Service).all()

    return [ServiceResponse.from_orm(service) for service in services]


# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# View service detail of a manager have department_id = RECEP

class ServiceDetailResponse(BaseModel):
    service_id: str
    service_name: str
    price: float
    status: ServiceStatus
    description: Optional[str]


    class Config:
        from_attributes = True


@manager_router.get("/services/{service_id}", response_model=ServiceDetailResponse)
def get_service_detail(
    employee_id: str,
    service_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết dịch vụ (chỉ cho manager trong phòng RECEP).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.department_id == 'RECEP'
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not a manager in RECEP")

    service = db.query(Service).filter(Service.service_id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    return ServiceDetailResponse.from_orm(service)



# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# View list invoice of a manager have department_id = ACCT

class InvoiceResponse(BaseModel):
    invoice_id: str
    household_id: str
    amount: float
    month_date: date
    created_date: datetime
    due_date: date
    status: InvoiceStatus

    class Config:
        from_attributes = True


@manager_router.get("/invoices", response_model=List[InvoiceResponse])
def get_invoices(employee_id: str, db: Session = Depends(get_db)):
    """
    Lấy danh sách hóa đơn (chỉ cho nhân viên manager thuộc phòng ACCT).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.department_id == 'ACCT',
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not an active manager in ACCT")

    invoices = db.query(Invoice).order_by(Invoice.created_date.desc()).all()

    return [InvoiceResponse.from_orm(invoice) for invoice in invoices]

# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------

# View invoice detail of a manager have department_id = ACCT

class InvoiceDetailResponse(BaseModel):
    invoice_detail_id: str
    service_id: str
    quantity: int
    price: float
    total: float

    class Config:
        from_attributes = True


class InvoiceFullResponse(BaseModel):
    invoice_id: str
    household_id: str
    amount: float
    month_date: date
    created_date: datetime
    due_date: date
    status: InvoiceStatus
    details: List[InvoiceDetailResponse]

    class Config:
        from_attributes = True


@manager_router.get("/invoices/{invoice_id}", response_model=InvoiceFullResponse)
def get_invoice_detail(invoice_id: str, employee_id: str, db: Session = Depends(get_db)):
    """
    Xem chi tiết hóa đơn (invoice + invoice_details) cho nhân viên manager thuộc ACCT.
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager,
        Employee.department_id == 'ACCT',
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not an active manager in ACCT")

    invoice = db.query(Invoice).filter(Invoice.invoice_id == invoice_id).first()

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    invoice_details = db.query(InvoiceDetail).filter(
        InvoiceDetail.invoice_id == invoice_id
    ).all()

    return InvoiceFullResponse(
        invoice_id=invoice.invoice_id,
        household_id=invoice.household_id,
        amount=invoice.amount,
        month_date=invoice.month_date,
        created_date=invoice.created_date,
        due_date=invoice.due_date,
        status=invoice.status,
        details=[InvoiceDetailResponse.from_orm(detail) for detail in invoice_details]
    )

# ------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------
# View list incidents of a manager (have department_id)

@manager_router.get("/incidents/")
def get_manager_incidents(employee_id: str, db: Session = Depends(get_db)):
    """
    Lấy danh sách sự cố mà manager chịu trách nhiệm
    """
    # Kiểm tra employee_id có tồn tại và có position là manager
    manager = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found or not a manager")

    # Query incidents mà responsible_id là employee_id
    incidents = db.query(Incident).filter(
        Incident.responsible_id == employee_id
    ).all()

    incident_list = [
        {
            "incident_id": incident.incident_id,
            "incident_name": incident.incident_name,
            "report_time": incident.report_time,
            "reporter_id": incident.reporter_id,
            "description": incident.description,
            "status": incident.status.value
        }
        for incident in incidents
    ]

    return {"incidents": incident_list}

# ------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------

# View incident detail of a manager (have department_id)
@manager_router.get("/incidents/{incident_id}")
def get_incident_detail(
    incident_id: str,
    employee_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết sự cố mà manager chịu trách nhiệm
    """
    # Kiểm tra employee_id có tồn tại và có position là manager
    manager = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.manager
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Manager not found or not a manager")

    # Query sự cố theo incident_id
    incident = db.query(Incident).filter(
        Incident.incident_id == incident_id
    ).first()

    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    return {
        "incident_id": incident.incident_id,
        "incident_name": incident.incident_name,
        "report_time": incident.report_time,
        "reporter_id": incident.reporter_id,
        "description": incident.description,
        "status": incident.status.value
    }