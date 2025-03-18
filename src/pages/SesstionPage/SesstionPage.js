import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import "./SesstionPage.css";
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

const listQuestionBank = [
	{
		sessionId: "SESSION001",
		sessionName: "SESSION001",
		activeAt: "2025-04-10T08:00:00Z",
		sessionStatus: "Active",
		rooms: []
	},
	{
		sessionId: "SESSION002",
		sessionName: "SESSION001",
		activeAt: "2025-04-10T13:00:00Z",
		sessionStatus: "Disabled",
		rooms: []
	},
	{
		sessionId: "SESSION003",
		sessionName: "SESSION001",
		activeAt: "2025-04-10T08:00:00Z",
		sessionStatus: "Active",
		rooms: [ ]
	},
	{
		sessionId: "SESSION004",
		sessionName: "SESSION001",
		activeAt: "2025-04-10T13:00:00Z",
		sessionStatus: "Active",
		rooms: []
	}
];

const SesstionPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingAccount, setEditingAccount] = useState(null);
	const paginationModel = { page: 0, pageSize: 5 };
	const inputRef = useRef(null);
	const [rows, setRows] = useState(Object.values(listQuestionBank).flat());
	const { id: organizeId } = useParams();
	
	const columns = [
		{
			field: "actions",
			headerName: "Thao tác", align: "center",headerAlign: "center",
			width: 150,
			sortable: false,
			renderCell: (params) => (
				<>
					<IconButton color="primary" onClick={() => handleEdit(params.row)}>
						<EditIcon />
					</IconButton>
					<IconButton color="error" onClick={() => handleDelete(params.row.sessionId)}>
						<DeleteIcon />
					</IconButton>
				</>
			),
		},
	];
	
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
			<div className="account-actions mt-4">
				<div className="search-container">
					<SearchBox></SearchBox>
				</div>
				<button className="add-btn" onClick={handleAddNew}>
					Thêm mới
				</button>
			</div>

			<div className="session-table-container mt-3">
			<div className="table-responsive">
				<table className="table sample-table tbl-organize">
					<thead style={{fontSize: "14px"}}>
						<tr className="align-middle fw-medium">
							<th scope="col" className="text-center title-row">
								<input
									className="form-check-input"
									type="checkbox"
									onChange={handleSelectAll}
									checked={selectedItems.length === listQuestionBank.length}
								/>
							</th>
							<th scope="col" className="title-row text-center">STT</th> 
							<th scope="col" className="title-row">Ca thi</th>
							<th scope="col" className="title-row">Active At</th>
							<th scope="col" className="title-row">Phòng thi</th>
							<th scope="col" className="title-row text-center">Trạng thái</th>
							<th scope="col" className="title-row">Thao tác</th>
						</tr>
					</thead>
					<tbody style={{fontSize: "14px"}}>
						{listQuestionBank.map((item, index) => (
							<tr key={item.id} className="align-middle">
								<td className=" text-center" style={{ width: "50px" }}>
									<input
										className="form-check-input"
										type="checkbox"
										onChange={(e) => handleSelectItem(e, item.id)}
										checked={selectedItems.includes(item.id)}
									/>
								</td>
								<td className="text-center">{index + 1}</td>
								<td>{item.sessionName}</td>
								<td>{item.activeAt}</td>
								<td>
									<Link className="text-hover-primary"
										to={`/staff/organize/${organizeId}/${item.sessionId}`} 
										style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
									>
										Danh sách phòng thi
									</Link>
								</td>
								<td>
									<div className="form-check form-switch d-flex justify-content-center">
										<input
											className="form-check-input"
											type="checkbox"
											role="switch"
											checked={item.sessionStatus.toLowerCase() === "active"}
											onChange={() =>
												handleToggleStatus(item.sessionId, item.sessionStatus)
											}
										/>
									</div>
								</td>
								<td>
									<button className="btn btn-primary btn-sm" style={{width: "35px", height: "35px"}}  onClick={() => handleEdit(item)}>
										<i className="fas fa-edit text-white "></i>
									</button>
									<button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}}  onClick={() => handleDelete(item.sessionId)}>
										<i className="fas fa-trash-alt"></i>
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="d-flex justify-content-end">
				<Pagination count={10}></Pagination>
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

export default SesstionPage;