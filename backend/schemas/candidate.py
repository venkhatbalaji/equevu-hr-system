from pydantic import BaseModel
from datetime import date
from db.models import DepartmentEnum

class CandidateCreateSchema(BaseModel):
    full_name: str
    dob: date
    experience: int
    department: DepartmentEnum

class CandidateResponseSchema(CandidateCreateSchema):
    id: int
    registered_at: date
    resume_path: str
