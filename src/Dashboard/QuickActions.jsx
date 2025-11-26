import {
  Calendar,
  Clock,
  FileText,
  User,
  ChevronRight,
} from "lucide-react"; // Icon import chhod diya as you said "Button" hi mat import karo

const QuickActions = () => {
  const actions = [
    { icon: <Calendar className="w-4 h-4" />, text: "Request Time Off" },
    { icon: <Clock className="w-4 h-4" />, text: "Log Hours" },
    { icon: <FileText className="w-4 h-4" />, text: "View Payslips" },
    { icon: <User className="w-4 h-4" />, text: "Update Profile" },
  ];

  return (
    <div className="bg-white p-4 rounded-md border shadow-sm">
      <h2 className="text-lg font-bold mb-4">Quick Actions</h2>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-100 transition text-sm text-gray-800"
          >
            {action.icon}
            {action.text}
            <ChevronRight className="w-4 h-4 ml-auto text-gray-500" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
