import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams  } from "react-router-dom";
import "./OrganizeExamPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Chip, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import CreatableSelect from "react-select/creatable";
import ReactSelect  from 'react-select';

const listQuestionBank = [
  {
    id: "65f1a3b4c8e4a2d5b6f7e8d9",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 12",
    organizeExamStatus: "Scheduled",
    duration: 90,
    examType: "Ma trận",
    matrixId: "MATRIX123",
    maxScore: 100,
    subjectId: "MATH12",
    totalQuestion: 50,
    examSet: null,
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d9",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 11",
    organizeExamStatus: "Scheduled",
    duration: 90,
    examType: "Dề thi",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH11",
    totalQuestion: 50,
    examSet: ["Ma12", "Ma13"],
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d0",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 1",
    organizeExamStatus: "Scheduled",
    duration: 90,
    examType: "Ngẫu nhiên",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH10",
    totalQuestion: 50,
    examSet: null,
    sesstion: []
  }
];

const typeOptions = [
	{ value: 'Ma trận', label: 'Ma trận' },
	{ value: 'Ngẫu nhiên', label: 'Ngẫu nhiên' },
	{ value: 'Đề thi', label: 'Đề thi' },

];

const subjectOptions = [
	{ value: 'Tư tưởng Hồ Chí Minh', label: 'Tư tưởng Hồ Chí Minh' },
	{ value: 'Yêu cầu phần mềm', label: 'Yêu cầu phần mềm' },
	{ value: 'Giải tích', label: 'Giải tích' },
];

const OrganizeExamPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [rows, setRows] = useState(Object.values(listQuestionBank).flat());
  const paginationModel = { page: 0, pageSize: 5 };
  const inputRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null); 
  const navigate = useNavigate(); // Hook để điều hướng
  const {id:organizeId} = useParams();

  const columns = [
    { field: "stt", headerName: "#", width: 15, align: "center", headerAlign: "center" },
    { 
      field: "organizeExamName", 
      headerName: "Kỳ thi", 
      width: 1090, flex: 0.1, 
      renderCell: (params) => (
        <Link 
          to={`/admin/organize/${encodeURIComponent(params.row.id)}`} 
          style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
        >
          {params.row.organizeExamName}
        </Link>
        // <span 
        //   style={{ 
        //     color: "blue", 
        //     cursor: "pointer" 
        //   }}
        //   onClick={() => navigate(`/admin/organize/${params.row.id}`)}
        // >
        //   {params.row.organizeExamName}
        // </span>
      )
    },
    { 
      field: "subjectId", 
      headerName: "Phân môn", 
      width: 200, flex: 0.1, 
    },
    { 
      field: "examType", 
      headerName: "Loại", 
      width: 130, flex: 0.05  
    },
    {
      field: "examSet",
      headerName: "Đề thi",
      width: 130, headerAlign: "center",
      renderCell: (params) => {
        const isNA = params.row.examType === "Ma trận" || params.row.examType === "Ngẫu nhiên";
    
        return isNA || !params.row.examSet ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center", // Căn giữa ngang
              alignItems: "center", // Căn giữa dọc
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold" }}> N/A </Typography>
          </Box>
        ) : (
          params.row.examSet.join(", ") // Hiển thị danh sách đề thi nếu có
        );
      }
    }
    ,
    
    { 
      field: "matrixId", 
      headerName: "Ma trận", 
      width: 100, headerAlign: "center",
      renderCell: (params) => {
        const isNA = params.row.examType === "Đề thi" || params.row.examType === "Ngẫu nhiên";
        return isNA || !params.row.matrixId ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center", // Căn giữa ngang
              alignItems: "center", // Căn giữa dọc
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold" }}> N/A </Typography>
          </Box>
        ) : (
          params.row.matrixId
        );
      }
    }, 
    { 
      field: "duration", 
      headerName: "Thời gian", 
      width: 80, align: "center",
    },
    { 
      field: "maxScore", 
      headerName: "Điểm", 
      width: 80, 
    },
    { 
      field: "organizeExamStatus", 
      headerName: "Trạng thái", 
      width: 145,
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
      field: "report", 
      headerName: "Chi tiết", 
      width: 75,
      // renderCell: (params) => (
      //   <Link 
      //     to={`/admin/organize/${encodeURIComponent(params.row.id)}`} 
      //     style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
      //   >
      //     {params.row.organizeExamName}
      //   </Link>
      // )
      renderCell: (params) => (
        <Link to={`/admin/organize/report/${organizeId}`}     
            style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
        >
          Chi tiết
        </Link>
      )
    },
    {
      field: "actions",
      headerName: "Thao tác", align: "center",headerAlign: "center",
      width: 110,
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
  
  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
    }, [showForm]);

  const handleStatusChange = (id, newStatus) => {
    Swal.fire({
    title: "Xác nhận thay đổi trạng thái?",
    text: "Bạn có chắc chắn muốn thay đổi trạng thái của kỳ thi?",
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
  organizeExamName: "",
  subjectId: "",
  examType: "",
  examSet: "",
  matrixId: "",
  duration: "",
  maxScore: "",
  organizeExamStatus: "active",
  });

  const handleAddNew = () => {
  setEditingAccount(null); 
  setFormData({
    organizeExamName: "",
    subjectId: "",
    examType: "",
    examSet: "",
    matrixId: "",
    duration: "",
    maxScore: "",
    organizeExamStatus: "active",
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
      organizeExamName: account.organizeExamName,
      subjectId: account.subjectId,
      examType: account.examType,
      examSet: account.examSet,
      matrixId: account.matrixId,
      duration: account.duration,
      maxScore: account.maxScore,
      organizeExamStatus: account.organizeExamStatus,
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
								{editingAccount ? "Chỉnh sửa thông tin kỳ thi" : "Tạo kỳ thi"}
							</p>
	
							<Grid container spacing={2}>										
								<Grid item xs={12}>
									<TextField
										fullWidth
										label="Kỳ thi"
										required
										value={formData.organizeExamName}
										inputRef={inputRef}
										onChange={(e) =>
											setFormData({ ...formData, organizeExamName: e.target.value })
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
										label="Thời gian"
										required
										value={formData.duration}
										onChange={(e) =>
											setFormData({ ...formData, duration: e.target.value })
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
										label="Điểm tối đa"
										required
										value={formData.maxScore}
										onChange={(e) =>
											setFormData({ ...formData, maxScore: e.target.value })
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
										placeholder="Phân môn"
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
										placeholder="Loại"
										name="color"
										options={typeOptions}
										isDisabled={editingAccount}
                    value={typeOptions.find((option) => option.value === selectedType)}
                    onChange={(selected) => setSelectedType(selected?.value || null)}
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
                {selectedType === "Đề thi" && (
								<Grid item xs={12}>
									<ReactSelect
										fullWidth
										className="basic-single "
										classNamePrefix="select"
										placeholder="Đề thi"
										name="color"
										options={subjectOptions}
										isDisabled={editingAccount}
										styles={{
											control: (base) => ({
												...base,
												height: "48px",
											}),
											menu: (base) => ({
												...base,
												width: "250px", 
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
                )}

                {selectedType === "Ma trận" && (
                <Grid item xs={12}>
									<ReactSelect
										fullWidth
										className="basic-single "
										classNamePrefix="select"
										placeholder="Ma trận"
										name="color"
										options={subjectOptions}
										isDisabled={editingAccount}
										styles={{
											control: (base) => ({
												...base,
												height: "48px", 
											}),
											menu: (base) => ({
												...base,
												width: "250px",
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
                )}
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

export default OrganizeExamPage;