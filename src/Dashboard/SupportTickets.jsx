import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  open: "bg-yellow-100 text-yellow-700",
  "in progress": "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

const SupportTickets = ({ tickets = [] }) => {
  const navigate = useNavigate();
  // 🔹 Latest 3 tickets (any status)
  const latestTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-l-4 border-l-orange-500 border-gray-200 p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2 text-orange-700 font-semibold">
          <TrendingUp size={18} />
          <span>Support Tickets</span>
        </div>
        <button
         onClick={() => navigate("/help")}
         className="text-sm text-orange-600 hover:underline">
          View All
        </button>
      </div>

      {/* Tickets */}
      <div className="space-y-3">
        {latestTickets.length === 0 && (
          <p className="text-sm text-gray-400">
            No tickets found
          </p>
        )}

        {latestTickets.map((ticket, index) => {
          const statusKey = ticket.status?.toLowerCase();

          return (
            <div
              key={ticket._id || index}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <p className="text-sm font-medium">
                  {ticket.subject}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Ticket ID: #
                  {ticket.ticketId ||
                    ticket._id?.slice(-4) ||
                    1000 + index}
                </p>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  statusStyles[statusKey] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {ticket.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SupportTickets;
