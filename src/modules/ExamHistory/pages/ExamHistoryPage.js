import React from "react";

import DefaultLayout from "templates/LayoutContainers/DefaultLayout";
import Header from "templates/Navbars/CandidateNavbar/Header";

import ExamHistoryTable from "../components/ExamHistoryTable";

const ExamHistoryPage = () => {
  const examHistories = [
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

  return (
    <DefaultLayout>
      <Header />
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center">
          <h1>Lịch sử thi</h1>
        </div>

        <ExamHistoryTable data={examHistories} />
      </div>
    </DefaultLayout>
  );
};

export default ExamHistoryPage;
