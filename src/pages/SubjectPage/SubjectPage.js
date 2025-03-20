import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./SubjectPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, IconButton, TextField, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";

<<<<<<< Updated upstream:src/pages/QuestionManagementPage/QuestionManagementPage.js
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
=======
const SubjectPage = () => {
  const [listSubject, setListSubject] = useState([]);
>>>>>>> Stashed changes:src/pages/SubjectPage/SubjectPage.js

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

<<<<<<< Updated upstream:src/pages/QuestionManagementPage/QuestionManagementPage.js
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
=======
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
          <Link to="/staff/dashboard" className="breadcrumb-link">Trang chủ</Link>
          <span> / </span>
          <span className="breadcrumb-current">Ngân hàng câu hỏi</span>
      </nav>

      <div className="sample-card-header d-flex justify-content-between align-items-center mt-3 mb-3">
        <div className='left-header d-flex align-items-center'>
          <div className="search-box me-2 rounded d-flex align-items-center">
            <i className="search-icon me-3 pb-0 fa-solid fa-magnifying-glass" style={{fontSize: "12px"}}></i>
            <input
              type="text"
              className="search-input w-100"
              placeholder="Tìm kiếm..."
              // value={searchTerm}
              // onChange={handleChangeSearch}
            />
          </div>
        </div>

        <div className='right-header'>
          <button className="btn btn-primary me-2" onClick={handleAddNew}>
            <i className="fas fa-plus me-2"></i>
            Thêm mới
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table sample-table table-hover">
          <thead>
            <tr className="align-middle">
              <th scope="col" className="text-center title-row">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedItems.length === listSubject.length && listSubject.length > 0}
                />
              </th>
              <th scope="col" className="title-row">Phân môn</th>
              <th scope="col" className="title-row" style={{ width: "120px"}}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {listSubject.map((item, index) => (
              <tr key={item.id} className="align-middle">
                <td className=" text-center" style={{ width: "50px" }}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={(e) => handleSelectItem(e, item.id)}
                    checked={selectedItems.includes(item.id)}
                  />
                </td>
                <td className="fw-semibold text-hover-primary">
                  <Link 
                    to={`/staff/question/${item.id}`} 
                    style={{ textDecoration: "none", cursor: "pointer" }}
                  >
                    {item.subjectName}
                  </Link>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm">
                    <i className="fas fa-edit text-white"></i>
                  </button>
                  <button className="btn btn-danger btn-sm ms-2">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sample-pagination d-flex justify-content-end align-items-center">
        <Pagination count={10} variant="outlined" shape="rounded" />
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
>>>>>>> Stashed changes:src/pages/SubjectPage/SubjectPage.js
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

export default SubjectPage;
