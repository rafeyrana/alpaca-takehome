import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.session import generate_summary, regenerate_summary, format_notes, save_session
from app.models.session import (
    Note, 
    SessionDetails, 
    SummaryRequest, 
    RegenerateSummaryRequest,
    SaveSessionRequest
)
from sqlalchemy.orm import Session

@pytest.fixture
def mock_db():
    return MagicMock(spec=Session)

@pytest.fixture
def sample_notes():
    return [
        Note(id="1", content="Patient reported severe headaches"),
        Note(id="2", content="Prescribed pain medication"),
        Note(id="3", content="Follow-up in two weeks")
    ]

@pytest.fixture
def sample_session_details():
    return SessionDetails(
        duration="30 minutes",
        patientName="John Doe",
        sessionType="Initial Consultation",
        summaryType="SOAP"
    )

def test_format_notes():
    notes = [
        Note(id="1", content="First note"),
        Note(id="2", content="Second note"),
        Note(id="3", content="Third note")
    ]
    formatted = format_notes(notes)
    expected = "- First note\n- Second note\n- Third note"
    assert formatted == expected

@pytest.mark.asyncio
@patch('app.services.session.llm_client.generate_response')
async def test_generate_summary_with_empty_notes(mock_generate_response):
    mock_generate_response.return_value = "No significant notes to summarize."
    request = SummaryRequest(
        sessionDetails=SessionDetails(
            duration="30 minutes",
            patientName="John Doe",
            sessionType="Follow-up",
            summaryType="SOAP"
        ),
        notes=[]
    )
    response = await generate_summary(request)
    assert response.status == "success"
    assert "No significant notes" in response.summary

@pytest.mark.asyncio
@patch('app.services.session.llm_client.generate_response')
async def test_generate_summary_with_special_characters(mock_generate_response, sample_session_details):
    notes = [
        Note(id="1", content="Patient's condition: improved!"),
        Note(id="2", content="Blood pressure: 120/80 mm/Hg"),
        Note(id="3", content="Temperature: 98.6°F")
    ]
    mock_generate_response.return_value = "Summary with special characters"
    request = SummaryRequest(sessionDetails=sample_session_details, notes=notes)
    response = await generate_summary(request)
    assert response.status == "success"
    mock_generate_response.assert_called_once()

@pytest.mark.asyncio
@patch('app.services.session.llm_client.generate_response')
async def test_regenerate_summary_with_long_text(mock_generate_response):
    long_text = "Lorem ipsum " * 100  # Create a long text
    mock_generate_response.return_value = "Regenerated summary"
    request = RegenerateSummaryRequest(
        patientName="John Doe",
        sessionType="Follow-up",
        summaryType="SOAP",
        notes=[Note(id="1", content=long_text)],
        currentSummary="Previous summary",
        selectedText="ipsum",
        suggestion="dolor"
    )
    response = await regenerate_summary(request)
    assert response.status == "success"
    assert response.summary == "Regenerated summary"
