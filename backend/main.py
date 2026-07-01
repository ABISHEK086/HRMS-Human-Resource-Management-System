from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from database import engine, Base, get_db
from datetime import datetime, date as date_type
import models
import schemas
import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_employee(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    employee = db.query(models.Employee).filter(models.Employee.email == payload.get("sub")).first()
    if employee is None:
        raise HTTPException(status_code=401, detail="Employee not found")
    return employee

@app.get("/")
def read_root():
    return {"message": "HRMS Backend is running"}

@app.post("/register", response_model=schemas.EmployeeResponse)
def register(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Employee).filter(models.Employee.email == employee.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_employee = models.Employee(
        first_name=employee.first_name,
        last_name=employee.last_name,
        email=employee.email,
        password_hash=auth.hash_password(employee.password),
        department=employee.department,
        position=employee.position,
    )
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee

@app.post("/login", response_model=schemas.Token)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.email == credentials.email).first()
    if not employee or not auth.verify_password(credentials.password, employee.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = auth.create_access_token(data={"sub": employee.email})
    return {"access_token": access_token, "token_type": "bearer", "employee": employee}

@app.get("/me", response_model=schemas.EmployeeResponse)
def read_current_employee(current_employee: models.Employee = Depends(get_current_employee)):
    return current_employee

@app.put("/me", response_model=schemas.EmployeeResponse)
def update_current_employee(
    updates: schemas.EmployeeUpdate,
    current_employee: models.Employee = Depends(get_current_employee),
    db: Session = Depends(get_db),
):
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_employee, field, value)

    db.commit()
    db.refresh(current_employee)
    return current_employee

@app.post("/leaves", response_model=schemas.LeaveResponse)
def apply_leave(
    leave: schemas.LeaveCreate,
    current_employee: models.Employee = Depends(get_current_employee),
    db: Session = Depends(get_db),
):
    new_leave = models.Leave(
        employee_id=current_employee.id,
        leave_type=leave.leave_type,
        start_date=leave.start_date,
        end_date=leave.end_date,
        reason=leave.reason,
    )
    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    return new_leave

@app.get("/leaves", response_model=list[schemas.LeaveResponse])
def get_my_leaves(
    current_employee: models.Employee = Depends(get_current_employee),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Leave)
        .filter(models.Leave.employee_id == current_employee.id)
        .order_by(models.Leave.start_date.desc())
        .all()
    )

@app.post("/attendance/check-in", response_model=schemas.AttendanceResponse)
def check_in(
    current_employee: models.Employee = Depends(get_current_employee),
    db: Session = Depends(get_db),
):
    today = date_type.today()
    existing = (
        db.query(models.Attendance)
        .filter(models.Attendance.employee_id == current_employee.id, models.Attendance.date == today)
        .first()
    )
    if existing and existing.check_in:
        raise HTTPException(status_code=400, detail="Already checked in today")

    if existing:
        existing.check_in = datetime.now()
        db.commit()
        db.refresh(existing)
        return existing

    record = models.Attendance(employee_id=current_employee.id, date=today, check_in=datetime.now())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.post("/attendance/check-out", response_model=schemas.AttendanceResponse)
def check_out(
    current_employee: models.Employee = Depends(get_current_employee),
    db: Session = Depends(get_db),
):
    today = date_type.today()
    record = (
        db.query(models.Attendance)
        .filter(models.Attendance.employee_id == current_employee.id, models.Attendance.date == today)
        .first()
    )
    if not record or not record.check_in:
        raise HTTPException(status_code=400, detail="You must check in first")
    if record.check_out:
        raise HTTPException(status_code=400, detail="Already checked out today")

    record.check_out = datetime.now()
    db.commit()
    db.refresh(record)
    return record

@app.get("/attendance", response_model=list[schemas.AttendanceResponse])
def get_my_attendance(
    current_employee: models.Employee = Depends(get_current_employee),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Attendance)
        .filter(models.Attendance.employee_id == current_employee.id)
        .order_by(models.Attendance.date.desc())
        .all()
    )

@app.get("/attendance/today", response_model=Optional[schemas.AttendanceResponse])
def get_today_attendance(
    current_employee: models.Employee = Depends(get_current_employee),
    db: Session = Depends(get_db),
):
    today = date_type.today()
    return (
        db.query(models.Attendance)
        .filter(models.Attendance.employee_id == current_employee.id, models.Attendance.date == today)
        .first()
    )