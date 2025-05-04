from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
# from app.auth import verify_password, create_access_token

app = FastAPI()

# @app.post("/token")
# async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     account = db.query(Account).filter(Account.username == form_data.username).first()
#     if not account or not verify_password(form_data.password, account.password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
#     access_token = create_access_token(data={"sub": account.username})
#     return {"access_token": access_token, "token_type": "bearer"}


from app.routers import admin, household, manager, staff, login

app.include_router(login.login_router)
app.include_router(admin.admin_router)
# app.include_router(household.household_router)
# app.include_router(manager.manager_router)
# app.include_router(staff.staff_router)