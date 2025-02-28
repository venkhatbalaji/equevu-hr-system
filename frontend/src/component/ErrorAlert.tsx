'use client'
import { useState, useEffect } from "react";

interface ErrorAlertProps {
  message: string | null;
  onClose?: () => void;
}

export default function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!visible || !message) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-3 rounded shadow-md">
      {message}
      <button onClick={() => setVisible(false)} className="ml-4 text-white font-bold">
        ✖
      </button>
    </div>
  );
}
