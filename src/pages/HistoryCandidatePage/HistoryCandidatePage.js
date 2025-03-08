import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HistoryCandidatePage.css";

const examHistory = [
  {
    id: 1,
    exam: "Bài kiểm tra cuối kỳ I (22Toán)",
    subject: "Toán",
    score: 4,
    date: "09/04/2024 03:07",
    note: "",
  },
  {
    id: 2,
    exam: "Test",
    subject: "Toán",
    score: 2,
    date: "09/04/2024 02:00",
    note: "Hoàng Nguyên Vũ bảo dừng",
  },
  {
    id: 3,
    exam: "test 1",
    subject: "Toán",
    score: 2,
    date: "09/04/2024 02:07",
    note: "Vi phạm",
  },
  {
    id: 4,
    exam: "Test 3",
    subject: "Tiếng Anh",
    score: 0,
    date: "09/04/2024 03:17",
    note: "Vi phạm",
  },
  {
    id: 5,
    exam: "Test 4",
    subject: "Tiếng Anh",
    score: 2,
    date: "09/04/2024 03:36",
    note: "Thoát ra khỏi màn hình nhiều lần",
  },
];

const HistoryCandidatePage = () => {
    return (
        <div className="container container-history justify-content-center d-flex">
            <div className="table-responsive tbl-history">
                <h2 className="text-center mb-4">Lịch sử thi</h2>
                <table className="table table-striped" >
                    <thead className="bg-light">
                        <tr>
                            <th style={{ minWidth: "0px" }}>STT</th>
                            <th style={{ minWidth: "130px" }}>Kỳ thi</th>
                            <th style={{ minWidth: "70px" }}>Môn thi</th>
                            <th style={{ minWidth: "30px" }}>Điểm số</th>
                            <th style={{ minWidth: "150px" }}>Ngày thực hiện</th>
                            <th style={{ minWidth: "300px" }}>Chú thích</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examHistory.map((exam, index) => (
                            <tr key={exam.id}>
                                <td>{index + 1}</td>
                                <td>{exam.exam}</td>
                                <td>{exam.subject}</td>
                                <td>{exam.score}</td>
                                <td>{exam.date}</td>
                                <td>{exam.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryCandidatePage;
