import TopStats from "./Dashboard/TopStats";
import LeaveSummary from "./Dashboard/LeaveSummary";
import TasksList from "./Dashboard/TasksList";
import SupportTickets from "./Dashboard/SupportTickets";
import RecentDocuments from "./Dashboard/RecentDocuments";
import RecentActivities from "./Dashboard/RecentActivities";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks } from "./ReduxToolkit/taskSlice";
import {
  fetchEmployeeData,
  getMyLeaves,
  getMyTickets,
} from "./ReduxToolkit/authSlice";

const Home = () => {
  const dispatch = useDispatch();

  const { allTasks, allTaskLoading } = useSelector(
    (state) => state.tasks
  );

  const {
    employee,
    leaves,
    tickets,
    loading,
    ticketLoading,
    leaveLoading,
  } = useSelector((state) => state.auth);

  const emp =
    employee || JSON.parse(localStorage.getItem("employee"));
  const empId = emp?._id || emp?.id;

  useEffect(() => {
    if (empId) {
      dispatch(getAllTasks());
      dispatch(getMyLeaves({ empId }));
      dispatch(getMyTickets(empId));
      dispatch(fetchEmployeeData());
    }
  }, [dispatch, empId]);

  // ✅ Combine all loading states
  const isPageLoading =
    allTaskLoading || loading || ticketLoading || leaveLoading;

  const RecentDocumentsData = employee?.documents || [];

  return (
    <div className="bg-gray-100 min-h-screen relative">
      {isPageLoading ? (
        // 🔄 PAGE KE ANDAR LOADER
        <div className="flex items-center justify-center h-[70vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">
              Dashboard loading...
            </p>
          </div>
        </div>
      ) : (
        // ✅ PAGE CONTENT
        <div className="space-y-6">
          <TopStats
            tasks={allTasks}
            leaves={leaves}
            tickets={tickets}
            documents={employee}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeaveSummary leaves={leaves} />
            <TasksList tasks={allTasks} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SupportTickets tickets={tickets} />
            <RecentDocuments documents={RecentDocumentsData} />
          </div>

          <RecentActivities
            tasks={allTasks}
            leaves={leaves}
            tickets={tickets}
            documents={employee}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
