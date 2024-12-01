import React, { useState } from 'react';
import SessionTimeDropdown from './SessionTimeDropdown';
import PatientNameInput from './PatientNameInput';
import SessionTypeDropdown from './SessionTypeDropdown';
import SummaryTypeDropdown from './SummaryTypeDropdown';
import SessionNotes from './SessionNotes';
import { SummaryDisplay } from './SummaryDisplay';
import { generateSummary, regenerateSummary, saveSession } from '../../api/summary';
import type { Note } from '../../types/api';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import Toast from '../common/Toast';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ValidationErrors {
  patientName: string;
  notes: string;
}

const SessionModal: React.FC<SessionModalProps> = ({ isOpen, onClose }) => {
  const { error, handleError, clearError } = useErrorHandler();
  const [duration, setDuration] = useState('30');
  const [patientName, setPatientName] = useState('');
  const [sessionType, setSessionType] = useState('Initial Consultation');
  const [summaryType, setSummaryType] = useState('medium');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [summary, setSummary] = useState('');

  const [errors, setErrors] = useState<ValidationErrors>({
    patientName: '',
    notes: '',
  });

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      patientName: '',
      notes: '',
    };

    if (!patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (notes.length === 0 || notes.every(note => !note.content.trim())) {
      newErrors.notes = 'At least one note with content is required';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const response = await generateSummary({
        sessionDetails: {
          duration,
          patientName,
          sessionType,
          summaryType,
        },
        notes,
      });

      if (response.status === 'error') {
        handleError(response.message);
      } else {
        setSummary(response.summary || "");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = async (selectedText: string, suggestion: string) => {
    if (!selectedText.trim() || !suggestion.trim()) {
      return;
    }

    try {
      setIsRegenerating(true);
      const newSummary = await regenerateSummary({
        patientName,
        sessionType,
        summaryType,
        notes,
        currentSummary: summary,
        selectedText,
        suggestion,
      });
      setSummary(newSummary);
    } catch (error) {
      handleError(error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSave = async () => {
    if (!summary || !patientName) {
      setErrors({
        ...errors,
        patientName: !patientName ? 'Patient name is required' : '',
      });
      return;
    }

    try {
      setIsSaving(true);
      setSaveSuccess(false);
      await saveSession({
        patientName,
        sessionType,
        summaryType,
        duration,
        notes,
        summary,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setDuration('30');
    setPatientName('');
    setSessionType('Initial Consultation');
    setSummaryType('medium');
    setNotes([]);
    setSummary('');
    setSaveSuccess(false);
    setErrors({
      patientName: '',
      notes: '',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 w-[900px] max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-8 text-[rgb(37,150,190)] text-center">New Session</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-8 flex flex-col items-center">
              <div className="space-y-6 w-[500px]">
              <PatientNameInput
                  value={patientName}
                  onChange={setPatientName}
                  error={errors.patientName}
                />
                <SessionTimeDropdown
                  value={duration}
                  onChange={setDuration}
                />
                <SessionTypeDropdown
                  value={sessionType}
                  onChange={setSessionType}
                />

                <SummaryTypeDropdown
                  value={summaryType}
                  onChange={setSummaryType}
                />
              </div>
              <div className="w-full max-w-[800px]">
                <SessionNotes
                  notes={notes}
                  onChange={setNotes}
                />
              </div>
              <div className="flex justify-center items-center space-x-4 w-full mt-6">
                <button
                  type="submit"
                  className="bg-[rgb(37,150,190)] text-white px-6 py-2 rounded-lg hover:bg-[rgb(27,140,180)] disabled:opacity-50"
                  disabled={isLoading || isRegenerating}
                >
                  {isLoading ? "Generating..." : "Generate Summary"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          {summary && (
            <div className="mt-8 w-full">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 text-center text-[rgb(27,140,180)]">Generated Summary</h3>
                <SummaryDisplay
                  summary={summary}
                  onSuggestion={handleSuggestion}
                  isLoading={isLoading || isRegenerating}
                />
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Session"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {error.visible && (
        <Toast
          message={error.message}
          type="error"
          onClose={clearError}
        />
      )}
      {saveSuccess && (
        <Toast
          message="Session saved successfully!"
          type="success"
          onClose={() => setSaveSuccess(false)}
        />
      )}
    </>
  );
};

export default SessionModal;
