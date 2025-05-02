# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.core.database import get_db
# from app.models import Task, Incident, Payment, Service, Household
# from app.auth import get_current_user, check_role
# from pydantic import BaseModel

# router = APIRouter(prefix="/employee", tags=["employee"])

# class IncidentCreate(BaseModel):
#     incident_name: str
#     type: str
#     description: str
#     status: str

# @router.get("/profile")
# def get_profile(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["employee", "department_head"])
#     return current_user["user"]

# @router.get("/tasks")
# def get_tasks(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["employee", "department_head"])
#     return db.query(Task).filter(Task.assignee_id == current_user["user"].employee_id).all()

# @router.post("/reports")
# def create_report(incident: IncidentCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["employee", "department_head"])
#     new_incident = Incident(
#         incident_name=incident.incident_name, type=incident.type, description=incident.description,
#         status=incident.status, reporter_id=current_user["user"].employee_id, report_time=func.now()
#     )
#     db.add(new_incident)
#     db.commit()
#     return new_incident

# # Nhân viên kế toán
# @router.put("/payments/{id}")
# def confirm_payment(id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["employee"])
#     if current_user["user"].department_id != 1:  
#         raise HTTPException(status_code=403, detail="Not an accountant")
#     payment = db.query(Payment).filter(Payment.payment_id == id).first()
#     payment.confirmed_by = current_user["user"].employee_id
#     db.commit()
#     return payment

# # Nhân viên lễ tân
# @router.post("/residents")
# def create_resident(household: dict, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["employee"])
#     if current_user["user"].department_id != 2:  # Giả sử 2 là ID của phòng lễ tân
#         raise HTTPException(status_code=403, detail="Not a receptionist")
#     # Logic tạo tài khoản cư dân tương tự admin
#     pass

# @router.post("/services")
# def create_service(service: dict, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["employee"])
#     if current_user["user"].department_id != 2:
#         raise HTTPException(status_code=403, detail="Not a receptionist")
#     new_service = Service(**service)
#     db.add(new_service)
#     db.commit()
#     return new_service