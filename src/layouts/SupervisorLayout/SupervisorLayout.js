import avatar from "../../assets/images/avar.jpg";
import logo from "../../assets/logo/logo.png";
import React from "react";
import { Outlet } from "react-router-dom";
import HeaderSupervisor from "../../components/HeaderSupervisor/HeaderSupervisor";
// Import Outlet

const SupervisorLayout = () => {
  return (
    <div>
      <HeaderSupervisor
        username="Phương Linh"
        avatarUrl={avatar}
        logoUrl={logo}
      />
      <div className="candi-main">
        <div className="main-content-candi">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SupervisorLayout;
