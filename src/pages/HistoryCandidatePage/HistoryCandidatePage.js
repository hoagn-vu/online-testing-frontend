import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HistoryCandidatePage.css";
import { useSelector } from "react-redux";
import ApiService from '../../services/apiService';
import { FaHistory } from "react-icons/fa";

const HistoryCandidatePage = () => {
  const userId = useSelector((state) => state.auth.user.id);
  const [examHistory, setExamHistory] = React.useState([]);

  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        const response = await ApiService.get(`/process-take-exams/${userId}/take-exam-history`);
        setExamHistory(response.data.items);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử thi:", error);
      }
    };

    fetchExamHistory();
  }, [userId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', options);
  };

  const getScoreBadge = (score) => {
    if (score >= 8) return "badge bg-success";
    if (score >= 5) return "badge bg-warning text-dark";
    return "badge bg-danger";
  };

  return (
    <div className="history-page">
      <div className="container container-history">
        <div className="history-card shadow-lg">
          <h2 className="text-center mb-4 d-flex align-items-center justify-content-center">
            <FaHistory className="me-2 text-primary" /> Lịch sử thi
          </h2>

          <div className="table-responsive">
            <table className="exam-history-table table table-hover align-middle">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Kỳ thi</th>
                  <th className="text-center">Môn thi</th>
                  <th className="text-center">Điểm số</th>
                  <th className="text-center">Ngày thực hiện</th>
                  <th>Chú thích</th>
                </tr>
              </thead>
              <tbody>
                {examHistory.map((exam, index) => (
                  <tr key={exam.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{exam.organizeExamName}</td>
                    <td className="text-center">{exam.subjectName}</td>
                    <td className="text-center">
                      <span className={getScoreBadge(exam.totalScore)}>
                        {exam.totalScore.toFixed(2)}
                      </span>
                    </td>
                    <td className="text-center">{formatDate(exam.finishedAt)}</td>
                    <td className={exam.note ? "text-danger fw-semibold" : "text-muted"}>
                      {exam.note || "—"}
                    </td>
                  </tr>
                ))}
                {examHistory.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      Chưa có dữ liệu lịch sử thi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCandidatePage;
