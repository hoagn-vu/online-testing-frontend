import AccountPage from "./pages/AccountPage/AccountPage";
import GroupUserPage from "./pages/GroupUserPage/GroupUserPage";
import ListUserInGroup from "./pages/ListUserInGroup/ListUserInGroup";
import Dashboard from "./pages/Dashboard/Dashboard";
import SubjectPage from "./pages/SubjectPage/SubjectPage";
import QuestionBankPage from "./pages/QuestionBankPage/QuestionBankPage";
import ListQuestionPage from "./pages/ListQuestionPage/ListQuestionPage";
import ExamMatrixPage from "./pages/ExamMatrixPage/ExamMatrixPage";
import DetailExamMatrixPage from "./pages/DetailExamMatrixPage/DetailExamMatrixPage";
import ExamManagementPage from "./pages/ExamManagementPage/ExamManagementPage";
import DetailExamPage from "./pages/DetailExamPage/DetailExamPage";
import OrganizeExamPage from "./pages/OrganizeExamPage/OrganizeExamPage";
import SessionPage from "./pages/SessionPage/SessionPage";
import RoomOrganizePage from "./pages/RoomOrganizePage/RoomOrganizePage";
import CandidateOrganizePage from "./pages/CandidateOrganizePage/CandidateOrganizePage";
import CandidateExamResultTest from "./pages/CandidateExamResult/CandidateExamResult_test";
import MonitorOrganizePage from "./pages/MonitorOrganizePage/MonitorOrganizePage";
import ScoreTableSessionPage from "./pages/ScoreTableSessionPage/ScoreTableSessionPage";
import ReportEachOrganizePage from "./pages/ReportEachOrganizePage/ReportEachOrganizePage";
import RoomTest from "./pages/RoomTest/RoomTest";
import LevelManagement from "./pages/LevelManagement/LevelManagement";
import AutoStatisticPage from "./pages/AutoStatisticPage/AutoStatisticPage";
import GenerateExamFromMatrixPage from "./pages/GenerateExamFromMatrixPage/GenerateExamFromMatrixPage";
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage";
import LogPage from "./pages/LogPage/LogPage";
import HomeCandidate from "./pages/HomeCandidate/HomeCandidate";
import HistoryCandidatePage from "./pages/HistoryCandidatePage/HistoryCandidatePage";
import ResultCandidatePage from "./pages/ResultCandidatePage/ResultCandidatePage";
import TakeExamPage from "./pages/TakeExamPage/TakeExamPage";
import SupervisorHomePage from "./pages/SupervisorHomePage/SupervisorHomePage";
import MonitoringPage from "./pages/MonitoringPage/MonitoringPage";
import SupvChangePasswordPage from "./pages/SupvChangePasswordPage/SupvChangePasswordPage";

const sharedRoutes = {
  question: [
    { path: "question", element: <SubjectPage /> },
    { path: "question/:subjectId", element: <QuestionBankPage /> },
    { path: "question/:subjectId/:questionBankId", element: <ListQuestionPage /> },
    { path: "level", element: <LevelManagement /> },
  ],
  exam: [
    { path: "matrix-exam", element: <ExamMatrixPage /> },
    { path: "matrix-exam/matrix-detail", element: <DetailExamMatrixPage /> },
    { path: "exam/generate-exam-matrix", element: <GenerateExamFromMatrixPage /> },
    { path: "exam", element: <ExamManagementPage /> },
    { path: "exam/:examId", element: <DetailExamPage /> },
  ],
  changePassword: [
    { path: "change-password", element: <ChangePasswordPage /> },
  ],
};

const routesConfig = {
  admin: [
    { path: "accountmanage", element: <AccountPage /> },
    { path: "groupuser", element: <GroupUserPage /> },
    { path: "log", element: <LogPage /> },
    ...sharedRoutes.changePassword,
  ],
  staff: [
    { path: "accountmanage", element: <AccountPage /> },
    { path: "groupuser", element: <GroupUserPage /> },
    { path: "groupuser/:groupuserId", element: <ListUserInGroup /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "organize", element: <OrganizeExamPage />, index: true },
    { path: "organize/:organizeId", element: <SessionPage /> },
    { path: "organize/statistic-auto/:organizeExamId", element: <AutoStatisticPage /> },
    { path: "organize/report/:organizeExamId", element: <ReportEachOrganizePage /> },
    { path: "organize/:organizeId/:sessionId", element: <RoomOrganizePage /> },
    { path: "organize/monitor/:organizeId/:sessionId", element: <MonitorOrganizePage /> },
    { path: "organize/score/:organizeId/:sessionId/:roomId", element: <ScoreTableSessionPage /> },
    { path: "organize/:organizeId/:sessionId/:roomId", element: <CandidateOrganizePage /> },
    { path: "organize/:organizeId/:sessionId/:roomId/:candidateId", element: <CandidateExamResultTest /> },
    { path: "room", element: <RoomTest /> },
    { path: "change-password", element: <ChangePasswordPage /> },
    { path: "statistic-auto", element: <AutoStatisticPage /> },
    ...sharedRoutes.question,
    ...sharedRoutes.exam,
    ...sharedRoutes.changePassword,
  ],
  lecturer: [
    ...sharedRoutes.question,
    ...sharedRoutes.exam,
    ...sharedRoutes.changePassword,
  ],
  candidate: [
    { path: "home", element: <HomeCandidate /> },
    { path: "history", element: <HistoryCandidatePage /> },
    { path: "result/:takeExamId", element: <ResultCandidatePage /> },
    { path: "take-exam/:organizeExamId/:sessionId/:roomId/:takeExamId", element: <TakeExamPage /> }
  ],
  supervisor: [
    { path: "home", element: <SupervisorHomePage /> },
    { path: "monitor/:organizeExamId/:sessionId/:roomId", element: <MonitoringPage /> },
    { path: "change-password", element: <SupvChangePasswordPage /> },
  ],
};

export default routesConfig;
