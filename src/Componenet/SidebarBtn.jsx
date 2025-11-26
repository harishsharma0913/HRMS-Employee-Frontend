import { NavLink } from "react-router-dom";

const SidebarBtn = ({ icon, label, to, onClick, collapsed }) => {
  const isLogout = label === "Log Out";
  const commonClasses =
    "w-full flex items-center px-3 font-bold py-2 text-sm rounded-md transition text-gray-800";
  const labelClasses = `text-[15px] pl-2 ${collapsed ? "hidden" : "block"}`;

  if (isLogout) {
    return (
      <button
        onClick={onClick}
        className={`${commonClasses} hover:bg-gray-200 gap-2`}
        title={collapsed ? label : ""}
      >
        <span>{icon}</span>
        <p className={labelClasses}>{label}</p>
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${commonClasses} gap-2 ${
          isActive ? "bg-gray-200 text-gray-700" : "hover:bg-gray-200 text-gray-700"
        }`
      }
      title={collapsed ? label : ""}
    >
      <span>{icon}</span>
      <p className={labelClasses}>{label}</p>
    </NavLink>
  );
};

export default SidebarBtn;