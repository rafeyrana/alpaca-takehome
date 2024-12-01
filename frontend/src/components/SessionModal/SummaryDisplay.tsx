import React, { useState, useCallback } from 'react';
import { SuggestionBox } from './SuggestionBox';

interface SummaryDisplayProps {
  summary: string;
  isLoading: boolean;
  onSuggestion?: (selectedText: string, suggestion: string) => void;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ 
  summary, 
  isLoading,
  onSuggestion 
}) => {
  const [selection, setSelection] = useState<{
    text: string;
    position: { x: number; y: number };
  } | null>(null);

  const handleSelection = useCallback(() => {
    const selectedText = window.getSelection()?.toString();
    
    if (selectedText && selectedText.trim()) {
      const range = window.getSelection()?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        setSelection({
          text: selectedText,
          position: {
            x: rect.left + scrollLeft,
            y: rect.top + scrollTop - 5 // 5px gap above selection
          }
        });
      }
    } else {
      setSelection(null);
    }
  }, []);

  const handleSuggestionSubmit = (suggestion: string) => {
    if (selection && onSuggestion) {
      onSuggestion(selection.text, suggestion);
    }
    setSelection(null);
  };

  if (isLoading) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">
          {selection ? 'Regenerating Summary...' : 'Generating Summary...'}
        </h3>
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="mt-4 relative">
      <div 
        className="p-4 border rounded-lg bg-white shadow-sm"
        onMouseUp={handleSelection}
      >
        <pre className="whitespace-pre-wrap font-sans text-gray-700">
          {summary}
        </pre>
      </div>
      
      {selection && (
        <SuggestionBox
          position={selection.position}
          onSubmit={handleSuggestionSubmit}
          onClose={() => setSelection(null)}
        />
      )}
    </div>
  );
};
