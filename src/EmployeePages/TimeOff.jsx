import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  applyLeave,
  getMyLeaves,
  getMyLeavesFiltered,
  resetLeaveState,
} from "../ReduxToolkit/authSlice";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  ArrowBigLeft,
  ArrowBigRight,  
} from "lucide-react";
import { useToast } from "../Toast/ToastProvider";
import LeaveTableWithFilters from "./leaveTableWithFilters";

export default function LeavePage() {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { leaveLoading, leaveSuccess, leaveError, leaves } = useSelector((state) => state.auth);
  console.log("Leaves:", leaves);
  
  const employee = useSelector((state) => state.auth.employee);

  const annualLeaveLimit = (leaves[0]?.annualLeave) || 20;

  useEffect(() => {
    const emp = employee || JSON.parse(localStorage.getItem("employee"));
    const empId = emp?._id || emp?.id;

    if (empId) {
      dispatch(getMyLeaves({ empId: empId , filters: {} }));
    }
  }, [employee?._id, dispatch]);

  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("Full Day");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [clickCount, setClickCount] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0); 

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayIndex = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateSelect = (day) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const selected = new Date(Date.UTC(year, month, day));
    const isoDate = selected.toISOString().slice(0, 10);

    if (clickCount === 0) {
      setStartDate(isoDate);
      setEndDate("");
      setClickCount(1);
    } else {
      if (new Date(isoDate) >= new Date(startDate)) {
        setEndDate(isoDate);
      } else {
        setStartDate(isoDate);
        setEndDate("");
      }
      setClickCount(0);
    }
    setSelectedDate(isoDate);
  };

const baseMonth = new Date(); // current month
baseMonth.setDate(1); // 1st of month (safe for comparison)

const minMonth = new Date(baseMonth);
const maxMonth = new Date(baseMonth);
maxMonth.setMonth(maxMonth.getMonth() + 2);

const handlePrevMonth = () => {
  if (monthOffset > 0) {
    const newOffset = monthOffset - 1;
    setMonthOffset(newOffset);

    const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(prev);
  }
};


const handleNextMonth = () => {
  if (monthOffset < 2) {
    const newOffset = monthOffset + 1;
    setMonthOffset(newOffset);

    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(next);
  }
};

const validateForm = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const errors = [];

  if (!startDate) {
    errors.push("Start date is required.");
  } else if (new Date(startDate) < today) {
    errors.push("Start date cannot be in the past.");
  }

  if (!startDate) {
    errors.push("Date is required.");
  } else if (new Date(endDate) < new Date(startDate)) {
    errors.push("End date cannot be before start date.");
  }

  const start = new Date(startDate);
  const end = new Date(endDate || startDate);
  const isStartSunday = start.getDay() === 0;
  const isEndSunday = end.getDay() === 0;
  const diffDays = 1 + Math.round((end - start) / (1000 * 60 * 60 * 24));

  if (diffDays > 5) {
    errors.push("You can apply for a maximum of 5 consecutive days.");
  }

  if (isStartSunday || isEndSunday) {
  errors.push("Leave cannot start or end on a Sunday.");
 }


  if (!reason || reason.trim().length > 100) {
    errors.push("Reason must be at least 100 characters.");
  }

  if (errors.length > 0) {
    showToast(errors[0], "error"); 
    return false;
  }

  return true;
};



  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
     if (!validateForm()) return;
    const emp = employee || JSON.parse(localStorage.getItem("employee"));
    const empId = emp?._id || emp?.id;
    
    const start = new Date(startDate);
const end = new Date(endDate || startDate);
const days = 1 + Math.round((end - start) / (1000 * 60 * 60 * 24));

