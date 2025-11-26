const activities = [
  {
    status: "Approved",
    color: "bg-green-500",
    title: "Time off request approved",
    time: "Dec 20–22, 2024 • 2 hours ago",
    bg: "bg-green-100 text-green-800",
  },
  {
    status: "Completed",
    color: "bg-blue-500",
    title: "Performance review completed",
    time: "Q4 2024 Review • 1 day ago",
    bg: "bg-blue-100 text-blue-800",
  },
  {
    status: "Due Soon",
    color: "bg-orange-500",
    title: "Training module assigned",
    time: "Cybersecurity Awareness • 3 days ago",
    bg: "bg-orange-100 text-orange-800",
  },
  {
    status: "Available",
    color: "bg-gray-400",
    title: "Payslip generated",
    time: "November 2024 • 1 week ago",
    bg: "bg-gray-100 text-gray-700",
  },
];

const ActivityCard = () => {
  return (
    <div className="bg-white p-4 rounded-md border shadow-sm">
      <h2 className="text-lg font-bold mb-1">Recent Activities</h2>
      <p className="text-sm text-gray-500 mb-4">Your latest HR-related activities</p>

      <div className="space-y-3">
        {activities.map((act, idx) => (
          <div key={idx} className="flex items-center gap-4">
            {/* Color dot */}
            <div className={`w-2 h-2 rounded-full ${act.color}`} />

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-medium">{act.title}</p>
              <p className="text-xs text-gray-500">{act.time}</p>
            </div>

            {/* Status tag using span */}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${act.bg}`}>
              {act.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityCard;
