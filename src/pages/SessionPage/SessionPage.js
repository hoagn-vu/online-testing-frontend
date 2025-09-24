import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams, useSearchParams, useNavigate  } from "react-router-dom";
import "./SessionPage.css";
import {Pagination, InputAdornment, Grid, MenuItem, IconButton, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import ApiService from "../../services/apiService";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SessionPage = () => {
	const { organizeId } = useParams();
	const [showForm, setShowForm] = useState(false);
	const [editingAccount, setEditingAccount] = useState(null);
	const inputRef = useRef(null);
	const [organizeExamName, setOrganizeExamName] = useState("");
	const navigate = useNavigate();
	const [showPasswordForm, setShowPasswordForm] = useState(false);
	const [organizeExam, setOrganizeExam] = useState([]);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const response = await ApiService.get('/organize-exams/get-by-id', {
				params: { organizeExamId: organizeId },
			});
			setOrganizeExam(response.data);
		};

		fetchData();
	}, []);

	const [listSession, setListSession] = useState([]);

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
			const response = await ApiService.get(`/organize-exams/sessions`, {
				params: { orgExamId: organizeId, keyword, page, pageSize },
			});
			setListSession(response.data.sessions);
			setTotalCount(response.data.totalCount);
			setOrganizeExamName(response.data.organizeExamName);
		} catch (error) {
			console.error("Failed to fetch data: ", error);
		}finally {
      setIsLoading(false);
    }
	};

	useEffect(() => {
		fetchData();
	}, [organizeId, keyword, page, pageSize]);
	
	const [formData, setFormData] = useState({
		sessionName: "",
		startAt: "",
		sessionStatus: "closed",
	});
	
	const preAddNew = () => {
		setEditingAccount(null); 
		setFormData({
			sessionName: "",
			startAt: "",
			sessionStatus: "closed",
		});
		setTimeout(() => setShowForm(true), 0); 
	};
	
	useEffect(() => {
		if (showForm && inputRef.current) {
			inputRef.current.focus();
		}
	}, [showForm]);

	function showToast(type, message, onClose) {
		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.onmouseenter = Swal.stopTimer;
				toast.onmouseleave = Swal.resumeTimer;
			}
		});

		return Toast.fire({
			icon: type,
			title: message,
			didClose: onClose
		});
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Dữ liệu thêm mới:", formData);
		if (editingAccount) {
			try {
				await ApiService.put(`/organize-exams/${organizeId}/sessions/${formData.sessionId}/update`, formData);
				showToast("success", "Chỉnh sửa ca thi thành công!");
				fetchData();
			}
			catch (error) {
				console.error("Failed to update session: ", error);
			}
		} else {
			try {
				await ApiService.post(`/organize-exams/${organizeId}/sessions`, formData);
				showToast("success", "Thêm ca thi thành công!");
				fetchData();
			} catch (error) {
				console.error("Failed to  add new session: ", error);
			}
		}

		resetForm();
		setShowForm(false);
	};

	const preEdit = (session) => {
		setFormData({
			sessionId: session.sessionId,
			sessionName: session.sessionName,
			startAt: session.startAt,
			sessionStatus: session.sessionStatus,
		});
		setEditingAccount(session);
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
				try {
					await ApiService.delete(`/organize-exams/${organizeId}/sessions/${id}`);
					showToast("success", "Xóa ca thi thành công!");

					// Sau khi xóa thì load lại danh sách
					fetchData();
				} catch (error) {
					console.error("Xóa thất bại:", error);
					showToast("error", error.message);
				}
			}
		});
	};

	const resetForm = () => {
		setFormData({
			sessionId: "",
			sessionName: "",
			startAt: "",
			roomList: "",
			sessionStatus: "closed",
		});
		setEditingAccount(null);
	}

	const examTypeLabels = {
		matrix: "Ma trận",
		auto: "Tự động",
		exams: "Đề thi có sẵn",
	};

	const handleToggleSessionStatus = async (sessionId, currentStatus) => {
		Swal.fire({
			title: "Bạn có chắc muốn thay đổi trạng thái?",
			text: "Trạng thái sẽ được cập nhật ngay sau khi xác nhận!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Xác nhận",
			cancelButtonText: "Hủy",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await ApiService.post(
						"/process-take-exams/toggle-session-status",
						{
							organizeExamId: organizeId,
							sessionId: sessionId,
						}
					);

					// Sau khi gọi API thành công thì fetch lại dữ liệu
					await fetchData();

					// Xác định trạng thái mới dựa vào trạng thái hiện tại
					let successMessage = "";
					if (currentStatus === "active") {
						successMessage = "Đóng ca thi thành công!";
					} else {
						successMessage = "Kích hoạt ca thi thành công!";
					}
					showToast("success", successMessage);
				} catch (error) {
					console.error("Failed to toggle session status: ", error);
					// Kiểm tra code từ API
					if (error.response?.data?.code === "session-has-no-room") {
						showToast("error", "Ca thi không có phòng thi!");
					} else {
						Swal.fire({
							icon: "error",
							title: "Lỗi",
							text: error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!",
						});
					}
				}
			}
		});
	}

	// Đổi mật khẩu thí sinh
	const [passwordData, setPasswordData] = useState({
		role: "candidate",
		organizeExamId: "",
		sessionId: "",
		newPassword: "",
		confirmPassword: "",
	});

	const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
			showToast("warning", "Vui lòng nhập lại mật khẩu xác nhận");
			return;
		}

		try {
			const response = await ApiService.put("/users/update-session-password",
				{
					organizeExamId: organizeId,
					sessionId: passwordData.sessionId,
					newPassword: passwordData.newPassword,
				}
			);
			showToast("success", "Mật khẩu thí sinh đã được cập nhật!");
			setShowPasswordForm(false);
		} catch (error) {
			console.error("Lỗi đổi mật khẩu:", error);
			showToast("error", "Không thể cập nhật mật khẩu, vui lòng thử lại");
		}
  };
	const handleTogglePassword = () => setShowPassword((prev) => !prev);

	return (
		<div className="p-4">
			{/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/staff/dashboard" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
					<Link to="/staff/organize" className="breadcrumb-between">Quản lý kỳ thi</Link></span>
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">{organizeExamName}</span>
			</nav>

			{/* <nav className="mb-3">
				<Link to="/staff">Home</Link> / 
				<span className="breadcrumb-current">Quản lý kỳ thi</span>
			</nav> */}

			<div>
				<div style={{
					background: "#fff",
					padding: "15px 15px 0px 15px",
					marginBottom: "15px",
					borderRadius: "8px",
					boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
					fontSize: "14px"
				}}>
					<p style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "15px" }}>
							Kỳ thi: {organizeExam.organizeExamName}
					</p>

					<div className="d-flex" style={{display: "flex",
							justifyContent: "space-between",
							gap: "20px",
					}}>
						{/* Cột 1 */}
						<div style={{ flex: 1 }}>
								<p><strong>Môn thi:</strong> {organizeExam.subjectName ?? "Chưa có dữ liệu"}</p>
								<p><strong>Loại đề thi:</strong> {examTypeLabels[organizeExam.examType] || organizeExam.examType}</p>
						</div>

						{/* Cột 2 */}
						<div style={{ flex: 1 }}>
							<p><strong>Thời gian làm bài:</strong> {Math.floor(organizeExam.duration / 60)} phút</p>
							{/* Chỉ hiển thị examSet khi loại đề là "exam" */}
							{organizeExam.examType === "exams" && (
								<p>
									<strong>Bộ đề thi:</strong>{" "}
									{organizeExam.exams?.length > 0
										? organizeExam.exams.map(e => e.examName).join(", ")
										: "Chưa có dữ liệu"}
								</p>
							)}

							{/* Chỉ hiển thị tổng số câu hỏi khi loại đề là "auto" */}
							{organizeExam.examType === "auto" && (
								<p><strong>Tổng số câu hỏi:</strong> {organizeExam.totalQuestions ?? "Chưa có dữ liệu"}</p>
							)}
							{organizeExam.examType === "matrix"  && (
									<p><strong>Ma trận đề:</strong> {organizeExam.matrixName ?? "Chưa có dữ liệu"}</p>
							)}
						</div>

						{/* Cột 3 - Hiển thị thông tin đặc biệt */}
						<div style={{ flex: 1 }}>
							{(organizeExam.examType === "matrix" || organizeExam.examType === "auto" || organizeExam.examType === "exams") && (
								<p><strong>Điểm tối đa:</strong> {organizeExam.maxScore?.toFixed(2)}</p>
							)}
						</div>
					</div>
				</div>
			</div>
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

          <div className='right-header'>
						<AddButton onClick={preAddNew}>
							<i className="fas fa-plus me-2"></i>
								Thêm mới
						</AddButton>
          </div>
        </div>

				<div className="session-table-container mt-3">
					<div className="table-responsive" 
						style={{minHeight: "310px"}}
					>
						<table className="table sample-table tbl-organize-hover table-hover">
							<thead style={{fontSize: "14px"}}>
								<tr className="align-middle fw-medium">
									<th scope="col" className="title-row text-center">STT</th> 
									<th scope="col" className="title-row">Ca thi</th>
									<th scope="col" className="title-row">Bắt đầu</th>
									<th scope="col" className="title-row">Kết thúc</th>
									<th scope="col" className="title-row">Phòng thi</th>
									<th scope="col" className="title-row text-center">Trạng thái</th>
									{/* <th scope="col" className="title-row text-center">Giám sát</th> */}
									<th className="text-center">Thao tác</th>
								</tr>
							</thead>
							<tbody style={{ fontSize: "14px" }}>
								{isLoading ? (
									<tr>
										<td colSpan="8" className="text-center">
											<div className="spinner-border text-primary" role="status">
												<span className="visually-hidden">Loading...</span>
											</div>
										</td>
									</tr>
								) : listSession.length === 0 ? (
									<tr>
										<td colSpan="8" className="text-center fw-semibold text-muted"
												style={{ height: "100px", verticalAlign: "middle" }}>
											Không có dữ liệu
										</td>
									</tr>
								) : (
									listSession.map((session, sessionIndex) => (
											<tr key={session.sessionId} className="align-middle">
												<td className="text-center">{sessionIndex + 1}</td>
												<td
													onClick={() => {
														localStorage.setItem("organizeExamName", organizeExamName);
														navigate(`/staff/organize/${organizeId}/${session.sessionId}`, {
															state: {
																sessionName: session.sessionName,
																organizeExamName: organizeExamName,
															},
														});
													}}
													style={{ cursor: "pointer", color: "black" }}
												>
													{session.sessionName}
												</td>
												<td
													onClick={() => {
														localStorage.setItem("organizeExamName", organizeExamName);
														navigate(`/staff/organize/${organizeId}/${session.sessionId}`, {
															state: {
																sessionName: session.sessionName,
																organizeExamName: organizeExamName,
															},
														});
													}}
													style={{ cursor: "pointer", color: "black" }}
												>
													{dayjs(session.startAt).format("DD/MM/YYYY HH:mm")}
												</td>
												<td
													onClick={() => {
														localStorage.setItem("organizeExamName", organizeExamName);
														navigate(`/staff/organize/${organizeId}/${session.sessionId}`, {
															state: {
																sessionName: session.sessionName,
																organizeExamName: organizeExamName,
															},
														});
													}}
													style={{ cursor: "pointer", color: "black" }}
												>
													{dayjs(session.finishAt).format("DD/MM/YYYY HH:mm")}
												</td>
												<td
													onClick={() => {
														localStorage.setItem("organizeExamName", organizeExamName);
														navigate(`/staff/organize/${organizeId}/${session.sessionId}`, {
															state: {
																sessionName: session.sessionName,
																organizeExamName: organizeExamName,
															},
														});
													}}
													style={{ cursor: "pointer", color: "black" }}
													className="text-hover-primary"
												>
													Danh sách phòng thi
												</td>
												<td className="text-center">
													<span className={`badge mt-1 ${session.sessionStatus === "active" ? "bg-primary" : "bg-secondary"}`}>
														{session.sessionStatus === "active" ? "Kích hoạt" : "Đóng"}
													</span>
												</td>
												{/* <td className="text-center">
													<Link className="text-hover-primary report-hover"
															to={`/staff/organize/monitor/${organizeId}/${session.sessionId}`}
															style={{ color: "blue", cursor: "pointer" }}>
														Giám sát
													</Link>
												</td> */}
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
															<li className="tbl-action" onClick={() => setShowPasswordForm(true)}>
																<button 
																	className="dropdown-item tbl-action" 
																	onClick={() => {
																		setPasswordData({
																			...passwordData,
																			sessionId: session.sessionId,
																			newPassword: "",
																			confirmPassword: ""
																		});
																		setShowPasswordForm(true);
																	}}>
																	Mật khẩu thí sinh
																</button>
															</li>
															<li className="tbl-action" onClick={() => preEdit(session)}> 
																<button className="dropdown-item tbl-action" onClick={() => preEdit(session)}>
																	Chỉnh sửa
																</button>
															</li>
															<li className="tbl-action" onClick={() => handleDelete(session.sessionId)}>
																<button className="dropdown-item tbl-action" onClick={() => handleDelete(session.sessionId)}>
																	Xoá
																</button>
															</li>
															<li className="tbl-action" onClick={() => handleToggleSessionStatus(session.sessionId, session.sessionStatus)}>
															{/* <li className="tbl-action" onClick={() => handleToggleStatus(session.sessionId, session.sessionStatus)}> */}
																<button
																	className="dropdown-item tbl-action"
																	onClick={() =>
																		handleToggleSessionStatus(session.sessionId, session.sessionStatus)
																		// handleToggleStatus(session.sessionId, session.sessionStatus)
																	}
																>
																	{session.sessionStatus.toLowerCase() === "active"
																		? "Đóng"
																		: "Kích hoạt"}
																</button>
															</li>
														</ul>
													</div>
												</td>
											</tr>
										))
								)}
							</tbody>

						</table>
					</div>
					<div className="d-flex justify-content-end mb-2">
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
			

			{/* Form thêm tài khoản */}
			{showForm && (
				<div className="form-overlay">
					<form
						className="shadow form-fade bg-white bd-radius-8"
						style={{ width: "750px", boxShadow: 3, top: "-60px", position: "relative",}}
						onSubmit={handleSubmit}
					>
						<div className="d-flex justify-content-between"
							style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "20px",
              }}
						>
						<p className="fw-bold p-4 pb-0">
							{editingAccount ? "Chỉnh sửa thông tin ca thi" : "Tạo ca thi"}
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
						<Grid container spacing={2} sx={{p: 3, pt: 1}}>										
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Ca thi"
									required
									value={formData.sessionName}
									inputRef={inputRef}
									onChange={(e) =>
									setFormData({ ...formData, sessionName: e.target.value })
									}
									sx={{
										"& .MuiInputBase-input": {
												fontSize: "14px",
												paddingBottom: "11px",
										},
										"& .MuiInputLabel-root": { fontSize: "14px" },
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DateTimePicker
										label="Thời gian bắt đầu"
										value={formData.startAt ? dayjs(formData.startAt) : null}
										onChange={(newValue) => 
										setFormData({ ...formData, startAt: newValue ? newValue.toISOString() : "" })
										}
										sx={{
											width: "100%", 
										}}
										slotProps={{
											textField: {
												fullWidth: true,
												sx: {
													"& .MuiInputBase-root": {
															height: "50px", 
															fontSize: "16px",
													},
													"& .MuiInputLabel-root": {
															fontSize: "14px",
													},
												},
											},
										}}
									/>
								</LocalizationProvider>
							</Grid>
							{/* <Grid item xs={6}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DateTimePicker
										label="Finish at"
										value={formData.activeAt ? dayjs(formData.activeAt) : null}
										onChange={(newValue) => 
										setFormData({ ...formData, activeAt: newValue ? newValue.toISOString() : "" })
										}
										sx={{
											width: "100%", 
										}}
										slotProps={{
											textField: {
												fullWidth: true,
												sx: {
													"& .MuiInputBase-root": {
															height: "50px", 
															fontSize: "16px",
													},
													"& .MuiInputLabel-root": {
															fontSize: "14px",
													},
												},
											},
										}}
									/>
								</LocalizationProvider>
							</Grid> */}
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
										{editingAccount ? "Cập nhật" : "Lưu"}
									</AddButton>
								</Grid>
							</Grid>
					</form>
				</div>
			)}

			{/* Form Đổi mật khẩu */}
			{showPasswordForm && (
				<div className="form-overlay">
					<form
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
								<AddButton type="submit" style={{width: "100%"}}>
									Lưu
								</AddButton>
							</Grid>
						</Grid>
					</form>
				</div>
			)}
		</div>
	)
}

export default SessionPage;