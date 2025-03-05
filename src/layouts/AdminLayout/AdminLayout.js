import avatar from "../../assets/images/avar.jpg";
import logo from "../../assets/logo/logo.png";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
// Import Outlet
import "./AdminLayout.css";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="admin-layout">
      <Header username="Phương Linh" avatarUrl={avatar} logoUrl={logo} />
      <div className="admin-main">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
