import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import './ExamMatrixPage.css'
import {Box, Button, Grid, MenuItem, Select, IconButton, TextField, Pagination } from "@mui/material";
import Swal from "sweetalert2";
import ApiService from "../../services/apiService";

const ExamMatrixPage = () => {
  const [listExamMatrix, setListExamMatrix] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/exam-matrices", {
        params: { keyword, page, pageSize },
      });
      setListExamMatrix(response.data.examMatrices);
      setTotalCount(response.data.totalCount)
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [keyword, page, pageSize]);

  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const inputRef = useRef(null);

  const handleAddNew = () => {
    console.log("Thêm mới");
  };

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

  return (
    <div className="exam-matrix-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i></Link> 
        
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Quản lý ma trận đề</span>
      </nav>

      <div className="tbl-shadow p-3">
        <div className="sample-card-header d-flex justify-content-between align-items-center mb-3">
          <div className='left-header d-flex align-items-center'>
            <div className="search-box me-2 rounded d-flex align-items-center">
              <i className="search-icon me-3 pb-0 fa-solid fa-magnifying-glass" style={{fontSize: "12px"}}></i>
              <input
                type="text"
                className="search-input w-100"
                placeholder="Tìm kiếm..."
                value={keyword}
                onChange={handleKeywordChange}
              />
            </div>
          </div>

          <div className='right-header'>
            <Link className="add-btn btn link-btn d-flex align-items-center" to="/staff/matrix-exam/matrix-detail">
              <i className="fas fa-plus me-2"></i>
              Thêm mới
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table sample-table table-hover tbl-organize-hover">
            <thead>
              <tr className="align-middle">
                <th className="text-center" style={{ width: "50px"}}>STT</th>
                <th>Ma trận</th>
                <th>Phân môn</th>
                <th>Bộ câu hỏi</th>
                <th style={{ width: "200px"}}>Số lượng đề tạo sinh</th>
                <th className="text-center" style={{ width: "120px"}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
            {listExamMatrix.length === 0 ? (
								<tr>
									<td colSpan="6" className="text-center fw-semibold text-muted"
											style={{ height: "100px", verticalAlign: "middle" }}>
										Không có dữ liệu
									</td>
								</tr>
							) : (
              listExamMatrix.map((item, index) => (
                <tr key={item.questionBankId} className="align-middle">
                  <td className="text-center">{index + 1}</td>
                  <td >
                    <Link className="text-hover-primary"
                      to={`/staff/`} 
                      style={{ textDecoration: "none", cursor: "pointer", color: "black" }}
                    >
                      {item.matrixName}
                    </Link>
                  </td>
                  <td>{item.subjectName}</td>
                  <td>{item.questionBankName}</td>
                  <td>{item.totalGeneratedExams}</td>
                  <td className="text-center">
                    <button className="btn btn-primary btn-sm" style={{width: "35px", height: "35px"}}>
                      <i className="fas fa-edit text-white "></i>
                    </button>
                    <button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        <div className="sample-pagination d-flex justify-content-end align-items-center">
          { totalCount > 0 && (
            <Pagination
              count={Math.ceil(totalCount / pageSize)}
              shape="rounded"
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          )}
        </div>
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
