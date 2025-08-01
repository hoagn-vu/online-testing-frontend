import React, { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import PropTypes from 'prop-types';
import Swal from "sweetalert2";

const MatrixBoth = ({ data, personName, handleInputChange, totalSelectedQuestions, difficultyData, totalScore, setTotalScore }) => {
    // State để lưu giá trị tạm thời của các input score
  const [tempScores, setTempScores] = useState(() =>
    data.reduce((acc, chapter, chapterIndex) => {
      chapter.levels.forEach((level, levelIndex) => {
        acc[`${chapterIndex}-${levelIndex}`] = level.score ?? 0;
      });
      return acc;
    }, {})
  );

  // Đồng bộ tempScores khi data thay đổi
  useEffect(() => {
    setTempScores(
      data.reduce((acc, chapter, chapterIndex) => {
        chapter.levels.forEach((level, levelIndex) => {
          acc[`${chapterIndex}-${levelIndex}`] = level.score ?? 0;
        });
        return acc;
      }, {})
    );
  }, [data]);

  // Debug totalScore, data, và tempScores
  useEffect(() => {
    console.log("totalScore in MatrixBoth:", totalScore);
    console.log("data in MatrixBoth:", data);
    console.log("tempScores in MatrixBoth:", tempScores);
  }, [totalScore, data, tempScores]);

  // Fallback để đảm bảo totalScore luôn là số hợp lệ
  const displayTotalScore = isNaN(totalScore) || totalScore === undefined ? 10 : totalScore;

  return (
    <Box display="flex" gap={2} className="mt-3 w-full" justifyContent="space-between" >
      <div className="table-responsive tbl-shadow pb-0" 
        style={{ flex: "1", fontSize: "14px", }}>
        <table className="table w-full border border-gray-300" >
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">STT</th>
              <th className="border p-2">Chuyên đề kiến thức</th>
              <th className="border p-2">Mức độ</th>
              <th className="border p-2 text-center">Số lượng chọn / Tổng</th>
              <th className="border p-2 text-center">Đơn vị</th>
              <th className="border p-2 text-center">Tổng điểm</th>
              <th className="border p-2 text-center">Điểm/Câu</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((item, chapterIndex) => (
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
                          step="1"
                          onChange={(e) => {
                            let value = Number(e.target.value);

                            if (isNaN(value)) value = 0;

                            if (value > level.total) value = level.total;

                            if (value < 0) value = 0;

                            handleInputChange(chapterIndex, levelIndex, "questionCount", value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === '.' || e.key === ',' || e.key === 'e') {
                              e.preventDefault();
                            }
                          }}                          
                          className="border p-1 text-center"
                          style={{ width: "60px" }}
                        />
                        <span>/ {String(level.total).padStart(2, "0")}</span>
                      </div>
                    </td>
                    <td className="border p-2 text-center" style={{ minWidth: "70px" }}>Câu</td>
                    <td className="border p-2 text-center">
                      <input
                        type="number"
                        // Giữ giá trị gốc nhưng không ép format mỗi lần render
                        value={tempScores[`${chapterIndex}-${levelIndex}`] ?? level.score}
                        min="0"
                        step="0.1"
                        onFocus={(e) => {
                          // Khi click vào thì bôi đen toàn bộ để dễ gõ đè
                          e.target.select();
                        }}
                        onChange={(e) => {
                          const newValue = Number(e.target.value);
                          const currentTotal = (data || []).reduce((total, chapter, cIndex) => {
                            const levels = Array.isArray(chapter.levels) ? chapter.levels : [chapter];
                            return (
                              total +
                              levels.reduce((sum, lvl, lIndex) => {
                                if (cIndex === chapterIndex && lIndex === levelIndex) return sum;
                                return sum + (lvl.score || 0);
                              }, 0)
                            );
                          }, 0);
                          const maxScore = displayTotalScore;
                          if (currentTotal + newValue > maxScore) {
                            Swal.fire({
                              icon: "warning",
                              title: "Tổng điểm vượt quá!",
                              text: `Tổng điểm không được vượt quá ${maxScore}.`,
                            });
                            // Reset về giá trị tối đa hợp lệ
                            const maxValidScore = Math.max(0, maxScore - currentTotal);
                            setTempScores((prev) => ({
                              ...prev,
                              [`${chapterIndex}-${levelIndex}`]: maxValidScore,
                            }));
                            handleInputChange(chapterIndex, levelIndex, "score", maxValidScore);
                            return;
                          }
                          // Cập nhật tempScores
                          setTempScores((prev) => ({
                            ...prev,
                            [`${chapterIndex}-${levelIndex}`]: newValue,
                          }));
                          // Cập nhật state chính thức
                          handleInputChange(chapterIndex, levelIndex, "score", newValue);
                        }}
                        onBlur={(e) => {
                          const formatted = parseFloat(e.target.value || "0").toFixed(1);
                          const formattedValue = parseFloat(formatted);
                          const currentTotal = (data || []).reduce((total, chapter, cIndex) => {
                            const levels = Array.isArray(chapter.levels) ? chapter.levels : [chapter];
                            return (
                              total +
                              levels.reduce((sum, lvl, lIndex) => {
                                if (cIndex === chapterIndex && lIndex === levelIndex) return sum;
                                return sum + (lvl.score || 0);
                              }, 0)
                            );
                          }, 0);
                          const maxScore = displayTotalScore;
                          if (currentTotal + formattedValue > maxScore) {
                            Swal.fire({
                              icon: "warning",
                              title: "Tổng điểm vượt quá!",
                              text: `Tổng điểm không được vượt quá ${maxScore}.`,
                            });
                            const maxValidScore = Math.max(0, maxScore - currentTotal);
                            setTempScores((prev) => ({
                              ...prev,
                              [`${chapterIndex}-${levelIndex}`]: maxValidScore,
                            }));
                            handleInputChange(chapterIndex, levelIndex, "score", maxValidScore);
                            return;
                          }
                          setTempScores((prev) => ({
                            ...prev,
                            [`${chapterIndex}-${levelIndex}`]: formattedValue,
                          }));
                          handleInputChange(chapterIndex, levelIndex, "score", formattedValue);
                        }}
                        className="border p-1 text-center"
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td className="border p-2 text-center">
                      {level.questionCount === 0
                        ? "-"
                        : (level.score / level.questionCount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            <tr className="bg-gray-300 font-semibold">
              <td className="border p-2 text-center" colSpan="3">Tổng số câu hỏi</td>
              <td className="border p-2 text-center">{totalSelectedQuestions}</td>
              <td className="border p-2 text-center">Câu</td>
              {/* <td className="border p-2 text-center">
                {data.reduce((total, chapter) => 
                total + chapter.levels.reduce((sum, level) => 
                sum + (level.score), 0), 0).toFixed(2)}
              </td> */}
              <td className="border p-2 text-center">
                <input
                  type="number"
                  value={totalScore}
                  step="0.1"
                  min="0"
                  onChange={(e) => {
                    let newTotal = parseFloat(e.target.value);
                    if (!isNaN(newTotal)) setTotalScore(newTotal);
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

      {/* Bảng thống kê */}
      <Paper 
        sx={{ 
          padding: 2, height: "100%", width: "250px", fontSize: "14px", borderRadius: "8px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h5 className="justify-content-center d-flex">Thống kê</h5>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd", backgroundColor: "#FFFF" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", textAlign: "left", padding: "8px", minWidth: "130px", backgroundColor: "#FFFF" }}>Mức độ</th>
              <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px", backgroundColor: "#FFFF" }}>Số lượng</th>
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
    setTotalScore: PropTypes.array.isRequired,
    totalScore: PropTypes.array.isRequired,
};

export default MatrixBoth;
