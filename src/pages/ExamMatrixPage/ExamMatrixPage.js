import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import './ExamMatrixPage.css'
import {Box, Button, Grid, MenuItem, Select, IconButton, TextField, Pagination } from "@mui/material";
import Swal from "sweetalert2";
import ApiService from "../../services/apiService";
import { Modal } from "react-bootstrap";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";

const ExamMatrixPage = () => {
  const [listExamMatrix, setListExamMatrix] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingMatrix, setEditingMatrix] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [totalSelectedQuestions, setTotalSelectedQuestions] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [difficultyData, setDifficultyData] = useState([]);   
  
  const handleDetailClick = async (matrix) => {
  setEditingMatrix(matrix);
  try {
    const response = await ApiService.get(`/exam-matrices`);
    const examMatrices = response.data.examMatrices || [];
    const selectedMatrix = examMatrices.find((m) => m.id === matrix.id);

    if (!selectedMatrix) {
      throw new Error("Không tìm thấy ma trận với ID: " + matrix.id);
    }

    const tags = selectedMatrix.matrixTags || [];
    setDetailData(tags);

    // Tính tổng số câu hỏi đã chọn
    setTotalSelectedQuestions(tags.reduce((sum, tag) => sum + tag.questionCount, 0));

    // Tính tổng điểm
    setTotalScore(tags.reduce((sum, tag) => sum + tag.score, 0));

    // Tính toán difficultyData
    setDifficultyData(
      Object.entries(
        tags.reduce((acc, tag) => {
          acc[tag.level] = (acc[tag.level] || 0) + tag.questionCount;
          return acc;
        }, {})
      ).map(([level, questionCount]) => ({ level, questionCount }))
    );
  } catch (error) {
    console.error("Lỗi lấy chi tiết ma trận:", error);
    Swal.fire("Lỗi!", "Không thể tải chi tiết ma trận. Vui lòng kiểm tra lại.", "error");
  }
  setShowDetailModal(true);
};

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

  useEffect(() => {
    if (showForm && inputRef.current) {
        inputRef.current.focus();
    }
  }, [showForm]);

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
      setListExamMatrix(prev => prev.filter(matrix => matrix.id !== id));
      }
    });
  };

  return (
    <div className="p-4">
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
                <th className="text-center" style={{ width: "200px"}}>Số lượng đề tạo sinh</th>
                <th className="text-center" style={{ width: "200px"}}>Trạng thái</th>
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
                <tr key={`${item.questionBankId}-${index}`} className="align-middle">
                  <td className="text-center">{index + 1}</td>
                  <td>
                      <span
                        className="text-hover-primary"
                        style={{ textDecoration: "none", cursor: "pointer", color: "black" }}
                        onClick={() => handleDetailClick(item)}
                      >
                        {item.matrixName}
                      </span>
                    </td>
                  <td>{item.subjectName}</td>
                  <td>{item.questionBankName}</td>
                  <td className="text-center">{item.totalGeneratedExams}</td>
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center">
                      <span className={`badge ms-2 mt-1 ${item.matrixStatus === "Active" || "available" ? "bg-primary" : "bg-secondary"}`}>
                        {item.matrixStatus === "Active" || "available" ? "Được sử dụng" : "Chưa sử dụng"}
                      </span>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="dropdown">
                      <button
                        className="btn btn-light btn-sm "
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{
                          width: "35px",
                          height: "35px",
                          padding: 0,
                          background: "none",
                          border: "none",
                          boxShadow: "none",
                        }}
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom "
                        style={{
                          right: "50%",
                          transform: 'translate3d(-10px, 10px, 0px)',
                        }}
                      >
                        <li className="tbl-action" onClick={() => handleEdit(item)}> 
                          <button 
                            className="dropdown-item tbl-action" 
                            onClick={() => handleEdit(item)}
                            disabled={item.examIds && item.examIds.length > 0}
                          >
                             Chỉnh sửa
                          </button>
                        </li>
                        <li className="tbl-action" onClick={() => handleDelete(item.id)}>
                          <button className="dropdown-item tbl-action" onClick={() => handleDelete(item.id)}>
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
              width: "700px",
              backgroundColor: "white",
              p: 3,
              borderRadius: "8px",
              boxShadow: 3,
              mx: "auto",
            }}
            onSubmit={handleSubmit}
          >
            <p className="mb-4 fw-bold">
              {"Chỉnh sửa thông tin ma trận đề thi" }
            </p>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
            </Grid>		
            {/* Buttons */}
            <Grid container spacing={2} sx={{mt: 1, justifyContent: "flex-end"}}>
              <Grid item xs={3}>
                <CancelButton style={{width: "100%"}} onClick={() => setShowForm(false)}>Hủy</CancelButton>
              </Grid>
              <Grid item xs={3}>
                <AddButton style={{width: "100%"}}>Cập nhật</AddButton>
              </Grid>
            </Grid>
          </Box>
        </div>
      )}

      {/* Modal chi tiết */}
      {showDetailModal && (
      <div className="form-overlay">
        <div style={{ backgroundColor: "#ffff",borderRadius: "8px"}}>
          <div className="p-3"
            style={{
              borderBottom: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: "#ffff",
              borderRadius: "8px"
            }}
          >
            <h5 className="modal-title fw-bold">Chi tiết ma trận: {editingMatrix?.matrixName}</h5>
            <button
              type="button"
              onClick={() => setShowDetailModal(false)}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            ><i className="fa-solid fa-xmark"></i></button>
          </div>
          <div className="p-4" style={{ overflowY: 'auto',}}>
            <div className="d-flex gap-2 w-100" style={{ flexWrap: 'wrap' }}>
              <div className="table-responsive tbl-shadow pb-0" style={{ flex: '1', fontSize: '14px' }}>
                <table className="table w-100 border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">STT</th>
                      <th className="border p-2">Chuyên đề kiến thức</th>
                      <th className="border p-2">Mức độ</th>
                      <th className="border p-2 text-center">Số lượng chọn / Tổng</th>
                      <th className="border p-2 text-center">Đơn vị</th>
                      <th className="border p-2 text-center">Tổng điểm</th>
                      <th className="border p-2 text-center">Điểm/Câu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      detailData.reduce((acc, tag) => {
                        if (!acc[tag.chapter]) {
                          acc[tag.chapter] = [];
                        }
                        acc[tag.chapter].push(tag);
                        return acc;
                      }, {})
                    ).map(([chapter, tags], chapterIndex) => (
                      <React.Fragment key={chapterIndex}>
                        {tags.map((tag, levelIndex) => (
                          <tr key={`${chapterIndex}-${levelIndex}`} className="border">
                            {levelIndex === 0 && (
                              <td className="border p-2 text-center" rowSpan={tags.length}>
                                {chapterIndex + 1}
                              </td>
                            )}
                            {levelIndex === 0 && (
                              <td className="border p-2" rowSpan={tags.length} style={{ minWidth: '300px' }}>
                                {chapter}
                              </td>
                            )}
                            <td className="border p-2" style={{ minWidth: '150px' }}>{tag.level}</td>
                            <td className="border p-2 text-center" style={{ minWidth: '100px' }}>
                              <div className="d-flex align-items-center justify-content-center gap-1">
                                {tag.questionCount}
                                <span>/ {String(10).padStart(2, '0')}</span> {/* Giả định total = 10 */}
                              </div>
                            </td>
                            <td className="border p-2 text-center" style={{ minWidth: '70px' }}>Câu</td>
                            <td className="border p-2 text-center">
                              {tag.score.toFixed(1)}
                            </td>
                            <td className="border p-2 text-center">
                              {tag.questionCount === 0
                                ? '-'
                                : (tag.score / tag.questionCount).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                    <tr className="bg-gray-300 fw-bold">
                      <td className="border p-2 text-center" colSpan="3">Tổng số câu hỏi</td>
                      <td className="border p-2 text-center">{totalSelectedQuestions}</td>
                      <td className="border p-2 text-center">Câu</td>
                      <td className="border p-2 text-center">{totalScore.toFixed(1)}</td>
                      <td className="border p-2 text-center">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-2" style={{ width: '250px', height:"200px", fontSize: '14px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', }}>
                <h5 className="text-center">Thống kê</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ddd', textAlign: 'left', padding: '8px', minWidth: '130px' }}>Mức độ</th>
                      <th style={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px' }}>Số lượng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {difficultyData.map((row, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.level}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{row.questionCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="p-3" style={{borderTop: '1px solid #ddd', textAlign: 'right',}}>
            <button onClick={() => setShowDetailModal(false)}
              style={{
                border: '1px solid #ccc',
                backgroundColor: '#6c757d',
                color: '#fff',
                padding: '5px 15px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ExamMatrixPage;
