import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./RoomOrganizePage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Chip, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ReactSelect  from 'react-select';

const listQuestionBank = [{
	sessionId: "SESSION001",
	activeAt: "2025-04-10T08:00:00Z",
	sessionStatus: "Active",
	rooms: [
		{
			roomId: "ROOM101",
			supervisorId: "SUP123",
			candidates: [
				{
						candidateId: "CAND001",
						examId: "EXAM123"
				},
				{
						candidateId: "CAND002",
						examId: "EXAM124"
				}
			]
		},
		{
			roomId: "ROOM102",
			supervisorId: "SUP124",
			candidates: [
				{
					candidateId: "CAND003",
					examId: "EXAM125"
				},
				{
					candidateId: "CAND004",
					examId: "EXAM126"
				}
			]
		}
	]
},
{
	sessionId: "SESSION002",
	activeAt: "2025-04-10T13:00:00Z",
	sessionStatus: "Disabled",
	rooms: [
		{
			roomId: "ROOM201",
			supervisorId: "SUP125",
			candidates: [
				{
					candidateId: "CAND005",
					examId: "EXAM127"
				},
				{
					candidateId: "CAND006",
					examId: "EXAM128"
				}
			]
		}
	]
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

	const [rows, setRows] = useState(() =>
		listQuestionBank.flatMap(session =>
			session.rooms.map(room => ({
				...room,
				sessionId: session.sessionId,
				activeAt: session.activeAt,
				sessionStatus: session.sessionStatus
			}))
		)
	);	
	
	useEffect(() => {
		setRows(
			listQuestionBank.flatMap(session =>
				session.rooms.map(room => ({
					...room,
					sessionId: session.sessionId,
					activeAt: session.activeAt,
					sessionStatus: session.sessionStatus
				}))
			)
		);
	}, [listQuestionBank]);

	
	const columns = [
		{ field: "stt", headerName: "#", width: 15, align: "center", headerAlign: "center" },
		{ 
				field: "roomId", 
				headerName: "Mã phòng thi", 
				width: 300, flex: 0.05, 
	// renderCell: (params) => (
	//   <Link 
	//   to={`/admin/exam/${encodeURIComponent(params.row.id)}`} 
	//   style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
	//   >
	//   {params.row.examCode}
	//   </Link>
	// )
		},
		{ 
				field: "roomName", 
				headerName: "Phòng thi", 
				width: 200, flex: 0.1,
		},
		{ 
			field: "supervisorId", 
			headerName: "Giám thị", 
			width: 200, flex: 0.06,
		},
		{ 
			field: "candidateList", 
			headerName: "Danh sách thí sinh", 
			width: 150, flex: 0.05,
			renderCell: (params) => (
				<Link 
					to={`/admin/organize/rooms/${params.row.sessionId}/${params.row.roomId}`} 
					style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
				>
					Danh sách thí sinh
				</Link>
		
			)
		},
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
					<IconButton color="error" onClick={() => handleDelete(params.row.roomId)}>
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
	
	

	return (
		<div className="exam-management-page">
			{/* Breadcrumb */}
			<nav>
				<Link to="/admin">Home</Link> / 
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

			{/* Hiển thị bảng theo vai trò đã chọn */}
			<div className="subject-table-container mt-3">
				<Paper sx={{ width: "100%" }}>
				<DataGrid
						rows={rows}
						columns={columns}
						initialState={{
						pagination: { paginationModel: { page: 0, pageSize: 5 } },
						}}
						pageSizeOptions={[5, 10]}
						disableColumnResize 
						disableExtendRowFullWidth
						disableRowSelectionOnClick
						getRowId={(row) => row.roomId} 
						localeText={{
								noRowsLabel: "Không có dữ liệu", 
								}}
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
										textAlign: "center",      
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
				</Paper>
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