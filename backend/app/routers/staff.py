from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from app.core.database import get_db
from app.models import Employee, Household, Task, EmployeePosition, TaskStatus, EmployeeStatus, HouseholdStatus, AccountHousehold, AccountEmployee, DepartmentType, Incident, IncidentStatus, Service, ServiceStatus, Invoice, InvoiceDetail, InvoiceStatus, Notification, Payment, PaymentMethod
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

@staff_router.get("/incidents", response_model=List[IncidentResponse])
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
# View incident detail of a staff

class IncidentDetailResponse(BaseModel):
    incident_id: str
    incident_name: str
    responsible_id: str
    report_time: datetime
    description: Optional[str]
    status: IncidentStatus

    class Config:
        from_attributes = True


@staff_router.get("/incidents/{incident_id}", response_model=IncidentDetailResponse)
def get_incident_detail(
    employee_id: str,
    incident_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết của sự cố dựa trên incident_id.
    """
    # Xác thực employee có tồn tại và là staff
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Staff not found or not valid position")

    # Lấy thông tin chi tiết của incident
    incident = db.query(Incident).filter(
        Incident.incident_id == incident_id,
        Incident.reporter_id == employee_id
    ).first()

    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found or not reported by this staff")

    return IncidentDetailResponse.from_orm(incident)

# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Update status of an incident of a staff

class IncidentStatus(str, Enum):
    in_progress = "in_progress"
    resolved = "resolved"

class IncidentStatusUpdateRequest(BaseModel):
    status: IncidentStatus
    description: Optional[str]
    class Config:
        from_attributes = True

@staff_router.put("/incidents/{incident_id}", response_model=IncidentResponse)
def update_incident_status(
    employee_id: str,
    incident_id: str,
    incident_data: IncidentStatusUpdateRequest,
    db: Session = Depends(get_db)
):
    """
    Cập nhật trạng thái của sự cố được báo cáo bởi nhân viên (chỉ cho phép in_progress -> resolved).
    """

    # 1. Xác thực employee tồn tại và là staff
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Staff not found or not valid position")

    # 2. Tìm incident do nhân viên đó báo cáo
    incident = db.query(Incident).filter(
        Incident.incident_id == incident_id,
        Incident.reporter_id == employee_id
    ).first()

    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found or not reported by this staff")

    # 3. Ràng buộc trạng thái: không cho chuyển từ resolved -> in_progress
    if incident.status == IncidentStatus.resolved and incident_data.status == IncidentStatus.in_progress:
        raise HTTPException(status_code=400, detail="Cannot revert status from resolved to in_progress")

    # 4. Cập nhật trạng thái và mô tả (nếu có)
    incident.status = incident_data.status
    if incident_data.description is not None:
        incident.description = incident_data.description

    db.commit()
    db.refresh(incident)

    return IncidentResponse.from_orm(incident)

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


# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
# View Service of a staff have department_id = RECEP 

class ServiceResponse(BaseModel):
    service_id: str
    service_name: str
    price: float
    status: ServiceStatus
    description: Optional[str]

    class Config:
        from_attributes = True


@staff_router.get("/services", response_model=List[ServiceResponse])
def view_services(employee_id: str, db: Session = Depends(get_db)):
    """
    Xem danh sách dịch vụ (chỉ cho staff trong phòng RECEP).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'RECEP'
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not a staff in RECEP")

    services = db.query(Service).all()

    return [ServiceResponse.from_orm(service) for service in services]


# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# View service detail of a staff have department_id = RECEP

class ServiceDetailResponse(BaseModel):
    service_id: str
    service_name: str
    price: float
    status: ServiceStatus
    description: Optional[str]


    class Config:
        from_attributes = True


@staff_router.get("/services/{service_id}", response_model=ServiceDetailResponse)
def get_service_detail(
    employee_id: str,
    service_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết dịch vụ (chỉ cho staff trong phòng RECEP).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'RECEP'
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not a staff in RECEP")

    service = db.query(Service).filter(Service.service_id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    return ServiceDetailResponse.from_orm(service)



# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Update service of a staff have department_id = RECEP 

class ServiceUpdateRequest(BaseModel):
    service_name: Optional[str]
    price: Optional[float]
    status: Optional[ServiceStatus]
    description: Optional[str]
    description: Optional[str]


@staff_router.put("/services/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: str,
    employee_id: str,
    service_data: ServiceUpdateRequest,
    db: Session = Depends(get_db)
):
    """
    Chỉnh sửa dịch vụ (chỉ cho staff trong phòng RECEP).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'RECEP'
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not a staff in RECEP")

    service = db.query(Service).filter(Service.service_id == service_id).first()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    if service_data.service_name is not None:
        service.service_name = service_data.service_name
    if service_data.price is not None:
        service.price = service_data.price
    if service_data.status is not None:
        service.status = service_data.status
    if service_data.description is not None:
        service.description = service_data.description

    db.commit()
    db.refresh(service)

    return ServiceResponse.from_orm(service)

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------
# Create service of a staff have department_id = RECEP

class ServiceCreateRequest(BaseModel):
    service_name: str
    price: float
    status: ServiceStatus
    description: Optional[str] = None
    class Config:
        from_attributes = True


@staff_router.post("/services", response_model=ServiceResponse)
def create_service(
    employee_id: str,
    service_data: ServiceCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Tạo dịch vụ mới (chỉ cho staff trong phòng RECEP).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'RECEP'
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not a staff in RECEP")

    new_service_id = f'SVC' + str(db.query(Service).count() + 1)

    new_service = Service(
        service_id=new_service_id,
        service_name=service_data.service_name,
        price=service_data.price,
        status=service_data.status,
        description=service_data.description
    )

    db.add(new_service)
    db.commit()
    db.refresh(new_service)

    return ServiceResponse.from_orm(new_service)

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------

# View list invoice of a staff have department_id = ACCT

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


@staff_router.get("/invoices", response_model=List[InvoiceResponse])
def get_invoices(employee_id: str, db: Session = Depends(get_db)):
    """
    Lấy danh sách hóa đơn (chỉ cho nhân viên staff thuộc phòng ACCT).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'ACCT',
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not an active staff in ACCT")

    invoices = db.query(Invoice).order_by(Invoice.created_date.desc()).all()

    return [InvoiceResponse.from_orm(invoice) for invoice in invoices]

# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------

# View invoice detail of a staff have department_id = ACCT

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


@staff_router.get("/invoices/{invoice_id}", response_model=InvoiceFullResponse)
def get_invoice_detail(invoice_id: str, employee_id: str, db: Session = Depends(get_db)):
    """
    Xem chi tiết hóa đơn (invoice + invoice_details) cho nhân viên staff thuộc ACCT.
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'ACCT',
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not an active staff in ACCT")

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

# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------

# Confirm invoice of a staff have department_id = ACCT

class ConfirmPaymentResponse(BaseModel):
    invoice_id: str
    payment_id: str
    status: str
    message: str


@staff_router.post("/invoices/{invoice_id}/confirm-payment", response_model=ConfirmPaymentResponse)
def confirm_payment(
    invoice_id: str,
    employee_id: str,
    payment_method: PaymentMethod = PaymentMethod.cash,
    db: Session = Depends(get_db)
):
    """
    Xác nhận thanh toán hóa đơn (chỉ cho nhân viên staff của ACCT) và gửi thông báo.
    Dù thanh toán qua ngân hàng hay tiền mặt, số tiền thanh toán tự động lấy từ số tiền hóa đơn.
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'ACCT',
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not an active staff in ACCT")

    invoice = db.query(Invoice).filter(Invoice.invoice_id == invoice_id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if invoice.status == InvoiceStatus.paid:
        raise HTTPException(status_code=400, detail="Invoice already paid")

    payment_amount = invoice.amount

    payment_id = 'PAY' + str(db.query(Payment).count() + 1)

    payment = Payment(
        payment_id=payment_id,
        invoice_id=invoice_id,
        amount=payment_amount,
        date=datetime.now(),
        method=payment_method,
        confirmed_by=employee_id
    )
    db.add(payment)

    invoice.status = InvoiceStatus.paid

    notification_id = f'NOT' + str(db.query(Notification).count() + 1)
    message_text = f"Hóa đơn {invoice_id} đã được thanh toán thành công."
    notification = Notification(
        notification_id=notification_id,
        invoice_id=invoice_id,
        household_id=invoice.household_id,
        payment_id=payment_id,
        message=message_text
    )
    db.add(notification)

    db.commit()

    return ConfirmPaymentResponse(
        invoice_id=invoice_id,
        payment_id=payment_id,
        status=invoice.status.value,
        message=message_text
    )

# -----------------------------------------------------------------------------
# -----------------------------------------------------------------------------

# View list account household of a staff have department_id = RECEP

class AccountHouseholdResponse(BaseModel):
    household_id: str
    account_id: str
    name: str
    room_number: str

    class Config:
        from_attributes = True


@staff_router.get("/accounts/household", response_model=List[AccountHouseholdResponse])
def get_accounts(employee_id: str, db: Session = Depends(get_db)):
    """
    Lấy danh sách tài khoản hộ gia đình (chỉ cho nhân viên staff thuộc phòng RECEP).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'RECEP',
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not an active staff in RECEP")

    accounts = db.query(AccountHousehold).all()

    households = db.query(Household).all()

    household_dict = {household.household_id: household for household in households}

    account_dict = {account.household_id: account for account in accounts}

    household_accounts = [AccountHouseholdResponse(
        household_id=household_id,
        account_id=account.account_id,
        name=household_dict[household_id].name,
        room_number=household_dict[household_id].room_number
    ) for household_id, account in account_dict.items()]

    return household_accounts


    


# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------

# View account household detail of a staff have department_id = RECEP

class AccountHouseholdDetailResponse(BaseModel):
    household_id: str
    username: str
    password: str
    name: str
    number_of_members: int
    phone: str
    status: HouseholdStatus

    class Config:
        from_attributes = True


@staff_router.get("/accounts/household/{account_id}", response_model=AccountHouseholdDetailResponse)
def get_account_detail(
    employee_id: str,
    account_id: str,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết tài khoản hộ gia đình (chỉ cho nhân viên staff thuộc phòng RECEP).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'RECEP',
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not an active staff in RECEP")

    account = db.query(AccountHousehold).filter(AccountHousehold.account_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    household = db.query(Household).filter(Household.household_id == account.household_id).first()
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")

    return AccountHouseholdDetailResponse(
        household_id=account.household_id,
        username=account.username,
        password=account.password,
        name=household.name,
        number_of_members=household.number_of_members,
        phone=household.phone,
        status=household.status
    )

# ---------------------------------------------------------------------------
# --------------------------------------------------------------------------

# Disable account household of a staff have department_id = RECEP

@staff_router.put("/accounts/household/{account_id}/disable", response_model=AccountHouseholdDetailResponse)
def disable_account(
    employee_id: str,
    account_id: str,
    db: Session = Depends(get_db)
):

    """
    Vô hiệu hóa tài khoản hộ gia đình (chỉ cho nhân viên staff thuộc phòng RECEP).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'RECEP',
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not an active staff in RECEP")

    account = db.query(AccountHousehold).filter(AccountHousehold.account_id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    household = db.query(Household).filter(Household.household_id == account.household_id).first()
    if not household:
        raise HTTPException(status_code=404, detail="Household not found")

    household.status = HouseholdStatus.inactive

    db.commit()
    db.refresh(household)

    return AccountHouseholdDetailResponse(
        household_id=account.household_id,
        username=account.username,
        password=account.password,
        name=household.name,
        number_of_members=household.number_of_members,
        phone=household.phone,
        status=household.status
    )




# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------

# Add account household of a staff have department_id = RECEP

class AccountHouseholdCreateRequest(BaseModel):
    username: str
    password: str
    name: str
    number_of_members: int
    room_number: str
    phone: str

    class Config:
        from_attributes = True


@staff_router.post("/accounts/household", response_model=AccountHouseholdDetailResponse)
def create_account(
    employee_id: str,
    account_data: AccountHouseholdCreateRequest,
    db: Session = Depends(get_db)
):
    """
    Tạo tài khoản hộ gia đình mới (chỉ cho nhân viên staff thuộc phòng RECEP).
    """
    employee = db.query(Employee).filter(
        Employee.employee_id == employee_id,
        Employee.position == EmployeePosition.staff,
        Employee.department_id == 'RECEP',
        Employee.status == EmployeeStatus.active
    ).first()

    if not employee:
        raise HTTPException(status_code=403, detail="Unauthorized: Not an active staff in RECEP")

    new_household_id = f'HH' + str(db.query(Household).count() + 1)

    new_household = Household(
        household_id=new_household_id,
        name=account_data.name,
        number_of_members=account_data.number_of_members,
        phone=account_data.phone,
        room_number=account_data.room_number,
        status=HouseholdStatus.active
    )

    db.add(new_household)
    db.commit()
    db.refresh(new_household)


    new_account_id = f'ACC' + str(db.query(AccountHousehold).count() + 1)

    new_account = AccountHousehold(
        account_id=new_account_id,
        household_id=new_household_id,
        username=account_data.username,
        password=account_data.password
    )

    db.add(new_account)
    db.commit()
    db.refresh(new_account)

    return AccountHouseholdDetailResponse(
        household_id=new_household.household_id,
        username=new_account.username,
        password=new_account.password,
        name=new_household.name,
        room_number=new_household.room_number,
        number_of_members=new_household.number_of_members,
        phone=new_household.phone,
        status=new_household.status
    )