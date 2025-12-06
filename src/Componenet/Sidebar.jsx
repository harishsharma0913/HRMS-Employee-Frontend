import {
  Calendar,
  HelpCircle ,
  FileText,
  Home,
  LogOut,
  Settings,
  Target,
  User,
  Users,
  BookType,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SidebarBtn from "./SidebarBtn";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import { useDispatch } from "react-redux";
import { logout } from "../ReduxToolkit/authSlice";
import { useToast } from "../Toast/ToastProvider";

const Sidebar = ({ closeSidebar, collapsed, setCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

    const handleLogout = async () => {
    const employee = JSON.parse(localStorage.getItem("employee"));

    try {
      // ✅ Logout API call to backend
      await api.post("/login/logout", { id: employee.id });

      // ✅ Clear local storage
      localStorage.clear(); 

      // ✅ Redirect to login
      dispatch(logout());
      navigate("/");

      // ✅ Optional: close sidebar
      closeSidebar?.();
    } catch (err) {
      console.error("Logout failed:", err);
      showToast("Logout failed:" + err, "error");
      
    }
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      className={`h-full bg-white border-r transition-all duration-300 relative space-y-6 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo + Collapse Button Section */}
      <div className="flex lg:justify-around relative mt-4 px-2">
        {!collapsed && (
          <div className=" flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[18px] text-gray-800">HRConnect</span>
          </div>
        )}

        {/* Collapse/Expand Button - only in laptop */}
        <div className="hidden lg:flex justify-end">
          <button
            onClick={toggleSidebar}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full shadow p-2"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>  

        {/* Close button (mobile only) */}
      <button
        onClick={closeSidebar}  
        className="absolute top-2 right-4 text-gray-600 hover:text-black lg:hidden"
        title="Close Sidebar"
      >
        <X className="w-5 h-5" />
      </button>
      </div>

      

      {/* Sidebar Menu Items */}
      <div className="space-y-2 px-[10px]">
        <SidebarBtn icon={<Home size={17} />} label="Dashboard" to="/home" collapsed={collapsed} />
        <SidebarBtn icon={<User size={17} />} label="My Profile" to="/profile" collapsed={collapsed} />
        <SidebarBtn icon={<Calendar size={17} />} label="Leave" to="/time-off" collapsed={collapsed} />
        <SidebarBtn icon={<HelpCircle size={17} />} label="Help" to="/help" collapsed={collapsed} />
        {/* <SidebarBtn icon={<BookOpen size={17} />} label="Learning" to="/learning" collapsed={collapsed} /> */}
        <SidebarBtn icon={<FileText size={17} />} label="Documents" to="/documents" collapsed={collapsed} />
        <SidebarBtn icon={<BookType size={17} />} label="Task" to="/task" collapsed={collapsed} />

        <div className=" border-t border-gray-300" />

        <SidebarBtn icon={<Settings size={17} />} label="Settings" to="/settings" collapsed={collapsed} />
        <SidebarBtn
          icon={<LogOut size={17} />}
          label="Log Out"
          onClick={handleLogout}
          collapsed={collapsed}
        />
      </div>
    </div>
  );
};

export default Sidebar;
