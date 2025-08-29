import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ResultCandidatePage.css";
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import ApiService from '../../services/apiService';

const ResultCandidatePage = () => {
  const { takeExamId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.user.id);

  const [view, setView] = useState(null); // Trạng thái hiển thị form
  const [examResult, setExamResult] = useState(null);

  const fetchExamResult = async () => {
    try {
      const response = await ApiService.get(`/process-take-exams/exam-result?userId=${userId}&takeExamId=${takeExamId}`);
      if (response.data) {
        setExamResult(response.data.data);

        if (response.data.status === "done") {
          setView("OK");
        } else if (response.data.status === "terminated") {
          setView("NotOK");
        } else {
          navigate("/candidate/home");
        }
      }
    } catch (error) {
      console.error("Failed to fetch exam result:", error);
    }
  };

  useEffect(() => {
    fetchExamResult();
  }, [takeExamId, userId]);

  return (
    <div className="result-candidate-container">
      {view === null && (
        <div className="result-choice-container">
          <h3 className="choice-title">Loading...</h3>
          {/* <p className="choice-subtitle">Bạn có muốn giữ kết quả thi hay hủy bài thi?</p>
          <div className="choice-buttons">
            <button className="btn btn-ok" onClick={() => setView("OK")}>
              <i className="fas fa-check-circle me-2"></i> OK
            </button>
            <button className="btn btn-not-ok" onClick={() => setView("NotOK")}>
              <i className="fas fa-times-circle me-2"></i> Not OK
            </button>
          </div> */}
        </div>
      )}

      {view === "OK" && (
        <div className="result-content">
          <h4 className="result-title text-center">
            <i className="fas fa-award me-2 text-success"></i> Kết quả thi
          </h4>
          <div className="result-details">
            <p><strong>Kỳ thi:</strong> {examResult.organizeExamName}</p>
            <p><strong>Môn thi:</strong> {examResult?.subjectName}</p>
            <p><strong>Thí sinh:</strong> {examResult?.candidateName} - {examResult?.candidateCode}</p>
            <p><strong>Thời gian hoàn thành:</strong> {examResult?.finishedAt}</p>
            <p><strong>Số câu đúng:</strong> <span className="text-success fw-bold">{examResult?.correctAnswers}</span>/{examResult?.totalQuestions}</p>
            <p><strong>Điểm thi:</strong> <span className="score-badge">{examResult?.totalScore.toFixed(2)}</span></p>
            <p><strong>Số lần rời khỏi màn hình:</strong> <span className="text-danger">{examResult?.violationCount}</span></p>
          </div>
          <div className="text-center mt-5">
            <a href="/candidate/home" className="btn-home">
              <i className="fas fa-home me-2"></i> Về trang chủ
            </a>
          </div>
        </div>
      )}

      {view === "NotOK" && (
        <div className="result-ne-content text-center">
          <h4 className="result-title text-danger">
            <i className="fas fa-ban me-2"></i> Bài thi bị hủy
          </h4>
          <p><strong>Môn:</strong> {examResult?.subjectName}</p>
          <p>Thí sinh <strong>{examResult?.candidateName}</strong> đã bị <span className="text-danger fw-bold">hủy thi</span> với lý do:</p>
          <p className="text-muted">{examResult?.unrecognizedReason}</p>
          <p className="text-muted">Mọi thắc mắc vui lòng liên hệ giám thị coi thi.</p>
          <div className="text-center mt-5">
            <a href="/candidate/home" className="btn-home">
              <i className="fas fa-home me-2"></i> Về trang chủ
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCandidatePage;
