from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.models.session import (
    SummaryRequest, 
    SummaryResponse, 
    Note, 
    SaveSessionRequest, 
    UserSession,
    RegenerateSummaryResponse,
    SaveSessionResponse
)
from app.services.session import generate_summary, regenerate_summary, save_session
from app.db.session import get_db

router = APIRouter()

class RegenerateSummaryRequest(BaseModel):
    patientName: str
    sessionType: str
    summaryType: str
    notes: List[Note]
    currentSummary: str
    selectedText: str
    suggestion: str

@router.post("/generate-summary", response_model=SummaryResponse)
async def create_summary(request: SummaryRequest) -> SummaryResponse:
    """
    Endpoint to generate a summary based on session details and notes.
    """
    try:
        return await generate_summary(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/regenerate-summary", response_model=RegenerateSummaryResponse)
async def regenerate_session_summary(request: RegenerateSummaryRequest) -> RegenerateSummaryResponse:
    """
    Endpoint to regenerate a summary based on user suggestions.
    """
    try:
        return await regenerate_summary(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/save-session", response_model=SaveSessionResponse)
async def save_user_session(
    request: SaveSessionRequest,
    db: Session = Depends(get_db)
) -> SaveSessionResponse:
    try:
        session_id = await save_session(request, db)
        return SaveSessionResponse(
            status="success",
            session_id=str(session_id)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
