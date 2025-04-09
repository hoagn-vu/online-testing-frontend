import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ResultCandidatePage.css";

const ResultCandidatePage = ({ examResult, view, terminateReason }) => {
  if (!examResult) return <p>Đang tải kết quả...</p>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="result-candidate-container">
      {view === "OK" && (
        <div className="result-content">
          <h4 className="pb-2 text-center">Kết quả thi</h4>
          <p><strong>Kỳ thi:</strong> {examResult.organizeExamName}</p>
          <p><strong>Thí sinh:</strong> {examResult.candidateName} - {examResult.candidateCode}</p>
          <p><strong>Điểm thi:</strong> {examResult.totalScore}</p>
          <p><strong>Số câu đúng:</strong> {examResult.correctAnswers} / {examResult.totalQuestions}</p>
          <p><strong>Thời gian hoàn thành:</strong> {formatDate(examResult.finishedAt)}</p>
          <div className="text-center">
            <a href="/candidate/home" className="btn btn-primary">Về trang chủ</a>
          </div>
        </div>
      )}

      {view === "NotOK" && (
        <div className="result-ne-content text-center">
          <h4 className="pb-2">Kết quả thi</h4>
          <p>Thí sinh: <strong>{examResult.candidateName}</strong> bị hủy thi với lý do sau:</p>
          <p>{terminateReason}</p>
          <p>Mọi thắc mắc xin liên hệ giám thị coi thi</p>
          <div className="text-center">
            <a href="/candidate/home" className="btn btn-primary">Về trang chủ</a>
          </div>
        </div>
      )}
    </div>
  );
};

ResultCandidatePage.propTypes = {
  examResult: PropTypes.shape({
    examName: PropTypes.string.isRequired,
    organizeExamName: PropTypes.string.isRequired,
    candidateName: PropTypes.string.isRequired,
    candidateId: PropTypes.string.isRequired,
    candidateCode: PropTypes.string.isRequired,
    completionTime: PropTypes.string.isRequired,
    finishedAt: PropTypes.string.isRequired,
    correctAnswers: PropTypes.number.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    totalScore: PropTypes.number.isRequired,
  }).isRequired,
  view: PropTypes.oneOf(["OK", "NotOK"]).isRequired,
  terminateReason: PropTypes.string,
};

export default ResultCandidatePage;
