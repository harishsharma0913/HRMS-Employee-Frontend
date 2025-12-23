import { useEffect, useState } from "react";
import { Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { cancelLeave, getMyLeavesFiltered } from "../ReduxToolkit/authSlice";
import PermissionPopup from "../Popup/PermissionPopup";
import { useToast } from "../Toast/ToastProvider";

const LeaveTableWithFilters = ({ onLeaveCancelled }) => {
  const dispatch = useDispatch();
  const { leavesFiltered, loading, error } = useSelector(
    (state) => state.auth
  );  

  const { showToast } = useToast();

  // ================= Filters =================
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ================= Pagination =================
  const [page, setPage] = useState(1);
  const limit = 5;

  // ================= Popup =================
  const [popupLeaveId, setPopupLeaveId] = useState(null);

  // ================= Fetch Leaves =================
  useEffect(() => {
    const emp = JSON.parse(localStorage.getItem("employee"));
    const empId = emp?._id || emp?.id;

    if (empId) {
      dispatch(
        getMyLeavesFiltered({
          empId,
          status: statusFilter,
          type: typeFilter,
          from: startDate,
          to: endDate,
          page,
          limit,
        })
      );
    }
  }, [dispatch, statusFilter, typeFilter, startDate, endDate, page]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter, typeFilter, startDate, endDate]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  // ================= Helpers =================
  const formatLeaveRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);

    const format = (date, withYear = false) =>
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        ...(withYear && { year: "numeric" }),
      });

    return start === end
      ? format(s, true)
      : `${format(s)} - ${format(e, true)}`;
  };

  // ================= Cancel Leave =================
  const confirmCancelLeave = async () => {
    const res = await dispatch(cancelLeave(popupLeaveId));

    if (res.meta.requestStatus === "fulfilled") {
      showToast(res.payload.message, "success");
      setPopupLeaveId(null);

      const emp = JSON.parse(localStorage.getItem("employee"));
      const empId = emp?._id || emp?.id;

      dispatch(
        getMyLeavesFiltered({
          empId,
          status: statusFilter,
          type: typeFilter,
          from: startDate,
          to: endDate,
          page,
          limit,
        })
      );

      onLeaveCancelled?.();
    } else {
      showToast(res.payload.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= Filters ================= */}
      <div className="bg-white p-4 rounded-lg border hover:shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded-md w-full"
            >
              <option>All</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Leave Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-2 border rounded-md w-full"
            >
              <option>All</option>
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Earned Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
          </div>
        </div>
      </div>

      {/* ================= Table ================= */}
      <div className="bg-white p-6 rounded-lg border hover:shadow-md relative overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3">
          Filtered Leave Requests
        </h2>

        {loading && (
          <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10">
            <span className="text-gray-600">⏳ Updating...</span>
          </div>
        )}

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2">Leave Type</th>
              <th>Date Range</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {leavesFiltered?.data?.length > 0 ? (
              leavesFiltered?.data.map((leave) => (
                <tr key={leave._id} className="border-b">
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
                  <td>
                    {leave.status === "Pending" ? (
                      <button
                        onClick={() => setPopupLeaveId(leave._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    ) : leave.status === "Approved" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500"
                >
                  No leave records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ================= Pagination ================= */}
        {leavesFiltered?.pagination?.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-5">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page <b>{leavesFiltered?.pagination?.currentPage}</b> of{" "}
              {leavesFiltered?.pagination?.totalPages}
            </span>

            <button
              disabled={page === leavesFiltered?.pagination?.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ================= Popup ================= */}
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
