import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./QuestionManagementPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, IconButton, TextField,} from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";

// const listSubject = [
//     { id: 1, subject: "Giải tích",},
//     { id: 2, subject: "Đại số tuyến tính", },
//     { id: 3, subject: "Yeu cầu phần mềm", },
//     { id: 4, subject: "Giao diện và trải nghiệm người dùng", },
//     { id: 5, subject: "Tư tưởng Hồ Chí Minh", },
//     { id: 6, subject: "Học máy và khai phá dữ liệu", },
// ];

const QuestionManagementPage = () => {
    const [listSubject, setListSubject] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await ApiService.get("/subjects");
          response.data.forEach((subject, index) => {
            setListSubject((prev) => [
              ...prev,
              {
                id: subject.id,
                subject: subject.subjectName,
              },
            ]);
          });
        } catch (error) {
          console.error("Lỗi lấy dữ liệu:", error);
        }
      };
      fetchData();
    }, []);
    
    const [showForm, setShowForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [rows, setRows] = useState(Object.values(listSubject).flat());
    // Lọc danh sách tài khoản theo vai trò được chọn

    const columns = [
        { field: "id", headerName: "#", width: 10, align: "center",headerAlign: "center", },
        { 
        field: "subject", headerName: "Tên phân môn", width: 1090,
        renderCell: (params) => (
            <Link 
              to={`/admin/question/${encodeURIComponent(params.row.subject)}`} 
              style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
            >
              {params.row.subject}
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
        subject: "",
    });

    const handleAddNew = () => {
        setEditingAccount(null); // Đảm bảo không ở chế độ chỉnh sửa
        setFormData({
        subject: "",
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
        subject: account.subject,
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
            console.log("Xóa phân môn có ID:", id);

            Swal.fire({
            title: "Đã xóa!",
            text: "Phân môn đã bị xóa.",
            icon: "success",
            });
            setRows(rows.filter((row) => row.id !== id));
        }
        });
    };

    return (
        <div className="subject-page">
        {/* Breadcrumbs */}
        <nav className="breadcrumb-container">
            <Link to="/admin" className="breadcrumb-link">
            Home
            </Link>
            <span> / </span>
            <span className="breadcrumb-current">Ngân hàng câu hỏi</span>
        </nav>

        {/* Thanh tìm kiếm + Nút thêm mới + Upload */}
        <div className="account-actions pt-3 mb-1">
            <div className="search-container">
                <SearchBox></SearchBox>
            </div>
            <button className="add-btn" onClick={handleAddNew}>
                Thêm mới
            </button>
        </div>

        {/* Hiển thị bảng theo vai trò đã chọn */}
        <div className="subject-table-container pt-2">
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
                {editingAccount ? "Chỉnh sửa phân môn" : "Thêm phân môn"}
                </p>

                <Grid container>
                    <TextField
                    fullWidth
                    label="Tên phân môn"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
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

export default QuestionManagementPage;
