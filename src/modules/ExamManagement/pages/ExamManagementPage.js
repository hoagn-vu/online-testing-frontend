import React from "react";

import DashboardLayout from "templates/LayoutContainers/DashboardLayout";
import DashboardNavbar from "templates/Navbars/DashboardNavbar";

const ExamManagementPage = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        <h1>Exam Management Page</h1>
      </div>
    </DashboardLayout>
  );
};

export default ExamManagementPage;
