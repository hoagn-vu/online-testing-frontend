import React from "react";
import PropTypes from "prop-types";

import "../styles/ExamHistoryTable.css";

const ExamHistoryTable = ({ data }) => {
  return (
    <div className="table-responsive tbl-history rounded">
      <table className="table exam-history-table table-striped table-hover align-middle text-center fs-6">
        <thead>
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
          {data.length > 0 ? (
            data.map((exam, index) => (
              <tr key={exam.id}>
                <td>{index + 1}</td>
                <td>{exam.exam}</td>
                <td>{exam.subject}</td>
                <td>{exam.score}</td>
                <td>{exam.date}</td>
                <td>{exam.note}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

ExamHistoryTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ExamHistoryTable;
