import React from 'react';

interface PatientNameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const PatientNameInput: React.FC<PatientNameInputProps> = React.memo(({ value, onChange, error }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Patient Name
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgb(37,150,190)] ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Enter patient name"
        aria-label="Patient name"
        aria-invalid={!!error}
        aria-describedby={error ? "patient-name-error" : undefined}
      />
      {error && (
        <p 
          id="patient-name-error" 
          className="mt-1 text-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

PatientNameInput.displayName = 'PatientNameInput';

export default PatientNameInput;