if (days > 5) {
  showToast("You can apply for a maximum of 5 consecutive leave days.", "error");
  return;
}
    const leaveData = {
      leaveType,
      startDate,
      endDate: endDate || startDate,
      reason,
      duration,
    };

    const res = await dispatch(applyLeave(leaveData));
    dispatch(getMyLeavesFiltered({ empId: empId, status: "", type: "", from: "", to: "" }));
    if (res.meta.requestStatus === "fulfilled") {
      showToast("Leave applied successfully!", "success");

      setLeaveType("Casual Leave");
      setStartDate("");
      setEndDate("");
      setReason("");
      setDuration("Full Day");
      setSelectedDate(null);
      setClickCount(0);

      if (empId) {
        dispatch(getMyLeaves({ empId: empId}));
      }

      dispatch(resetLeaveState());
    } else {
      showToast("Something went wrong!", "error");
    }
  };

  useEffect(() => {
    if (leaveSuccess || leaveError) {
      const timeout = setTimeout(() => {
        if (leaveSuccess) {
          showToast("Leave applied successfully!", "success");
        }
        if (leaveError) {
          showToast("Error: " + leaveError, "error");
        }
        dispatch(resetLeaveState());
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [leaveSuccess, leaveError, dispatch]);

  const totalApprovedDays = useMemo(() => {
    return leaves
      .filter((leave) => leave.status === "Approved")
      .reduce((total, leave) => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        const days = 1 + Math.round((end - start) / (1000 * 60 * 60 * 24));
        return total + days;
      }, 0);
  }, [leaves]);

  const handleLeaveCancelled = () => {
  const emp = employee || JSON.parse(localStorage.getItem("employee"));
  const empId = emp?._id || emp?.id;

  if (empId) {
    dispatch(getMyLeaves({ empId, filters: {} }));
  }
};

  const totalLimits = {
    "Annual Leave": 24,
    "Casual Leave": 10,
    "Sick Leave": 10,
    "Earned Leave": 10,
    "Unpaid Leave": 10,
  };  

  const colorMap = {
    "Annual Leave": "bg-green-500",
    "Casual Leave": "bg-orange-500",
    "Sick Leave": "bg-red-500",
    "Earned Leave": "bg-slate-500",
    "Unpaid Leave": "bg-pink-500",
  };

  const leaveTypeMap = {
    "Sick": "Sick Leave",
    "Casual": "Casual Leave",
    "Earned": "Earned Leave",
    "Unpaid": "Unpaid Leave",
    "Annual": "Annual Leave",
  };

  const leaveUsage = useMemo(() => {
    const usage = {
      "Annual Leave": 0,
      "Casual Leave": 0,
      "Sick Leave": 0,
      "Earned Leave": 0,
      "Unpaid Leave": 0,
    };

    leaves
      .filter((leave) => leave.status === "Approved")
      .forEach((leave) => {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        const days = 1 + Math.round((end - start) / (1000 * 60 * 60 * 24));

        const normalizedType = leaveTypeMap[leave.leaveType] || leave.leaveType;
        if (usage[normalizedType] !== undefined) {
          usage[normalizedType] += days;
        }
      });

    usage["Annual Leave"] =
      usage["Casual Leave"] +
      usage["Sick Leave"] +
      usage["Earned Leave"] +
      usage["Unpaid Leave"];

    return usage;
  }, [leaves]);

  return (
    <div className="space-y-6 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border hover:shadow-md flex items-center gap-4">
          <CalendarDays className="text-blue-500" />
          <div>
<p className="text-gray-500">Available Leave</p>
<h3 className="text-xl font-semibold">
  {leaves[0]?.annualLeave 
    ? `${Math.max(annualLeaveLimit - totalApprovedDays, 0)} / ${annualLeaveLimit} days`
    : "20 days"}
</h3>

          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border hover:shadow-md flex items-center gap-4">
          <Clock className="text-indigo-500" />
          <div>
            <p className="text-gray-500">Pending Requests</p>
            <h3 className="text-xl font-semibold">
              {
                leaves.filter((leave) => leave.status === "Pending").length
              }{" "}
              requests
            </h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border hover:shadow-md flex items-center gap-4">
          <CheckCircle className="text-green-500" />
          <div>
            <p className="text-gray-500">Approved Leaves</p>
            <h3 className="text-xl font-semibold">
             {totalApprovedDays} days used
            </h3>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white p-6 rounded-lg border hover:shadow-md">
        <div className="flex justify-between items-center mb-4">
           <button
  onClick={handlePrevMonth}
  disabled={monthOffset === 0}
  className={`p-1 rounded-full ${
    monthOffset === 0
      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-blue-600 text-white"
  }`}
>
  <ArrowBigLeft />
</button>


          <h2 className="text-lg font-semibold">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
  onClick={handleNextMonth}
  disabled={monthOffset === 2}
  className={`p-1 rounded-full ${
    monthOffset === 2
      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-blue-600 text-white"
  }`}
>
  <ArrowBigRight />
</button>


        </div>

        <div className="grid grid-cols-7 text-center text-sm text-gray-600 font-medium mb-2">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-center gap-y-2">
          {Array(getFirstDayIndex(currentMonth))
            .fill("")
            .map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}

          {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => {
  const day = i + 1;
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const dateUTC = new Date(Date.UTC(year, month, day));
  const iso = dateUTC.toISOString().slice(0, 10);
  const isSelected = iso === selectedDate;
  const inRange =
    startDate &&
    endDate &&
    new Date(iso) >= new Date(startDate) &&
    new Date(iso) <= new Date(endDate);

const isSunday = dateUTC.getUTCDay() === 0;
const today = new Date();
today.setHours(0, 0, 0, 0);
const isPast = dateUTC < today;

const isDisabled = isSunday || isPast;

  return (
    <div
      key={day}
      onClick={() => !isDisabled && handleDateSelect(day)}
      className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full cursor-pointer
        ${isSelected ? "bg-blue-600 text-white" : ""}
        ${inRange ? "bg-blue-800 text-white" : ""}
        ${isDisabled ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-blue-100 text-gray-800"}
      `}
    >
      {day}
    </div>
  );
})}

        </div>
      </div>

      {/* Form + Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleLeaveSubmit} className="bg-white p-6 rounded-lg border hover:shadow-md space-y-4">
          <h2 className="text-lg font-semibold">Apply for Leave</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Earned Leave</option>
              <option>Unpaid Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Date</label>
              <input
                type="date"
                value={endDate || startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="duration"
                value="Full Day"
                checked={duration === "Full Day"}
                onChange={(e) => setDuration(e.target.value)}
              />
              Full Day
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="duration"
                value="Half Day"
                checked={duration === "Half Day"}
                onChange={(e) => setDuration(e.target.value)}
              />
              Half Day
            </label>
          </div>
        <textarea
  placeholder="Chhutti ka reason likhiye..."
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  className="w-full p-2 border rounded-md"
  required
></textarea>

          <button
            type="submit"
            disabled={leaveLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {leaveLoading ? "Submitting..." : "Submit Leave Request"}
          </button>
          </form>

        {/* Balance (Static) */}
        <div className="bg-white p-6 rounded-lg border hover:shadow-md space-y-4">
  <h2 className="text-lg font-semibold">Leave Balance</h2>

  {Object.entries(totalLimits).map(([type, total]) => {
    const used = leaveUsage[type] || 0;
    const percent = Math.min((used / total) * 100, 100);

    return (
      <div key={type}>
        <div className="flex justify-between text-sm">
          <span>{type}</span>
          <span>{used}/{total} days</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className={`h-2 rounded-full ${colorMap[type]}`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  })}
        </div>

      </div>
       
      {/* Leave Table */}
      <LeaveTableWithFilters onLeaveCancelled={handleLeaveCancelled} />  
    </div>
  );
};




