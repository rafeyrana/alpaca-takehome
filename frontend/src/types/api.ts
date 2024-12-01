export interface Note {
  id: string;
  content: string;
}

export interface SessionDetails {
  duration: string;
  patientName: string;
  sessionType: string;
  summaryType: string;
}

export interface SummaryRequest {
  sessionDetails: SessionDetails;
  notes: Note[];
}

export interface SummaryResponse {
  status: 'success' | 'error';
  summary?: string;
  message?: string;
}
