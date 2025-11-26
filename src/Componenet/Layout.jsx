import { useState } from "react";
import Sidebar from './Sidebar';
import Navbar from './Navebar';
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 bg-white border-r
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:static 
          ${collapsed ? "w-16" : "w-64"}`}
      >
        <Sidebar
          closeSidebar={() => setSidebarOpen(false)}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* Page Content */}
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={() => setSidebarOpen(true)} collapsed={collapsed} />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;