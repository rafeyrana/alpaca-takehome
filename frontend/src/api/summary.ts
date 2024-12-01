import axios from 'axios';
import { SummaryRequest, SummaryResponse, Note } from '../types/api';

interface RegenerateSummaryRequest {
  patientName: string;
  sessionType: string;
  summaryType: string;
  notes: Note[];
  currentSummary: string;
  selectedText: string;
  suggestion: string;
}

interface SaveSessionRequest {
  patientName: string;
  sessionType: string;
  summaryType: string;
  duration: string;
  notes: Note[];
  summary: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const generateSummary = async (params: SummaryRequest): Promise<SummaryResponse> => {
  try {
    const response = await axios.post<SummaryResponse>(
      `${API_BASE_URL}/api/generate-summary`,
      params
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        summary: '',
        status: 'error',
        message: error.response?.data?.message || 'Failed to generate summary',
      };
    }
    return {
      summary: '',
      status: 'error',
      message: 'An unexpected error occurred',
    };
  }
};

export const regenerateSummary = async (request: RegenerateSummaryRequest): Promise<string> => {
  try {
    const response = await axios.post<{ summary: string }>(
      `${API_BASE_URL}/api/regenerate-summary`,
      request
    );
    return response.data.summary;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to regenerate summary');
    }
    throw new Error('An unexpected error occurred');
  }
};
export const saveSession = async (request: SaveSessionRequest): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/api/save-session`, request);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to save session');
    }
    throw new Error('An unexpected error occurred');
  }
};
