# from fastapi import Depends, HTTPException, status, FastAPI
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from sqlalchemy.orm import Session
# from app.core.database import get_db
# from app.models import Employee, Household, Account, Task
# from datetime import datetime, timedelta
# from pydantic import BaseModel

# SECRET_KEY = "xxx2k4" 
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password):
#     return pwd_context.hash(password)

# def create_access_token(data: dict, expires_delta: timedelta = None):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if not username:
#             raise HTTPException(status_code=401, detail="Invalid token")
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")
    
#     account = db.query(Account).filter(Account.username == username).first()
#     if not account:
#         raise HTTPException(status_code=401, detail="User not found")
    
#     employee = db.query(Employee).filter(Employee.account_id == account.account_id).first()
#     if employee:
#         if employee.department_id is None:
#             role = "admin"
#         else:
#             role = employee.position
#         return {"user": employee, "role": role}
    
#     household = db.query(Household).filter(Household.account_id == account.account_id).first()
#     if household:
#         return {"user": household, "role": "resident"}
    
#     raise HTTPException(status_code=401, detail="User not found")

# def check_role(current_user: dict, allowed_roles: list):
#     if current_user["role"] not in allowed_roles:
#         raise HTTPException(status_code=403, detail="Not authorized")