import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import './QuestionBankNamePage.css'
import { Box, Button, Grid, IconButton, TextField,} from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { Search } from "lucide-react";
import Swal from "sweetalert2";

const listQuestionBank = [
    { id: 1, question_bank_name: "Giải tích 1",},
    { id: 2, question_bank_name: "Giải tích 2", },
    { id: 3, question_bank_name: "Giải tích 3", },
];

const QuestionBankNamePage = () => {
    const { subject } = useParams();  // Lấy môn học từ URL

    const [showForm, setShowForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [rows, setRows] = useState(Object.values(listQuestionBank).flat());

    const columns = [
        { field: "id", headerName: "#", width: 10, align: "center",headerAlign: "center", },
        { 
        field: "question_bank_name", headerName: "Ngân hàng câu hỏi", width: 1090,
        renderCell: (params) => (
            <Link  
              style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
            >
              {params.row.question_bank_name}
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

    const paginationModel = { page: 0, pageSize: 5 };
    const inputRef = useRef(null);

    useEffect(() => {
    if (showForm && inputRef.current) {
        inputRef.current.focus();
      }
    }, [showForm]);

    const handleStatusChange = (id, newStatus) => {
        setRows(
        rows.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
        );
    };

    const [formData, setFormData] = useState({
        question_bank_name: "",
    });

    const handleAddNew = () => {
        setEditingAccount(null); // Đảm bảo không ở chế độ chỉnh sửa
        setFormData({
        question_bank_name: "",
        });
        setTimeout(() => setShowForm(true), 0); // Đợi React cập nhật state rồi mới hiển thị form
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu thêm mới:", formData);
        setShowForm(false);
    };

    const handleEdit = (account) => {
        setFormData({
        question_bank_name: account.question_bank_name,
        });
        setEditingAccount(account);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
        title: "Bạn có chắc chắn xóa?",
        text: "Bạn sẽ không thể hoàn tác hành động này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        }).then((result) => {
        if (result.isConfirmed) {
            // Xóa tài khoản ở đây (ví dụ: gọi API hoặc cập nhật state)
            console.log("Xóa ngân hàng câu hỏi có ID:", id);

            Swal.fire({
            title: "Đã xóa!",
            text: "Ngân hàng câu hỏi đã bị xóa.",
            icon: "success",
            });
            setRows(rows.filter((row) => row.id !== id));
        }
        });
    };
    return (
        <div className="question-bank-page">
        {/* Breadcrumb */}
        <nav>
            <Link to="/admin">Home</Link> / 
            <Link to="/admin/question">Ngân hàng câu hỏi</Link> / 
            <span className="breadcrumb-current">{decodeURIComponent(subject)}</span>
        </nav>
            {/* Thanh tìm kiếm + Nút thêm mới + Upload */}
            <div className="account-actions">
                <button className="add-btn" onClick={handleAddNew}>
                    Thêm mới
                </button>

                {/* Ô tìm kiếm + icon */}
                <div className="search-container">
                <input type="text" placeholder="Tìm kiếm..." className="search-box" />
                <Search className="search-icon" size={20} />
                </div>
            </div>

            {/* Hiển thị bảng theo vai trò đã chọn */}
            <div className="subject-table-container">
                <h5>Danh sách ngân hàng câu hỏi - {decodeURIComponent(subject)}</h5>                
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

            {/* Form thêm tài khoản */}
            {showForm && (
                <div className="form-overlay">
                <Box
                    component="form"
                    sx={{
                        minWidth: "500px",
                        minHeight: "200px",
                        backgroundColor: "white",
                        p: 2,
                        borderRadius: "8px",
                        boxShadow: 3,
                        mx: "auto",
                    }}
                    onSubmit={handleSubmit}
                >
                    <p className="text-align fw-bold">
                    {editingAccount ? "Chỉnh sửa ngân hàng câu hỏi" : "Thêm ngân hàng câu hỏi"}
                    </p>

                    <Grid container>
                        <TextField
                        fullWidth
                        label="Tên ngân hàng câu hỏi"
                        required
                        value={formData.question_bank_name}
                        onChange={(e) =>
                            setFormData({ ...formData, question_bank_name: e.target.value })
                        }
                        inputRef={inputRef}
                        sx={{
                            "& .MuiInputBase-input": {
                            fontSize: "14px",
                            paddingBottom: "11px",
                            },
                            "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                        }}
                        />
                    </Grid>

                    {/* Buttons */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        >
                        {editingAccount ? "Cập nhật" : "Lưu"}
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => setShowForm(false)}
                        >
                        Hủy
                        </Button>
                    </Grid>
                    </Grid>
                </Box>
                </div>
            )}
        </div>
    );
};

export default QuestionBankNamePage;
