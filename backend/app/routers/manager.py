# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.core.database import get_db
# from app.models import Task, Employee, Incident
# from app.auth import get_current_user, check_role
# from pydantic import BaseModel

# router = APIRouter(prefix="/department-head", tags=["department_head"])

# class TaskCreate(BaseModel):
#     name_task: str
#     assignee_id: int
#     description: str
#     deadline: str

# @router.get("/profile")
# def get_profile(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["department_head"])
#     return current_user["user"]

# @router.get("/tasks")
# def get_tasks(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["department_head"])
#     return db.query(Task).filter(Task.assigner_id == current_user["user"].employee_id).all()

# @router.post("/tasks")
# def create_task(task: TaskCreate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["department_head"])
#     new_task = Task(
#         name_task=task.name_task, assigner_id=current_user["user"].employee_id,
#         assignee_id=task.assignee_id, description=task.description, deadline=task.deadline, status="pending"
#     )
#     db.add(new_task)
#     db.commit()
#     return new_task

# @router.get("/reports")
# def get_reports(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["department_head"])
#     return db.query(Incident).filter(Incident.responsible_id == current_user["user"].employee_id).all()