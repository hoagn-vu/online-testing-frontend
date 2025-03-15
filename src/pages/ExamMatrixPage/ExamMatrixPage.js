import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import './ExamMatrixPage.css'
import {Box, Button, Grid, MenuItem, Select, IconButton, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";

// Dữ liệu mẫu
const listExamMatrix = [
    {
        "id": "matrix_001",
        "questionBankId": "812004",
        "matrixName": "Đề thi Toán học kỳ 1",
        "matrixStatus": "Active",
        "totalGeneratedExams": 10,
        "subjectId": "math_101",
        "matrixTags": [
          {
            "tagName": "Nhận biết",
            "questionCount": 15,
            "tagScore": 0.1
          },
          {
            "tagName": "Thông hiểu",
            "questionCount": 15,
            "tagScore": 0.1
          },
          {
            "tagName": "Vận dụng cao",
            "questionCount": 15,
            "tagScore": 0.1
          }
        ],
        "examId": [
          "exam_001",
          "exam_002",
          "exam_003",
          "exam_004",
          "exam_005"
        ]
      }
      
];

const ExamMatrixPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const inputRef = useRef(null);
  // const [rows, setRows] = useState(Object.values(listExamMatrix).flat());
  const [rows, setRows] = useState([...listExamMatrix]);

  useEffect(() => {
    console.log("Dữ liệu rows:", rows);
      if (showForm && inputRef.current) {
        inputRef.current.focus();
      }
      }, [showForm]);

  // const handleStatusChange = (id, newStatus) => {
  //   const updatedRows = rows.map((row) =>
  //     row.id === id ? { ...row, matrixStatus: newStatus } : row
  //   );
  //   console.log("Cập nhật trạng thái:", updatedRows);
  //   setRows(updatedRows);
  // };

  const handleStatusChange = (id, newStatus) => {
    Swal.fire({
      title: "Xác nhận thay đổi trạng thái?",
      text: "Bạn có chắc chắn muốn thay đổi trạng thái của ma trận đề?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedRows = rows.map((row) =>
          row.id === id ? { ...row, matrixStatus: newStatus } : row
        );
        setRows(updatedRows);
        Swal.fire("Thành công!", "Trạng thái đã được cập nhật.", "success");
      }
    });
  };
  
  const [formData, setFormData] = useState({
    matrixName: "",
    subjectId: "",
    questionBankId: "",
    matrixStatus: "active",
  });

  const handleEdit = (account) => {
    setFormData({
      matrixName: account.matrixName,
      subjectId: account.subjectId,
      questionBankId: account.questionBankId,
      matrixStatus: account.matrixStatus,
    });
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu thêm mới:", formData);
    setShowForm(false);
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
      console.log("Xóa tài khoản có ID:", id);
  
      Swal.fire({
        title: "Đã xóa!",
        text: "Ma trận đề thi đã bị xóa.",
        icon: "success",
      });
      setRows(rows.filter((row) => row.id !== id));
      }
    });
  };
  const columns = [
    { field: "stt", headerName: "#", width: 15, align: "center", headerAlign: "center", },
    { 
        field: "matrixName", 
        headerName: "Ma trận đề thi", 
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
        field: "matrixStatus",
        headerName: "Trạng thái",
        width: 160,
        renderCell: (params) => (
        <Select
        value={(params.row.matrixStatus || "Active").toLowerCase()}  
        onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
            size="small"
            sx={{
            minWidth: 120, 
            fontSize: "15px", 
            padding: "0px", 
            }}
        >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="disabled">Disabled</MenuItem>
        </Select>
        ),
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
              <span className="breadcrumb-current">Quản lý ma trận đề</span>
          </nav>

          <div className="account-actions mt-4">
              <div className="search-container">
                  <SearchBox></SearchBox>
              </div>
              <Link className="add-btn btn link-btn" to="/admin/detail-matrix">
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
                  disableColumnResize 
                  disableExtendRowFullWidth
                  disableRowSelectionOnClick
                  getRowId={(row) => row.id}
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
          {/* Form thêm tài khoản */}
          {showForm && (
            <div className="form-overlay">
              <Box
                component="form"
                sx={{
                  width: "600px",
                  backgroundColor: "white",
                  p: 2,
                  borderRadius: "8px",
                  boxShadow: 3,
                  mx: "auto",
                }}
                onSubmit={handleSubmit}
              >
                <p className="text-align fw-bold">
                  {"Chỉnh sửa ma trận đề thi" }
                </p>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Ma trận đề thi"
                      required
                      value={formData.matrixName}
                      inputRef={inputRef}
                      onChange={(e) =>
                        setFormData({ ...formData, studentId: e.target.value })
                      }
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: "14px",
                          paddingBottom: "11px",
                        },
                        "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      select
                      label="Trạng thái"
                      required
                      value={formData.matrixStatus}
                      onChange={(e) =>
                        setFormData({ ...formData, matrixStatus: e.target.value })
                      }
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: "14px",
                          paddingBottom: "11px",
                        },
                        "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                      }}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="disabled">Disabled</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      required
                      label="Phân môn"
                      value={formData.subjectId}
                      disabled={editingAccount}
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: "14px",
                          paddingBottom: "11px",
                        },
                        "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      required
                      label="Ngân hàng câu hỏi"
                      value={formData.questionBankId}
                      disabled={editingAccount}
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: "14px",
                          paddingBottom: "11px",
                        },
                        "& .MuiInputLabel-root": { fontSize: "14px" }, 
                      }}
                    />
                  </Grid>
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

export default ExamMatrixPage;
