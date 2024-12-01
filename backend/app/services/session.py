from app.models.session import (
    SummaryRequest, 
    SummaryResponse, 
    Note, 
    SaveSessionRequest, 
    UserSession,
    RegenerateSummaryResponse
)
from app.llm_clients.openai_client import OpenAIClient
from app.prompts.session_summary import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE, REGENERATE_SYSTEM_PROMPT, REGENERATE_USER_PROMPT
from sqlalchemy.orm import Session

llm_client = OpenAIClient()

def format_notes(notes: list[Note]) -> str:
    return "\n".join([f"- {note.content}" for note in notes])

async def generate_summary(request: SummaryRequest) -> SummaryResponse:
    notes_text = format_notes(request.notes)
    
    user_prompt = USER_PROMPT_TEMPLATE.format(
        patient_name=request.sessionDetails.patientName,
        session_type=request.sessionDetails.sessionType,
        duration=request.sessionDetails.duration,
        summary_type=request.sessionDetails.summaryType,
        notes=notes_text
    )

    try:
        summary_text = await llm_client.generate_response(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            temperature=0.8
        )
        
        return SummaryResponse(
            status="success",
            summary=summary_text
        )
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return SummaryResponse(
            status="error",
            summary="",
            message=str(e)
        )

async def regenerate_summary(request) -> RegenerateSummaryResponse:
    try:
        print("regenerate_summary")
        print("request:", request)
        
        formatted_notes = format_notes(request.notes)
        print("formatted_notes:", formatted_notes)
        
        prompt = REGENERATE_USER_PROMPT.format(
            patient_name=request.patientName,
            session_type=request.sessionType,
            formatted_notes=formatted_notes,
            current_summary=request.currentSummary,
            selected_text=request.selectedText,
            suggestion=request.suggestion
        )
        print("prompt:", prompt)
        
        new_summary = await llm_client.generate_response(
            system_prompt=REGENERATE_SYSTEM_PROMPT,
            user_prompt=prompt
        )
        print("new_summary:", new_summary)
        
        return RegenerateSummaryResponse(
            status="success",
            summary=new_summary.strip()
        )
        
    except Exception as e:
        print(f"Error regenerating summary: {str(e)}")
        raise e

async def save_session(request: SaveSessionRequest, db: Session) -> str:
   
    try:
        notes_json = [{"content": note.content} for note in request.notes]
        
        # Create new session
        session = UserSession(
            patient_name=request.patientName,
            session_type=request.sessionType,
            summary_type=request.summaryType,
            duration=request.duration,
            notes=notes_json,
            summary=request.summary
        )
        
        # Add and commit to database
        db.add(session)
        db.commit()
        db.refresh(session)
        
        return session.id
        
    except Exception as e:
        db.rollback()
        print(f"Error saving session: {str(e)}")
        raise Exception(f"Failed to save session: {str(e)}")
