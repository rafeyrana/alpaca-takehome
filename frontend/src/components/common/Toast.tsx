import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseClasses = "fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0";
  const typeClasses = type === 'error' 
    ? "bg-red-500 text-white" 
    : "bg-green-500 text-white";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <div className="flex items-center space-x-2">
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
