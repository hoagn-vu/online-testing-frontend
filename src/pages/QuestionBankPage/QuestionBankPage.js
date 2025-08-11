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
import ThesisImage from "../../../src/assets/images/Thesis-bro.png";

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
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

  const toggleDropdown = (id) => {
    setOpenDropdownId(prev => prev === id ? null : id);
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  useEffect(() => {
    // Đóng khi click bên ngoài
    const handleClickOutside = () => {
      closeDropdown();
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

      <div className="">
        <div className="question-bank-card-header d-flex justify-content-between align-items-center mb-4">
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

        <div className="container p-0">
          <div
            className="d-grid"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {listQuestionBank.length === 0 ? (
              <div
                className="d-flex justify-content-center align-items-center text-center text-muted fw-semibold"
                style={{ minHeight: "200px", gridColumn: "1 / -1" }}
              >
                <div className="text-center p-4 rounded shadow-sm bg-light text-muted" style={{ width: "400px"}}>
                  <i className="fa-solid fa-circle-info fa-2x mb-2"></i>
                  <h5>Không có dữ liệu</h5>
                </div>
              </div>
            ) : (
              listQuestionBank.map((item, index) => (
                <div key={item.questionBankId}
                  className="card h-100 shadow-custom border-0 bd-radius-8"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/staff/question/${subjectId}/${item.questionBankId}`, {
                      state: { questionBankName: item.questionBankName },
                    })
                  }
                >
                  {/* Ảnh đại diện */}
                  <img
                    src={ThesisImage} 
                    className="card-img-top rounded-top-4"
                    alt="thumbnail"
                    style={{ height: "160px", objectFit: "cover" }}
                  />

                  <div className="card-body d-flex flex-column justify-content-between">
                    {/* Tiêu đề */}
                    <h5
                      className="card-title fw-bold text-truncate mb-3"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/staff/question/${subjectId}/${item.questionBankId}`, {
                          state: {
                            questionBankName: item.questionBankName,
                          },
                        })
                      }
                    >
                      {item.questionBankName}
                    </h5>

                    {/* Tags dạng chip */}
                    <div className="mb-2">
                      <p className="badge bg-light text-dark border d-inline-block mb-2" style={{ fontSize: "12px" }}>
                        Phân môn: {subjectName}
                      </p><br />
                      <div className="d-flex justify-content-between">
                        <p className="badge bg-light text-dark border d-inline-block" style={{ fontSize: "12px" }}>
                        {item.totalQuestions} câu hỏi
                        </p>
                        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="dropdown-toggle-icon dropdown-custom"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            onClick={() => toggleDropdown(item.questionBankId)}
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </button>
                          <ul className={`dropdown-menu dropdown-menu-end custom-dropdown-questionbank ${openDropdownId === item.questionBankId ? 'show' : ''}`}>
                            <li className="tbl-action">
                              <button className="dropdown-item tbl-action" onClick={() => handlePreEdit(item)}>
                                Chỉnh sửa
                              </button>
                            </li>
                            <li className="tbl-action">
                              <button className="dropdown-item tbl-action" onClick={() => handleDelete(item.questionBankId)}>
                                Xoá
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sample-pagination d-flex justify-content-end align-items-center mt-3">
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
          <div
            className="shadow form-fade bg-white bd-radius-8"
            style={{ width: "750px", boxShadow: 3}}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankPage;
