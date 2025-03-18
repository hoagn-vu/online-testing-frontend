import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "./RoomOrganizePage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Pagination, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ReactSelect  from 'react-select';

const listQuestionBank = [
	{
		roomId: "ROOM101",
		roomName: "401",
		supervisorId: "SUP123",
		roomStatus: "Active",
		candidates: []
	},
	{
		roomId: "ROOM102",
		roomName: "402",
		supervisorId: "SUP124",
		roomStatus: "Active",
		candidates: []
	}
];

const subjectOptions = [
	{ value: 'Tư tưởng Hồ Chí Minh', label: 'Tư tưởng Hồ Chí Minh' },
	{ value: 'Yêu cầu phần mềm', label: 'Yêu cầu phần mềm' },
	{ value: 'Giải tích', label: 'Giải tích' },
];

const RoomOrganizePage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingAccount, setEditingAccount] = useState(null);
	const paginationModel = { page: 0, pageSize: 5 };
	const inputRef = useRef(null);
	const [rows, setRows] = useState();
	const {sessionId} = useParams();
	const { id: organizeId } = useParams();

	console.error("organizeId:", organizeId);
	useEffect(() => {
		setRows(
		  listQuestionBank.map(room => ({
			...room, // Giữ nguyên dữ liệu của room
		  }))
		);
	  }, []);
	
	useEffect(() => {
		if (showForm && inputRef.current) {
				inputRef.current.focus();
		}
		}, [showForm]);
	
	const [formData, setFormData] = useState({
		roomId: "",
		roomName: "",
		supervisorId: "",
		candidateList: "",
	});

	const handleAddNew = () => {
	setEditingAccount(null); 
	setFormData({
		roomId: "",
		roomName: "",
		supervisorId: "",
		candidateList: "",
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
				roomId: account.roomId,
				roomName: account.roomName,
				supervisorId: account.supervisorId,
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
				console.log("Xóa phòng thi có ID:", id);
	
				setRows(prevRows => {
					const updatedRows = prevRows.filter(row => row.roomId !== id);
					console.log("Danh sách sau khi xóa:", updatedRows);
					return updatedRows;
				});
	
				Swal.fire({
					title: "Đã xóa!",
					text: "Phòng thi đã bị xóa.",
					icon: "success",
				});
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
						row.id === id ? { ...row, roomStatus: newStatus } : row
					)
				);
				console.log("roomId được đổi status:", id)
				Swal.fire({
					title: "Cập nhật thành công!",
					text: `Trạng thái đã chuyển sang "${newStatus}".`,
					icon: "success",
				});
			}
		});
	};

	return (
		<div>
			{/* Breadcrumb */}
			<nav>
				<Link to="/staff">Home</Link> / 
				<span className="breadcrumb-current">Quản lý kỳ thi</span>
			</nav>
			<div className="account-actions mt-4">
				<div className="search-container">
						<SearchBox></SearchBox>
				</div>
				<button className="add-btn" onClick={handleAddNew}>
						Thêm mới
				</button>
			</div>

			<div className="room-organize-table-container mt-3">
				<div className="table-responsive">
					<table className="table sample-table tbl-organize">
						<thead style={{fontSize: "14px"}}>
							<tr className="align-middle fw-medium">
								<th scope="col" className="title-row text-center">STT</th> 
								<th scope="col" className="title-row">Mã phòng</th>
								<th scope="col" className="title-row">Phòng</th>
								<th scope="col" className="title-row">Giám thị</th>
								<th scope="col" className="title-row">Thí sinh</th>
								<th scope="col" className="title-row text-center">Trạng thái</th>
								<th scope="col" className="title-row">Thao tác</th>
							</tr>
						</thead>
						<tbody style={{fontSize: "14px"}}>
							{listQuestionBank.map((item, index) => (
								<tr key={item.roomId} className="align-middle">
									<td className="text-center">{index + 1}</td>
									<td>{item.roomId}</td>
									<td>{item.roomName}</td>
									<td>{item.supervisorId}</td>
									<td>
										<Link className="text-hover-primary"
											to={`/staff/organize/${organizeId}/${sessionId}/${item.roomId}`}
											style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
										>
											Danh sách thí sinh
										</Link>
									</td>
									<td>
										<div className="form-check form-switch d-flex justify-content-center">
											<input
												className="form-check-input"
												type="checkbox"
												role="switch"
												checked={item.roomStatus.toLowerCase() === "active"}
												onChange={() =>
													handleToggleStatus(item.roomId, item.roomStatus)
												}
											/>
										</div>
									</td>
									<td>
										<button className="btn btn-primary btn-sm" style={{width: "35px", height: "35px"}}  onClick={() => handleEdit(item)}>
											<i className="fas fa-edit text-white "></i>
										</button>
										<button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}}  onClick={() => handleDelete(item.roomId)}>
											<i className="fas fa-trash-alt"></i>
										</button>
									</td>
								</tr>
							))}
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
						<p className="text-align fw-bold">{editingAccount ? "Chỉnh sửa thông tin ca thi" : "Thêm phòng thi"}</p>
						<Grid container spacing={2}>										
						<Grid item xs={12}>
						<ReactSelect
								fullWidth
								className="basic-single "
								classNamePrefix="select"
								placeholder="Phòng thi"
								name="color"
								options={subjectOptions}
								styles={{
									control: (base) => ({
										...base,
										height: "48px", // Tăng chiều cao
										minHeight: "40px",
									}),
									valueContainer: (base) => ({
										...base,
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										fontSize: "14px",
									}),
									placeholder: (base) => ({
										...base,
										fontSize: "14px", // Cỡ chữ của placeholder (label)
									}),
								}}
							/>
						</Grid>
							<Grid item xs={6}>
							<ReactSelect
									fullWidth
									className="basic-single "
									classNamePrefix="select"
									placeholder="Giám thị"
									name="color"
									options={subjectOptions}
									styles={{
										control: (base) => ({
											...base,
											width: "275px", // Cố định chiều rộng
											minWidth: "275px",
											maxWidth: "250px",
											height: "48px", // Tăng chiều cao
											minHeight: "40px",
										}),
										menu: (base) => ({
											...base,
											width: "250px", // Cố định chiều rộng của dropdown
										}),
										valueContainer: (base) => ({
											...base,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
											fontSize: "14px",
										}),
										placeholder: (base) => ({
											...base,
											fontSize: "14px", // Cỡ chữ của placeholder (label)
										}),
									}}
								/>
							</Grid>
							<Grid item xs={6}>
								<ReactSelect
										fullWidth
										className="basic-single "
										classNamePrefix="select"
										placeholder="Nhóm thí sinh"
										name="color"
										options={subjectOptions}
										styles={{
											control: (base) => ({
												...base,
												width: "275px", // Cố định chiều rộng
												minWidth: "275px",
												maxWidth: "250px",
												height: "48px", // Tăng chiều cao
												minHeight: "40px",
											}),
											menu: (base) => ({
												...base,
												width: "250px", // Cố định chiều rộng của dropdown
											}),
											valueContainer: (base) => ({
												...base,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												fontSize: "14px",
											}),
											placeholder: (base) => ({
												...base,
												fontSize: "14px", // Cỡ chữ của placeholder (label)
											}),
										}}
								/>
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
										> Hủy </Button>
								</Grid>
						</Grid>
					</Box>
				</div>
			)}
		</div>
	)
}

export default RoomOrganizePage;