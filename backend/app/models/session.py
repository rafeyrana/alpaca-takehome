from pydantic import BaseModel
from typing import List
from uuid import uuid4
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import Column, String, DateTime, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class Note(BaseModel):
    id: str
    content: str

class SessionDetails(BaseModel):
    duration: str
    patientName: str
    sessionType: str
    summaryType: str

class SummaryRequest(BaseModel):
    sessionDetails: SessionDetails
    notes: List[Note]

class SummaryResponse(BaseModel):
    status: str
    summary: str
    message: Optional[str] = None

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    patient_name = Column(String, nullable=False)
    session_type = Column(String, nullable=False)
    summary_type = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    notes = Column(JSON, nullable=False)  # Store notes as JSON array
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

class SaveSessionRequest(BaseModel):
    patientName: str
    sessionType: str
    summaryType: str
    duration: str
    notes: List[Note]
    summary: str

# Response Models
class BaseResponse(BaseModel):
    """Base response model for consistent response structure"""
    status: str
    message: Optional[str] = None

class RegenerateSummaryResponse(BaseModel):
    """Response model for regenerate summary endpoint"""
    status: str
    summary: str

class SaveSessionResponse(BaseResponse):
    """Response model for save session endpoint"""
    session_id: str
