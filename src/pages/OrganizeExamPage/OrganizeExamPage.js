import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useSearchParams, useNavigate, useLocation  } from "react-router-dom";
import "./OrganizeExamPage.css";
import {InputAdornment, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Pagination, NumberInput, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import CreatableSelect from "react-select/creatable";
import ReactSelect  from 'react-select';
import FormCreateOrganizeExam from "../../components/FormCreateOrganizeExam/FormCreateOrganizeExam";
import AddButton from "../../components/AddButton/AddButton";
import FormCreateOrganizeExamTest from "../../components/FormCreateOrganizeExamTest/FormCreateOrganizeExamTest";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const OrganizeExamPage = () => {
  const [listOrganizeExam, setListOrganizeExam] = useState([]);
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [subjectOptions, setSubjectOptions] = useState([]);
	const [questionBankOptions, setQuestionBankOptions] = useState([]);
	const navigate = useNavigate();
	const [showFormCreate, setShowFormCreate] = useState(false);
	const [listDisplay, setListDisplay] = useState([]);
	const location = useLocation();
	const [showDetailExamForm, setShowDetailExamForm] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [detailData, setDetailData] = useState([]);
	const [showChapter, setShowChapter] = useState(true);
	const [showLevel, setShowLevel] = useState(true);
	const [totalSelectedQuestions, setTotalSelectedQuestions] = useState(0);
	const [totalScore, setTotalScore] = useState(0);
	const [difficultyData, setDifficultyData] = useState([]); 
	const dynamicColSpan = 1 + (showChapter ? 1 : 0) + (showLevel ? 1 : 0);

	useEffect(() => {
		if (location.state?.reload) {
			fetchData(); 
		}
	}, [location.state]);

	const handleOpenForm = () => {
		const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.set("showFormCreate", "true");
		navigate(`${location.pathname}?${newSearchParams.toString()}`);
		setShowFormCreate(true);
	};

	const handleCloseForm = () => {
		const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.delete("showFormCreate");
		const newUrl = newSearchParams.toString()
			? `${location.pathname}?${newSearchParams.toString()}`
			: location.pathname;
		navigate(newUrl, { replace: true });
		setShowFormCreate(false);
		
		fetchData();
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		setShowFormCreate(params.get("showFormCreate") === "true");
	}, [location.search]);

	const [typeOptions, setTypeOptions] = useState([
		{ value: "matrix", label: "Ma trận" },
		{ value: "auto", label: "Ngẫu nhiên" },
		{ value: "exams", label: "Đề thi" },
	]);

	const typeMapping = {
		matrix: "Ma trận",
		auto: "Tự động",
		exams: "Đề thi có sẵn"
	};


  const [formData, setFormData] = useState({
    organizeExamName: "",
    subjectId: "",
		questionBankId: null,
    examType: "",
    examSet: null,
    matrixId: null,
    duration: "",
    maxScore: 10,
		totalQuestions: "",
    organizeExamStatus: "active",
  });

	const [formEditData, setFormEditData] = useState({
    organizeExamName: "",
  });

	const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const response = await ApiService.get('/organize-exams', {
				params: { page, pageSize, keyword },
			});
			setListOrganizeExam(response.data.organizeExams);
			setTotalCount(response.data.totalCount);
		} catch (error) {
			console.error("Failed to fetch data", error);
		}
	};

  useEffect(() => {
    fetchData();
  }, [page, pageSize, keyword]);

	useEffect(() => {
		const fetchSubjectOptions = async () => {
			try {
				const response = await ApiService.get("/subjects");
				setSubjectOptions(response.data.subjects.map((subject) => ({
					value: subject.id,
					label: subject.subjectName,
				})));
			} catch (error) {
				console.error("Failed to fetch subjects", error);
			}
		};
		fetchSubjectOptions();
	}, []);

	const fetchQuestionBankOptions = async (type, subjectId) => {
		if (type !== "auto") {
			setQuestionBankOptions([]);
			return;
		}
		try {
			const response = await ApiService.get("/subjects/question-bank-options", {
				params: { subjectId: subjectId },
			});

			setQuestionBankOptions(response.data.map((questionBank) => ({
				value: questionBank.questionBankId,
				label: questionBank.questionBankName,
			})));
		} catch (error) {
			console.error("Failed to fetch question banks", error);
		}
	};

  const [editingOrganizeExam, setEditingOrganizeExam] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
	}, [showForm]);

  const handleToggleStatus = async (id, currentStatus) => {
    Swal.fire({
      title: "Bạn có chắc muốn thay đổi trạng thái?",
      text: "Trạng thái sẽ được cập nhật ngay sau khi xác nhận!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then(async(result) => {
      if (result.isConfirmed) {
				try {
					// Xác định trạng thái mới
        	const newStatus = currentStatus.toLowerCase() === "active" ? "done" : "active";
					const response = await ApiService.put(
						`/organize-exams/${id}/update-status?newStatus=${newStatus}`,
					);
					await ApiService.post(
						`/statistics/update-organize-exam-grade-stats?organizeExamId=${id}`, 
					);

					await ApiService.post(
						`/statistics/update-participation-violation-by-id?organizeExamId=${id}`
						
					);

					await ApiService.post(
						`/statistics/organize-exam/ramdom-exam-status?organizeExamId=${id}`
					);
					// Sau khi gọi API thành công thì fetch lại dữ liệu
					await fetchData();

					// Xác định trạng thái mới dựa vào trạng thái hiện tại
					let successMessage = "";
					if (currentStatus === "active") {
						successMessage = "Đóng kỳ thi thành công";
					} else {
						successMessage = "Kích hoạt kỳ thi thành công";
					}


					Swal.fire({
						title: "Thành công!",
						text: successMessage,
						icon: "success",
					});
				} catch (error) {
					console.error("Failed to toggle session status: ", error);
					Swal.fire({
						icon: "error",
						title: "Lỗi",
						text: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!",
					});
				}        
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
		if (editingOrganizeExam) {
			try {
				await ApiService.put(`/organize-exams/${editingOrganizeExam.id}`, formData);
				Swal.fire({
					icon: "success",
					text: "Cập nhật tên kỳ thi thành công",
					draggable: true
				});
				fetchData();
			} catch (error) {
				console.error("Failed to update organize exam", error);
			}
		} else {
			try {
				await ApiService.post("/organize-exams", formEditData);
				fetchData();
			} catch (error) {
				console.error("Failed to add organize exam", error);
			}
		}

		resetForm();
  };

  const preEdit = (organizeExam) => {
    setFormData({
      organizeExamName: organizeExam.organizeExamName,
    });
    setEditingOrganizeExam(organizeExam);
    setShowForm(true);
  };
  
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Bạn có chắc chắn xóa?",
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async(result) => {
      if (result.isConfirmed) {
				console.log("Xóa tài khoản có ID:", id);
				try {
          await ApiService.put(`/organize-exams/${id}`, { organizeExamStatus: "deleted" });
          fetchData();
          Swal.fire({
            title: "Đã xóa!",
            text: "Kỳ thi đã bị xóa thành công",
            icon: "success",
          });
        }
        catch (error) {
          console.error("Xóa thất bại:", error);
					Swal.fire({
						icon: "error",
						title: "Lỗi khi xóa kỳ thi",
						text: error.message,
					});
        }
      }
    });
  };

	const resetForm = () => {
		setFormData({
			organizeExamName: "",
			subjectId: "",
			questionBankId: null,
			examType: "",
			examSet: null,
			matrixId: null,
			duration: "",
			maxScore: 10,
			organizeExamStatus: "active",
		});
		setEditingOrganizeExam(null);
		setQuestionBankOptions([]);
		setShowForm(false);
	};
	
	const handleReport = (exam) => {
		navigate(`/staff/organize/report/${exam.id}`);
	};

	const handleStatisticAuto = (exam) => {
		navigate(`/staff/organize/statistic-auto/${exam.id}`);
	};

	const handleDetailClick = async (matrixId) => {
		try {
			const response = await ApiService.get(`/exam-matrices/${matrixId}`);
			const selectedMatrix = response.data?.data;

			if (!selectedMatrix) {
				throw new Error("Không tìm thấy ma trận với ID: " + matrixId);
			}

			// Lấy dữ liệu classification để bổ sung total
			const tagRes = await ApiService.get("/subjects/questions/tags-classification", {
				params: { 
					subjectId: selectedMatrix.subjectId, 
					questionBankId: selectedMatrix.questionBankId, 
					type: selectedMatrix.matrixType   // dùng selectedMatrix thay vì matrix
				},
			});
			const classification = tagRes.data || [];

			// Kết hợp matrixTags với classification để thêm total
			const tags = (selectedMatrix.matrixTags || []).map(tag => {
				if (tag.chapter && tag.chapter.trim() !== "") {
					if (tag.level && tag.level.trim() !== "") {
						const found = classification.find(c => c.chapter === tag.chapter && c.level === tag.level);
						return { ...tag, total: found ? found.total : 0 };
					} else {
						const chapterTotals = classification
							.filter(c => c.chapter === tag.chapter)
							.reduce((sum, c) => sum + (c.total || 0), 0);
						return { ...tag, total: chapterTotals };
					}
				} else {
					const levelTotals = classification
						.filter(c => c.level === tag.level)
						.reduce((sum, c) => sum + (c.total || 0), 0);
					return { ...tag, total: levelTotals };
				}
			});

			setDetailData(tags);
			const hasChapter = tags.some(tag => tag.chapter && tag.chapter.trim() !== "");
			const hasLevel = tags.some(tag => tag.level && tag.level.trim() !== "");

			setShowChapter(hasChapter);
			setShowLevel(hasLevel);

			setTotalSelectedQuestions(tags.reduce((sum, tag) => sum + (tag.questionCount || 0), 0));
			setTotalScore(tags.reduce((sum, tag) => sum + (tag.score || 0), 0));

			setDifficultyData(
				Object.entries(
					tags.reduce((acc, tag) => {
						const key = hasLevel ? (tag.level || "Không xác định") : (tag.chapter || "Không xác định");
						acc[key] = (acc[key] || 0) + (tag.questionCount || 0);
						return acc;
					}, {})
				).map(([key, questionCount]) =>
					hasLevel ? { level: key, questionCount } : { chapter: key, questionCount }
				)
			);

			setShowDetailModal(true);
			console.log("detailData:", tags);
			console.log("classification:", classification);
		} catch (error) {
			console.error("Lỗi lấy chi tiết ma trận:", error);
			Swal.fire("Lỗi!", "Không thể tải chi tiết ma trận. Vui lòng kiểm tra lại.", "error");
		}
	};


  return (
    <div className="p-4">
      {/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/staff/dashboard" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				
				<span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">Quản lý kỳ thi</span>
			</nav>

			{showFormCreate ? (
				<FormCreateOrganizeExam
					onClose={handleCloseForm}
					typeOptions={typeOptions}
				/>
			) : (
				<>
					<div className="tbl-shadow p-3">
						<div className="sample-card-header d-flex justify-content-between align-items-center mb-2">
							<div className='left-header d-flex align-items-center'>
								<div className="search-box rounded d-flex align-items-center">
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

							<div className='right-header d-flex'>
								<AddButton onClick={handleOpenForm}>
									<i className="fas fa-plus me-2"></i> Thêm mới
								</AddButton>
							</div>
						</div>

						{/* Hiển thị bảng theo vai trò đã chọn */}
						<div className="organize-examtable-container mt-3">
							<div className="table-responsive" style={{minHeight: "250px"}}>
								<table className="table organize-exam-table sample-table tbl-organize-hover table-hover" style={{fontSize: "14px"}}>
									<thead>
										<tr className="align-middle fw-medium">
											<th className="text-center">STT</th>
											<th>Kỳ thi</th>
											<th>Phân môn</th>
											<th>Loại</th>
											<th className="text-center">Đề thi</th>
											<th>Ma trận</th>
											<th className="text-center">Thời gian (M)</th>
											<th className="text-center">Điểm</th>
											<th className="text-center">Trạng thái</th>
											<th className="text-center">Thao tác</th>
										</tr>
									</thead>
									<tbody>
									{listOrganizeExam.length === 0 ? (
										<tr>
											<td colSpan="11" className="text-center fw-semibold text-muted"
													style={{ height: "100px", verticalAlign: "middle" }}>
												Không có dữ liệu
											</td>
										</tr>
									) : (
										listOrganizeExam.map((item, index) => (
											<tr key={item.id} className="align-middle">
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
													className="text-center"
												>
													{index + 1}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
													className="text-hover-primary"
												>
													{item.organizeExamName}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
												>
													{item.subjectName}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
												>
													{typeMapping[item.examType] || item.examType}
												</td>
												{/* đề thi */}
												<td
													className="text-center"
													onClick={() => {
														if (item.examType === "exams" && item.exams && item.exams.length > 0) {
															setSelectedItem(item);  
															setShowDetailExamForm(true);
														}
													}}
													style={{
														cursor: item.exams && item.exams.length > 0 ? "pointer" : "default",
														textDecoration: "none",
														color: item.exams && item.exams.length > 0 ? "black" : "gray",
													}}
													onMouseEnter={(e) => {
														if (item.exams && item.exams.length > 0) e.target.style.color = "blue";
													}}
													onMouseLeave={(e) => {
														if (item.exams && item.exams.length > 0) e.target.style.color = "black";
													}}
												>
													{item.examType === "Ma trận" || item.examType === "Tự động" ? "-" : item.exams?.length || "-"}										
												</td>
												<td
													onClick={() => {
														if (item.examType === "matrix" && item.matrixName && item.matrixName.length > 0) {
															console.log("item clicked:", item);
															console.log("matrixId:", item.matrixId);
															handleDetailClick(item.matrixId);
														}
													}}
													style={{
														cursor: item.examType === "matrix" && item.matrixName ? "pointer" : "default",
														textDecoration: "none",
														color: item.examType === "matrix" && item.matrixName ? "black" : "gray",
													}}
													onMouseEnter={(e) => {
														if (item.examType === "matrix" && item.matrixName) e.target.style.color = "blue";
													}}
													onMouseLeave={(e) => {
														if (item.examType === "matrix" && item.matrixName) e.target.style.color = "black";
													}}
												>
													{item.examType === "Đề thi sẵn có" || item.examType === "Tự động"
														? "-"
														: item.matrixName || "-"}
												</td>

												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
													className="text-center"
												>
													{Math.floor(item.duration / 60)}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
													className="text-center"
												>
													{item.maxScore.toFixed(2)}
												</td>
												<td className="text-center">
													<div className="d-flex align-items-center justify-content-center">
														<span className={`badge mt-1 ${item.organizeExamStatus.toLowerCase() === "active" ? "bg-primary" : "bg-secondary"}`}>
															{item.organizeExamStatus.toLowerCase() === "active" ? "Khả dụng" : "Hoàn thành"}
														</span>
													</div>
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
														<ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom"
															style={{
																right: "50%",
																transform: 'translate3d(-10px, 10px, 0px)',
																zIndex: 999999,
															}}
														>
															<li className="tbl-action" onClick={() => preEdit(item)}> 
																<button className="dropdown-item tbl-action" onClick={() => preEdit(item)}>
																	Chỉnh sửa
																</button>
															</li>
															<li className="tbl-action" onClick={() => handleDelete(item.id)}>
																<button className="dropdown-item tbl-action" onClick={() => handleDelete(item.id)}>
																	Xoá
																</button>
															</li>
															<li
																className={`tbl-action ${item.organizeExamStatus.toLowerCase() !== "done" ? "done" : ""}`}
																onClick={() => {
																	if (item.organizeExamStatus.toLowerCase() === "done") {
																		handleReport(item);
																	}
																}}
															>
																<button
																	className="dropdown-item tbl-action"
																	disabled={item.organizeExamStatus.toLowerCase() !== "done"}
																>
																	Báo cáo
																</button>
															</li>
															<li
																className={`tbl-action ${item.organizeExamStatus.toLowerCase() !== "done" ? "done" : ""}`}
																onClick={() => {
																	if (item.organizeExamStatus.toLowerCase() === "done") {
																		if (item.examType.toLowerCase() === "auto" || item.examType.toLowerCase() === "matrix") {
																			handleStatisticAuto(item);
																		} else if (item.examType.toLowerCase() === "exams") {
																			handleStatisticAuto(item);
																		}
																	}
																}}
															>
																<button
																	className="dropdown-item tbl-action"
																	disabled={item.organizeExamStatus.toLowerCase() !== "done"}
																>
																	Thống kê
																</button>
															</li>
															<li className="tbl-action" onClick={() => handleToggleStatus(item.id, item.organizeExamStatus)}>
																<button
																	className="dropdown-item tbl-action"
																	onClick={() =>
																		handleToggleStatus(item.id, item.organizeExamStatus)
																	}
																>
																	{item.organizeExamStatus.toLowerCase() === "active"
																		? "Đóng"
																		: "Kích hoạt"}
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

							<div className="organize-exampagination d-flex justify-content-end align-items-center">
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
					</div>
				</>
			)}

			{/* Form thêm/sửa phân môn */}
			{showForm && (
				<div className="form-overlay">
					<React.Fragment>
						<form
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
									{editingOrganizeExam ? "Chỉnh sửa kỳ thi" : "Thêm mức độ"}
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
									label="Tên kỳ thi"
									required
									value={formData.organizeExamName}
									onChange={(e) =>
										setFormData({ ...formData, organizeExamName: e.target.value })
									}
									inputRef={inputRef}
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
							</Grid>

							<Grid container spacing={2} sx={{justifyContent: "flex-end", p: 3, pt: 1 }}>
								<Grid item xs={3}>
									<CancelButton style={{width: "100%"}} onClick={() => setShowForm(false)}>Hủy</CancelButton>
								</Grid>
								<Grid item xs={3}>
									<AddButton style={{width: "100%"}}>
										{editingOrganizeExam ? "Cập nhật" : "Lưu"}
									</AddButton>
								</Grid>
							</Grid>
						</form>
					</React.Fragment>
				</div>
			)}

			{/* Modal */}
			{showDetailExamForm && selectedItem && (
				<div className="form-overlay">
					<div
						className="shadow form-fade bg-white bd-radius-8"
						style={{ width: "800px", boxShadow: 3 }}
					>
						{/* Header */}
						<div
							className="d-flex justify-content-between align-items-center p-4"
							style={{
								borderBottom: "1px solid #ccc",
								marginBottom: "20px",
								padding: "10px 20px",
							}}
						>
							<h5 className="fw-bold" style={{ margin: 0 }}>Danh sách đề thi</h5>
							<button
								className="btn-close"
								onClick={() => setShowDetailExamForm(false)}
							/>
						</div>

						{/* Nội dung danh sách đề thi */}
						<div style={{ maxHeight: "400px", overflowY: "auto", padding: "0 20px" }}>
							{selectedItem.exams && selectedItem.exams.length > 0 ? (
								<table className="table table-bordered table-hover">
									<thead className="table-light">
										<tr className="text-center">
											<th>STT</th>
											<th>Tên đề thi</th>
											<th>Mã đề thi</th>
										</tr>
									</thead>
									<tbody>
										{selectedItem.exams.map((exam, idx) => (
											<tr key={exam.id || idx}>
												<td className="text-center">{idx + 1}</td>
												<td>{exam.examName}</td>
												<td className="text-center">{exam.examCode || "-"}</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<p>Không có đề thi nào</p>
							)}
						</div>

						{/* Nút hủy */}
						<Grid container spacing={2} sx={{ justifyContent: "flex-end", p: 3, pt: 1 }}>
							<Grid item xs={3}>
								<CancelButton
									onClick={() => setShowDetailExamForm(false)}
									style={{ width: "100%" }}
								>
									Hủy
								</CancelButton>
							</Grid>
						</Grid>
					</div>
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
						<h5 className="modal-title fw-bold">Chi tiết ma trận: {listOrganizeExam.matrixName}</h5>
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
							<div className="table-responsive tbl-shadow pb-0 mb-0" style={{ flex: '1', fontSize: '14px' }}>
								<table className="table w-100 border border-gray-300">
									<thead>
										<tr className="bg-gray-200">
											<th className="border p-2">STT</th>
											{showChapter && <th className="border p-2">Chuyên đề kiến thức</th>}
											{showLevel && <th className="border p-2">Mức độ</th>}
											<th className="border p-2 text-center">Số lượng chọn / Tổng</th>
											<th className="border p-2 text-center">Đơn vị</th>
											<th className="border p-2 text-center">Tổng điểm</th>
											<th className="border p-2 text-center">Điểm/Câu</th>
										</tr>
									</thead>
									<tbody>
										{/* Nếu có chapter thì vẫn group theo chapter */}
										{showChapter ? (
											Object.entries(
												detailData.reduce((acc, tag) => {
													const key = tag.chapter || "Khác";
													if (!acc[key]) acc[key] = [];
													acc[key].push(tag);
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
																<td
																	className="border p-2"
																	rowSpan={tags.length}
																	style={{ minWidth: "300px" }}
																>
																	{chapter}
																</td>
															)}
															{showLevel && (
																<td className="border p-2" style={{ minWidth: "150px" }}>
																	{tag.level || "-"}
																</td>
															)}
															<td className="border p-2 text-center">{tag.questionCount} / {(tag.total || 0).toString().padStart(2, '0')}</td>
															<td className="border p-2 text-center">Câu</td>
															<td className="border p-2 text-center">{(tag.score || 0).toFixed(1)}</td>
															<td className="border p-2 text-center">
																{tag.questionCount === 0 ? "-" : (tag.score / tag.questionCount).toFixed(2)}
															</td>
														</tr>
													))}
												</React.Fragment>
											))
										) : (
											/* Nếu không có chapter thì không group, duyệt trực tiếp */
											detailData.map((tag, index) => (
												<tr key={index} className="border">
													<td className="border p-2 text-center">{index + 1}</td>
													{showLevel && (
														<td className="border p-2" style={{ minWidth: "150px" }}>
															{tag.level || "-"}
														</td>
													)}
													<td className="border p-2 text-center">{tag.questionCount} / {(tag.total || 0).toString().padStart(2, '0')}</td>
													<td className="border p-2 text-center">Câu</td>
													<td className="border p-2 text-center">{(tag.score || 0).toFixed(1)}</td>
													<td className="border p-2 text-center">
														{tag.questionCount === 0 ? "-" : (tag.score / tag.questionCount).toFixed(2)}
													</td>
												</tr>
												
											))
											
										)}
										<tr className="bg-gray-300 fw-bold">
											<td className="border p-2 text-center" colSpan={dynamicColSpan}>Tổng số câu hỏi</td>
											<td className="border p-2 text-center">{totalSelectedQuestions}</td>
											<td className="border p-2 text-center">Câu</td>
											<td className="border p-2 text-center">{totalScore.toFixed(1)}</td>
											<td className="border p-2 text-center">-</td>
										</tr>
									</tbody>

								</table>
							</div>

							<div className="p-2" style={{ minWidth: '250px', fontSize: '14px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', }}>
								<h5 className="text-center">Thống kê</h5>
								<table className="table table-bordered">
									<thead>
										<tr>
											<th style={{ border: '1px solid #ddd', textAlign: 'left', padding: '8px', minWidth: '130px' }}>
												{showLevel ? "Mức độ" : "Chuyên đề"}
											</th>
											<th style={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px' }}>Số lượng</th>
										</tr>
									</thead>
									<tbody>
										{difficultyData.map((row, index) => (
											<tr key={index}>
												<td style={{ border: '1px solid #ddd', padding: '8px' }}>
													{showLevel ? (row.level || "Không xác định") : (row.chapter || "Không xác định")}
												</td>
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
  )
}

export default OrganizeExamPage;