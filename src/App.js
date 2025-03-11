import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <Router>
      {" "}
      {/* Thêm BrowserRouter */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
      </Routes>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="accountmanage" element={<AccountPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="question" element={<QuestionManagementPage />}/>
          <Route path="question/:subject" element={<QuestionBankNamePage />} />
          <Route path="listquestion" element={<ListQuestionPage />} />
          <Route path="room" element={<RoomManagementPage />} />
          <Route path="log" element={<LogPage />} />
        </Route>
      </Routes>
      <Routes>
        <Route path="/candidate" element={<DefaultLayout />}>
          <Route path="home" element={<HomeCandidate />} />
          <Route path="history" element={<HistoryCandidatePage />} />
          <Route path="result" element={<ResultCandidatePage />} />
          <Route path="takexam" element={<TakeExamPage />} />
        </Route>
      </Routes>
      <Routes>
        
      </Routes>
    </Router>
  );
}

export default App;
