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
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showDetailExamForm, setShowDetailExamForm] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [showForm, setShowForm] = useState(false);
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

  const handleToggleStatus = (id, currentStatus) => {
    Swal.fire({
      title: "Bạn có chắc muốn thay đổi trạng thái?",
      text: "Trạng thái sẽ được cập nhật ngay sau khi xác nhận!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const newStatus = currentStatus.toLowerCase() === "active" ? "disabled" : "active";
        const statusLabel = newStatus === "active" ? "Kích hoạt" : "Đóng";

        // Cập nhật state (sau này sẽ gửi API để cập nhật cơ sở dữ liệu)
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, organizeExamStatus: newStatus } : row
          )
        );
        console.log("organizeExamId được đổi status:", id)
        Swal.fire({
          title: "Cập nhật thành công!",
          text: `Trạng thái đã chuyển sang "${statusLabel}".`,
          icon: "success",
        });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
		if (editingOrganizeExam) {
			try {
				await ApiService.put(`/organize-exams/${editingOrganizeExam.id}`, formData);
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
			setListOrganizeExam(prev => prev.filter(item => item.id !== id));

	  	setListDisplay(prev => prev.filter(item => item.id !== id));
      Swal.fire({
        title: "Đã xóa!",
        text: "Kỳ thi đã bị xóa.",
        icon: "success",
      });
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

	const [passwordData, setPasswordData] = useState({
		role: "candidate",
		newPassword: "",
		confirmPassword: "",
	});
	
	const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    console.log("Cập nhật mật khẩu cho vai trò:", passwordData);
    setShowPasswordForm(false);
  };

	const handleTogglePassword = () => setShowPassword((prev) => !prev);
	const handleReport = (exam) => {
		navigate(`/staff/organize/report/${exam.id}`);
	};

  return (
    <div className="p-4">
      {/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				
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
							<div className="table-responsive" style={{minHeight: "230px"}}>
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
														setSelectedItem(item);  
														setShowDetailExamForm(true);
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
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
												>
													{item.examType === "Đề thi sẵn có" || item.examType === "Tự động" ? "-" : item.matrixName || "-"}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
													className="text-center"
												>
													{item.duration}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
													className="text-center"
												>
													{item.maxScore}
												</td>
												<td className="text-center">
													<div className="d-flex align-items-center justify-content-center">
														<span className={`badge mt-1 ${item.organizeExamStatus.toLowerCase() === "active" ? "bg-primary" : "bg-secondary"}`}>
															{item.organizeExamStatus.toLowerCase() === "active" ? "Kích hoạt" : "Đóng"}
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
															<li className="tbl-action" onClick={() => setShowPasswordForm(true)}>
																<button className="dropdown-item tbl-action" onClick={() => setShowPasswordForm(true)}>
																	Mật khẩu thí sinh
																</button>
															</li>
															<li
																className={`tbl-action ${item.organizeExamStatus.toLowerCase() !== "disabled" ? "disabled" : ""}`}
																onClick={() => {
																	if (item.organizeExamStatus.toLowerCase() === "disabled") {
																		handleReport(item);
																	}
																}}
															>
																<button
																	className="dropdown-item tbl-action"
																	disabled={item.organizeExamStatus.toLowerCase() !== "disabled"}
																>
																	Báo cáo
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

			{/* Form Đổi mật khẩu */}
			{showPasswordForm && (
				<div className="form-overlay">
					<div
						className="shadow form-fade bg-white bd-radius-8"
						style={{ width: "800px", boxShadow: 3,}}
						onSubmit={handlePasswordSubmit}
					>
						<div 
							className="d-flex justify-content-between"
							style={{
								borderBottom: "1px solid #ccc",
								marginBottom: "20px",
							}}
						>
							<p className="fw-bold p-4 pb-0">
								Đổi mật khẩu
							</p>
							<button
								className="p-4"
								type="button"
								onClick={() => setShowPasswordForm(false)}
								style={{
									border: 'none',
									background: 'none',
									fontSize: '20px',
									cursor: 'pointer',
								}}
							><i className="fa-solid fa-xmark"></i></button>            
						</div>
						<Grid container spacing={2} sx={{p: 3, pt: 1}}>
							{/* Mã và Họ Tên */}
							<Grid item xs={12}>
								<TextField
									fullWidth
									select
									required
									label="Vai trò"
									value={passwordData.role}
									onChange={(e) =>
										setPasswordData({ ...passwordData, role: e.target.value })
									}
									sx={{
										"& .MuiInputBase-input": {
											fontSize: "14px",
											paddingBottom: "11px",
										},
										"& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
									}}
								>
									<MenuItem value="candidate">Thí sinh</MenuItem>

								</TextField>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Mật khẩu mới"
									type={showPassword ? "text" : "password"}
									required
									inputRef={inputRef}
									value={formData.newPassword}
									onChange={(e) =>
										setPasswordData({ ...passwordData, newPassword: e.target.value })
									}
									sx={{
										"& .MuiInputBase-input": {
											fontSize: "14px",
											paddingBottom: "11px",
										},
										"& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
									}}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={handleTogglePassword} edge="end">
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Xác nhận mật khẩu"
									required
									inputRef={inputRef}
									type={showConfirmPassword  ? "text" : "password"}
									value={formData.confirmPassword}
									onChange={(e) =>
										setPasswordData({ ...passwordData, confirmPassword: e.target.value })
									}
									sx={{
										"& .MuiInputBase-input": {
											fontSize: "14px",
											paddingBottom: "11px",
										},
										"& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
									}}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													onClick={() => setShowConfirmPassword(!showConfirmPassword)}
													edge="end"
												>
													{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							</Grid>
							</Grid>

						{/* Buttons */}
						<Grid container spacing={2} sx={{justifyContent:"flex-end", p: 3, pt: 1 }}>
							<Grid item xs={3}>
								<CancelButton onClick={() => setShowPasswordForm(false)} style={{width: "100%"}}>
									Hủy
								</CancelButton>
							</Grid>
							<Grid item xs={3}>
								<AddButton style={{width: "100%"}}>
									Lưu
								</AddButton>
							</Grid>
						</Grid>
					</div>
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
    </div>
  )
}

export default OrganizeExamPage;