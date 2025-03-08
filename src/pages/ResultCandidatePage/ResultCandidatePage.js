import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ResultCandidatePage.css";

const ResultCandidatePage = () => {
    const [examResult] = useState({
        examName: "Kỳ thi cuối kỳ",
        subject: "Toán cao cấp",
        candidateName: "Phương Linh",
        candidateId: "BIT220089",
        completionTime: "12:30 - 15/03/2025",
        score: 9.5,
        correctAnswers: 28,
        totalQuestion: 30,
        leaveCount: 1
    });

    return (
        <div className="result-candidate-container">
            <div className="result-content">
                <h4 className="pb-2 justify-content-center d-flex">Kết quả thi</h4>
                <p><strong>Kỳ thi:</strong> {examResult.examName}</p>
                <p><strong>Môn thi:</strong> {examResult.subject}</p>
                <p><strong>Thí sinh:</strong> {examResult.candidateName} - {examResult.candidateId}</p>
                <p><strong>Thời gian hoàn thành:</strong> {examResult.completionTime}</p>
                <p><strong>Số câu đúng:</strong> {examResult.correctAnswers}/{examResult.totalQuestion}</p>
                <p><strong>Điểm thi:</strong> {examResult.score}</p>
                <p><strong>Số lần rời khỏi màn hình:</strong> {examResult.leaveCount}</p>
                <div className="justify-content-center d-flex pt-2">
                    <a href="/" className="btn-home ">Về trang chủ</a>
                </div>
            </div>
        </div>
    );
};

export default ResultCandidatePage;
