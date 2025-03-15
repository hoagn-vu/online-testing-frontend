import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import './ExamManagementPage.css'
import { Box, Button, Grid, IconButton, TextField, MenuItem, Select} from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ReactSelect  from 'react-select';

const listQuestionBank = [
	{
		id: "67cf6cee1d44d62edf5de90b",
		examCode: "MTH01",
		examName: "Giữa kỳ Giải tích 1",
		subjectId: "67cf6cee1d44d62edf5de90b",
		questionBankId: "67cf6cee1d44d62edf5de90b",
		examStatus: "Active",
	},
	{
		id: "67cf6cee1d44d62edf5de902",
		examCode: "MTH01",
		examName: "Giữa kỳ Giải tích 1",
		subjectId: "67cf6cee1d44d62edf5de905",
		questionBankId: "67cf6cee1d44d62edf5de909",
		examStatus: "Disabled",
	},
	
];

// Dữ liệu mẫu option ngân hàng câu hỏi
const bankOptions = [
	{ value: 'Giải tích 1', label: 'Giải tích 1' },
	{ value: 'Yêu cầu phần mềm', label: 'Yêu cầu phần mềm' },
	{ value: 'Giải tích 2', label: 'Giải tích 2' },

];

// Dữ liệu mẫu option phân môn
const subjectOptions = [
	{ value: 'Tư tưởng Hồ Chí Minh', label: 'Tư tưởng Hồ Chí Minh' },
	{ value: 'Yêu cầu phần mềm', label: 'Yêu cầu phần mềm' },
	{ value: 'Giải tích', label: 'Giải tích' },
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
				width: 160,
				renderCell: (params) => (
					<Select
					value={(params.row.examStatus || "Active").toLowerCase()}  
					onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
						size="small"
						sx={{
						minWidth: 120, 
						fontSize: "15px", 
						padding: "0px", 
						}}
					>
						<MenuItem value="active">Active</MenuItem>
						<MenuItem value="disabled">Disabled</MenuItem>
					</Select>
				),
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
		Swal.fire({
		title: "Xác nhận thay đổi trạng thái?",
		text: "Bạn có chắc chắn muốn thay đổi trạng thái của đề thi?",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Đồng ý",
		cancelButtonText: "Hủy",
		}).then((result) => {
			if (result.isConfirmed) {
				const updatedRows = rows.map((row) =>
					row.id === id ? { ...row, examStatus: newStatus } : row
				);
				setRows(updatedRows);
				Swal.fire("Thành công!", "Trạng thái đã được cập nhật.", "success");
			}
		});
	};

  const [formData, setFormData] = useState({
  examCode: "",
  examName: "",
  subjectId: "",
	questionBankId: "",
  examStatus: "active",
  });

  const handleAddNew = () => {
  setEditingAccount(null); // Đảm bảo không ở chế độ chỉnh sửa
  setFormData({
    examCode: "",
		examName: "",
		subjectId: "",
		questionBankId: "",
		examStatus: "active",
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
      examCode: account.examCode,
      examName: account.examName,
      subjectId: account.subjectId,
			questionBankId: account.questionBankId,
      examStatus: account.examStatus,
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
							}}
							onSubmit={handleSubmit}
						>
							<p className="text-align fw-bold">
								{editingAccount ? "Chỉnh sửa thông tin đề thi" : "Tạo đề thi"}
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
								<Grid item xs={12}>
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
									<ReactSelect
										fullWidth
										className="basic-single "
										classNamePrefix="select"
										placeholder="Chọn phân môn"
										name="color"
										options={subjectOptions}
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
								<Grid item xs={6}>
									<ReactSelect
										fullWidth
										className="basic-single "
										classNamePrefix="select"
										placeholder="Chọn ngân hàng câu hỏi"
										name="color"
										options={bankOptions}
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
