import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./OrganizeExamPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Chip, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Pagination, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import CreatableSelect from "react-select/creatable";
import ReactSelect  from 'react-select';

const listQuestionBank = [{
  id: "65f1a3b4c8e4a2d5b6f7e8d9",
  organizeExamName: "Kỳ thi giữa kỳ Toán lớp 12",
  organizeExamStatus: "Scheduled",
  duration: 90,
  examType: "Ngẫu nhiên",
  matrixId: "MATRIX123",
  maxScore: 100,
  subjectId: "MATH12",
  totalQuestion: 50,
  examSet: ["Ma12", "Ma13"],
  sesstion: [
    {
      sesstionId: "SESSION001",
      activeAt: "2025-04-10T08:00:00Z",
      sesstionStatus: "Active",
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
      sesstionId: "SESSION002",
      activeAt: "2025-04-10T13:00:00Z",
      sesstionStatus: "Scheduled",
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
  ]
}];

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

  const [listOrganizeExam, setListOrganizeExam] = useState([]);

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
      setSelectedItems(listOrganizeExam.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [rows, setRows] = useState(Object.values(listQuestionBank).flat());
  const paginationModel = { page: 0, pageSize: 5 };
  const inputRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null); 

  const columns = [
    { field: "stt", headerName: "#", width: 15, align: "center", headerAlign: "center" },
    { 
      field: "organizeExamName", 
      headerName: "Kỳ thi", 
      width: 1090, flex: 0.1, 
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
      width: 130
    },
    { 
      field: "matrixId", 
      headerName: "Ma trận", 
      width: 100,
    },
    { 
      field: "duration", 
      headerName: "Thời gian", 
      width: 80, 
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
      <div className="organize-examtable-container mt-3">
        <div className="table-responsive">
          <table className="table organize-exam-table table-hover">
            <thead>
              <tr className="align-middle fw-medium">
                <th scope="col" className="text-center title-row">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === listQuestionBank.length}
                  />
                </th>
                <th scope="col" className="title-row">Kỳ thi</th>
                <th scope="col" className="title-row">Phân môn</th>
                <th scope="col" className="title-row">Loại</th>
                <th scope="col" className="title-row">Đề thi</th>
                <th scope="col" className="title-row">Ma trận</th>
                <th scope="col" className="title-row">Thời gian</th>
                <th scope="col" className="title-row">Điểm</th>
                <th scope="col" className="title-row">Trạng thái</th>
                <th scope="col" className="title-row">Báo cáo</th>
                <th scope="col" className="title-row">Thao tác</th>
              </tr>
            </thead>
            <tbody>
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
                  <td>
                    <Link className="text-hover-primary"
                      to={`/staff/organize/${encodeURIComponent(item.id)}`} 
                      style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
                    >
                      {item.organizeExamName}
                    </Link>
                  </td>
                  <td>{item.subjectId}</td>
                  <td>{item.examType}</td>
                  <td>{item.examSet}</td>
                  <td>{item.matrixId}</td>
                  <td>{item.duration}</td>
                  <td>{item.maxScore}</td>
                  <td>{item.organizeExamStatus}</td>
                  <td>
                    <Link
                      to={`/staff/organize/report/${item.id}`}     
                      style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
                    >
                      Chi tiết
                    </Link>
                  </td>
                  <td>
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

        <div className="organize-exampagination d-flex justify-content-end align-items-center">
          <Pagination count={10} variant="outlined" shape="rounded" />
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