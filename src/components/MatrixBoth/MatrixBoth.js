import React, { useEffect } from "react";
import { Box, Paper } from "@mui/material";
import PropTypes from 'prop-types';

const MatrixBoth = ({ data, personName, handleInputChange, totalSelectedQuestions, difficultyData }) => {
  // useEffect(() => {
  //   console.log("from matrix both", data);
  // }, [data]);

  return (
    <Box display="flex" gap={2} className="mt-3 w-full" justifyContent="space-between">
      {/* Bảng câu hỏi */}
      <div className="table-responsive" style={{ flex: "1" }}>
        <table className="table w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">STT</th>
              <th className="border p-2">Chuyên đề kiến thức</th>
              <th className="border p-2">Mức độ</th>
              <th className="border p-2 text-center">Số lượng chọn / Tổng</th>
              <th className="border p-2 text-center">Đơn vị</th>
              <th className="border p-2 text-center">Điểm/Câu</th>
              <th className="border p-2 text-center">Tổng điểm</th> {/* Thêm cột mới */}

            </tr>
          </thead>
          <tbody>
            {data.map((item, chapterIndex) => (
              <React.Fragment key={chapterIndex}>
                {item.levels.map((level, levelIndex) => (
                  <tr key={`${chapterIndex}-${levelIndex}`} className="border">
                    {levelIndex === 0 && (
                      <td className="border p-2 text-center" rowSpan={item.levels.length}>
                        {chapterIndex + 1}
                      </td>
                    )}
                    {levelIndex === 0 && (
                      <td className="border p-2" rowSpan={item.levels.length} style={{ minWidth: "300px" }}>
                        {item.chapter}
                      </td>
                    )}
                    <td className="border p-2" style={{ minWidth: "150px" }}>{level.level}</td>
                    <td className="border p-2 text-center" style={{ minWidth: "100px" }}>
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <input
                          type="number"
                          value={level.questionCount}
                          min="0"
                          max={level.total}
                          onChange={(e) =>
                            handleInputChange(chapterIndex, levelIndex, "questionCount", Number(e.target.value))
                          }
                          className="border p-1 text-center"
                          style={{ width: "50px" }}
                        />
                        <span>/ {String(level.total).padStart(2, "0")}</span>
                      </div>
                    </td>
                    <td className="border p-2 text-center" style={{ minWidth: "70px" }}>Câu</td>
                    <td className="border p-2 text-center">
                      <input
                        type="number"
                        value={level.scorePerQuestion}
                        min="0"
                        step="0.1"
                        onChange={(e) =>
                          handleInputChange(chapterIndex, levelIndex, "scorePerQuestion", Number(e.target.value))
                        }
                        className="border p-1 text-center"
                        style={{ width: "50px" }}
                      />
                    </td>
                    <td className="border p-2 text-center">
                        {(level.questionCount * level.scorePerQuestion).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr className="bg-gray-300 font-semibold">
              <td className="border p-2 text-center" colSpan="3">Tổng số câu hỏi</td>
              <td className="border p-2 text-center">{totalSelectedQuestions}</td>
              <td className="border p-2 text-center">Câu</td>
              <td className="border p-2 text-center">-</td>
              <td className="border p-2 text-center">
                {data.reduce((total, chapter) => 
                total + chapter.levels.reduce((sum, level) => 
                sum + (level.questionCount * level.scorePerQuestion), 0), 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bảng thống kê */}
      <Paper sx={{ padding: 2, height: "100%", width: "250px" }}>
        <h5 className="justify-content-center d-flex">Thống kê</h5>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", textAlign: "left", padding: "8px", minWidth: "130px" }}>Mức độ</th>
              <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px" }}>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {difficultyData.map((row, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.level}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{row.questionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </Box>
  );
};

MatrixBoth.propTypes = {
    data: PropTypes.array.isRequired,
    personName: PropTypes.array.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    totalSelectedQuestions: PropTypes.number.isRequired,
    difficultyData: PropTypes.array.isRequired,
};

export default MatrixBoth;
