// components/Toast.jsx
import { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Auto close after 3s
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colorMap = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white ${colorMap[type]} animate-fade-in`}>
      {message}
    </div>
  );
};

export default Toast;
