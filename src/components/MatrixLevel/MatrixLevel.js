import React, { useState, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import PropTypes from "prop-types";
import Swal from "sweetalert2";

const MatrixLevel = ({ data, handleInputChange, totalScore: propTotalScore, setTotalScore }) => {
  // State để lưu số lượng câu hỏi đã chọn theo mức độ + điểm/câu
  const [levelData, setLevelData] = useState(() => {
    const levelSummary = {};
    console.log("Input data to MatrixLevel:", data); 
    data.forEach((item, index) => {
      const levels = Array.isArray(item.levels) ? item.levels : [item];
      levels.forEach((level) => {
        if (!levelSummary[level.level]) {
          levelSummary[level.level] = {
            level: level.level || "Không xác định",
            totalSelected: level.questionCount ?? 0,
            totalQuestions: level.total ?? 0,
            score: level.score ?? 0,
            originalIndex: index,
          };
        } else {
          levelSummary[level.level].totalSelected += level.questionCount ?? 0;
          levelSummary[level.level].totalQuestions += level.total ?? 0;
          levelSummary[level.level].score += level.score ?? 0;
        }
      });
    });
    return Object.values(levelSummary);
  });

  // Đồng bộ levelData khi data thay đổi
  useEffect(() => {
    setLevelData((prev) => {
      const levelSummary = {};
      data.forEach((item, index) => {
        const levels = Array.isArray(item.levels) ? item.levels : [item];
        levels.forEach((level) => {
          const levelKey = level.level || "Không xác định";
          if (!levelSummary[levelKey]) {
            const existing = prev.find((p) => p.level === levelKey) || {};
            levelSummary[levelKey] = {
              level: levelKey,
              totalSelected: existing.totalSelected ?? level.questionCount ?? 0,
              totalQuestions: level.total ?? 0,
              score: existing.score ?? level.score ?? 0,
              originalIndex: index,
            };
          } else {
            levelSummary[levelKey].totalQuestions += level.total ?? 0;
            levelSummary[levelKey].score += level.score ?? 0;
          }
        });
      });
      return Object.values(levelSummary);
    });
  }, [data]);

  // Debug totalScore và levelData
  useEffect(() => {
    console.log("propTotalScore in MatrixLevel:", propTotalScore);
    console.log("levelData in MatrixLevel:", levelData);
  }, [propTotalScore, levelData]);

  // Sử dụng totalScore từ prop hoặc mặc định là 10 nếu undefined
  const effectiveTotalScore = propTotalScore !== undefined ? propTotalScore : 10;

  const handleInputChangeLevel = (index, key, value) => {
    const levelItem = levelData[index];
    if (key === "score") {
      const currentTotal = levelData.reduce((sum, item, i) =>
        i === index ? sum : sum + (item.score || 0), 0
      );
      const maxScore = effectiveTotalScore ?? 10;
      if (currentTotal + value > maxScore) {
        Swal.fire({
          icon: "warning",
          title: "Tổng điểm vượt quá!",
          text: `Tổng điểm không được vượt quá ${maxScore}.`,
        });
        return;
      }
    }
    // Cập nhật state nội bộ
    setLevelData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
    // Truyền thay đổi lên cha
    handleInputChange(levelItem.originalIndex, 0, key, value);
  };

  return (
    <Box display="flex" gap={2} className="mt-3 w-full" justifyContent="space-between">
      {/* Bảng tổng hợp câu hỏi theo mức độ */}
      <div className="table-responsive tbl-shadow pb-0" style={{ flex: "1", fontSize: "14px" }}>
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
                    onChange={(e) => {
                      let value = Number(e.target.value);
                      if (isNaN(value)) value = 0;
                      if (value > item.totalQuestions) value = item.totalQuestions;
                      if (value < 0) value = 0;
                      handleInputChangeLevel(index, "totalSelected", value);
                    }}
                    onKeyDown={(e) => {
                      if ([".", ",", "e"].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="border p-1 text-center"
                    style={{ width: "60px" }}
                  /> / {(item.totalQuestions ?? 0).toString().padStart(2, '0')}
                </td>
                <td className="text-center">Câu</td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    value={item.score}
                    min="0"
                    step="0.1"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleInputChangeLevel(index, "score", Number(e.target.value))}
                    onBlur={(e) => {
                      const formatted = parseFloat(e.target.value || "0").toFixed(1);
                      handleInputChangeLevel(index, "score", parseFloat(formatted));
                    }}
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
              <td className="text-center">Câu</td>
              <td className="border p-2 text-center">
                <input
                  type="number"
                  value={effectiveTotalScore || 0}
                  min="0"
                  step="0.1"
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && typeof setTotalScore === "function") {
                      setTotalScore(value);
                    } else {
                      console.error("setTotalScore is not a function:", setTotalScore);
                    }
                  }}
                  className="border p-1 text-center"
                  style={{ width: "60px" }}
                />
              </td>
              <td className="border p-2 text-center">-</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bảng thống kê theo mức độ */}
      <Paper sx={{
          padding: 2,
          height: "100%",
          width: "250px",
          fontSize: "14px",
          borderRadius: "8px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}>
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
  handleInputChange: PropTypes.func.isRequired,
  totalScore: PropTypes.number,
  setTotalScore: PropTypes.func.isRequired,
};

export default MatrixLevel;