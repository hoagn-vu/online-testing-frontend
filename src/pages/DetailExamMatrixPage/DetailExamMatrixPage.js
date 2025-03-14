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
    { value: 'red', label: 'Tư tưởng Hồ Chí Minh Tư tưởng Hồ Chí Minh Tư ' },
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
        minwidth: 200, flex: 0.05,
        renderCell: (params) => {
            return params.row.isFirst ? (
            <Box sx={{ display: "flex", alignItems: "center", height: "100%",
                whiteSpace: "normal",   // Cho phép xuống dòng
                wordBreak: "break-word" // Cắt từ nếu quá dài
            }}>
                <Typography variant="body1" fontWeight="bold">
                    {params.value}
                </Typography>
            </Box>
            ) : (
            ""
            );
        },
    },
    { field: "difficulty", headerName: "Độ khó", minWidth: 100, flex:0.01, },
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

const difficultyData = [
    { level: "Nhận biết", count: 10 },
    { level: "Thông hiểu", count: 15 },
    { level: "Vận dụng cao", count: 5 },
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

            <div className="d-flex mt-4">
                <div className="d-flex">          
                <TextField
                    required
                    id="outlined-required"
                    label="Tên ma trận đề thi"
                    sx={{
                         "& .css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input": {
                            padding: "13px",
                            fontSize: "14px",
                            paddingBottom: "17px",
                            width: "220px"
                         },
                        "& .MuiInputLabel-root": {
                            marginLeft: "0px", // Giữ margin trái
                            fontSize: "14px"
                        },
                    }}
                />

                    <Select
                        className="basic-single ms-2 me-2"
                        classNamePrefix="select"
                        placeholder="Chọn phân môn"
                        name="color"
                        options={colourOptions}
                        styles={{
                            control: (base) => ({
                                ...base,
                                width: "250px", // Cố định chiều rộng
                                minWidth: "250px",
                                maxWidth: "250px",
                                height: "50px", // Tăng chiều cao
                                minHeight: "50px",
                            }),
                            menu: (base) => ({
                                ...base,
                                width: "250px", // Cố định chiều rộng của dropdown
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                            }),
                            placeholder: (base) => ({
                                ...base,
                                fontSize: "14px", // Cỡ chữ của placeholder (label)
                            }),
                        }}
                    />
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        placeholder="Chọn ngân hàng câu hỏi"
                        name="color"
                        options={colourOptions}
                        styles={{
                            control: (base) => ({
                                ...base,
                                width: "250px", // Cố định chiều rộng
                                minWidth: "250px",
                                maxWidth: "250px",
                                height: "50px", // Tăng chiều cao
                                minHeight: "50px",
                            }),
                            menu: (base) => ({
                                ...base,
                                width: "250px", // Cố định chiều rộng của dropdown
                            }),
                            valueContainer: (base) => ({
                                ...base,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontSize: "14px",
                            }),
                            placeholder: (base) => ({
                                ...base,
                                fontSize: "14px", // Cỡ chữ của placeholder (label)
                            }),
                        }}
                    />
                </div>
                <div className="d-flex ms-auto">
                    <button className="add-btn" >
                        Lưu
                    </button>
                </div>
            </div>
            <Box display="flex" gap={2} className="mt-3">

                <Box sx={{ width: "80%" }}>
                    <DataGrid
                        rows={[...processedData, footerRow]}  // 🟢 Đảm bảo footer ở cuối bảng
                        columns={columns}
                        disableColumnResize
                        disableExtendRowFullWidth
                        disableColumnSorting
                        hideFooter={true} 
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

                <Paper sx={{ display: "inline-block", padding: 2, height: "250px" }}>
                    <h5 className="justify-content-center d-flex">Thống kê</h5>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
                        <thead>
                            <tr>
                                <th style={{ border: "1px solid #ddd", textAlign: "left", padding: "8px", minWidth: "130px" }}>
                                    Mức độ
                                </th>
                                <th style={{ border: "1px solid #ddd", textAlign: "center", padding: "8px" }}>
                                    Số lượng
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {difficultyData.map((row, index) => (
                                <tr key={index}>
                                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                        {row.level}
                                    </td>
                                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                                        {row.count}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Paper>
            </Box>
        </div>
    );
};

export default DetailExamMatrixPage;
