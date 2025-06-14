import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams  } from "react-router-dom";
import "./OrganizeExamPage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Chip, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Pagination, NumberInput, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ApiService from "../../services/apiService";
import CreatableSelect from "react-select/creatable";
import ReactSelect  from 'react-select';
import FormCreateOrganizeExam from "../../components/FormCreateOrganizeExam/FormCreateOrganizeExam";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Add } from "@mui/icons-material";

const OrganizeExamPage = () => {
  const [listOrganizeExam, setListOrganizeExam] = useState([]);
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [subjectOptions, setSubjectOptions] = useState([]);
	const [questionBankOptions, setQuestionBankOptions] = useState([]);
	const navigate = useNavigate();
	const [showFormCreate, setShowFormCreate] = useState(false);
	const [listDisplay, setListDisplay] = useState([]);

	const [typeOptions, setTypeOptions] = useState([
		{ value: "matrix", label: "Ma trận" },
		{ value: "auto", label: "Ngẫu nhiên" },
		{ value: "exams", label: "Đề thi" },
	]);
  const [formData, setFormData] = useState({
    organizeExamName: "",
    subjectId: "",
		questionBankId: null,
    examType: "",
    examSet: null,
    matrixId: null,
    duration: "",
    maxScore: 10,
		totalQuestions: "",
    organizeExamStatus: "active",
  });

	const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const response = await ApiService.get('/organize-exams', {
				params: { page, pageSize, keyword },
			});
			setListOrganizeExam(response.data.organizeExams);
			setTotalCount(response.data.totalCount);
		} catch (error) {
			console.error("Failed to fetch data", error);
		}
	};

  useEffect(() => {
    fetchData();
  }, [page, pageSize, keyword]);

	useEffect(() => {
		const fetchSubjectOptions = async () => {
			try {
				const response = await ApiService.get("/subjects");
				setSubjectOptions(response.data.subjects.map((subject) => ({
					value: subject.id,
					label: subject.subjectName,
				})));
			} catch (error) {
				console.error("Failed to fetch subjects", error);
			}
		};
		fetchSubjectOptions();
	}, []);

	const fetchQuestionBankOptions = async (type, subjectId) => {
		if (type !== "auto") {
			setQuestionBankOptions([]);
			return;
		}
		try {
			const response = await ApiService.get("/subjects/question-bank-options", {
				params: { subjectId: subjectId },
			});

			setQuestionBankOptions(response.data.map((questionBank) => ({
				value: questionBank.questionBankId,
				label: questionBank.questionBankName,
			})));
		} catch (error) {
			console.error("Failed to fetch question banks", error);
		}
	};

	// 	if (formData.subjectId && formData.examType === "auto") {
	// 		fetchQuestionBankOptions();
	// 	}
	// }, [formData.subjectId, formData.examType]);
	
  const preAddNew = () => {
		setEditingOrganizeExam(null); 
		setFormData({
			organizeExamName: "",
			subjectId: "",
			questionBankId: null,
			examType: "",
			examSet: null,
			matrixId: null,
			duration: "",
			maxScore: 10,
			totalQuestions: "",
			organizeExamStatus: "active",
		});
		setShowForm(true);
	};	

  const [showForm, setShowForm] = useState(false);
  const [editingOrganizeExam, setEditingOrganizeExam] = useState(null);
  const inputRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null); 

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

  const handleSubmit = async (e) => {
    e.preventDefault();
		if (editingOrganizeExam) {
			try {
				await ApiService.put(`/organize-exams/${editingOrganizeExam.id}`, formData);
				fetchData();
			} catch (error) {
				console.error("Failed to update organize exam", error);
			}
		} else {
			try {
				await ApiService.post("/organize-exams", formData);
				fetchData();
			} catch (error) {
				console.error("Failed to add organize exam", error);
			}
		}

		resetForm();
  };

  const preEdit = (organizeExam) => {
    setFormData({
      organizeExamName: organizeExam.organizeExamName,
      subjectId: organizeExam.subjectId,
      examType: organizeExam.examType,
      examSet: organizeExam.examSet,
      matrixId: organizeExam.matrixId,
      duration: organizeExam.duration,
      maxScore: organizeExam.maxScore,
			totalQuestions: organizeExam.totalQuestions,
      organizeExamStatus: organizeExam.organizeExamStatus,
    });
    setEditingOrganizeExam(organizeExam);
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
			setListOrganizeExam(prev => prev.filter(item => item.id !== id));

	  	setListDisplay(prev => prev.filter(item => item.id !== id));
      Swal.fire({
        title: "Đã xóa!",
        text: "Kỳ thi đã bị xóa.",
        icon: "success",
      });
      }
    });
  };

	const resetForm = () => {
		setFormData({
			organizeExamName: "",
			subjectId: "",
			questionBankId: null,
			examType: "",
			examSet: null,
			matrixId: null,
			duration: "",
			maxScore: 10,
			organizeExamStatus: "active",
		});
		setEditingOrganizeExam(null);
		setQuestionBankOptions([]);
		setShowForm(false);
	};

  return (
    <div className="p-4">
      {/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				
				<span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">Quản lý kỳ thi</span>
			</nav>

			{showFormCreate ? (
				<FormCreateOrganizeExam 
					onClose={() => setShowFormCreate(false)}
					typeOptions={typeOptions}
					questionBankOptions={questionBankOptions}
					subjectOptions={subjectOptions}
				/>
			) : (
				<>
					<div className="tbl-shadow p-3">
						<div className="sample-card-header d-flex justify-content-between align-items-center mb-2">
							<div className='left-header d-flex align-items-center'>
								<div className="search-box rounded d-flex align-items-center">
									<i className="search-icon me-3 pb-0 fa-solid fa-magnifying-glass" style={{fontSize: "12px"}}></i>
									<input
										type="text"
										className="search-input w-100"
										placeholder="Tìm kiếm..."
										value={keyword}
										onChange={handleKeywordChange}
									/>
								</div>
							</div>

							<div className='right-header d-flex'>
								<AddButton onClick={() => setShowFormCreate(true)}>
									<i className="fas fa-plus me-2"></i> Thêm mới
								</AddButton>
								<button className="btn btn-primary" style={{fontSize: "14px"}} onClick={preAddNew}>
									<i className="fas fa-plus me-2"></i>
									Thêm mới
								</button>
							</div>
						</div>

						{/* Hiển thị bảng theo vai trò đã chọn */}
						<div className="organize-examtable-container mt-3">
							<div className="table-responsive">
								<table className="table organize-exam-table sample-table tbl-organize-hover table-hover" style={{fontSize: "14px"}}>
									<thead>
										<tr className="align-middle fw-medium">
											<th className="text-center">STT</th>
											<th>Kỳ thi</th>
											<th>Phân môn</th>
											<th>Loại</th>
											<th>Đề thi</th>
											<th>Ma trận</th>
											<th className="text-center">Thời gian (M)</th>
											<th className="text-center">Điểm</th>
											<th className="text-center">Trạng thái</th>
											<th className="text-center">Báo cáo</th>
											<th className="text-center">Thao tác</th>
										</tr>
									</thead>
									<tbody>
									{listOrganizeExam.length === 0 ? (
										<tr>
											<td colSpan="11" className="text-center fw-semibold text-muted"
													style={{ height: "100px", verticalAlign: "middle" }}>
												Không có dữ liệu
											</td>
										</tr>
									) : (
										listOrganizeExam.map((item, index) => (
											<tr key={item.id} className="align-middle">
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
													className="text-center"
												>
													{index + 1}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
													className="text-hover-primary"
												>
													{item.organizeExamName}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
												>
													{item.subjectName}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
												>
													{item.examType}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
												>
													{item.examType === "Ma trận" || item.examType === "Ngẫu nhiên" ? "-" : item.examSet?.join(", ") || "-"}										
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
												>
													{item.examType === "Đề thi" || item.examType === "Ngẫu nhiên" ? "-" : item.matrixId || "-"}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
													className="text-center"
												>
													{item.duration}
												</td>
												<td
													onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
														state: { organizeExamName: item.organizeExamName },
													})}
													style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
													className="text-center"
												>
													{item.maxScore}
												</td>
												<td>
												<div className="form-check form-switch d-flex align-items-center justify-content-center" >
													<input
														className="form-check-input"
														type="checkbox"
														role="switch"
														checked={item.organizeExamStatus.toLowerCase() === "active"}
														onChange={() =>
															handleToggleStatus(item.id, item.organizeExamStatus)
														}
													/>
													<span className={`badge ms-2 mt-1 ${item.organizeExamStatus === "Active" || "available" ? "bg-primary" : "bg-secondary"}`}>
														{item.organizeExamStatus === "Active" || "available" ? "Kích hoạt" : "Đóng"}
													</span>
												</div>
											</td>
												<td className="text-center">
													<Link
														to={`/staff/organize/report/${item.id}`}     
														style={{ color: "blue", cursor: "pointer" }}
														className="report-hover"
													>
														Chi tiết
													</Link>
												</td>
												<td className="text-center">
													<button className="btn btn-primary btn-sm" style={{width: "35px", height: "35px"}} onClick={() => preEdit(item)}>
														<i className="fas fa-edit text-white "></i>
													</button>
													<button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}} onClick={() => handleDelete(item.id)}>
														<i className="fas fa-trash-alt"></i>
													</button>
												</td>
											</tr>
										)))}
									</tbody>
								</table>
							</div>

							<div className="organize-exampagination d-flex justify-content-end align-items-center">
								{ totalCount > 0 && (
									<Pagination
										count={Math.ceil(totalCount / pageSize)}
										shape="rounded"
										page={page}
										onChange={(e, value) => setPage(value)}
										color="primary"
									/>
								)}
							</div>
						</div>
					</div>

      {/* Form thêm tài khoản */}
				{showForm && (
					<div className="form-overlay">
						<Box
							component="form"
							sx={{
								width: "650px",
								backgroundColor: "white",
								p: 3,
								borderRadius: "8px",
								boxShadow: 3,
								mx: "auto",
							}}
							onSubmit={handleSubmit}
						>
							<p className="fw-bold mb-4">
								{editingOrganizeExam ? "Chỉnh sửa thông tin kỳ thi" : "Tạo kỳ thi"}
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
										label="Thời lượng"
										type="number"
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
										type="number"
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
										isDisabled={editingOrganizeExam}
										onChange={(selectedOption) => {
											setFormData({ ...formData, subjectId: selectedOption.value });
										}}
										styles={{
											control: (base) => ({
												...base,
												width: "292px", // Cố định chiều rộng
												minWidth: "292px",
												maxWidth: "260px",
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
										isDisabled={editingOrganizeExam}
                    value={typeOptions.find((option) => option.value === selectedType)}
										onChange={(selected) => {
											setSelectedType(selected?.value || null);
											fetchQuestionBankOptions(selected?.value, formData.subjectId);
											setFormData({ ...formData, examType: selected?.value || null });
										}}
										styles={{
											control: (base) => ({
												...base,
												width: "292px", // Cố định chiều rộng
												minWidth: "292px",
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
                {selectedType === "exams" && (
								<Grid item xs={12}>
									<ReactSelect
										fullWidth
										className="basic-single "
										classNamePrefix="select"
										placeholder="Chọn đề thi"
										name="color"
										options={subjectOptions}
										isDisabled={editingOrganizeExam}
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

                {selectedType === "matrix" && (
                <Grid item xs={12}>
									<ReactSelect
										fullWidth
										className="basic-single "
										classNamePrefix="select"
										placeholder="Chọn ma trận"
										name="color"
										options={subjectOptions}
										isDisabled={editingOrganizeExam}
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
                {selectedType === "auto" && (								
									<Grid container spacing={2} sx={{marginLeft:"0px", marginTop: "0px"}}>		
										<Grid item xs={6}>
										<ReactSelect
											fullWidth
											className="basic-single "
											classNamePrefix="select"
											placeholder="Bộ câu hỏi"
											name="color"
											onChange={(selectedOption) => {
												setFormData({ ...formData, questionBankId: selectedOption.value });
											}}
											options={questionBankOptions}
											isDisabled={editingOrganizeExam}
											styles={{
												control: (base) => ({
													...base,
													width: "275px", // Cố định chiều rộng
													height: "48px", // Tăng chiều cao
												}),
												menu: (base) => ({
													...base,
													width: "100%", // Cố định chiều rộng của dropdown
													zIndex: 9999,
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
											<TextField
												fullWidth
												label="Số lượng câu hỏi"
												type="number"
												required
												value={formData.totalQuestions}
												onChange={(e) =>
													setFormData({ ...formData, totalQuestions: e.target.value })
												}
												sx={{
													position: "relative", 
   												zIndex: 0, 
													"& .MuiInputBase-input": {
														fontSize: "14px",
														paddingBottom: "11px",
													},
													"& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
												}}
											/>
										</Grid>
									</Grid>
                )}
							</Grid>		
							{/* Buttons */}
							<Grid container spacing={2} sx={{ mt: 1, justifyContent:"flex-end" }}>
								<Grid item xs={3}>
									<CancelButton style={{width: "100%"}} onClick={() => resetForm()}>
										Hủy
									</CancelButton>
								</Grid>
								<Grid item xs={3}>
									<AddButton style={{width: "100%"}}>
										{editingOrganizeExam ? "Cập nhật" : "Lưu"}
									</AddButton>
								</Grid>
							</Grid>
						</Box>
					</div>
				)}
				</>
			)}
    </div>
  )
}

export default OrganizeExamPage;