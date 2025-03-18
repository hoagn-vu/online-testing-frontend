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
                questionBankId: "67cf702d1d44d62edf5de919",
                questionBankName: "His 1",
                questionBankStatus: null,
                list: [],
            },
            {
                questionBankId: "67cf70341d44d62edf5de917",
                questionBankName: "His 2",
                questionBankStatus: null,
                list: [],
            }
        ]
    }
];

const QuestionBankNamePage = () => {
    const { subject } = useParams();  // Lấy môn học từ URL

    const [showForm, setShowForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [rows, setRows] = useState(Object.values(listQuestionBank).flat());

    const columns = [
        { field: "stt", headerName: "#", width: 15, align: "center", headerAlign: "center" },
        { 
            field: "questionBankName", 
            headerName: "Ngân hàng câu hỏi", 
            width: 1090, flex: 0.1, 
            renderCell: (params) => (
                <Link 
                    to={`/admin/question/${subject}/${params.row.id}`} 
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
    

    const paginationModel = { page: 0, pageSize: 5 };
    const inputRef = useRef(null);

    useEffect(() => {
        if (!subject) return; // Tránh lỗi nếu subject chưa có
    
        const formattedData = listQuestionBank
            .filter((item) => item.subjectName.toLowerCase() === subject.toLowerCase()) // Lọc theo subjectName
            .flatMap((filteredSubject) =>
                filteredSubject.questionBanks.map((bank, index) => ({
                    stt: index + 1, // Số thứ tự
                    id: bank.questionBankId, // ID ngân hàng câu hỏi
                    questionBankName: bank.questionBankName, // Tên ngân hàng câu hỏi
                }))
            );
    
        setRows(formattedData);
    }, [subject]);
    

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
        questionBankName: "",
    });

    const handleAddNew = () => {
        setEditingAccount(null); // Đảm bảo không ở chế độ chỉnh sửa
        setFormData({
            questionBankName: "",
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
            questionBankName: account.questionBankName,
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
          <Link to="/staff/dashboard">Home</Link>
          <span> / </span>
          <Link to="/staff/question">Ngân hàng câu hỏi</Link>
          <span> / </span>
          <span className="breadcrumb-current">{decodeURIComponent(subject)}</span>
        </nav>

            <div className="account-actions mt-4">
              <div className="search-container">
                  <SearchBox></SearchBox>
              </div>
              <button className="add-btn" onClick={handleAddNew}>
                Thêm mới
              </button>
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
                    localeText={{
											noRowsLabel: "Không có dữ liệu", // ✅ Đổi text mặc định của DataGrid
                    }}
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
                    "& .MuiTablePagination-displayedRows": {
                    textAlign: "center",        // Căn giữa chữ "1-1 of 1"
                    marginTop: "16px",
                    marginLeft: "0px"
                    },
                    "& .MuiTablePagination-selectLabel": {
                        marginTop: "13px",
                        marginLeft: "0px"
                    },
                    "& .MuiTablePagination-select": {
                        marginLeft: "0px",
                    } 
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
                        value={formData.questionBankName}
                        onChange={(e) =>
                            setFormData({ ...formData, questionBankName: e.target.value })
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
