import React from "react";

import DashboardLayout from "templates/LayoutContainers/DashboardLayout";
import DashboardNavbar from "templates/Navbars/DashboardNavbar";

const SystemLogPage = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        <h1>System Log Page</h1>
      </div>
    </DashboardLayout>
  );
};

export default SystemLogPage;
