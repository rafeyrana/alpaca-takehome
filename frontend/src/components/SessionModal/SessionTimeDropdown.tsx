interface SessionTimeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
}

const SessionTimeDropdown = ({ value, onChange, error, touched }: SessionTimeDropdownProps) => {
  return (
    <div>
      <label className={`block text-base font-medium mb-2 ${touched && error ? 'text-red-600' : 'text-gray-700'}`}>
        Session Time
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`block w-full h-12 px-4 py-2.5 text-gray-900 rounded-md border shadow-sm text-base
          ${touched && error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
      >
        {[30, 45, 60, 75, 90].map((time) => (
          <option key={time} value={time}>
            {time} minutes
          </option>
        ))}
      </select>
      {touched && error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SessionTimeDropdown;
