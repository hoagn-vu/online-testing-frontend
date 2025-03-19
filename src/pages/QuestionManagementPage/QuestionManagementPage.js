import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./QuestionManagementPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Grid, IconButton, TextField, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from '@mui/material/Pagination';
import ApiService from "../../services/apiService";

const QuestionManagementPage = () => {
  const [listSubject, setListSubject] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiService.get("/subjects");
        setListSubject(response.data.subjects);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectItem = (e, id) => {
    if (e.target.checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(listSubject.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [rows, setRows] = useState([]);
  const inputRef = useRef(null);

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

      <div className="sample-card-header d-flex justify-content-between align-items-center mt-3 pb-2">
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
          <button className="btn btn-primary me-2" style={{fontSize: "14px"}} onClick={handleAddNew}>
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
                  checked={selectedItems.length === listSubject.length}
                />
              </th>
              <th scope="col" className="title-row">Phân môn</th>
              <th scope="col" className="title-row" style={{ width: "120px"}}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {listSubject.length === 0 ? (
              <tr>
                <td colSpan="3" 
                    className="text-center fw-semibold text-muted" 
                    style={{ height: "100px", verticalAlign: "middle" }}>
                  Không có dữ liệu
                </td>
              </tr>
              ) : (
              listSubject.map((item, index) => (
                <tr key={item.id} className="align-middle">
                  <td className="text-center" style={{ width: "50px" }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onChange={(e) => handleSelectItem(e, item.id)}
                      checked={selectedItems.includes(item.id)}
                    />
                  </td>
                  <td className="fw-semibold text-hover-primary">
                    <Link 
                      to={`/staff/question/${encodeURIComponent(item.subjectName)}`} 
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="subject-pagination d-flex justify-content-end align-items-center">
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
