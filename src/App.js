import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
import AccountPage from "./pages/AccountPage/AccountPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import HistoryCandidatePage from "./pages/HistoryCandidatePage/HistoryCandidatePage";
import HomeCandidate from "./pages/HomeCandidate/HomeCandidate";
import LogPage from "./pages/LogPage/LogPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import TakeExamPage from "./pages/TakeExamPage/TakeExamPage";
import ResultCandidatePage from "./pages/ResultCandidatePage/ResultCandidatePage";
import SubjectPage from "./pages/SubjectPage/SubjectPage";
import QuestionBankPage from "./pages/QuestionBankPage/QuestionBankPage";
import ListQuestionPage from "./pages/ListQuestionPage/ListQuestionPage";
import RoomManagementPage from "./pages/RoomManagementPage/RoomManagementPage";
import ExamMatrixPage from "./pages/ExamMatrixPage/ExamMatrixPage";
import DetailExamMatrixPage from "./pages/DetailExamMatrixPage/DetailExamMatrixPage";
import ExamManagementPage from "./pages/ExamManagementPage/ExamManagementPage";
import DetailExamPage from "./pages/DetailExamPage/DetailExamPage";
import OrganizeExamPage from "./pages/OrganizeExamPage/OrganizeExamPage";
import SessionPage from "./pages/SessionPage/SessionPage";
import RoomOrganizePage from "./pages/RoomOrganizePage/RoomOrganizePage";
import CandidateOrganizePage from "./pages/CandidateOrganizePage/CandidateOrganizePage";
import SupervisorLayout from "./layouts/SupervisorLayout/SupervisorLayout";
import SupervisorHomePage from "./pages/SupervisorHomePage/SupervisorHomePage";
import MonitoringPage from "./pages/MonitoringPage/MonitoringPage";
import MonitorOrganizePage from "./pages/MonitorOrganizePage/MonitorOrganizePage";
import ScoreTableSessionPage from "./pages/ScoreTableSessionPage/ScoreTableSessionPage";
import ReportEachOrganizePage from "./pages/ReportEachOrganizePage/ReportEachOrganizePage";
import Admin2Layout from "./layouts/Admin2Layout/Admin2Layout";
import ExamCreationPage from "./pages/AddOrganizeExam/AddOrganizeExam";
import NotFound from "./pages/NotFound/NotFound";
import GroupUserPage from "./pages/GroupUserPage/GroupUserPage";
import ListUserInGroup from "./pages/ListUserInGroup/ListUserInGroup";

import WelcomePage from "./pages/WelcomePage/WelcomePage";

import { authApi, useGetProfileQuery } from "./services/authApi";
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from "prop-types";
import { setUser } from './redux/authSlice';

import Login2 from "./pages/Login2/Login2";
import LevelManagement from "./pages/LevelManagement/LevelManagement";
import RoomTest from "./pages/RoomTest/RoomTest";
import CandidateExamResult from "./pages/CandidateExamResult/CandidateExamResult";
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage";
import SupvChangePasswordPage from "./pages/SupvChangePasswordPage/SupvChangePasswordPage";
import CandidateExamResultTest from "./pages/CandidateExamResult/CandidateExamResult_test";
import AutoStatisticPage from "./pages/AutoStatisticPage/AutoStatisticPage";
import GenerateExamFromMatrixPage from "./pages/GenerateExamFromMatrixPage/GenerateExamFromMatrixPage";
import routesConfig from "./routesConfig";

