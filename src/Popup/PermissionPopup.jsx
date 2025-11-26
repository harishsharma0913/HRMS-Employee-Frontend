import { createPortal } from "react-dom";
import { X } from "lucide-react";

const PermissionPopup = ({ message, onConfirm, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-fade-in relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        {/* Message */}
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-5">
          {message || "Do you allow this action?"}
        </h2>

        {/* OK Button */}
        <div className="flex justify-center">
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body // 👈 ye line isse body ke andar render karti hai
  );
};

export default PermissionPopup;
