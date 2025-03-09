import React from "react";

import DashboardLayout from "templates/LayoutContainers/DashboardLayout";
import DashboardNavbar from "templates/Navbars/DashboardNavbar";

const AccountManagementPage = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        <h1>Account Management Page</h1>
      </div>
    </DashboardLayout>
  );
};

export default AccountManagementPage;