function App() {
  const accessToken = useSelector((state) => state.auth.accessToken) || localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (accessToken && !user) {  // Chỉ gọi API nếu chưa có user
      dispatch(authApi.endpoints.getProfile.initiate())
        .unwrap()
        .then((data) => dispatch(setUser(data)))
        .catch((error) => console.error('Failed to fetch profile', error));
    }
  }, [accessToken, user, dispatch]);

  const ProtectedRoute = ({ allowedRoles, children }) => {
    // const { user, accessToken } = useSelector((state) => state.auth);
    const { isFetching } = useGetProfileQuery(undefined, {
      skip: !accessToken, // Chỉ gọi API nếu có accessToken
    });
  
    // Nếu API `/profile` đang lấy dữ liệu, hiển thị loading (tránh redirect sai)
    if (isFetching) return <p>Loading...</p>;
  
    if (!user) {
      return <Navigate to="/" />;
    }
  
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/not-found" />;
    }
  
    return children;
  };
  ProtectedRoute.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
    children: PropTypes.node.isRequired,
  };

  return (
    /*<Router>

      <Routes>
        <Route path="/" element={<Login2 />} /> 
        <Route path="/not-found" element={<NotFound />} /> 
        <Route path="/test" element={<WelcomePage />} />
      </Routes>
      <Routes>
      {Object.entries(routesConfig).map(([role, routes]) => (
          <Route 
            key={role}
            path={`/${role}`} 
            element={
              <ProtectedRoute allowedRoles={[role]}>
                {role === "candidate" 
                  ? <DefaultLayout /> 
                  : role === "supervisor"
                    ? <SupervisorLayout />
                    : <Admin2Layout />}
              </ProtectedRoute>
            }
          >
            {routes.map(({ path, element, index }) => (
              <Route 
                key={path} 
                path={path} 
                index={index} 
                element={element} 
              />
            ))}
          </Route>
        ))}
      </Routes>
    </Router>*/
    <Router>
      <Routes>
        <Route path="/" element={<Login2 />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/test" element={<WelcomePage />} />
      </Routes>

      <Routes>
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin2Layout />
            </ProtectedRoute>
          }
        >
          {/* <Route path="accountmanage" element={<AccountPage />} /> */}
          {/* <Route path="groupuser" element={<GroupUserPage />} /> */}
          <Route path="log" element={<LogPage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="/staff" element={<Admin2Layout />}>
          <Route path="accountmanage" 
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route path="groupuser" 
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <GroupUserPage />
              </ProtectedRoute>
            }
          />
          <Route path="groupuser/:groupuserId" 
            element={
              <ProtectedRoute allowedRoles={["staff", "admin"]}>
                <ListUserInGroup />
              </ProtectedRoute>
            }
          />
          <Route path="dashboard" 
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="organize">
            <Route index 
              element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <OrganizeExamPage />
              </ProtectedRoute>
            }
          />
            <Route path=":organizeId" 
              element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <SessionPage />
              </ProtectedRoute>
            }
          />
          </Route>
          <Route path="organize/statistic-auto/:organizeExamId" 
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <AutoStatisticPage />
              </ProtectedRoute>
            }
          />
          <Route path="organize/report/:organizeExamId" 
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <ReportEachOrganizePage />
              </ProtectedRoute>
            }
          />
          <Route path="organize/:organizeId/:sessionId" 
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <RoomOrganizePage />
              </ProtectedRoute>
            }
          />
          <Route path="organize/monitor/:organizeId/:sessionId" 
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <MonitorOrganizePage />
              </ProtectedRoute>
            }
          />
          <Route path="organize/score/:organizeId/:sessionId/:roomId" 
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <ScoreTableSessionPage />
              </ProtectedRoute>
            }
          />
          <Route path="organize/:organizeId/:sessionId/:roomId" 
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <CandidateOrganizePage />
              </ProtectedRoute>
            }
          />
          <Route path="organize/:organizeId/:sessionId/:roomId/:candidateId" 
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <CandidateExamResultTest />
              </ProtectedRoute>
            }
          />
          <Route path="question" 
            element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <SubjectPage />
              </ProtectedRoute>
            }
          />
          <Route path="question/:subjectId" 
           element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <QuestionBankPage />
              </ProtectedRoute>
            }
          />
          <Route path="question/:subjectId/:questionBankId" 
           element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <ListQuestionPage />
              </ProtectedRoute>
            }
          />
          <Route path="matrix-exam" 
           element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <ExamMatrixPage />
              </ProtectedRoute>
            }
          />
          <Route path="exam/generate-exam-matrix" 
           element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <GenerateExamFromMatrixPage />
              </ProtectedRoute>
            }
          />
          <Route path="matrix-exam/matrix-detail" 
           element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <DetailExamMatrixPage />
              </ProtectedRoute>
            }
          />
          <Route path="exam" 
           element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <ExamManagementPage />
              </ProtectedRoute>
            }
          />
          <Route path="exam/:examId" 
           element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <DetailExamPage />
              </ProtectedRoute>
            }
          />
          <Route path="room" 
           element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <RoomTest />
              </ProtectedRoute>
            }
          />
          <Route path="level" 
           element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <LevelManagement />
              </ProtectedRoute>
            }
          />
          <Route path="change-password" 
           element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />
          <Route path="statistic-auto" 
           element={
              <ProtectedRoute allowedRoles={["lecturer", "staff"]}>
                <AutoStatisticPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>

      {/* <Routes>
        <Route 
          path="/lecturer" 
          element={<Admin2Layout />}
        >
          <Route path="question" element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <SubjectPage />
            </ProtectedRoute>
          }/>
          <Route path="question/:subjectId" element={<QuestionBankPage />} />
          <Route path="question/:subjectId/:questionBankId" element={<ListQuestionPage />} />
          <Route path="matrix-exam" element={<ExamMatrixPage />} />
          <Route path="exam/generate-exam-matrix" element={<GenerateExamFromMatrixPage />} />
          <Route path="matrix-exam/matrix-detail" element={<DetailExamMatrixPage />} />
          <Route path="exam" element={<ExamManagementPage />} />
          <Route path="exam/:examId" element={<DetailExamPage />} />
          <Route path="level" element={<LevelManagement />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>
      </Routes> */}

      <Routes>
        <Route 
          path="/candidate" 
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <DefaultLayout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<HomeCandidate />} />
          <Route path="history" element={<HistoryCandidatePage />} />
          <Route path="result/:takeExamId" element={<ResultCandidatePage />} />
          <Route path="take-exam/:organizeExamId/:sessionId/:roomId/:takeExamId" element={<TakeExamPage />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="/supervisor" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorLayout />
          </ProtectedRoute>
        }>
          <Route path="home" element={<SupervisorHomePage />} />
          <Route path="monitor/:organizeExamId/:sessionId/:roomId" element={<MonitoringPage />} />
          <Route path="change-passwords" element={<SupvChangePasswordPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
