import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import './ExamMatrixPage.css'
import { Box, Button, Grid, IconButton, TextField,} from "@mui/material";
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

const ExamMatrixPage = () => {
    const [rows, setRows] = useState(Object.values(listQuestionBank).flat());
    
    const columns = [
        { field: "stt", headerName: "#", width: 15, align: "center", headerAlign: "center" },
        { 
            field: "matrixName", 
            headerName: "Ma trận đề thi", 
            width: 1090, flex: 0.1, 
            renderCell: (params) => (
                <Link 
                    to={``} 
                    style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
                >
                    {params.row.questionBankName}
                </Link>
            )
        },
        { 
            field: "subjectId", 
            headerName: "Phân môn", 
            width: 1090, flex: 0.1, 
            renderCell: (params) => (
                <Link 
                    to={``} 
                    style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
                >
                    {params.row.questionBankName}
                </Link>
            )
        },
        { 
            field: "questionBankId", 
            headerName: "Ngân hàng câu hỏi", 
            width: 1090, flex: 0.1, 
            renderCell: (params) => (
                <Link 
                    to={``} 
                    style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
                >
                    {params.row.questionBankName}
                </Link>
            )
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 130,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton color="primary" onClick={() => handleEdit(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div className="question-bank-page">
            {/* Breadcrumb */}
            <nav>
                <Link to="/admin">Home</Link> / 
                <span className="breadcrumb-current">Quản lý ma trận đề thi</span>
            </nav>

            <div className="account-actions mt-4">
                <div className="search-container">
                    <SearchBox></SearchBox>
                </div>
                <Link className="add-btn btn" to="/admin/detail-matrix">
                    Thêm mới
                </Link>
            </div>

            {/* Hiển thị bảng theo vai trò đã chọn */}
            <div className="subject-table-container mt-3">
                <Paper sx={{ width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10]}
                    disableColumnResize // ✅ Ngăn kéo giãn cột
                    disableExtendRowFullWidth
                    disableRowSelectionOnClick
                    sx={{
                    "& .MuiDataGrid-cell": {
                        whiteSpace: "normal", // ✅ Cho phép xuống dòng khi nội dung dài
                        wordWrap: "break-word", // ✅ Xuống dòng tự động
                        lineHeight: "1.2", // ✅ Giảm khoảng cách giữa các dòng nếu nội dung quá dài
                        padding: "8px", // ✅ Thêm padding cho đẹp hơn
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        borderBottom: "2px solid #ccc", // Đường phân cách dưới tiêu đề cột
                    },
                    "& .MuiDataGrid-cell": {
                        borderRight: "1px solid #ddd", // Đường phân cách giữa các cột
                    },
                    "& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
                        borderBottom: "none", // Loại bỏ viền dưới cùng của hàng cuối
                    },
                    }}
                />
                </Paper>
            </div>
        </div>
    );
};

export default ExamMatrixPage;
