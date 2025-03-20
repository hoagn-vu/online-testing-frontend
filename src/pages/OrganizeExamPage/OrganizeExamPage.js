import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams  } from "react-router-dom";
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

const listQuestionBank = [
  {
    id: "65f1a3b4c8e4a2d5b6f7e8d1",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 12",
    organizeExamStatus: "Active",
    duration: 90,
    examType: "Ma trận",
    matrixId: "MATRIX123",
    maxScore: 100,
    subjectId: "MATH12",
    totalQuestion: null,
    examSet: null,
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d2",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 11",
    organizeExamStatus: "Disabled",
    duration: 90,
    examType: "Đề thi",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH11",
    totalQuestion: null,
    examSet: ["Ma12", "Ma13"],
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d3",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 1",
    organizeExamStatus: "Disabled",
    duration: 90,
    examType: "Ngẫu nhiên",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH10",
    totalQuestion: 50,
    examSet: null,
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d4",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 11",
    organizeExamStatus: "Active",
    duration: 90,
    examType: "Đề thi",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH11",
    totalQuestion: null,
    examSet: ["Ma12", "Ma13"],
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d5",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 11",
    organizeExamStatus: "Active",
    duration: 90,
    examType: "Đề thi",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH11",
    totalQuestion: null,
    examSet: ["Ma12", "Ma13"],
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d6",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 11",
    organizeExamStatus: "Disabled",
    duration: 90,
    examType: "Đề thi",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH11",
    totalQuestion: null,
    examSet: ["Ma12", "Ma13"],
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d7",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 11",
    organizeExamStatus: "Disabled",
    duration: 90,
    examType: "Đề thi",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH11",
    totalQuestion: null,
    examSet: ["Ma12", "Ma13"],
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d8",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 11",
    organizeExamStatus: "Active",
    duration: 90,
    examType: "Đề thi",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH11",
    totalQuestion: null,
    examSet: ["Ma12", "Ma13"],
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d9",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 11",
    organizeExamStatus: "Active",
    duration: 90,
    examType: "Đề thi",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH11",
    totalQuestion: null,
    examSet: ["Ma12", "Ma13"],
    sesstion: []
  },
  {
    id: "55f1a3b4c8e4a2d5b6f7e8d10",
    organizeExamName: "Kỳ thi giữa kỳ Toán lớp 11",
    organizeExamStatus: "Active",
    duration: 90,
    examType: "Đề thi",
    matrixId: null,
    maxScore: 100,
    subjectId: "MATH11",
    totalQuestion: null,
    examSet: ["Ma12", "Ma13"],
    sesstion: []
  },
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
  const [rows, setRows] = useState(listQuestionBank);
  const paginationModel = { page: 0, pageSize: 5 };
  const inputRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null); 
  const navigate = useNavigate(); // Hook để điều hướng
  const {id:organizeId} = useParams();
  // const [rows, setRows] = useState([]);
  
  useEffect(() => {
    // Giả lập dữ liệu lấy từ cơ sở dữ liệu (sau này thay bằng API)
    const fetchData = async () => {
      const fakeData = [
        {
          id: "65f1a3b4c8e4a2d5b6f7e8d9",
          organizeExamName: "Kỳ thi giữa kỳ Toán lớp 12",
          organizeExamStatus: "active",
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
          organizeExamStatus: "active",
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
          organizeExamStatus: "disabled",
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
      setRows(fakeData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (showForm && inputRef.current) {
      inputRef.current.focus();
    }
    }, [showForm]);

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
        const newStatus = currentStatus.toLowerCase() === "active" ? "disabled" : "active";

        // Cập nhật state (sau này sẽ gửi API để cập nhật cơ sở dữ liệu)
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, organizeExamStatus: newStatus } : row
          )
        );
        console.log("organizeExamId được đổi status:", id)
        Swal.fire({
          title: "Cập nhật thành công!",
          text: `Trạng thái đã chuyển sang "${newStatus}".`,
          icon: "success",
        });
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
      <nav className="mb-4">
        <Link className="breadcrumbs-hover" style={{textDecoration: "none"}} to="/admin">Home</Link> /
        <span className="breadcrumb-current"> Quản lý kỳ thi</span>
      </nav>

      <div className="account-actions mt-2">
        <div className="search-container">
          <SearchBox></SearchBox>
        </div>
        <button className="btn btn-primary me-2" style={{fontSize: "14px"}} onClick={handleAddNew}>
          <i className="fas fa-plus me-2"></i>
          Thêm mới
        </button>
      </div>

      {/* Hiển thị bảng theo vai trò đã chọn */}
      <div className="organize-examtable-container mt-3">
        <div className="table-responsive">
          <table className="table organize-exam-table sample-table tbl-organize-hover table-hover" style={{fontSize: "14px"}}>
            <thead>
              <tr className="align-middle fw-medium">
                <th className="text-center">STT</th>
                <th scope="col" className="title-row">Kỳ thi</th>
                <th scope="col" className="title-row">Phân môn</th>
                <th scope="col" className="title-row">Loại</th>
                <th scope="col" className="title-row">Đề thi</th>
                <th scope="col" className="title-row">Ma trận</th>
                <th className="text-center">Thời gian (M)</th>
                <th className="text-center">Điểm</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center">Báo cáo</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {listQuestionBank.map((item, index) => (
                <tr key={item.id} className="align-middle">
                  <td className="text-center">{index + 1}</td>
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
                  <td>{item.examType === "Ma trận" || item.examType === "Ngẫu nhiên" ? "N/A" : item.examSet?.join(", ") || "N/A"}</td>
                  <td>{item.examType === "Đề thi" || item.examType === "Ngẫu nhiên" ? "N/A" : item.matrixId || "N/A"}</td>
                  <td className="text-center">{item.duration}</td>
                  <td className="text-center">{item.maxScore}</td>
                  <td>
                   <div className="form-check form-switch d-flex justify-content-center">
                     <input
                       className="form-check-input"
                       type="checkbox"
                       role="switch"
                       checked={item.organizeExamStatus.toLowerCase() === "active"}
                       onChange={() =>
                         handleToggleStatus(item.id, item.organizeExamStatus)
                       }
                     />
                   </div>
                 </td>
                  <td className="text-center">
                    <Link
                      to={`/staff/organize/report/${item.id}`}     
                      style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
                    >
                      Chi tiết
                    </Link>
                  </td>
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
										placeholder="Chọn đề thi"
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
										placeholder="Chọn ma trận"
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
                {selectedType === "Ngẫu nhiên" && (
                <Grid item xs={12}>
                  <TextField
										fullWidth
										label="Số lượng câu hỏi"
										required
										value={formData.totalQuestion}
										onChange={(e) =>
											setFormData({ ...formData, totalQuestion: e.target.value })
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