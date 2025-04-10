import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HistoryCandidatePage.css";
import { useSelector } from "react-redux";
import ApiService from "../../services/apiService";

const HistoryCandidatePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        const response = await ApiService.get(`/process-take-exams/${user.id}/exam-results`);
        const data = response.data;
        const mappedData = data.map((item, index) => ({
          id: index + 1,
          exam: item.organizeExamName || "Không rõ",
          subject: item.subjectName || "Không rõ",
          score: item.totalScore ?? 0,
          date: new Date(item.finishedAt).toLocaleString("vi-VN"),
          note: item.unrecognizedReason || "",
        }));

        setExamHistory(mappedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lịch sử thi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamResults();
  }, [user?.id]);

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <div className="container container-history justify-content-center d-flex">
        <div className="table-responsive tbl-history">
          <h2 className="text-center mb-4">Lịch sử thi</h2>
          {loading ? (
            <div className="text-center">Đang tải dữ liệu...</div>
          ) : (
            <table className="exam-history-table table table-striped">
              <thead className="bg-light">
                <tr>
                  <th style={{ minWidth: "0px" }}>STT</th>
                  <th style={{ minWidth: "150px" }}>Kỳ thi</th>
                  <th style={{ minWidth: "90px" }}>Môn thi</th>
                  <th style={{ minWidth: "100px" }}>Điểm số</th>
                  <th style={{ width: "180px" }}>Ngày thực hiện</th>
                  <th style={{ minWidth: "300px" }}>Chú thích</th>
                </tr>
              </thead>
              <tbody>
                {examHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">Không có dữ liệu</td>
                  </tr>
                ) : (
                  examHistory.map((exam, index) => (
                    <tr key={exam.id}>
                      <td>{index + 1}</td>
                      <td>{exam.exam}</td>
                      <td className="text-center">{exam.subject}</td>
                      <td className="text-center">{exam.score}</td>
                      <td className="text-center">{exam.date}</td>
                      <td>{exam.note}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryCandidatePage;
