import React, { useEffect, useState } from "react";
import { CircleAlert, Clock, Circle, CircleCheck, Search } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks, getTasks } from "../ReduxToolkit/taskSlice";
import UpdateStatus from "./UpdateStatus";

export default function TaskHomePage() {

  const dispatch = useDispatch();
  const { tasks, allTasks, loading, totalPages } = useSelector((state) => state.tasks);

  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch Tasks
  useEffect(() => {
    const filters = {
      status: status === "All" ? "" : status,
      search: search.trim(),
      page: currentPage,
      limit: 5, // 👈 प्रति पेज 5 items
    };
    dispatch(getTasks(filters));
    dispatch(getAllTasks());
  }, [status, search, currentPage]);

  // Stats Calculation
  const total = allTasks.length;
  const pending = allTasks.filter((t) => t.status === "Pending").length;
  const inProgress = allTasks.filter((t) => t.status === "In Progress").length;
  const completed = allTasks.filter((t) => t.status === "Completed").length;

  const stats = [
    {
      title: "Total Tasks",
      count: total,
      color: "from-purple-500 to-purple-400",
      icon: <CircleAlert />,
    },
    {
      title: "Pending",
      count: pending,
      color: "from-gray-300 to-gray-200",
      icon: <Circle />,
    },
    {
      title: "In Progress",
      count: inProgress,
      color: "from-blue-500 to-blue-400",
      icon: <Clock />,
    },
    {
      title: "Completed",
      count: completed,
      color: "from-green-500 to-green-400",
      icon: <CircleCheck />,
    },
  ];

  return (
    <div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((item, idx) => (
          <div key={idx}
            className={`rounded-xl text-white p-5 shadow bg-gradient-to-r ${item.color}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <span className="p-2 rounded-lg bg-black/5 text-2xl">{item.icon}</span>
            </div>
            <p className="text-4xl font-bold mt-2">{item.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">

        <div className="flex gap-3">
          {["All", "Pending", "In Progress", "Completed"].map((tab, i) => (
            <button
              key={i}
              onClick={() => {
                setStatus(tab);
                setCurrentPage(1); // 👈 filter बदलने पर page 1
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium shadow duration-150 ${
                status === tab ? "bg-purple-600 text-white" : "bg-white text-gray-700 border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center bg-white border rounded-full px-4 py-2 w-64 shadow-sm">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // 👈 search पर भी page 1
            }}
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="w-full text-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3 font-semibold text-blue-700">Loading tasks...</p>
        </div>
      )}

      {/* Tasks */}
      <div className="flex flex-col gap-4">
        {tasks.map((task, idx) => (
          <div 
          onClick={() => {
            setSelectedTask(task);
            setOpen(true);
          }}
          key={idx} 
          className="bg-white p-5 rounded-xl shadow border hover:shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.01]">
            <div className="flex items-start">
              <div className="flex flex-col md:flex-row gap-2">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <div className="flex gap-2 mb-1 md:mb-0">
                <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {task.priority}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  task.status === "In Progress"
                    ? "bg-blue-100 text-blue-600"
                    : task.status === "Completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {task.status}
              </span>
              </div>
              </div>
              <div
              onClick={() => {
                setSelectedTask(task);
                setOpen(true);
              }} 
              className="text-black cursor-pointer text-xl hover:bg-gray-300 px-3 rounded-full ml-auto">⋮</div>
            </div>

            <p className="text-gray-600 text-sm mt-1">{task.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
              <div className="flex items-center gap-2">
                📅 Due Date : {new Date(task.dueDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                👤 Assigned To : {task.assignTo.fullName || "Human Resource (HR)"}
              </div>
            </div>
          </div>
        ))}

        {!loading && tasks.length === 0 && (
          <p className="text-center font-semibold text-gray-500 py-10">
            No tasks found...
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>

      </div>
      <UpdateStatus open={open} onClose={() => setOpen(false)} task={selectedTask} />
    </div>
  );
}
