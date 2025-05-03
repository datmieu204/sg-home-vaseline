# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.core.database import get_db
# from app.models import Notification, ServiceRegistration
# from app.auth import get_current_user, check_role

# router = APIRouter(prefix="/resident", tags=["resident"])

# @router.get("/profile")
# def get_profile(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["resident"])
#     return current_user["user"]

# @router.put("/profile")
# def update_profile(updated_data: dict, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["resident"])
#     household = current_user["user"]
#     for key, value in updated_data.items():
#         setattr(household, key, value)
#     db.commit()
#     return household

# @router.get("/notifications")
# def get_notifications(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["resident"])
#     return db.query(Notification).filter(Notification.household_id == current_user["user"].household_id).all()

# @router.get("/services")
# def get_services(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
#     check_role(current_user, ["resident"])
#     return db.query(ServiceRegistration).filter(ServiceRegistration.household_id == current_user["user"].household_id).all()