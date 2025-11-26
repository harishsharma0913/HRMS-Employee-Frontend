import { useDispatch, useSelector } from "react-redux";
import { getMyTickets } from "../ReduxToolkit/authSlice";
import { useEffect } from "react";

const RecentTicketsTable = () => {
  const dispatch = useDispatch();
  const { tickets, ticketsLoading, ticketsError } = useSelector(
    (state) => state.auth
  );

  useEffect(() => { 
    const emp = JSON.parse(localStorage.getItem("employee"));
    const empId = emp?._id || emp?.id;
    if (empId) {
      dispatch(getMyTickets(empId));
    }
  }, [dispatch]);

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-blue-100 text-blue-600";
      case "in progress":
        return "bg-purple-100 text-purple-600";
      case "resolved":
        return "bg-green-100 text-green-600";
      case "closed":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (ticketsLoading)
    return (
      <div className="bg-white p-6 rounded-xl shadow border text-center text-gray-500">
        Loading tickets...
      </div>
    );

  if (ticketsError)
    return (
      <div className="bg-white p-6 rounded-xl shadow border text-center text-red-500">
        Failed to load tickets. Please try again.
      </div>
    );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl hover:shadow-lg border mb-6 mt-6 transition-all max-w-5xl mx-auto w-full">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
        Recent Support Tickets
      </h2>

      {/* TABLE FOR DESKTOP */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="p-3 font-medium">Ticket ID</th>
              <th className="p-3 font-medium">Subject</th>
              <th className="p-3 font-medium">Category</th>
              <th className="p-3 font-medium">Priority</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{ticket.ticketId}</td>
                  <td className="p-3">{ticket.subject}</td>
                  <td className="p-3">{ticket.category}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CARD VIEW FOR MOBILE */}
      <div className="sm:hidden space-y-4">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-800 text-sm">
                  {ticket.subject}
                </p>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(
                    ticket.status
                  )}`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Ticket ID:</span>{" "}
                  {ticket.ticketId}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Category:</span>{" "}
                  {ticket.category}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Priority:</span>{" "}
                  <span
                    className={`px-2 py-[2px] rounded-full text-[11px] font-medium ${getPriorityBadge(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Date:</span>{" "}
                  {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm italic">
            No tickets found.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentTicketsTable;
