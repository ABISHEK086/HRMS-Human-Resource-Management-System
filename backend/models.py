from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime as dt

class LeaveStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    department = Column(String(50))
    position = Column(String(50))
    join_date = Column(Date, nullable=True)
    role = Column(String(20), nullable=False, default="employee")

    leaves = relationship("Leave", back_populates="employee")
    attendance_records = relationship("Attendance", back_populates="employee")
    announcements = relationship("Announcement", back_populates="posted_by_employee")


class Leave(Base):
    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type = Column(String(50), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(String(255), nullable=True)
    status = Column(Enum(LeaveStatus), default=LeaveStatus.pending, nullable=False)

    employee = relationship("Employee", back_populates="leaves")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    check_in = Column(DateTime, nullable=True)
    check_out = Column(DateTime, nullable=True)

    employee = relationship("Employee", back_populates="attendance_records")

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    posted_by = Column(Integer, ForeignKey("employees.id"), nullable=False)
    created_at = Column(DateTime, default=dt.utcnow, nullable=False)

    posted_by_employee = relationship("Employee", back_populates="announcements")