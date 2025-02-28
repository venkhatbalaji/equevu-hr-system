import os
import shutil
from fastapi import HTTPException
from fastapi.responses import FileResponse

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


class FileHandler:
    @staticmethod
    def save_resume(file, candidate_name: str):
        candidate_dir = os.path.join(UPLOAD_DIR, candidate_name.replace(" ", "_"))
        os.makedirs(candidate_dir, exist_ok=True)
        file_path = os.path.join(candidate_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return file_path

    @staticmethod
    def download_resume(resume_path: str):
        if not os.path.exists(resume_path):
            raise HTTPException(status_code=404, detail="Resume file not found")
        return FileResponse(
            resume_path,
            media_type="application/pdf",
            filename=os.path.basename(resume_path),
        )
