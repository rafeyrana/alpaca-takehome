import { useEffect, useRef } from 'react';

interface NoteBulletPointProps {
  content: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  autoFocus?: boolean;
  onCreateNew?: () => void;
}

const NoteBulletPoint = ({ content, onChange, onDelete, autoFocus, onCreateNew }: NoteBulletPointProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onCreateNew?.();
    }
  };

  return (
    <div className="flex items-start space-x-2 w-full animate-slideIn border border-gray-200 rounded-md p-3">
      <div className="mt-3 text-gray-500">•</div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 p-2 text-gray-800 resize-none overflow-hidden focus:outline-none"
        style={{ minHeight: '2rem' }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = target.scrollHeight + 'px';
        }}
      />
      <button
        onClick={onDelete}
        className="mt-2 text-gray-400 hover:text-red-500 transition-colors text-xl"
      >
        ×
      </button>
    </div>
  );
};

export default NoteBulletPoint;
