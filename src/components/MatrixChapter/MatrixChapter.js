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
  // const handleInputChangeChapter = (index, key, value) => {
  //     const newChapterData = [...chapterData];
  //     newChapterData[index][key] = value;
  //     setChapterData(newChapterData);
  // };

  const handleInputChangeChapter = (index, key, value) => {
    const newChapterData = [...chapterData];
  
    if (key === "pointsPerQuestion") {
      const currentTotal = chapterData.reduce((sum, item, i) =>
        i === index ? sum : sum + item.pointsPerQuestion, 0
      );
  
      if (currentTotal + value > maxTotalPointsChapter) {
        alert("Tổng điểm vượt quá giới hạn đã đặt!");
        return;
      }
  
      newChapterData[index][key] = value;
    } else {
      newChapterData[index][key] = value;
    }
  
    setChapterData(newChapterData);
  };  

  const [maxTotalPointsChapter, setMaxTotalPoints] = useState(() =>
    data?.reduce((sum, item) => sum + item.questionCount * 1, 0).toFixed(1)
  ); // mặc định tổng điểm = tổng số câu
  
  return (
      <Box display="flex" gap={2} className="mt-3 w-full" justifyContent="space-between">
        {/* Bảng tổng hợp câu hỏi */}
        <div className="table-responsive" style={{ flex: "1", fontSize: "14px" }}>
          <table className="table w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">STT</th>
                <th className="border p-2">Chuyên đề kiến thức</th>
                <th className="border p-2 text-center">Số lượng chọn / Tổng</th>
                <th className="border p-2 text-center">Đơn vị</th>
                <th className="border p-2 text-center">Tổng Điểm</th>
                <th className="border p-2 text-center">Điểm/Câu</th>
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
                      step="1"
                      onKeyDown={(e) => {
                        if ([".", ",", "e"].includes(e.key)) {
                          e.preventDefault(); // Chặn nhập số thập phân và ký tự không hợp lệ
                        }
                      }}
                      onChange={(e) =>
                        handleInputChangeChapter(index, "totalSelected", Number(e.target.value))
                      }
                      className="border p-1 text-center"
                      style={{ width: "60px" }}
                    />{" "}
                    / {item.totalQuestions}
                  </td>
                  <td className="text-center">Câu</td>
                  <td className="border p-2 text-center">
                    <input
                      type="number"
                      value={item.pointsPerQuestion.toFixed(1)}
                      min="0"
                      step="0.1"
                      onChange={(e) => handleInputChangeChapter(index, "pointsPerQuestion", Number(e.target.value))}
                      className="border p-1 text-center"
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    {item.totalSelected === 0
                      ? "-"
                      : (item.pointsPerQuestion / item.totalSelected).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-300 font-semibold">
                <td className="border p-2 text-center" colSpan="2">Tổng</td>
                <td className="border p-2 text-center">{chapterData.reduce((sum, item) => sum + item.totalSelected, 0)}</td>
                <td className="text-center">Câu</td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    value={maxTotalPointsChapter}
                    min="0"
                    step="0.1"
                    onChange={(e) => setMaxTotalPoints(Number(e.target.value))}
                    className="border p-1 text-center"
                    style={{ width: "60px" }}
                  />
                </td>

                {/* <td className="border p-2 text-center">
                  {chapterData.reduce((sum, item) => sum + item.pointsPerQuestion, 0).toFixed(2)}
                </td> */}
                <td className="border p-2 text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        {/* Bảng thống kê theo chương */}
        <Paper sx={{ padding: 2, height: "100%", width: "250px", fontSize: "14px"  }}>
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