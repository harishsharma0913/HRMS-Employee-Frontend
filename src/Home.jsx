import TopStats from "./Dashboard/TopStats";
import LeaveSummary from "./Dashboard/LeaveSummary";
import TasksList from "./Dashboard/TasksList";
import SupportTickets from "./Dashboard/SupportTickets";
import RecentDocuments from "./Dashboard/RecentDocuments";
import RecentActivities from "./Dashboard/RecentActivities";
import { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTasks } from "./ReduxToolkit/taskSlice";
import { fetchEmployeeData, getMyLeaves, getMyTickets } from "./ReduxToolkit/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const {allTasks} = useSelector((state) => state.tasks);
  const { employee, leaves, tickets } = useSelector((state) => state.auth);

  const RecentDocumentsData = employee.documents || [];
  console.log(employee);
  
  const emp = employee || JSON.parse(localStorage.getItem("employee"));
  const empId = emp?._id || emp?.id;

  useEffect(() => {
    dispatch(getAllTasks());
    dispatch(getMyLeaves({ empId: empId }));
    dispatch(getMyTickets(empId));
    dispatch(fetchEmployeeData());
  }, [dispatch]);
  return (
    <div className=" bg-gray-100 min-h-screen space-y-6">
      <TopStats tasks={allTasks} leaves={leaves} tickets={tickets} documents={employee} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeaveSummary leaves={leaves} />
        <TasksList tasks={allTasks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SupportTickets tickets={tickets} />
        <RecentDocuments documents={RecentDocumentsData} />
      </div>

      <RecentActivities tasks={allTasks} leaves={leaves} tickets={tickets} documents={employee} />
    </div>
  );
};

export default Home;
