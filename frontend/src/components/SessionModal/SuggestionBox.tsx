import React, { useState, useRef, useEffect } from 'react';

interface SuggestionBoxProps {
  position: { x: number; y: number };
  onSubmit: (suggestion: string) => void;
  onClose: () => void;
}

export const SuggestionBox: React.FC<SuggestionBoxProps> = ({
  position,
  onSubmit,
  onClose,
}) => {
  const [suggestion, setSuggestion] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Adjust position if box would go off screen
    if (boxRef.current) {
      const box = boxRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      let adjustedX = position.x;
      let adjustedY = position.y;

      // Adjust horizontal position if needed
      if (position.x + box.width > viewportWidth) {
        adjustedX = viewportWidth - box.width - 10;
      }

      // Ensure box stays above selection
      adjustedY = position.y - box.height - 10;

      // If would go above viewport, place below selection instead
      if (adjustedY < 0) {
        adjustedY = position.y + 20;
      }

      boxRef.current.style.left = `${adjustedX}px`;
      boxRef.current.style.top = `${adjustedY}px`;
    }
  }, [position]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestion.trim()) {
      onSubmit(suggestion);
      onClose();
    }
  };

  return (
    <div
      ref={boxRef}
      className="fixed bg-white p-4 rounded-lg shadow-lg border border-gray-200"
      style={{ zIndex: 1000 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Suggest an edit</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close suggestion box"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your suggestion..."
          rows={3}
          autoFocus
          style={{ color: 'black' }}
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={!suggestion.trim()}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
