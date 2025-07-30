import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import './QuestionBankPage.css'
import { Box, Button, Grid, IconButton, TextField, Pagination } from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";

const QuestionBankPage = () => {
  const { subjectId } = useParams();
  const [subjectName, setSubjectName] = useState("");

  const [listQuestionBank, setListQuestionBank] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingBank, setEditingBank] = useState(null);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/subjects/question-banks", {
        params: { subId: subjectId, keyword, page, pageSize },
      });
      setListQuestionBank(response.data.questionBanks);
      setSubjectName(response.data.subjectName);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [subjectId, keyword, page, pageSize]);

  const createQuestionBank = async (questionBankName) => {
    setIsLoading(true);
    try {
      await ApiService.post("/subjects/add-question-bank", {
        subjectId: subjectId,
        questionBankName: questionBankName,
      });
      fetchData();
    } catch (error) {
      console.error("Lỗi tạo ngân hàng câu hỏi:", error);
    }
    setIsLoading(false);
  };

  const updateQuestionBank = async (questionBankId, questionBankName) => {
    setIsLoading(true);
    try {
      await ApiService.put(`/subjects/update-question-bank`, {
        subjectId: subjectId,
        questionBankId: questionBankId,
        questionBankName: questionBankName,
      });
      fetchData();
    } catch (error) {
      console.error("Lỗi cập nhật ngân hàng câu hỏi:", error);
    }
    setIsLoading(false);
  };

  const handlePreAddNew = () => {
    setEditingBank(null);
    setFormData({ questionBankName: "" });
    setShowForm(true);
  };

  const handlePreEdit = (account) => {
    setFormData({
      questionBankId: account.questionBankId,
      questionBankName: account.questionBankName,
    });
    setEditingBank(account);
    setShowForm(true);
  };
  
  const inputRef = useRef(null);
    
  const [formData, setFormData] = useState({
    questionBankName: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBank) {
      updateQuestionBank(editingBank.questionBankId, formData.questionBankName);
    } else {
      createQuestionBank(formData.questionBankName);
    }
    setShowForm(false);
  };


  const handleDelete = (questionBankId) => {
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
        // Xóa ngân hàng câu hỏi khỏi danh sách
        setListQuestionBank(prev => prev.filter(bank => bank.questionBankId !== questionBankId));
                
        Swal.fire({
          title: "Đã xóa!",
          text: "Ngân hàng câu hỏi đã bị xóa.",
          icon: "success",
        });
      }
    });
  };
    return (
      <div className="p-4">
      {/* Breadcrumb */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-between"> <Link to="/staff/question" className="breadcrumb-between">Ngân hàng câu hỏi</Link></span>
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
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
                value={keyword}
                onChange={handleKeywordChange}
              />
            </div>
          </div>

          <div className='right-header'>
            <AddButton onClick={handlePreAddNew}>
              <i className="fas fa-plus me-2"></i>
              Thêm mới
            </AddButton>
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
            {listQuestionBank.length === 0 ? (
								<tr>
									<td colSpan="4" className="text-center fw-semibold text-muted"
											style={{ height: "100px", verticalAlign: "middle" }}>
										Không có dữ liệu
									</td>
								</tr>
							) : (
              listQuestionBank.map((item, index) => (
                <tr key={item.questionBankId} className="align-middle">
                  <td className="text-center">{index+1}</td>
                  <td
                    onClick={() => {
                      navigate(`/staff/question/${subjectId}/${item.questionBankId}`, {
                        state: {
                          questionBankName: item.questionBankName,
                        },
                      });
                    }}
                    style={{ cursor: "pointer", color: "black" }}
                    className="text-hover-primary"
                  >
                    {item.questionBankName}
                  </td>
                  <td
                    onClick={() => {
                      navigate(`/staff/question/${subjectId}/${item.questionBankId}`, {
                        state: {
                          questionBankName: item.questionBankName,
                        },
                      });
                    }}
                    style={{ cursor: "pointer", color: "black" }}
                    className="text-center"
                  >
                    {item.totalQuestions}
                  </td>
                  <td className="text-center align-middle">
                    <div className="dropdown d-inline-block">
                      <button
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        className="dropdown-toggle-icon"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom "
                        style={{
                          right: "50%",
                          transform: 'translate3d(-10px, 10px, 0px)',
                        }}
                      >
                        <li className="tbl-action" onClick={() => handlePreEdit(item)}> 
                          <button className="dropdown-item tbl-action" onClick={() => handlePreEdit(item)}>
                             Chỉnh sửa
                          </button>
                        </li>
                        <li className="tbl-action" onClick={() => handleDelete(item.questionBankId)}>
                          <button className="dropdown-item tbl-action" onClick={() => handleDelete(item.questionBankId)}>
                             Xoá
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        <div className="sample-pagination d-flex justify-content-end align-items-center ">
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
              minWidth: "700px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: 3,
              mx: "auto",
          }}
            onSubmit={handleSubmit}
        >
          <div className="d-flex justify-content-between"
            style={{
              borderBottom: "1px solid #ccc",
              marginBottom: "20px",
            }}
          >
            <p className="fw-bold p-4 pb-0">
            {editingBank ? "Chỉnh sửa bộ câu hỏi" : "Thêm bộ câu hỏi"}
            </p>
            <button
              className="p-4"
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            ><i className="fa-solid fa-xmark"></i></button>
          </div>
          <Grid container sx={{p: 3, pt: 1}}>
            <TextField
            fullWidth
            label="Tên bộ câu hỏi"
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
          <Grid container spacing={2} sx={{justifyContent: "flex-end", p: 3, pt: 1 }}>
          <Grid item xs={3}>
            <CancelButton style={{width: "100%"}} onClick={() => setShowForm(false)}>
              Hủy
            </CancelButton>
          </Grid>
          <Grid item xs={3}>
            <AddButton style={{width: "100%"}}>
              {editingBank ? "Cập nhật" : "Lưu"}
            </AddButton>
          </Grid>
          </Grid>
        </Box>
        </div>
      )}
    </div>
  );
};

export default QuestionBankPage;
