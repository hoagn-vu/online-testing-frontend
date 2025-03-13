import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Select from 'react-select';
import './DetailExamMatrixPage.css'
import { Box, Button, Grid, IconButton, Input, TextField, MenuItem, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";

const listQuestionBank = [
    {
        id: "67cf6cee1d44d62edf5de90b",
        subjectName: "Math",
        subjectStatus: null,
        questionBanks: [
            {
                questionBankId: "67cf702d1d44d62edf5de913",
                questionBankName: "Giải tích 1",
                questionBankStatus: null,
                list: [],
            },
            {
                questionBankId: "67cf70341d44d62edf5de916",
                questionBankName: "Giải tích 2",
                questionBankStatus: null,
                list: [],
            }
        ]
    },
    {
        id: "67cf6d191d44d62edf5de90d",
        subjectName: "History",
        subjectStatus: null,
        questionBanks: [
            {
                questionBankId: "67cf702d1d44d62edf5de913",
                questionBankName: "His 1",
                questionBankStatus: null,
                list: [],
            },
            {
                questionBankId: "67cf70341d44d62edf5de916",
                questionBankName: "His 2",
                questionBankStatus: null,
                list: [],
            }
        ]
    }
];

// Dữ liệu mẫu cho dropdown
const colourOptions = [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
  ];

const columns = [
    { field: "id", headerName: "#", width: 50, headerAlign: "center", align: "center", },
    {
        field: "topic",
        headerName: "Chuyên đề kiến thức",
        minwidth: 250, flex: 0.1,
        renderCell: (params) => {
          return params.row.isFirst ? (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                <Typography variant="body1" fontWeight="bold">
                    {params.value}
                </Typography>
            </Box>
          ) : (
            ""
          );
        },
      },
    { field: "difficulty", headerName: "Độ khó", width: 100, flex:0.02, },
    {
        field: "selected",
        headerAlign: "center",
        headerName: "Số lượng chọn / Tổng",
        width: 200,
        align: "center",
        renderCell: (params) => {
            const isFooterRow = params.row.topic === "Tổng số câu đã chọn";
    
            if (isFooterRow) {
                return (
                    <Typography
                        fontWeight="bold"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        {params.row.selected}
                    </Typography>

                );
            }
    
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <TextField
                        type="number"
                        size="small"
                        variant="outlined"
                        value={params.row.selected}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            console.log(`Updated selected value for row ${params.row.id}:`, newValue);
                        }}
                        inputProps={{
                            min: 0,
                            max: params.row.totalQuestion, 
                            style: { textAlign: "center", width: "50px", padding: "5px", height: "30px" }
                        }}
                        sx={{
                            mr: 1,
                            "& .MuiInputBase-root": { height: "30px", display: "flex", alignItems: "center" }
                        }}
                    />
                    <Typography sx={{ fontSize: "14px" }}>/ {params.row.totalQuestion}</Typography>
                </Box>
            );
        },
    },
    {
        field: "score",
        headerName: "Điểm / Câu",
        width: 100,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
            const isFooterRow = params.row.topic === "Tổng số câu đã chọn";
    
            return (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    {isFooterRow ? (
                        <Typography fontWeight="bold">{params.value || ""}</Typography> // Chỉ hiển thị văn bản nếu là dòng tổng
                    ) : (
                        <TextField
                            type="number"
                            value={params.value}
                            size="small"
                            variant="outlined"
                            inputProps={{ min: 0, style: { textAlign: "center" } }}
                            sx={{ width: "100%" }}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                console.log(`New score: ${newValue}`);
                                // Thêm logic cập nhật dữ liệu ở đây nếu cần
                            }}
                        />
                    )}
                </Box>
            );
        },
    },
    
        
];

const rawData  = [
    { id: 1, topic: "Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", difficulty: "Nhận biết", selected: "2", totalQuestion: "5", unit: "Câu"},
    { id: 2, topic: "Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", difficulty: "Thông hiểu", selected: "2", totalQuestion: "10", unit: "Câu"},
    { id: 3, topic: "Bối cảnh quốc tế từ sau chiến tranh thế giới thứ hai", difficulty: "Vận dụng cao", selected: "2", totalQuestion: "5", unit: "Câu"},
    { id: 4, topic: "Các nước Á, Phi, và Mĩ La Tinh giai đoạn 1945-2000", difficulty: "Nhận biết", selected: "2", totalQuestion: "9", unit: "Câu"},
    { id: 5, topic: "Các nước Á, Phi, và Mĩ La Tinh giai đoạn 1945-2000", difficulty: "Thông hiểu", selected: "2", totalQuestion: "15", unit: "Câu"},
    { id: 6, topic: "Liên Xô và các nước Đông Âu giai đoạn 1945-1991", difficulty: "Vận dụng cao", selected: "2", totalQuestion: "5", unit: "Câu" },
];

// Xử lý gộp chuyên đề
const processData = (data) => {
    let groupedData = [];
    let lastTopic = null;
    data.forEach((item, index) => {
      let isFirst = item.topic !== lastTopic;
      groupedData.push({ ...item, id: index + 1, isFirst });
      lastTopic = item.topic;
    });
    return groupedData;
  };

  // Tính tổng số câu đã chọn
  const calculateTotalSelected = (data) => {
    return data.reduce((sum, item) => sum + Number(item.selected), 0); // Chuyển selected về dạng số
};

const DetailExamMatrixPage = () => {
    const processedData = processData(rawData);
    const totalSelected = calculateTotalSelected(rawData);
    
    const footerRow = {
        id: "", 
        topic: "Tổng số câu đã chọn",  // Chỉ hiện dòng tổng
        difficulty: "",
        selected: `${totalSelected}`,  // 🟢 Chỉ hiện số tổng, không có "/"
        totalQuestion: "",
        unit: "Câu",
        isFirst: true, // Không phải dòng đầu của nhóm
    };
    

    return (
        <div className="detail-matrix-page">
            {/* Breadcrumb */}
            <nav>
                <Link to="/admin">Home</Link> / 
                <Link to="/admin/question">Quản lý ma trận đề thi</Link> / 
                <span className="breadcrumb-current"></span>
            </nav>

            <div className="d-flex">
                <div className="d-flex">          
                    <TextField
                        required
                        id="outlined-required"
                        label="Ma trận đề thi"
                    />
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        placeholder="Chọn phân môn"
                        name="color"
                        options={colourOptions}
                    />
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        placeholder="Chọn ngân hàng câu hỏi"
                        name="color"
                        options={colourOptions}
                    />
                </div>
                <div className="d-flex ms-auto">
                    <button className="add-btn" >
                        Lưu
                    </button>
                </div>
            </div>
            <Box sx={{ width: "100%" }}>
                <DataGrid
                    rows={[...processedData, footerRow]}  // 🟢 Đảm bảo footer ở cuối bảng
                    columns={columns}
                    disableColumnResize
                    disableExtendRowFullWidth
                    disableColumnSorting
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            borderBottom: "2px solid #ccc", // Đường phân cách dưới tiêu đề cột
                        },
                        "& .MuiDataGrid-cell": {
                            borderRight: "1px solid #ddd", // Đường phân cách giữa các cột
                        },
                        "& .footer-row": {
                            fontWeight: "bold",
                            backgroundColor: "#f5f5f5",
                            textAlign: "center",
                        },
                    }}
                />
            </Box>

        </div>
    );
};

export default DetailExamMatrixPage;
