from sqlalchemy import Column, Integer, String, Date, Enum, func
from .session import Base
import enum


class DepartmentEnum(str, enum.Enum):
    IT = "IT"
    HR = "HR"
    Finance = "Finance"


class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    dob = Column(Date, nullable=False)
    experience = Column(Integer, nullable=False)
    department = Column(Enum(DepartmentEnum), nullable=False)
    resume_path = Column(String, nullable=False)
    registered_at = Column(Date, server_default=func.now())
