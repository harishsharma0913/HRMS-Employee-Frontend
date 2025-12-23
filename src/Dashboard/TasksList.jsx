import { useNavigate } from "react-router-dom";
import { Clock, Clock3 } from "lucide-react";

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const getProgressByStatus = (status) => {
  if (!status) return 0;

  switch (status.toLowerCase()) {
    case "pending":
      return 0;
    case "inprogress":
    case "in progress":
      return 50;
    case "completed":
      return 100;
    default:
      return 0;
  }
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const TasksList = ({ tasks = [] }) => {
  // 🔹 Latest 3 tasks (any status)
  const navigate = useNavigate();
  const latestTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.dueDate) -
        new Date(a.createdAt || a.dueDate)
    )
    .slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-l-4 border-l-blue-500 border-gray-200 p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2 text-blue-700 font-semibold">
          <Clock size={18} />
          <span>My Tasks</span>
        </div>
        <button 
         onClick={() => navigate("/task")}
         className="text-sm text-blue-600 hover:underline">
          View All
        </button>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {latestTasks.length === 0 && (
          <p className="text-sm text-gray-400">
            No tasks available
          </p>
        )}

        {latestTasks.map((task, index) => {
          const progress = getProgressByStatus(task.status);

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-medium text-sm">
                  {task.title}
                </p>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    priorityStyles[task.priority] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {task.priority || "N/A"}
                </span>
              </div>

              <p className="flex text-xs text-gray-500 mb-3">
                <Clock3 className="h-3 w-3 mt-[2px] mr-1" />
                Due: {formatDate(task.dueDate)}
              </p>

              {/* Progress */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {progress}% completed ({task.status})
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksList;
