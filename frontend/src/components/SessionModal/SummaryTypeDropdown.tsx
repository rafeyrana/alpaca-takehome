interface SummaryTypeDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const SummaryTypeDropdown = ({ value, onChange }: SummaryTypeDropdownProps) => {
  return (
    <div>
      <label className="block text-base font-medium text-gray-700 mb-2">
        Summary Type
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full h-12 px-4 py-2.5 text-gray-900 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
      >
        {['short', 'medium', 'detailed'].map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SummaryTypeDropdown;
