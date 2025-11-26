import { useEffect, useState } from "react";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { cancelLeave, getMyLeavesFiltered } from "../ReduxToolkit/authSlice";
import PermissionPopup from "../Popup/PermissionPopup";
import { useToast } from "../Toast/ToastProvider";

const LeaveTableWithFilters = ({ onLeaveCancelled }) => {
  const dispatch = useDispatch();
  const { leavesFiltered , loading, error } = useSelector(state => state.auth);

  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [popupLeaveId, setPopupLeaveId] = useState(null);

  useEffect(() => {
    const today = new Date();
    const past30 = new Date();
    past30.setDate(today.getDate() - 30);
    setStartDate(past30.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  // Backend filtering thunk call
  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem("employee"));
    const empId = emp?._id || emp?.id;
    if (empId) {
      dispatch(
      getMyLeavesFiltered({
      empId: empId,
      status: statusFilter,
      type: typeFilter,
      from: startDate,
      to: endDate,
      })
      );
    }
  }, [dispatch, statusFilter, typeFilter, startDate, endDate]);

  const formatLeaveRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const same = start === end;
    const format = (date, withYear = false) =>
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(withYear && { year: "numeric" }),
      });

    return same ? format(s, true) : `${format(s)} - ${format(e, true)}`;
  };

   const confirmCancelLeave = async () => {
  const emp = JSON.parse(localStorage.getItem("employee"));
  const empId = emp?._id || emp?.id;

  const res = await dispatch(cancelLeave(popupLeaveId));  
  if (res.meta.requestStatus === "fulfilled") {
    showToast(res.payload.message, "success");
    setPopupLeaveId(null);

    dispatch(getMyLeavesFiltered({ 
      empId,
      status: statusFilter,
      type: typeFilter,
      from: startDate,
      to: endDate,
    }));
    if (onLeaveCancelled) onLeaveCancelled();
  } else {
    showToast(res.payload.message, "error");
  }
};

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border hover:shadow-md flex flex-wrap gap-4 justify-between">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-md w-40"
          >
            <option>All</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Leave Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border rounded-md w-40"
          >
            <option>All</option>
            <option>Casual Leave</option>
            <option>Sick Leave</option>
            <option>Earned Leave</option>
            <option>Unpaid Leave</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
      </div>

      {/* Leave Table */}
      <div className="bg-white p-6 rounded-lg divide-y border hover:shadow-md overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2">Filtered Leave Requests</h2>

  {loading && (
    <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-10">
      <span className="text-gray-600">⏳ Updating...</span>
    </div>
  )}
  {error ? (
    showToast("Error Fetching Leaves: " + error, "error")
  ) : (
       <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-2 pt-2">Leave Type</th>
                <th className="pb-2 pt-2">Date Range</th>
                <th className="pb-2 pt-2">Duration</th>
                <th className="pb-2 pt-2">Status</th>
                <th className="pb-2 pt-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leavesFiltered?.length > 0 ? (
                leavesFiltered.map((leave, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-2">{leave.leaveType}</td>
                    <td>{formatLeaveRange(leave.startDate, leave.endDate)}</td>
                    <td>{leave.duration}</td>
                    <td>
                      <span
                        className={`font-semibold ${
                          leave.status === "Approved"
                            ? "text-green-600"
                            : leave.status === "Pending"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="ml-4 mt-2 flex items-center">
                      {leave.status === "Pending" ? (
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Cancel Request"
                          onClick={() => setPopupLeaveId(leave._id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      ) : leave.status === "Approved" ? (
                        <CheckCircle2 className="text-green-600 w-5 h-5" title="Approved" />
                      ) : (
                        <XCircle className="text-red-500 w-5 h-5" title="Rejected" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No leave records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table> 
  )} 
      </div>

      {popupLeaveId && (
        <PermissionPopup
          message="Are you sure you want to cancel this leave?"
          onConfirm={confirmCancelLeave}
          onClose={() => setPopupLeaveId(null)}
        />
      )}
    </div>
  );
};

export default LeaveTableWithFilters;
