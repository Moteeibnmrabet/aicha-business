import React, { useEffect } from 'react';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
      <div className="bg-deep-black text-white px-6 py-4 rounded-sm shadow-lg font-sans font-light text-sm">
        {message}
      </div>
    </div>
  );
};

export default Toast;
