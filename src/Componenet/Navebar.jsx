import { Bell, Menu, EllipsisVertical} from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

  const Navbar = ({ toggleSidebar, collapsed }) => {
  const { employee } = useSelector((state) => state.auth);
  // const employee = JSON.parse(localStorage.getItem("employee"));
  return (
    <header className="bg-white border-b px-6 py-2 fixed top-0 z-20 w-full flex justify-between items-center shadow-sm h-16">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-md border hover:bg-gray-200 transition"
          onClick={toggleSidebar}
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <div className="max-w-full sm:max-w-none">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
            Welcome back{employee?.fullName ? `, ${employee.fullName.split(" ")[0]}!` : "!"}
          </h1>
          <p className="hidden sm:block text-base text-gray-600">
            Here's what's happening with your work today.
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-2 transition-all duration-300 ${collapsed ? "lg:mr-[64px]" : "lg:mr-[256px]"}`}>
        <button className="p-2 rounded-full hover:bg-gray-200 transition">
          <Bell className="w-[18px] h-[18px] text-gray-700" />
        </button>
        <NavLink
          to="/profile"
         className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white">
        <img
          src={
            employee?.documents?.profileImage
              ? `https://hrms-backend-i9gs.onrender.com/uploads/${employee.documents.profileImage}`
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrmvSoqEMvs4E-TIgyfMdztZYEdKav-zok1A&s"
          }
          alt={employee?.fullName || "Profile"}
          className="w-9 h-9 rounded-full object-cover"
        />
        </NavLink>
        <button className="p-2 rounded-full hover:bg-gray-200 transition">
          <EllipsisVertical className="w-[20px] h-[20px] text-gray-700" />
        </button>

      </div>
    </header>
  );
};

export default Navbar;