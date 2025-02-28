from fastapi import (
    APIRouter,
    HTTPException,
    UploadFile,
    File,
    Depends,
    Query,
    Header,
    Form,
)
from sqlalchemy.orm import Session
from db.session import get_db
from schemas.candidate import CandidateCreateSchema, CandidateResponseSchema
from services.candidate_service import CandidateService
from utils.file_handler import FileHandler
from typing import List, Optional
import json
from api.dependencies.admin import verify_admin

router = APIRouter()


@router.post("/", response_model=CandidateResponseSchema)
def register_candidate(
    candidate: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        candidate_data = json.loads(candidate)
        candidate_schema = CandidateCreateSchema(**candidate_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid candidate data: {str(e)}")

    if resume.content_type not in [
        "application/pdf",
    ]:
        raise HTTPException(status_code=400, detail="Invalid file type")

    file_path = FileHandler.save_resume(resume, candidate_schema.full_name)

    candidate_service = CandidateService(db)
    new_candidate = candidate_service.create_candidate(candidate_schema, file_path)

    return new_candidate


@router.get(
    "/",
    response_model=List[CandidateResponseSchema],
    dependencies=[Depends(verify_admin)],
)
def list_candidates(
    db: Session = Depends(get_db),
    department: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, le=50),
):
    candidate_service = CandidateService(db)
    return candidate_service.get_candidates(department, page, limit)


@router.get(
    "/{candidate_id}",
    summary="Get Candidate by ID",
    description="Retrieve candidate details by ID.",
    response_model=CandidateResponseSchema,
    dependencies=[Depends(verify_admin)],
)
def get_candidate_by_id(candidate_id: int, db: Session = Depends(get_db)):
    candidate_service = CandidateService(db)
    candidate = candidate_service.get_candidate_by_id(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate


@router.get(
    "/{candidate_id}/resume",
    summary="Get Candidate by ID",
    description="Retrieve candidate details by ID.",
    response_model=CandidateResponseSchema,
    dependencies=[Depends(verify_admin)],
)
def download_resume(
    candidate_id: int,
    db: Session = Depends(get_db),
):
    candidate_service = CandidateService(db)
    candidate = candidate_service.get_candidate_by_id(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return FileHandler.download_resume(candidate.resume_path)
