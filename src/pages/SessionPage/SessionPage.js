import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams, useSearchParams, useNavigate  } from "react-router-dom";
import "./SessionPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Pagination, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
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

const SessionPage = () => {
	const { organizeId } = useParams();

	const [showForm, setShowForm] = useState(false);
	const [editingAccount, setEditingAccount] = useState(null);
	const inputRef = useRef(null);
	const [organizeExamName, setOrganizeExamName] = useState("");
	const navigate = useNavigate();
	
	const [organizeExam, setOrganizeExam] = useState([]);

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
		try {
			const response = await ApiService.get(`/organize-exams/sessions`, {
				params: { orgExamId: organizeId, keyword, page, pageSize },
			});
			setListSession(response.data.sessions);
			setTotalCount(response.data.totalCount);
			setOrganizeExamName(response.data.organizeExamName);
		} catch (error) {
			console.error("Failed to fetch data: ", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, [organizeId, keyword, page, pageSize]);
	
	const [formData, setFormData] = useState({
		sessionId: "",
		sessionName: "",
		activeAt: "",
		roomList: "",
		sessionStatus: "inactive",
	});
	
	const preAddNew = () => {
		setEditingAccount(null); 
		setFormData({
			sessionId: "",
			sessionName: "",
			activeAt: "",
			roomList: "",
			sessionStatus: "inactive",
		});
		setTimeout(() => setShowForm(true), 0); 
	};
	
	useEffect(() => {
		if (showForm && inputRef.current) {
			inputRef.current.focus();
		}
	}, [showForm]);

	const handleStatusChange = (id, newStatus) => {
		Swal.fire({
		title: "Xác nhận thay đổi trạng thái?",
		text: "Bạn có chắc chắn muốn thay đổi trạng thái của ca thi?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Đồng ý",
		cancelButtonText: "Hủy",
		}).then((result) => {
			if (result.isConfirmed) {
				const updatedRows = rows.map((row) =>
					row.sessionId === id ? { ...row, sessionStatus: newStatus } : row
				);
				setRows(updatedRows);
				Swal.fire("Thành công!", "Trạng thái đã được cập nhật.", "success");
			}
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Dữ liệu thêm mới:", formData);
		if (editingAccount) {
			try {
				await ApiService.put(`/organize-exams/${organizeId}/sessions/${formData.sessionId}`, formData);
				fetchData();
			}
			catch (error) {
				console.error("Failed to update session: ", error);
			}
		} else {
			try {
				await ApiService.post(`/organize-exams/${organizeId}/sessions`, formData);
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
			activeAt: session.activeAt,
			sessionStatus: session.sessionStatus,
		});
		setEditingAccount(session);
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

			Swal.fire({
				title: "Đã xóa!",
				text: "Ca thi đã bị xóa.",
				icon: "success",
			});
      setListSession(prev => prev.filter(session => session.sessionId !== id));
			}
		});
	};

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
				const newStatus = currentStatus === "Active" ? "Disabled" : "Active";
        const statusLabel = newStatus === "active" ? "Kích hoạt" : "Đóng";

				// Cập nhật state (sau này sẽ gửi API để cập nhật cơ sở dữ liệu)
				setRows((prevRows) =>
					prevRows.map((row) =>
						row.id === id ? { ...row, sessionStatus: newStatus } : row
					)
				);
				console.log("sessionId được đổi status:", id)
				Swal.fire({
					title: "Cập nhật thành công!",
					text: `Trạng thái đã chuyển sang "${statusLabel}".`,
					icon: "success",
				});
			}
		});
	};

	const resetForm = () => {
		setFormData({
			sessionId: "",
			sessionName: "",
			activeAt: "",
			roomList: "",
			sessionStatus: "inactive",
		});
		setEditingAccount(null);
	}

	return (
		<div className="p-4">
			{/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
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
								<p><strong>Loại đề thi:</strong> {organizeExam.examType}</p>
						</div>

						{/* Cột 2 */}
						<div style={{ flex: 1 }}>
							<p><strong>Thời gian làm bài:</strong> {organizeExam.duration} phút</p>
							{/* Chỉ hiển thị examSet khi loại đề là "exam" */}
							{organizeExam.examType === "exam" && (
								<p><strong>Bộ đề thi:</strong> {organizeExam.exams?.length > 0 ? organizeExam.examSet.join(", ") : "Chưa có dữ liệu"}</p>
							)}

							{/* Chỉ hiển thị tổng số câu hỏi khi loại đề là "auto" */}
							{organizeExam.examType === "auto" && (
								<p><strong>Tổng số câu hỏi:</strong> {organizeExam.totalQuestions ?? "Chưa có dữ liệu"}</p>
							)}
						</div>

						{/* Cột 3 - Hiển thị thông tin đặc biệt */}
						<div style={{ flex: 1 }}>
							{(organizeExam.examType === "matrix" || organizeExam.examType === "auto") && (
								<p><strong>Điểm tối đa:</strong> {organizeExam.maxScore}</p>
							)}
							{organizeExam.examType === "matrix"  && (
									<p><strong>Ma trận đề:</strong> {organizeExam.matrixName ?? "Chưa có dữ liệu"}</p>
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
				<div className="table-responsive">
					<table className="table sample-table tbl-organize-hover table-hover">
						<thead style={{fontSize: "14px"}}>
							<tr className="align-middle fw-medium">
								<th scope="col" className="title-row text-center">STT</th> 
								<th scope="col" className="title-row">Ca thi</th>
								<th scope="col" className="title-row">Bắt đầu</th>
								<th scope="col" className="title-row">Kết thúc</th>
								<th scope="col" className="title-row">Phòng thi</th>
								<th scope="col" className="title-row">Trạng thái</th>
								<th scope="col" className="title-row text-center">Giám sát</th>
								<th className="text-center">Thao tác</th>
							</tr>
						</thead>
						<tbody style={{ fontSize: "14px" }}>
							{listSession.length === 0 ? (
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
												{dayjs(session.activeAt).format("DD/MM/YYYY HH:mm")}
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
												{dayjs(session.activeAt).format("DD/MM/YYYY HH:mm")}
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
												<div className="d-flex align-items-center justify-content-left">
													<span className={`badge mt-1 ${session.sessionStatus === "Active" || "available" ? "bg-primary" : "bg-secondary"}`}>
														{session.sessionStatus === "Active" || "available" ? "Kích hoạt" : "Đóng"}
													</span>
												</div>
											</td>
											<td className="text-center">
												<Link className="text-hover-primary report-hover"
														to={`/staff/organize/monitor/${organizeId}/${session.sessionId}`}
														style={{ color: "blue", cursor: "pointer" }}>
													Giám sát
												</Link>
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
														<li className="tbl-action" onClick={() => handleToggleStatus(session.sessionId, session.sessionStatus)}>
															<button
																className="dropdown-item tbl-action"
																onClick={() =>
																	handleToggleStatus(session.sessionId, session.sessionStatus)
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
					<div
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
							<Grid item xs={6}>
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DateTimePicker
										label="Start at"
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
							</Grid>
							<Grid item xs={6}>
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
							</Grid>
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
					</div>
				</div>
			)}
		</div>
	)
}

export default SessionPage;