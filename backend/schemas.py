from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from datetime import date as date_type
from datetime import datetime

class EmployeeCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    department: Optional[str] = None
    position: Optional[str] = None

class EmployeeResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    join_date: Optional[date] = None

    class Config:
        from_attributes = True

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    join_date: Optional[date] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    employee: EmployeeResponse

class LeaveCreate(BaseModel):
    leave_type: str
    start_date: date_type
    end_date: date_type
    reason: Optional[str] = None

class LeaveResponse(BaseModel):
    id: int
    leave_type: str
    start_date: date_type
    end_date: date_type
    reason: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

class AttendanceResponse(BaseModel):
    id: int
    date: date_type
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None

    class Config:
        from_attributes = True
