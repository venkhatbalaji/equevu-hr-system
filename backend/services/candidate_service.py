from sqlalchemy.orm import Session
from db.models import Candidate
from schemas.candidate import CandidateCreateSchema


class CandidateService:
    def __init__(self, db: Session):
        self.db = db

    def create_candidate(self, candidate_data: CandidateCreateSchema, resume_path: str):
        candidate = Candidate(**candidate_data.model_dump(), resume_path=resume_path)
        self.db.add(candidate)
        self.db.commit()
        self.db.refresh(candidate)
        return candidate

    def get_candidates(self, department=None, page=0, limit=10):
        skip = (page - 1) * limit
        query = self.db.query(Candidate)
        if department:
            query = query.filter(Candidate.department == department)
        return (
            query.order_by(Candidate.registered_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_candidate_by_id(self, candidate_id: int):
        return self.db.query(Candidate).filter(Candidate.id == candidate_id).first()
