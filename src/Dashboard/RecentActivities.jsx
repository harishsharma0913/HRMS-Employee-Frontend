import { useMemo } from "react";

const badgeColors = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
};

const dotColors = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
};

const RecentActivities = ({
  tasks = [],
  leaves = [],
  tickets = [],
  documents = {},
}) => {
  const activities = useMemo(() => {
    const list = [];

    /* 🔹 Leaves */
    if (leaves.length) {
      const latestLeave = [...leaves].sort(
        (a, b) => new Date(b.updatedAt || b.startDate) - new Date(a.updatedAt || a.startDate)
      )[0];

      list.push({
        title: "Leave request",
        desc: `${latestLeave.leaveType}`,
        time: new Date(latestLeave.updatedAt || latestLeave.startDate).toDateString(),
        status: latestLeave.status,
        color:
          latestLeave.status?.toLowerCase() === "approved"
            ? "green"
            : latestLeave.status?.toLowerCase() === "pending"
            ? "orange"
            : "red",
      });
    }

    /* 🔹 Tasks */
    if (tasks.length) {
      const latestTask = [...tasks].sort(
        (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      )[0];

      list.push({
        title: "Task update",
        desc: latestTask.title,
        time: new Date(latestTask.updatedAt || latestTask.createdAt).toDateString(),
        status: latestTask.status,
        color:
          latestTask.status?.toLowerCase() === "completed"
            ? "green"
            : latestTask.status?.toLowerCase() === "in progress"
            ? "blue"
            : "orange",
      });
    }

    /* 🔹 Tickets */
    if (tickets.length) {
      const latestTicket = [...tickets].sort(
        (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      )[0];

      list.push({
        title: "Ticket update",
        desc: latestTicket.subject,
        time: new Date(latestTicket.updatedAt || latestTicket.createdAt).toDateString(),
        status: latestTicket.status,
        color:
          latestTicket.status?.toLowerCase() === "resolved"
            ? "green"
            : latestTicket.status?.toLowerCase() === "in progress"
            ? "blue"
            : "orange",
      });
    }

    /* 🔹 Documents */
    if (documents && Object.keys(documents).length) {
      list.push({
        title: "Document uploaded",
        desc: "New document added",
        time: "Recently",
        status: "Available",
        color: "purple",
      });
    }

    return list.slice(0, 4);
  }, [tasks, leaves, tickets, documents]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold mb-1">Recent Activities</h3>
      <p className="text-xs text-gray-400 mb-4">
        Your latest activities across all modules
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((a, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-4 flex justify-between"
          >
            <div className="flex gap-3">
              <span
                className={`w-2 h-2 rounded-full mt-2 ${dotColors[a.color]}`}
              />
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-gray-400">{a.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{a.time}</p>
              </div>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full h-fit ${badgeColors[a.color]}`}
            >
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
