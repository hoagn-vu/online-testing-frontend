import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import { setUser } from "./redux/authSlice";
import { useGetProfileQuery } from "./services/authApi";

import "bootstrap/dist/css/bootstrap.min.css";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import DefaultLayout from "./layouts/DefaultLayout/DefaultLayout";
import AccountPage from "./pages/AccountPage/AccountPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import HistoryCandidatePage from "./pages/HistoryCandidatePage/HistoryCandidatePage";
import HomeCandidate from "./pages/HomeCandidate/HomeCandidate";
import LogPage from "./pages/LogPage/LogPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import TakeExamPage from "./pages/TakeExamPage/TakeExamPage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import ResultCandidatePage from "./pages/ResultCandidatePage/ResultCandidatePage";
import QuestionManagementPage from "./pages/QuestionManagementPage/QuestionManagementPage";
import QuestionBankNamePage from "./pages/QuestionBankNamePage/QuestionBankNamePage";
import ListQuestionPage from "./pages/ListQuestionPage/ListQuestionPage";
import RoomManagementPage from "./pages/RoomManagementPage/RoomManagementPage";
import ExamMatrixPage from "./pages/ExamMatrixPage/ExamMatrixPage";
import DetailExamMatrixPage from "./pages/DetailExamMatrixPage/DetailExamMatrixPage";
import ExamManagementPage from "./pages/ExamManagementPage/ExamManagementPage";
import DetailExamPage from "./pages/DetailExamPage/DetailExamPage";
import OrganizeExamPage from "./pages/OrganizeExamPage/OrganizeExamPage";
import SesstionPage from "./pages/SesstionPage/SesstionPage";
import RoomOrganizePage from "./pages/RoomOrganizePage/RoomOrganizePage";
import CandidateOrganizePage from "./pages/CandidateOrganizePage/CandidateOrganizePage";
import SupervisorLayout from "./layouts/SupervisorLayout/SupervisorLayout";
import SupervisorHomePage from "./pages/SupervisorHomePage/SupervisorHomePage";
import MonitoringPage from "./pages/MonitoringPage/MonitoringPage";
import MonitorOrganizePage from "./pages/MonitorOrganizePage/MonitorOrganizePage";
import ScoreTableSessionPage from "./pages/ScoreTableSessionPage/ScoreTableSessionPage";
import ReportEachOrganizePage from "./pages/ReportEachOrganizePage/ReportEachOrganizePage";
import Admin2Layout from "./layouts/Admin2Layout/Admin2Layout";

import NotFound from "./pages/NotFound/NotFound";

import { selectIsAuthenticated, selectCurrentRole } from "./services/authSelectors";

function App() {
  const accessToken = useSelector((state) => state.auth.accessToken) || localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  const { data, isSuccess, isLoading } = useGetProfileQuery(undefined, {
    skip: !accessToken,
  });

  const role = useSelector(selectCurrentRole);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(data));
    }
  }, [isSuccess, data, dispatch]);


  // const ProtectedRoute = ({ children }) => {
  //   if (!accessToken) return <Navigate to="/" />;
  //   if (!isSuccess || isLoading) return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
  //     <div className="spinner-border text-primary" role="status">
  //       <span className="visually-hidden">Loading...</span>
  //     </div>
  //   </div>
  
  //   return children;
  // };

  // const AdminRoute = ({ children }) => {
  //   if (!isSuccess || isLoading) return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
  //     <div className="spinner-border text-primary" role="status">
  //       <span className="visually-hidden">Loading...</span>
  //     </div>
  //   </div>

  //   if (accessToken && role === "admin") {
  //     return children;
  //   } else {
  //     return <Navigate to="/not-found" />;
  //   }
  // };

  // const CandidateRoute = ({ children }) => {
  //   if (!isSuccess || isLoading) return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
  //     <div className="spinner-border text-primary" role="status">
  //       <span className="visually-hidden">Loading...</span>
  //     </div>
  //   </div>
    
  //   if (accessToken && role === "candidate") {
  //     return children;
  //   } else {
  //     return <Navigate to="/not-found" />;
  //   }
  // };

  const ProtectedRoute = ({ allowedRoles, children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRole = useSelector(selectCurrentRole);
  
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
  
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/not-found" replace />;
    }
  
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/not-found" element={<NotFound />} />
      </Routes>
      <Routes>
        <Route 
          path="/staff" 
          element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin2Layout />
            </ProtectedRoute>
          }
        >
          <Route path="accountmanage" element={<AccountPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="organize" element={<OrganizeExamPage />} />
          <Route path="organize/report/:organizeId" element={<ReportEachOrganizePage />} />
          <Route path="organize/:id" element={<SesstionPage />} />
          <Route path="organize/:organizeId/:sessionId" element={<RoomOrganizePage />} />
          <Route path="organize/monitor/:organizeId/:sessionId" element={<MonitorOrganizePage />} />
          <Route path="organize/score/:organizeId/:sessionId" element={<ScoreTableSessionPage />} />
          <Route path="organize/:organizeId/:sessionId/:roomId" element={<CandidateOrganizePage />} />
          <Route path="question" element={<QuestionManagementPage />}/>
          <Route path="question/:subject" element={<QuestionBankNamePage />} />
          <Route path="question/:subject/:questionBankId" element={<ListQuestionPage />} />
          <Route path="matrix-exam" element={<ExamMatrixPage />} />
          <Route path="matrix-detail" element={<DetailExamMatrixPage />} />
          <Route path="exam" element={<ExamManagementPage />} />
          <Route path="exam/:examId" element={<DetailExamPage />} />
          <Route path="room" element={<RoomManagementPage />} />
          <Route path="log" element={<LogPage />} />
        </Route>
      </Routes>

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
          <Route path="result" element={<ResultCandidatePage />} />
          <Route path="takexam" element={<TakeExamPage />} />
        </Route>
      </Routes>

      <Routes>
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route path="home" element={<SupervisorHomePage />} /> 
          <Route path="monitor" element={<MonitoringPage />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
