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
      className="fixed bg-white shadow-lg rounded-lg p-3 z-50 w-64"
      style={{ transform: 'translate3d(0, 0, 0)' }}
    >
      <h3 className="text-sm font-semibold mb-2 text-gray-700">Suggest edits</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          className="w-full p-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
          rows={2}
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <button
            type="submit"
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
