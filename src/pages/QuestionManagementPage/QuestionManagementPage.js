import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./QuestionManagementPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, IconButton, TextField, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";

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
    const [rows, setRows] = useState([]);
    const inputRef = useRef(null);

    // Giả lập API call
    useEffect(() => {
        setTimeout(() => {
            const apiData = [
                { id: "67cf6cee1d44d62edf5de90b", subjectName: "Math", subjectStatus: null, questionBanks: [] },
                { id: "67cf6d191d44d62edf5de90d", subjectName: "History", subjectStatus: null, questionBanks: [] },
            ];
            const dataWithIndex = apiData.map((item, index) => ({ ...item, stt: index + 1 })); // Gán số thứ tự
            setRows(dataWithIndex);
        }, 1000);
    }, []);

    const columns = [
        { field: "stt", headerName: "#", width: 15, align: "center", headerAlign: "center" },
        { 
            field: "subjectName", 
            headerName: "Tên phân môn", 
            width: 800, flex: 0.1, 
            renderCell: (params) => (
                <Link 
                    to={`/admin/question/${encodeURIComponent(params.row.subjectName)}`} 
                    style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
                >
                    {params.row.subjectName}
                </Link>
            )
        },
        {
            field: "actions",
            headerName: "Thao tác", align: "center", headerAlign: "center",
            width: 150,
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

    useEffect(() => {
        if (showForm && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showForm]);

    const [formData, setFormData] = useState({
        subjectName: "",
    });

    const handleAddNew = () => {
        setEditingAccount(null);
        setFormData({ subjectName: "" });
        setTimeout(() => setShowForm(true), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAccount) {
            // Cập nhật dữ liệu
            setRows(rows.map((row) => (row.id === editingAccount.id ? { ...row, subjectName: formData.subjectName } : row)));
        } else {
            // Thêm mới dữ liệu
            const newSubject = {
                id: Date.now().toString(), // Giả lập ID, cần backend tạo ID thực
                subjectName: formData.subjectName,
                subjectStatus: null,
                questionBanks: [],
            };
            setRows([...rows, newSubject]);
        }
        setShowForm(false);
    };

    const handleEdit = (subject) => {
        setFormData({ subjectName: subject.subjectName });
        setEditingAccount(subject);
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
                setRows(rows.filter((row) => row.id !== id));
                Swal.fire("Đã xóa!", "Phân môn đã bị xóa.", "success");
            }
        });
    };

    return (
        <div className="subject-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumb-container">
                <Link to="/admin" className="breadcrumb-link">Home</Link>
                <span> / </span>
                <span className="breadcrumb-current">Ngân hàng câu hỏi</span>
            </nav>

            {/* Thanh tìm kiếm + Nút thêm mới */}
            <div className="account-actions pt-3 mb-1">
                <div className="search-container">
                    <SearchBox />
                </div>
                <button className="add-btn" onClick={handleAddNew}>
                    Thêm mới
                </button>
            </div>

            {/* Hiển thị bảng */}
            <div className="subject-table-container pt-2">
                <Paper sx={{ width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { page: 0, pageSize: 5 } },
                        }}
                        pageSizeOptions={[5, 10]}
                        disableColumnResize
                        disableExtendRowFullWidth
                        disableRowSelectionOnClick
                        localeText={{
													noRowsLabel: "Không có dữ liệu", // ✅ Đổi text mặc định của DataGrid
                        }}
                        sx={{
                            "& .MuiDataGrid-cell": {
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                lineHeight: "1.2",
                                padding: "8px",
                            },
                            "& .MuiDataGrid-columnHeaders": {
                                borderBottom: "2px solid #ccc",
                            },
                            "& .MuiDataGrid-cell": {
                                borderRight: "1px solid #ddd",
                            },
                            "& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
                                borderBottom: "none",
                            },
                        }}
                    />
                </Paper>
            </div>

            {/* Form thêm/sửa phân môn */}
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
                                value={formData.subjectName}
                                onChange={(e) =>
                                    setFormData({ ...formData, subjectName: e.target.value })
                                }
                                inputRef={inputRef}
                                sx={{
                                    "& .MuiInputBase-input": { fontSize: "14px", paddingBottom: "11px" },
                                    "& .MuiInputLabel-root": { fontSize: "14px" },
                                }}
                            />
                        </Grid>

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={6}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    {editingAccount ? "Cập nhật" : "Lưu"}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="outlined" color="secondary" fullWidth onClick={() => setShowForm(false)}>
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
