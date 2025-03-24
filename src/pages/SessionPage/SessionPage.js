import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
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

const SessionPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingAccount, setEditingAccount] = useState(null);
	const inputRef = useRef(null);
	const { id: organizeId } = useParams();

		const [listOrganizeExam, setListOrganizeExam] = useState([]);
	
		useEffect(() => {
			const fetchData = async () => {
				const response = await ApiService.get('/organize-exams');
				setListOrganizeExam(response.data.organizeExams);
			};
	
			fetchData();
		}, []);

	const [listSession, setListSession] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await ApiService.get(`/organize-exams/sessions`, {
					params: { orgExamId: organizeId },
				});
				setListSession(response.data.sessions);
			} catch (error) {
				console.error("Failed to fetch data: ", error);
			}
		};

		fetchData();
	}, [organizeId]);
	
	
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
	
	const [formData, setFormData] = useState({
	sessionId: "",
	activeAt: "",
	roomList: "",
	sessionStatus: "active",
	});

	const handleAddNew = () => {
	setEditingAccount(null); 
	setFormData({
		sessionId: "",
		activeAt: "",
		roomList: "",
		sessionStatus: "active",
	});
	setTimeout(() => setShowForm(true), 0); 
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Dữ liệu thêm mới:", formData);
		setShowForm(false);
	};

	const handleEdit = (account) => {
		setFormData({
			sessionId: account.sessionId,
			activeAt: account.activeAt,
			sessionStatus: account.sessionStatus,
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
			console.log("Xóa tài khoản có ID:", id);

			Swal.fire({
				title: "Đã xóa!",
				text: "Tài khoản đã bị xóa.",
				icon: "success",
			});
			setRows(rows.filter((row) => row.sessionId !== id));
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

				// Cập nhật state (sau này sẽ gửi API để cập nhật cơ sở dữ liệu)
				setRows((prevRows) =>
					prevRows.map((row) =>
						row.id === id ? { ...row, sessionStatus: newStatus } : row
					)
				);
				console.log("sessionId được đổi status:", id)
				Swal.fire({
					title: "Cập nhật thành công!",
					text: `Trạng thái đã chuyển sang "${newStatus}".`,
					icon: "success",
				});
			}
		});
	};

	return (
		<div className="exam-management-page">
			{/* Breadcrumb */}
			<nav>
				<Link to="/staff">Home</Link> / 
				<span className="breadcrumb-current">Quản lý kỳ thi</span>
			</nav>

		<div>
			{listOrganizeExam.map((exam) => (
				<div key={exam.id} style={{
					background: "#fff",
					padding: "15px 15px 0px 15px",
					marginBottom: "15px",
					borderRadius: "8px",
					boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
					fontSize: "14px"
				}}>
					<p style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "15px" }}>
							Kỳ thi: {exam.organizeExamName}
					</p>

					<div className="d-flex" style={{display: "flex",
							justifyContent: "space-between",
							gap: "20px",
					}}>
						{/* Cột 1 */}
						<div style={{ flex: 1 }}>
								<p><strong>Môn thi:</strong> {exam.subjectName ?? "Chưa có dữ liệu"}</p>
								<p><strong>Loại đề thi:</strong> {exam.examType}</p>
						</div>

						{/* Cột 2 */}
						<div style={{ flex: 1 }}>
							<p><strong>Thời gian làm bài:</strong> {exam.duration} phút</p>
							{exam.examType === "exam" || "Đề thi" && (
									<p><strong>Bộ đề thi:</strong> {exam.exams.length > 0 ? exam.examSet.join(", ") : "Chưa có dữ liệu"}</p>
							)}
							{exam.examType === "matrix" || "Ma trận" && (
									<p><strong>Ma trận đề:</strong> {exam.matrixName ?? "Chưa có dữ liệu"}</p>
							)}
							{exam.examType === "auto" || "Ngẫu nhiên" && (
									<p><strong>Tổng số câu hỏi:</strong> {exam.totalQuestion ?? "Chưa có dữ liệu"}</p>
							)}
						</div>

						{/* Cột 3 - Hiển thị thông tin đặc biệt */}
						<div style={{ flex: 1 }}>
							{(exam.examType === "matrix" || "Ma trận" || exam.examType === "auto" || "Ngẫu nhiên") && (
									<p><strong>Điểm tối đa:</strong> {exam.maxScore}</p>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
			<div className="account-actions mt-2">
				<div className="search-container">
					<SearchBox></SearchBox>
				</div>
				<button className="btn btn-primary me-2" style={{fontSize: "14px"}} onClick={handleAddNew}>
					<i className="fas fa-plus me-2"></i>
					Thêm mới
				</button>
			</div>

			<div className="session-table-container mt-3">
			<div className="table-responsive">
				<table className="table sample-table tbl-organize">
					<thead style={{fontSize: "14px"}}>
						<tr className="align-middle fw-medium">
							<th scope="col" className="title-row text-center">STT</th> 
							<th scope="col" className="title-row">Ca thi</th>
							<th scope="col" className="title-row">Active At</th>
							<th scope="col" className="title-row">Phòng thi</th>
							<th scope="col" className="title-row">Trạng thái</th>
							<th scope="col" className="title-row text-center">Giám sát</th>
							<th scope="col" className="title-row">Thao tác</th>
						</tr>
					</thead>
					<tbody style={{ fontSize: "14px" }}>
						{listSession.length === 0 ? (
							<tr>
								<td colSpan="6" className="text-center fw-semibold text-muted"
										style={{ height: "100px", verticalAlign: "middle" }}>
									Không có dữ liệu
								</td>
							</tr>
						) : (
							listSession.map((session, sessionIndex) => (
									<tr key={session.sessionId} className="align-middle">
										<td className="text-center">{sessionIndex + 1}</td>
										<td>{session.sessionName}</td>
										<td>{dayjs(session.activeAt).format("DD/MM/YYYY HH:mm")}</td>
										<td>
											<Link className="text-hover-primary"
													to={`/staff/organize/${organizeId}/${session.sessionId}`}
													style={{ textDecoration: "none", color: "black", cursor: "pointer" }}>
												Danh sách phòng thi
											</Link>
										</td>
										<td className="text-center">
											<div className="form-check form-switch d-flex align-items-center justify-content-left">
												<input
													className="form-check-input"
													type="checkbox"
													role="switch"
													checked={session.sessionStatus === "Active" || "available"}
													onChange={() => handleToggleStatus(session.sessionId, session.sessionStatus)}
												/>
												<span className={`badge ms-2 ${session.sessionStatus === "Active" || "available" ? "bg-primary" : "bg-secondary"}`}>
													{session.sessionStatus === "Active" || "available" ? "Hoạt động" : "Không hoạt động"}
												</span>
											</div>
										</td>


										<td className="text-center">
											<Link className="text-hover-primary"
													to={`/staff/organize/monitor/${organizeId}/${session.sessionId}`}
													style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}>
												Giám sát
											</Link>
										</td>
										<td>
											<button className="btn btn-primary btn-sm" style={{ width: "35px", height: "35px" }}
															onClick={() => handleEdit(session)}>
												<i className="fas fa-edit text-white"></i>
											</button>
											<button className="btn btn-danger btn-sm ms-2" style={{ width: "35px", height: "35px" }}
															onClick={() => handleDelete(session.sessionId)}>
												<i className="fas fa-trash-alt"></i>
											</button>
										</td>
									</tr>
								))
						)}
					</tbody>

				</table>
			</div>
			<div className="d-flex justify-content-end">
				<Pagination count={10} color="primary"></Pagination>
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
							position: "relative",
							top: "-60px",
						}}
						onSubmit={handleSubmit}
					>
						<p className="text-align fw-bold">
								{editingAccount ? "Chỉnh sửa thông tin ca thi" : "Tạo ca thi"}
						</p>

						<Grid container spacing={2}>										
							<Grid item xs={6}>
								<TextField
									fullWidth
									label="Ca thi"
									required
									value={formData.sessionId}
									inputRef={inputRef}
									onChange={(e) =>
									setFormData({ ...formData, sessionId: e.target.value })
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
										label="Active at"
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
	)
}

export default SessionPage;