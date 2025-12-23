import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TOTAL_LEAVES = 24;

const calculateLeaveDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (
    Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
  );
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const LeaveSummary = ({ leaves = [] }) => {
  const currentYear = new Date().getFullYear();
  const today = new Date();
  const navigate = useNavigate();

  /* 🔹 Approved leaves (current year) */
  const approvedLeaves = leaves.filter((leave) => {
    const year = new Date(leave.startDate).getFullYear();
    return (
      year === currentYear &&
      leave.status?.toLowerCase() === "approved"
    );
  });

  /* 🔹 Used days */
  const usedLeaves = approvedLeaves.reduce((total, leave) => {
    return total + calculateLeaveDays(leave.startDate, leave.endDate);
  }, 0);

  const availableLeaves = Math.max(0, TOTAL_LEAVES - usedLeaves);

  /* 🔹 Pending leaves */
  const pendingLeaves = leaves.filter(
    (leave) => leave.status?.toLowerCase() === "pending"
  ).length;

  /* 🔹 Progress % */
  const progressPercent = Math.min(
    100,
    Math.round((usedLeaves / TOTAL_LEAVES) * 100)
  );

  /* 🔹 Upcoming Leave (nearest future approved) */
  const upcomingLeave = approvedLeaves
    .filter((leave) => new Date(leave.startDate) > today)
    .sort(
      (a, b) =>
        new Date(a.startDate) - new Date(b.startDate)
    )[0];

  /* 🔹 Recent applications (latest 2) */
  const recentLeaves = [...leaves]
    .sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl border border-l-4 border-l-green-500 border-gray-200 p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2 text-green-700 font-semibold">
          <CalendarDays size={18} />
          <span>Leave Summary</span>
        </div>
        <button
         onClick={() => navigate("/time-off")}
         className="text-sm text-green-600 hover:underline">
          View All
        </button>
      </div>

      {/* Leave Balance */}
      <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Leave Balance</span>
          <span className="text-gray-600">
            {usedLeaves} / {TOTAL_LEAVES} used
          </span>
        </div>

        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-600 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>Available: {availableLeaves} days</span>
          <span>Pending: {pendingLeaves}</span>
        </div>
      </div>

      {/* Upcoming Leave */}
      {upcomingLeave && (
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">Upcoming Leave</p>
              <p className="text-sm font-semibold text-gray-700">
                {upcomingLeave.leaveType}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(upcomingLeave.startDate)} -{" "}
                {formatDate(upcomingLeave.endDate)}
              </p>
            </div>

            <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
              Approved
            </span>
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <p className="text-sm font-semibold mb-2">
        Recent Applications
      </p>

      <div className="space-y-2">
        {recentLeaves.map((leave) => (
          <div
            key={leave._id}
            className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
          >
            <div>
              <p className="text-sm">{leave.leaveType}</p>
              <p className="text-xs text-gray-400">
                {formatDate(leave.startDate)} (
                {calculateLeaveDays(
                  leave.startDate,
                  leave.endDate
                )}
                d)
              </p>
            </div>

            <span
              className={`text-xs font-medium px-3 py-1 rounded-full
                ${
                  leave.status === "Approved"
                    ? "text-green-700 bg-green-100"
                    : "text-yellow-700 bg-yellow-100"
                }`}
            >
              {leave.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveSummary;
