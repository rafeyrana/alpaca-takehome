import React, { useState, useCallback, useRef } from 'react';
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
    range?: Range;
  } | null>(null);
  
  const contentRef = useRef<HTMLPreElement>(null);

  const handleSelection = useCallback(() => {
    const selectedText = window.getSelection()?.toString();
    
    if (selectedText && selectedText.trim()) {
      const sel = window.getSelection();
      const range = sel?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      
      if (rect && range) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // Create a new range and add highlight class
        const span = document.createElement('span');
        span.className = 'bg-yellow-200';
        range.surroundContents(span);

        setSelection({
          text: selectedText,
          position: {
            x: rect.left + scrollLeft,
            y: rect.top + scrollTop - 5
          },
          range: range.cloneRange() // Store range for later cleanup
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
    
    // Clean up highlight
    if (contentRef.current) {
      const highlightedSpan = contentRef.current.querySelector('.bg-yellow-200');
      if (highlightedSpan) {
        const parent = highlightedSpan.parentNode;
        if (parent) {
          parent.replaceChild(
            document.createTextNode(highlightedSpan.textContent || ''),
            highlightedSpan
          );
        }
      }
    }
    
    setSelection(null);
  };

  const handleClose = () => {
    // Clean up highlight
    if (contentRef.current) {
      const highlightedSpan = contentRef.current.querySelector('.bg-yellow-200');
      if (highlightedSpan) {
        const parent = highlightedSpan.parentNode;
        if (parent) {
          parent.replaceChild(
            document.createTextNode(highlightedSpan.textContent || ''),
            highlightedSpan
          );
        }
      }
    }
    
    setSelection(null);
  };

  if (isLoading) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">
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
        <pre 
          ref={contentRef}
          className="whitespace-pre-wrap font-sans text-gray-700"
        >
          {summary}
        </pre>
      </div>
      
      {selection && (
        <SuggestionBox
          position={selection.position}
          onSubmit={handleSuggestionSubmit}
          onClose={handleClose}
        />
      )}
    </div>
  );
};
