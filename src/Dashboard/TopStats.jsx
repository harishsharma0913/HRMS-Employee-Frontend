import {
  CalendarDays,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react";

const calculateLeaveDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diffTime = endDate - startDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const TopStats = ({
  tasks = [],
  leaves = [],
  tickets = [],
  documents = [],
}) => {    
  const TOTAL_LEAVES = 24;
  const currentYear = new Date().getFullYear();

  /* 🔹 Used Leaves (Approved + Current Year + Days Count) */
  const usedLeaves = leaves
    .filter((leave) => {
      const leaveYear = new Date(leave.startDate).getFullYear();
      return (
        leaveYear === currentYear &&
        leave.status?.toLowerCase() === "approved"
      );
    })
    .reduce((total, leave) => {
      return total + calculateLeaveDays(leave.startDate, leave.endDate);
    }, 0);

  const availableLeaves = Math.max(0, TOTAL_LEAVES - usedLeaves);

  const activeTasks = tasks.filter(
  (task) => task.status?.toLowerCase() === "in progress"
  ).length;

const openTickets = tickets.filter(
  (ticket) => ticket.status?.toLowerCase() === "open"
  ).length;

  const countUploadedDocuments = (documentsObj = {}) => {
  let count = 0;

  Object.values(documentsObj).forEach((value) => {
    // Nested object (like marksheets)
    if (typeof value === "object" && value !== null) {
      Object.values(value).forEach((nestedVal) => {
        if (nestedVal) count++;
      });
    } 
    // Normal file
    else {
      if (value) count++;
    }
  });

  return count;
};

  const uploadedDocumentsCount = countUploadedDocuments(documents?.documents);


  /* 🔹 Stats Config */
  const stats = [
    {
      title: "Available Leaves",
      value: availableLeaves,
      subtitle: "days remaining",
      icon: CalendarDays,
      iconColor: "text-green-600",
    },
    {
      title: "Active Tasks",
      value: activeTasks,
      subtitle: "tasks assigned",
      icon: Clock,
      iconColor: "text-blue-600",
    },
    {
      title: "Open Tickets",
      value: openTickets,
      subtitle: "need attention",
      icon: TrendingUp,
      iconColor: "text-orange-600",
    },
    {
      title: "My Documents",
      value: uploadedDocumentsCount,
      subtitle: "files uploaded",
      icon: FileText,
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-5 flex justify-between items-start"
          >
            {/* Left Content */}
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="text-2xl font-semibold mt-2">
                {item.value || 0}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {item.subtitle}
              </p>
            </div>

            {/* Right Icon */}
            <div className={item.iconColor}>
              <Icon size={18} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopStats;
