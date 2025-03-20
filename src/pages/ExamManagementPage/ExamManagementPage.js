import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import './ExamManagementPage.css'
import { Box, Button, Grid, IconButton, TextField, Pagination, MenuItem, Select} from "@mui/material";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ReactSelect  from 'react-select';
import ApiService from "../../services/apiService";

const ExamManagementPage = () => {
	const [listExam, setListExam] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await ApiService.get("/exams");
				setListExam(response.data.exams);
			} catch (error) {
				console.error("Lỗi lấy dữ liệu:", error);
			}
		};

		fetchData();
	}, []);

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
			setSelectedItems(listExam.map((item) => item.id));
		} else {
			setSelectedItems([]);
		}
	};

	const [showForm, setShowForm] = useState(false);
	const [editingAccount, setEditingAccount] = useState(null);
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
		<div className="sample-management-page">
			{/* Breadcrumb */}
			<nav>
				<Link to="/staff">Home</Link> / 
				<span className="breadcrumb-current">Quản lý đề thi</span>
			</nav>

			<div className="sample-card-header d-flex justify-content-between align-items-center mt-3 mb-3">
				<div className='left-header d-flex align-items-center'>
					<div className="search-box me-2 rounded d-flex align-items-center">
						<i className="search-icon me-3 pb-0 fa-solid fa-magnifying-glass" style={{fontSize: "12px"}}></i>
						<input
							type="text"
							className="search-input w-100"
							placeholder="Tìm kiếm..."
							// value={searchTerm}
							// onChange={handleChangeSearch}
						/>
					</div>
				</div>

				<div className='right-header'>
					<button className="btn btn-primary me-2" style={{fontSize: "14px"}} onClick={handleAddNew}>
						<i className="fas fa-plus me-2"></i>
						Thêm mới
					</button>
				</div>
			</div>

			<div className="table-responsive">
				<table className="table sample-table table-hover tbl-organize-hover">
					<thead>
						<tr className="align-middle">
							<th className=" text-center" style={{ width: "50px"}}>STT</th>
							<th>Mã đề thi</th>
							<th>Tên đề thi</th>
							<th>Phân môn</th>
							<th>Bộ câu hỏi</th>
							<th className=" text-center" style={{ width: "120px"}}>Thao tác</th>
						</tr>
					</thead>
					<tbody>
						{listExam.map((item, index) => (
							<tr key={item.id} className="align-middle">
								<td className=" text-center">{index +1} </td>
								<td className="text-hover-primary">
									<Link 
										to={`/staff/`} 
										style={{ textDecoration: "none", cursor: "pointer", color: "black" }}
									>
										{item.examCode}
									</Link>
								</td>
								<td className=" text-hover-primary">{item.examName}</td>
								<td>{item.subjectName}</td>
								<td>{item.questionBankName}</td>
								<td className="text-center">
                  <button className="btn btn-primary btn-sm" style={{width: "35px", height: "35px"}}>
                    <i className="fas fa-edit text-white "></i>
                  </button>
                  <button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="sample-pagination d-flex justify-content-end align-items-center">
		  		<Pagination count={10} color="primary" />        
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
