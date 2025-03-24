import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import './QuestionBankPage.css'
import { Box, Button, Grid, IconButton, TextField, Pagination } from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";

const QuestionBankPage = () => {
    const { subjectId } = useParams();
    const [subjectName, setSubjectName] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    const [listQuestionBank, setListQuestionBank] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await ApiService.get("/subjects/question-banks", {
            params: { subId: subjectId },
          });
          setListQuestionBank(response.data.questionBanks);
          setSubjectName(response.data.subjectName);
        } catch (error) {
          console.error("Lỗi lấy dữ liệu:", error);
        }
      };
  
      fetchData();
    }, [subjectId]);
  
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
        setSelectedItems(listQuestionBank.map((item) => item.id));
      } else {
        setSelectedItems([]);
      }
    };

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
      <nav className="mb-3">
        <Link to="/staff/dashboard">Home</Link>
        <span> / </span>
        <Link to="/staff/question">Ngân hàng câu hỏi</Link>
        <span> / </span>
        <span className="breadcrumb-current">{subjectName}</span>
      </nav>

      <div className="tbl-shadow p-3">
        <div className="question-bank-card-header d-flex justify-content-between align-items-center mb-3">
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
            <button className="btn btn-primary" style={{fontSize: "14px"}} onClick={handleAddNew}>
              <i className="fas fa-plus me-2"></i>
              Thêm mới
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table question-bank-table tbl-organize-hover table-hover" style={{fontSize: "14px"}}>
            <thead>
              <tr className="align-middle">
                <th className="text-center" style={{ width: "50px"}}>STT</th>
                <th>Bộ câu hỏi cho phân môn: {subjectName}</th>
                <th className="text-center">Số lượng câu hỏi</th>
                <th className="text-center" style={{ width: "120px"}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {listQuestionBank.map((item, index) => (
                <tr key={item.questionBankId} className="align-middle">
                  <td className="text-center">{index+1}</td>
                  <td >
                    <Link className="text-hover-primary"
                      to={`/staff/question/${subjectId}/${item.questionBankId}`} 
                      style={{ textDecoration: "none", cursor: "pointer", color:"black" }}
                    >
                      {item.questionBankName}
                    </Link>
                  </td>
                  <td className="text-center">{item.totalQuestions}</td>
                  <td className="text-center">
                    <button className="btn btn-primary btn-sm" style={{width: "35px", height: "35px"}}>
                      <i className="fas fa-edit text-white "></i>
                    </button>
                    <button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="question-bank-pagination d-flex justify-content-end align-items-center">
            <Pagination count={10} color="primary" shape="rounded"/>        
        </div>
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

export default QuestionBankPage;
