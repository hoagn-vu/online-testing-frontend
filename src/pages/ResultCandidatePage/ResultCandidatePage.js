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
            {/* Nếu chưa chọn, hiển thị 2 nút */}
            {view === null && (
                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-success" onClick={() => setView("OK")}>OK</button>
                    <button className="btn btn-danger" onClick={() => setView("NotOK")}>Not OK</button>
                </div>
            )}

            {/* Form kết quả bình thường khi chọn OK */}
            {view === "OK" && (
                <div className="result-content">
                    <h4 className="pb-2 text-center">Kết quả thi</h4>
                    <p><strong>Kỳ thi:</strong> {examResult.examName}</p>
                    <p><strong>Môn thi:</strong> {examResult.subject}</p>
                    <p><strong>Thí sinh:</strong> {examResult.candidateName} - {examResult.candidateId}</p>
                    <p><strong>Thời gian hoàn thành:</strong> {examResult.completionTime}</p>
                    <p><strong>Số câu đúng:</strong> {examResult.correctAnswers}/{examResult.totalQuestion}</p>
                    <p><strong>Điểm thi:</strong> {examResult.score}</p>
                    <p><strong>Số lần rời khỏi màn hình:</strong> {examResult.leaveCount}</p>
                    <div className="text-center">
                        <a href="/candidate/home" className="btn btn-primary">Về trang chủ</a>
                    </div>
                </div>
            )}

            {/* Form hủy bài thi khi chọn NotOK */}
            {view === "NotOK" && (
                <div className="result-ne-content text-center">
                    <h4 className="pb-2">Kết quả thi</h4>
                    <p>Thí sinh: <strong>{examResult.candidateName}</strong> bị hủy thi với lý do sau:</p>
                    <p>{examResult.subject}</p>
                    <p>Mọi thắc mắc xin liên hệ giám thị coi thi</p>
                    <div className="text-center">
                        <a href="/candidate/home" className="btn btn-primary">Về trang chủ</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultCandidatePage;
