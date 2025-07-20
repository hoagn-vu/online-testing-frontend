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
            score: 0, // Điểm mỗi câu
          };
        }
        levelSummary[item.level].totalSelected += item.questionCount;
        levelSummary[item.level].totalQuestions += item.total;
      });
  
    return Object.values(levelSummary);
  });
  

  // Xử lý thay đổi input (Số lượng chọn, Điểm/câu)
  // const handleInputChangeLevel = (index, key, value) => {
  //   const newLevelData = [...levelData];
  //   newLevelData[index][key] = value;
  //   setLevelData(newLevelData);
  // };
  const handleInputChangeLevel = (index, key, value) => {
    const newLevelData = [...levelData];
  
    if (key === "score") {
      const currentTotal = levelData.reduce((sum, item, i) =>
        i === index ? sum : sum + item.score, 0
      );
  
      if (currentTotal + value > maxTotalPointsLevel) {
        alert("Tổng điểm vượt quá giới hạn đã đặt!");
        return;
      }
  
      newLevelData[index][key] = value;
    } else {
      newLevelData[index][key] = value;
    }
  
    setLevelData(newLevelData);
  }; 

  const [maxTotalPointsLevel, setMaxTotalPoints] = useState(() => {
    if (!data || data.length === 0) return 10;
    const sum = data.reduce((sum, item) => sum + (item.questionCount * 1), 0);
    return sum === 0 ? 10 : sum.toFixed(1);
    }
  ); 

  return (
    <Box display="flex" gap={2} className="mt-3 w-full" justifyContent="space-between">
      {/* Bảng tổng hợp câu hỏi theo mức độ */}
      <div className="table-responsive" style={{ flex: "1", fontSize: "14px" }}>
        <table className="table w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">STT</th>
              <th className="border p-2">Mức độ</th>
              <th className="border p-2 text-center">Số lượng chọn / Tổng</th>
              <th className="border p-2 text-center">Đơn vị</th>
              <th className="border p-2 text-center">Tổng Điểm</th>
              <th className="border p-2 text-center">Điểm/Câu</th>
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
                    onKeyDown={(e) => {
                      if ([".", ",", "e"].includes(e.key)) {
                        e.preventDefault(); // Chặn nhập số thập phân và ký tự không hợp lệ
                      }
                    }}
                    className="border p-1 text-center"
                    style={{ width: "60px" }}
                  /> / {item.totalQuestions}
                </td>
                <td className="text-center">Câu</td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    value={item.score.toFixed(1)}
                    min="0"
                    step="0.1"
                    onChange={(e) => handleInputChangeLevel(index, "score", Number(e.target.value))}
                    className="border p-1 text-center"
                    style={{ width: "60px" }}
                  />
                </td>
                <td className="border p-2 text-center">
                  {item.totalSelected === 0
                    ? "-"
                    : (item.score / item.totalSelected).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-300 font-semibold">
              <td className="border p-2 text-center" colSpan="2">Tổng</td>
              <td className="border p-2 text-center">{levelData.reduce((sum, item) => sum + item.totalSelected, 0)}</td>
              <td className="border p-2 text-center">Câu</td>
              <td className="border p-2 text-center">
                  <input
                    type="number"
                    value={maxTotalPointsLevel}
                    min="0"
                    step="0.1"
                    onChange={(e) => setMaxTotalPoints(Number(e.target.value))}
                    className="border p-1 text-center"
                    style={{ width: "60px" }}
                  />
                </td>
              {/* <td className="border p-2 text-center">
                {levelData.reduce((sum, item) => sum + item.score, 0).toFixed(2)}
              </td> */}
              <td className="border p-2 text-center">-</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bảng thống kê theo mức độ */}
      <Paper sx={{ padding: 2, height: "100%", width: "250px", fontSize: "14px"  }}>
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