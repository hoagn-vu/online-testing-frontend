import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import './ExamManagementPage.css'
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
        examCode: "MTH01",
        examName: "Giữa kỳ Giải tích 1",
        subjectId: "67cf6cee1d44d62edf5de90b",
        questionBankId: "67cf6cee1d44d62edf5de90b",
        examStatus: null,
    },
    {
        id: "67cf6cee1d44d62edf5de902",
        examCode: "MTH01",
        examName: "Giữa kỳ Giải tích 1",
        subjectId: "67cf6cee1d44d62edf5de905",
        questionBankId: "67cf6cee1d44d62edf5de909",
        examStatus: null,
    },
    
];

const ExamManagementPage = () => {
    const [rows, setRows] = useState(Object.values(listQuestionBank).flat());
    
    const columns = [
        { field: "stt", headerName: "#", width: 15, align: "center", headerAlign: "center" },
        { 
            field: "examCode", 
            headerName: "Mã đề thi", 
            width: 1090, flex: 0.1, 
        },
        { 
            field: "examName", 
            headerName: "Tên đề thi", 
            width: 1090, flex: 0.1, 
        },
        { 
            field: "subjectId", 
            headerName: "Phân môn", 
            width: 1090, flex: 0.1,   
        },
        { 
            field: "questionBankId", 
            headerName: "Ngân hàng câu hỏi", 
            width: 1090, flex: 0.1, 
        },
        { 
            field: "examStatus", 
            headerName: "Trạng thái", 
            width: 1090, flex: 0.1, 
        },
        {
            field: "actions",
            headerName: "Thao tác",
            width: 130,
            sortable: false,
        },
    ];

    return (
        <div className="exam-management-page">
            {/* Breadcrumb */}
            <nav>
                <Link to="/admin">Home</Link> / 
                <span className="breadcrumb-current">Quản lý đề thi</span>
            </nav>

            <div className="account-actions mt-4">
                <div className="search-container">
                    <SearchBox></SearchBox>
                </div>
                <Link className="add-btn btn">
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

export default ExamManagementPage;
