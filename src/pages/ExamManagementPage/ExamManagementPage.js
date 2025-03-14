import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import './ExamManagementPage.css'
import { Box, Button, Grid, IconButton, TextField} from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import Select from 'react-select';

const listQuestionBank = [
	{
		id: "67cf6cee1d44d62edf5de90b",
		examCode: "MTH01",
		examName: "Giữa kỳ Giải tích 1",
		subjectId: "67cf6cee1d44d62edf5de90b",
		questionBankId: "67cf6cee1d44d62edf5de90b",
		examStatus: null,
	},
	{
		id: "67cf6cee1d44d62edf5de902",
		examCode: "MTH01",
		examName: "Giữa kỳ Giải tích 1",
		subjectId: "67cf6cee1d44d62edf5de905",
		questionBankId: "67cf6cee1d44d62edf5de909",
		examStatus: null,
	},
	
];
const colourOptions = [
	{ value: 'red', label: 'Tư tưởng Hồ Chí Minh Tư tưởng Hồ Chí Minh Tư ' },
	{ value: 'blue', label: 'Blue' },
	{ value: 'green', label: 'Green' },
	{ value: 'yellow', label: 'Yellow' },
	{ value: 'purple', label: 'Purple' },
];

const ExamManagementPage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingAccount, setEditingAccount] = useState(null);
	const [rows, setRows] = useState(Object.values(listQuestionBank).flat());
	
	const columns = [
			{ field: "stt", headerName: "#", width: 15, align: "center", headerAlign: "center" },
			{ 
				field: "examCode", 
				headerName: "Mã đề thi", 
				width: 1090, flex: 0.1, 
			},
			{ 
				field: "examName", 
				headerName: "Tên đề thi", 
				width: 1090, flex: 0.1, 
			},
			{ 
				field: "subjectId", 
				headerName: "Phân môn", 
				width: 1090, flex: 0.1,   
			},
			{ 
				field: "questionBankId", 
				headerName: "Ngân hàng câu hỏi", 
				width: 1090, flex: 0.1, 
			},
			{ 
				field: "examStatus", 
				headerName: "Trạng thái", 
				width: 1090, flex: 0.1, 
			},
			{
				field: "actions",
				headerName: "Thao tác", align: "center",headerAlign: "center",
				width: 160,
				sortable: false,
				renderCell: (params) => (
					<>
						<IconButton color="primary" onClick={() => handleEdit(params.row)}>
							<EditIcon />
						</IconButton>
						<IconButton color="error" onClick={() => handleDelete(params.row.id)}>
							<DeleteIcon />
						</IconButton>
					</>
				),
			},
	];

	const paginationModel = { page: 0, pageSize: 5 };
	  const inputRef = useRef(null);
	
	  useEffect(() => {
	  if (showForm && inputRef.current) {
		  inputRef.current.focus();
		}
	  }, [showForm]);
	
	  const handleStatusChange = (id, newStatus) => {
		setRows(
		  rows.map((row) => (row.id === id ? { ...row, status: newStatus } : row))
		);
	  };
	
	  const [formData, setFormData] = useState({
		examCode: "",
		location: "",
		capacity: "",
		status: "active",
	  });
	
	  const handleAddNew = () => {
		setEditingAccount(null); // Đảm bảo không ở chế độ chỉnh sửa
		setFormData({
		  roomName: "",
		  location: "",
		  capacity: "",
		  status: "active",
		});
		setTimeout(() => setShowForm(true), 0); // Đợi React cập nhật state rồi mới hiển thị form
	  };
	
	  const handlePermissionChange = (permission) => {
		setFormData((prevData) => {
		  const updatedPermissions = prevData.permissions.includes(permission)
			? prevData.permissions.filter((p) => p !== permission)
			: [...prevData.permissions, permission];
	
		  return { ...prevData, permissions: updatedPermissions };
		});
	  };
	
	  const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Dữ liệu thêm mới:", formData);
		setShowForm(false);
	  };
	
	  const handleEdit = (account) => {
		setFormData({
		  roomName: account.roomName,
		  location: account.location,
		  capacity: account.capacity,
		  status: account.status,
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
			setRows(rows.filter((row) => row.id !== id));
		  }
		});
	  };

	return (
		<div className="exam-management-page">
			{/* Breadcrumb */}
			<nav>
				<Link to="/admin">Home</Link> / 
				<span className="breadcrumb-current">Quản lý đề thi</span>
			</nav>

			<div className="account-actions mt-4">
				<div className="search-container">
					<SearchBox></SearchBox>
				</div>
				<Link className="add-btn btn" onClick={handleAddNew}>
					Thêm mới
				</Link>
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
					disableColumnResize // ✅ Ngăn kéo giãn cột
					disableExtendRowFullWidth
					disableRowSelectionOnClick
					localeText={{
						noRowsLabel: "Không có dữ liệu", // ✅ Đổi text mặc định của DataGrid
					  }}
					sx={{
					"& .MuiDataGrid-cell": {
						whiteSpace: "normal", // ✅ Cho phép xuống dòng khi nội dung dài
						wordWrap: "break-word", // ✅ Xuống dòng tự động
						lineHeight: "1.2", // ✅ Giảm khoảng cách giữa các dòng nếu nội dung quá dài
						padding: "8px", // ✅ Thêm padding cho đẹp hơn
					},
					"& .MuiDataGrid-columnHeaders": {
						borderBottom: "2px solid #ccc", // Đường phân cách dưới tiêu đề cột
					},
					"& .MuiDataGrid-cell": {
						borderRight: "1px solid #ddd", // Đường phân cách giữa các cột
					},
					"& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
						borderBottom: "none", // Loại bỏ viền dưới cùng của hàng cuối
					},
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
									}}
									onSubmit={handleSubmit}
								>
									<p className="text-align fw-bold">
										{editingAccount ? "Chỉnh sửa tài khoản" : "Tạo đề thi"}
									</p>
			
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<TextField
												fullWidth
												label="Mã đề thi"
												required
												value={formData.examCode}
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
										<Grid item xs={6}>
											<TextField
												fullWidth
												label="Tên đề thi"
												required
												value={formData.examName}
												onChange={(e) =>
													setFormData({ ...formData, name: e.target.value })
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
			
										<Grid item xs={6}>
											<TextField
												fullWidth
												required
												type="number"
												label="Số lượng"
											//   value={formData.capacity}
												disabled={editingAccount}
												sx={{
													"& .MuiInputBase-input": {
														fontSize: "14px",
														paddingBottom: "11px",
													},
													"& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
												}}
											/>
										</Grid>
			
										<Grid item xs={6}>
										<Select
											fullWidth
											className="basic-single "
											classNamePrefix="select"
											placeholder="Chọn ma trận đề"
											name="color"
											options={colourOptions}
											isDisabled={editingAccount}
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
											>
												Hủy
											</Button>
										</Grid>
									</Grid>
								</Box>
							</div>
						)}
		</div>
	);
};

export default ExamManagementPage;
