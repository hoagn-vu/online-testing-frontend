/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Soft UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

import React from "react";

// Soft UI Dashboard React layouts
import DashboardPage from "modules/Dashboard/pages/DashboardPage";
import AccountManagementPage from "modules/AccountManagement/pages/AccountManagementPage";
import OrganizeExamPage from "modules/OrganizeExam/pages/OrganizeExamPage";
import QuestionBankPage from "modules/QuestionBank/pages/QuestionBankPage";
import ExamMatrixPage from "modules/ExamMatrix/pages/ExamMatrixPage";
import ExamManagementPage from "modules/ExamManagement/pages/ExamManagementPage";
import RoomManagementPage from "modules/RoomManagement/pages/RoomManagementPage";
import SystemLogPage from "modules/SystemLog/pages/SystemLogPage";

import LoginPage from "modules/Login/pages/LoginPage";
import CandidateHomePage from "modules/CandidateHome/pages/CandidateHomePage";
import ExamHistoryPage from "modules/ExamHistory/pages/ExamHistoryPage";
import TakeExamPage from "modules/TakeExam/pages/TakeExamPage";

import DashboardTemplate from "pages-template/dashboard-template";
import Tables from "pages-template/tables";
import Billing from "pages-template/billing";

// Soft UI Dashboard React icons
import Shop from "templates/Icons/Shop";
import Office from "templates/Icons/Office";
import Document from "templates/Icons/Document";
import Documents from "templates/Icons/Documents";
import CustomerSupport from "templates/Icons/CustomerSupport";
import CreditCard from "templates/Icons/CreditCard";
import UserConfig from "templates/Icons/UserConfig";
import File from "templates/Icons/File";
import Dashboard from "templates/Icons/Dashboard";
import Exam from "templates/Icons/Exam";

const routes = [
  // Routes cho các trang không trên sidebar
  { type: "page", route: "/", component: <LoginPage /> },
  { type: "page", route: "/candidate", component: <CandidateHomePage /> },
  { type: "page", route: "/history", component: <ExamHistoryPage /> },
  { type: "page", route: "/take-exam", component: <TakeExamPage /> },

  // Routes cho các trang trên sidebar
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Dashboard size="12px" />,
    component: <DashboardPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý tài khoản",
    key: "account-management",
    route: "/account-management",
    icon: <UserConfig size="14px" />,
    component: <AccountManagementPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý kỳ thi",
    key: "organize-exam",
    route: "/organize-exam",
    icon: <Exam size="12px" />,
    component: <OrganizeExamPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Ngân hàng câu hỏi",
    key: "question-bank",
    route: "/question-bank",
    icon: <File size="12px" />,
    component: <QuestionBankPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Ma trận đề thi",
    key: "exam-matrix",
    route: "/exam-matrix",
    icon: <Document size="12px" />,
    component: <ExamMatrixPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý đề thi",
    key: "exam-management",
    route: "/exam-management",
    icon: <Documents size="12px" />,
    component: <ExamManagementPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý phòng thi",
    key: "room-management",
    route: "/room-management",
    icon: <Office size="12px" />,
    component: <RoomManagementPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Nhật ký hệ thống",
    key: "system-log",
    route: "/system-log",
    icon: <CustomerSupport size="14px" />,
    component: <SystemLogPage />,
    noCollapse: true,
  },

  { type: "title", title: "Template tham khảo", key: "temp-tham-khao" },
  {
    type: "collapse",
    name: "Dashboard-Template",
    key: "dashboard-template",
    route: "/dashboard-template",
    icon: <Shop size="12px" />,
    component: <DashboardTemplate />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    route: "/tables",
    icon: <Office size="12px" />,
    component: <Tables />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: <Billing />,
    noCollapse: true,
  },
];

export default routes;
