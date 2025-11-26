import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { useDispatch } from "react-redux";
import { getMyTickets, submitSupportTicket } from "../ReduxToolkit/authSlice";
import { useToast } from "../Toast/ToastProvider";

const SupportTicketForm = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    subject: "",
    category: "Technical Issue",
    priority: "Low",
    description: "",
    attachments: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachments" && files?.[0]) {
      const file = files[0];
      const validTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        showToast("Only JPG, PNG, and PDF files are allowed.", "error");
        return;
      }

      if (file.size > maxSize) {
        showToast("File size must be less than 5MB.", "error");
        return;
      }

      setFormData({ ...formData, attachments: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emp = JSON.parse(localStorage.getItem("employee"));
    const empId = emp?._id || emp?.id;
    if (!empId) {
      alert("Employee ID missing. Please login again.");
      return;
    }

    const result = await dispatch(
      submitSupportTicket({ employeeId: empId, ticketData: formData })
    );
    dispatch(getMyTickets(empId));

    if (result.meta.requestStatus === "fulfilled") {
      showToast("Ticket raised successfully!", "success");
      setFormData({
        subject: "",
        category: "Technical Issue",
        priority: "Low",
        description: "",
        attachments: null,
      });
      setPreview(null);
    } else {
      showToast(result.payload.message, "error");
    }
  };

  return (
    <div className="px-3 sm:px-4 md:px-6 lg:px-8 w-full flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300"
      >
        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-gray-800 text-center sm:text-left">
          Raise Support Ticket
        </h2>

        {/* Subject */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            placeholder="Enter ticket subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            required
          />
        </div>

        {/* Category + Priority */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            >
              <option>Technical Issue</option>
              <option>Account Access</option>
              <option>System Error</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Describe your issue..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md h-28 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
            required
          />
        </div>

        {/* Attachments */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachments
          </label>

          <label className="relative w-full min-h-[8rem] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition flex flex-col items-center justify-center px-4 text-center overflow-hidden">
            {preview && (
              <div className="absolute top-3 left-3 w-14 h-14 sm:w-20 sm:h-20">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, attachments: null });
                    setPreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-gray-700 shadow-md"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            )}

            <UploadCloud className="w-6 h-6 text-gray-400 mb-2 mt-2 sm:mt-0" />
            <p className="text-sm text-gray-500 leading-snug">
              Drag & drop or{" "}
              <span className="text-blue-600 font-medium">click to upload</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PDF, PNG, JPG up to 5MB
            </p>

            <input
              type="file"
              name="attachments"
              onChange={handleChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white text-sm sm:text-base font-medium px-6 py-3 rounded-md hover:bg-blue-700 active:scale-[0.98] transition-transform"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default SupportTicketForm;
