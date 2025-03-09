import React from "react";

import DashboardLayout from "templates/LayoutContainers/DashboardLayout";
import DashboardNavbar from "templates/Navbars/DashboardNavbar";

const RoomManagementPage = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        <h1>Room Management Page</h1>
      </div>
    </DashboardLayout>
  );
};

export default RoomManagementPage;
