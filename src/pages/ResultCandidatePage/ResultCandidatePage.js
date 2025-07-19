import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ResultCandidatePage.css";

const ResultCandidatePage = () => {
  const [view, setView] = useState(null); // Trạng thái hiển thị form

  const examResult = {
    examName: "Kỳ thi cuối kỳ",
    subject: "Toán cao cấp",
    candidateName: "Phương Linh",
    candidateId: "BIT220089",
    completionTime: "12:30 - 15/03/2025",
    score: 9.5,
    correctAnswers: 28,
    totalQuestion: 30,
    leaveCount: 1
  };

  return (
    <div className="result-candidate-container">
  {view === null && (
    <div className="result-choice-container">
      <h3 className="choice-title">Xác nhận kết quả thi</h3>
      <p className="choice-subtitle">Bạn có muốn giữ kết quả thi hay hủy bài thi?</p>
      <div className="choice-buttons">
        <button className="btn btn-ok" onClick={() => setView("OK")}>
          <i className="fas fa-check-circle me-2"></i> OK
        </button>
        <button className="btn btn-not-ok" onClick={() => setView("NotOK")}>
          <i className="fas fa-times-circle me-2"></i> Not OK
        </button>
      </div>
    </div>
  )}

  {view === "OK" && (
    <div className="result-content">
      <h4 className="result-title text-center">
        <i className="fas fa-award me-2 text-success"></i> Kết quả thi
      </h4>
      <div className="result-details">
        <p><strong>Kỳ thi:</strong> {examResult.examName}</p>
        <p><strong>Môn thi:</strong> {examResult.subject}</p>
        <p><strong>Thí sinh:</strong> {examResult.candidateName} - {examResult.candidateId}</p>
        <p><strong>Thời gian hoàn thành:</strong> {examResult.completionTime}</p>
        <p><strong>Số câu đúng:</strong> <span className="text-success fw-bold">{examResult.correctAnswers}</span>/{examResult.totalQuestion}</p>
        <p><strong>Điểm thi:</strong> <span className="score-badge">{examResult.score}</span></p>
        <p><strong>Số lần rời khỏi màn hình:</strong> <span className="text-danger">{examResult.leaveCount}</span></p>
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
        <i className="fas fa-ban me-2"></i> Kết quả thi bị hủy
      </h4>
      <p><strong>Môn:</strong> {examResult.subject}</p>
      <p>Thí sinh <strong>{examResult.candidateName}</strong> đã bị <span className="text-danger fw-bold">hủy thi</span> với lý do:</p>
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
