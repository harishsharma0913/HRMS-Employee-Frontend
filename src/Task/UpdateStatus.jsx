import React, { useEffect } from "react";
import { X, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateTask, getTasks, resetTaskState, getAllTasks } from "../ReduxToolkit/taskSlice";
import { useToast } from "../Toast/ToastProvider";

export default function UpdateStatus({ open, onClose, task }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { loading, success, error } = useSelector((state) => state.tasks);
//   console.log(task._id);
  
  // ❗ Hooks हमेशा TOP पर होने चाहिए
  useEffect(() => {
    if (success) {
      showToast("Task status updated successfully", "success");
      dispatch(getTasks({limit: 5})); 
      dispatch(getAllTasks())
      dispatch(resetTaskState());
      onClose();
    }
  }, [success]);

  // Modal closed → सिर्फ UI return null (No hooks after)
  if (!open || !task) {
    return null;
  }

  // Helper functions safe after condition (NO HOOKS)
  const getRemainingTime = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = e - s;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return "Pending";
    if (days === 0) return "Due Today";
    return `${days} day(s) remaining`;
  };

  const remainingTime = getRemainingTime(task.createdAt, task.dueDate);

  const getNextStatus = (status) => {
    if (status === "Pending") return "In Progress";
    if (status === "In Progress") return "Completed";
    if (status === "Completed") return "Done";
    return "Completed";
  };

  const nextStatus = getNextStatus(task.status);  

  const handleStatusUpdate = () => {
    const updatedData = { status: nextStatus };
    // console.log(updatedData);
    if (updatedData.status !== "Done"){
        dispatch(updateTask({ id: task._id, updatedData }));
    }else{
        onClose();
    }
  }; 

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg max-h-[90vh] overflow-y-auto p-6 relative">

        {/* Header */}
        <div className="flex gap-4 mb-2 border-b pb-2">
          <h2 className="text-xl font-semibold">Task Details</h2>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              task.status === "In Progress"
                ? "bg-blue-100 text-blue-600"
                : task.status === "Completed"
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {task.status}
          </span>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold">{task.title}</h1>

        {/* Description */}
        <p className="text-gray-700 mt-2">{task.description}</p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs text-gray-500">Priority</p>
            <p className="font-medium text-gray-800">{task.priority}</p>
          </div>

          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs text-gray-500">Assigned By</p>
            <p className="font-medium text-gray-800">
              {task.assignBy || "Human Resource (HR)"}
            </p>
          </div>

          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs text-gray-500">Assigned Date</p>
            <p className="font-medium text-gray-800">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="border rounded-xl p-4 bg-gray-50">
            <p className="text-xs text-gray-500">Due Date</p>
            <p className="font-medium text-gray-800">
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Time remaining */}
        <div className="border rounded-xl p-4 bg-blue-50 text-blue-700 mt-6 flex items-center gap-2">
          <Clock size={20} />
          <div>
            <p className="font-semibold text-sm">Time Remaining</p>
            <p className="text-xs">{remainingTime}</p>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm mt-2">❌ {error}</p>}

        {/* Footer */}
        <div className="mt-8">
          <button
            onClick={handleStatusUpdate}
            disabled={loading}
            className={`w-full px-6 py-3 rounded-xl shadow text-white ${
              loading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Updating..." : nextStatus}
          </button>
        </div>
      </div>
    </div>
  );
}
