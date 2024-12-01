import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, MagicMock
from app.main import app
from app.models.session import Note, SessionDetails, SummaryRequest, RegenerateSummaryRequest

client = TestClient(app)

@pytest.fixture
def mock_llm_response():
    return "This is a mock summary of the session."

@pytest.fixture
def sample_summary_request():
    return {
        "sessionDetails": {
            "duration": "30 minutes",
            "patientName": "John Doe",
            "sessionType": "Initial Consultation",
            "summaryType": "SOAP"
        },
        "notes": [
            {"id": "1", "content": "Patient reported headaches"},
            {"id": "2", "content": "Prescribed medication"}
        ]
    }

@pytest.fixture
def sample_regenerate_request():
    return {
        "patientName": "John Doe",
        "sessionType": "Initial Consultation",
        "summaryType": "SOAP",
        "notes": [
            {"id": "1", "content": "Patient reported headaches"},
            {"id": "2", "content": "Prescribed medication"}
        ],
        "currentSummary": "Previous summary",
        "selectedText": "headaches",
        "suggestion": "migraines"
    }

@pytest.mark.asyncio
@patch('app.services.session.llm_client.generate_response')
async def test_generate_summary_endpoint(mock_generate_response, mock_llm_response, sample_summary_request):
    mock_generate_response.return_value = mock_llm_response
    response = client.post("/api/generate-summary", json=sample_summary_request)
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["summary"] == mock_llm_response

@pytest.mark.asyncio
@patch('app.services.session.llm_client.generate_response')
async def test_regenerate_summary_endpoint(mock_generate_response, mock_llm_response, sample_regenerate_request):
    mock_generate_response.return_value = mock_llm_response
    response = client.post("/api/regenerate-summary", json=sample_regenerate_request)
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["summary"] == mock_llm_response

def test_generate_summary_invalid_request():
    invalid_request = {
        "sessionDetails": {
            "duration": "30 minutes"
            # Missing other required fields
        },
        "notes": []
    }
    response = client.post("/api/generate-summary", json=invalid_request)
    assert response.status_code == 422

def test_regenerate_summary_invalid_request():
    invalid_request = {
        "patientName": "John Doe"
        # Missing other required fields
    }
    response = client.post("/api/regenerate-summary", json=invalid_request)
    assert response.status_code == 422

def test_generate_summary_empty_notes(mock_llm_response):
    request = {
        "sessionDetails": {
            "duration": "30 minutes",
            "patientName": "John Doe",
            "sessionType": "Initial Consultation",
            "summaryType": "SOAP"
        },
        "notes": []
    }
    response = client.post("/api/generate-summary", json=request)
    assert response.status_code == 200

def test_generate_summary_long_content(mock_llm_response):
    long_content = "Test content " * 1000  # Create very long content
    request = {
        "sessionDetails": {
            "duration": "30 minutes",
            "patientName": "John Doe",
            "sessionType": "Initial Consultation",
            "summaryType": "SOAP"
        },
        "notes": [{"id": "1", "content": long_content}]
    }
    response = client.post("/api/generate-summary", json=request)
    assert response.status_code == 200

def test_generate_summary_special_characters():
    request = {
        "sessionDetails": {
            "duration": "30 minutes",
            "patientName": "John O'Doe",  # Test with special characters
            "sessionType": "Initial Consultation",
            "summaryType": "SOAP"
        },
        "notes": [
            {"id": "1", "content": "Patient's temperature: 98.6°F"},
            {"id": "2", "content": "Blood pressure: 120/80 mm/Hg"}
        ]
    }
    response = client.post("/api/generate-summary", json=request)
    assert response.status_code == 200

def test_invalid_content_type():
    response = client.post(
        "/api/generate-summary",
        data="not a json",
        headers={"Content-Type": "text/plain"}
    )
    assert response.status_code == 422

def test_method_not_allowed():
    response = client.get("/api/generate-summary")
    assert response.status_code == 405
