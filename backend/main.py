from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from sqlalchemy.orm import Session
from schemas.healthcheck import HealthCheckResponse
from api.routes import candidates
from sqlalchemy.sql import text
from db.session import get_db, Base, engine
import os

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

swagger_ui = True if ENVIRONMENT == "development" else False

app = FastAPI(
    title="HR System API",
    description="API for managing candidates and resumes in the HR system.",
    version="1.0",
    docs_url="/docs" if swagger_ui else None,
    redoc_url="/redoc" if swagger_ui else None,
    openapi_url="/openapi.json" if swagger_ui else None,
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    """Create all database tables on application start."""
    print("Running automatic database migrations...")
    Base.metadata.create_all(bind=engine)
    print("Database setup complete.")


@app.get(
    "/health-check",
    response_model=HealthCheckResponse,
    summary="Check API and Database Health",
    description="Returns the status of the API and database connectivity.",
    tags=["Health Check"],
)
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return HealthCheckResponse(
            message="HR System API is running", database="Connected"
        )
    except Exception as e:
        return HealthCheckResponse(
            message="HR System API is running", database=f"Error: {str(e)}"
        )


app.include_router(candidates.router, prefix="/candidates", tags=["Candidates"])
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
