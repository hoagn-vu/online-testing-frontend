import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import PropTypes from "prop-types";

const MatrixLevel = ({ data }) => {
  // State để lưu số lượng câu hỏi đã chọn theo mức độ + điểm/câu
  const [levelData, setLevelData] = useState(() => {
    const levelSummary = {};
    data
      .filter(item => item.level !== "") // Lọc bỏ item có level rỗng
      .forEach((item) => {
        if (!levelSummary[item.level]) {
          levelSummary[item.level] = {
            level: item.level,
            totalSelected: 0,
            totalQuestions: 0,
            pointsPerQuestion: 0, // Điểm mỗi câu
          };
        }
        levelSummary[item.level].totalSelected += item.questionCount;
        levelSummary[item.level].totalQuestions += item.totalQuestionTag;
      });
  
    return Object.values(levelSummary);
  });
  

  // Xử lý thay đổi input (Số lượng chọn, Điểm/câu)
  const handleInputChangeLevel = (index, key, value) => {
    const newLevelData = [...levelData];
    newLevelData[index][key] = value;
    setLevelData(newLevelData);
  };

  return (
    <Box display="flex" gap={2} className="mt-3 w-full" justifyContent="space-between">
      {/* Bảng tổng hợp câu hỏi theo mức độ */}
      <div className="table-responsive" style={{ flex: "1" }}>
        <table className="table w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">STT</th>
              <th className="border p-2">Mức độ</th>
              <th className="border p-2 text-center">Số lượng chọn / Tổng</th>
              <th className="border p-2 text-center">Điểm/Câu</th>
              <th className="border p-2 text-center">Tổng Điểm</th>
            </tr>
          </thead>
          <tbody>
            {levelData.map((item, index) => (
              <tr key={index} className="border">
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{item.level}</td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    value={item.totalSelected}
                    min="0"
                    max={item.totalQuestions}
                    onChange={(e) => handleInputChangeLevel(index, "totalSelected", Number(e.target.value))}
                    className="border p-1 text-center"
                    style={{ width: "50px" }}
                  /> / {item.totalQuestions}
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    value={item.pointsPerQuestion}
                    min="0"
                    step="0.1"
                    onChange={(e) => handleInputChangeLevel(index, "pointsPerQuestion", Number(e.target.value))}
                    className="border p-1 text-center"
                    style={{ width: "50px" }}
                  />
                </td>
                <td className="border p-2 text-center">
                  {(item.totalSelected * item.pointsPerQuestion).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-300 font-semibold">
              <td className="border p-2 text-center" colSpan="2">Tổng</td>
              <td className="border p-2 text-center">{levelData.reduce((sum, item) => sum + item.totalSelected, 0)}</td>
              <td className="border p-2 text-center">-</td>
              <td className="border p-2 text-center">
                {levelData.reduce((sum, item) => sum + item.totalSelected * item.pointsPerQuestion, 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bảng thống kê theo mức độ */}
      <Paper sx={{ padding: 2, height: "100%", width: "250px" }}>
        <h5 className="justify-content-center d-flex">Thống kê theo mức độ</h5>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", textAlign: "left", padding: "8px", minWidth: "130px" }}>Mức độ</th>
              <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px" }}>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {levelData.map((row, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.level}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{row.totalSelected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </Box>
  );
};

MatrixLevel.propTypes = {
  data: PropTypes.array.isRequired,
};

export default MatrixLevel;