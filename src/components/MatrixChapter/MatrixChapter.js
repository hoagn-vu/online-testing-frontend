import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import PropTypes from 'prop-types';

const MatrixChapter = ({ data }) => {
    // State để lưu số lượng câu hỏi đã chọn theo chương + điểm/câu
    const [chapterData, setChapterData] = useState(() => {
        const chapterSummary = {};
        data
          .filter(item => item.chapter !== "") // Lọc bỏ mục có chapter rỗng
          .forEach((item) => {
            if (!chapterSummary[item.chapter]) {
              chapterSummary[item.chapter] = {
                chapter: item.chapter,
                totalSelected: 0,
                totalQuestions: 0,
                pointsPerQuestion: 0, // Điểm mỗi câu
              };
            }
            chapterSummary[item.chapter].totalSelected += item.questionCount;
            chapterSummary[item.chapter].totalQuestions += item.total;
          });
      
        return Object.values(chapterSummary);
      });
      
  
  // Xử lý thay đổi input (Số lượng chọn, Điểm/câu)
    const handleInputChangeChapter = (index, key, value) => {
        const newChapterData = [...chapterData];
        newChapterData[index][key] = value;
        setChapterData(newChapterData);
    };
    
    return (
        <Box display="flex" gap={2} className="mt-3 w-full" justifyContent="space-between">
          {/* Bảng tổng hợp câu hỏi */}
          <div className="table-responsive" style={{ flex: "1" }}>
            <table className="table w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">STT</th>
                  <th className="border p-2">Chuyên đề kiến thức</th>
                  <th className="border p-2 text-center">Số lượng chọn / Tổng</th>
                  <th className="border p-2 text-center">Điểm/Câu</th>
                  <th className="border p-2 text-center">Tổng Điểm</th>
                </tr>
              </thead>
              <tbody>
                {chapterData.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2 text-center">{index + 1}</td>
                    <td className="border p-2">{item.chapter}</td>
                    <td className="border p-2 text-center">
                      <input
                        type="number"
                        value={item.totalSelected}
                        min="0"
                        max={item.totalQuestions}
                        onChange={(e) => handleInputChangeChapter(index, "totalSelected", Number(e.target.value))}
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
                        onChange={(e) => handleInputChangeChapter(index, "pointsPerQuestion", Number(e.target.value))}
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
                  <td className="border p-2 text-center">{chapterData.reduce((sum, item) => sum + item.totalSelected, 0)}</td>
                  <td className="border p-2 text-center">-</td>
                  <td className="border p-2 text-center">
                    {chapterData.reduce((sum, item) => sum + item.totalSelected * item.pointsPerQuestion, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
    
          {/* Bảng thống kê theo chương */}
          <Paper sx={{ padding: 2, height: "100%", width: "250px" }}>
            <h5 className="justify-content-center d-flex">Thống kê theo chương</h5>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", textAlign: "left", padding: "8px", minWidth: "130px" }}>Chương</th>
                  <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px" }}>Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {chapterData.map((row, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{row.chapter}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{row.totalSelected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </Box>
      );
    };
MatrixChapter.propTypes = {
  data: PropTypes.array.isRequired,
  totalSelectedQuestions: PropTypes.number.isRequired,
};

export default MatrixChapter;