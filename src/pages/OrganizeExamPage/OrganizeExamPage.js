import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useSearchParams, useNavigate, useLocation  } from "react-router-dom";
import "./OrganizeExamPage.css";
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
import FormCreateOrganizeExamTest from "../../components/FormCreateOrganizeExamTest/FormCreateOrganizeExamTest";

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
	const location = useLocation();

	useEffect(() => {
		if (location.state?.reload) {
			fetchData(); 
		}
	}, [location.state]);

	const handleOpenForm = () => {
		const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.set("showFormCreate", "true");
		navigate(`${location.pathname}?${newSearchParams.toString()}`);
		setShowFormCreate(true);
	};

	const handleCloseForm = () => {
		const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.delete("showFormCreate");
		const newUrl = newSearchParams.toString()
			? `${location.pathname}?${newSearchParams.toString()}`
			: location.pathname;
		navigate(newUrl, { replace: true });
		setShowFormCreate(false);
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		setShowFormCreate(params.get("showFormCreate") === "true");
	}, [location.search]);

	const [typeOptions, setTypeOptions] = useState([
		{ value: "matrix", label: "Ma trận" },
		{ value: "auto", label: "Ngẫu nhiên" },
		{ value: "exams", label: "Đề thi" },
	]);

	const typeMapping = {
		matrix: "Ma trận",
		auto: "Tự động",
		exams: "Đề thi có sẵn"
	};


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

  const [showForm, setShowForm] = useState(false);
  const [editingOrganizeExam, setEditingOrganizeExam] = useState(null);
  const inputRef = useRef(null);

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
        const statusLabel = newStatus === "active" ? "Kích hoạt" : "Đóng";

        // Cập nhật state (sau này sẽ gửi API để cập nhật cơ sở dữ liệu)
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === id ? { ...row, organizeExamStatus: newStatus } : row
          )
        );
        console.log("organizeExamId được đổi status:", id)
        Swal.fire({
          title: "Cập nhật thành công!",
          text: `Trạng thái đã chuyển sang "${statusLabel}".`,
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
					onClose={handleCloseForm}
					typeOptions={typeOptions}
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
								<AddButton onClick={handleOpenForm}>
									<i className="fas fa-plus me-2"></i> Thêm mới
								</AddButton>
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
													{typeMapping[item.examType] || item.examType}
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
													{item.examType === "Đề thi" || item.examType === "Ngẫu nhiên" ? "-" : item.matrixName || "-"}
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
												<td className="text-center">
													<div className="d-flex align-items-center justify-content-center" >
														<span className={`badge mt-1 ${item.organizeExamStatus === "Active" || "available" ? "bg-primary" : "bg-secondary"}`}>
															{item.organizeExamStatus === "Active" || "available" ? "Kích hoạt" : "Đóng"}
														</span>
													</div>
												</td>
												<td className="text-center">
													<div className="dropdown">
														<button
															className="btn btn-light btn-sm "
															type="button"
															data-bs-toggle="dropdown"
															aria-expanded="false"
															style={{
																width: "35px",
																height: "35px",
																padding: 0,
																background: "none",
																border: "none",
																boxShadow: "none",
															}}
														>
															<i className="fas fa-ellipsis-v"></i>
														</button>
														<ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom"
															style={{
																right: "50%",
																transform: 'translate3d(-10px, 10px, 0px)',
															}}
														>
															<li className="tbl-action" onClick={() => preEdit(item)}> 
																<button className="dropdown-item tbl-action" onClick={() => preEdit(item)}>
																	Chỉnh sửa
																</button>
															</li>
															<li className="tbl-action" onClick={() => handleDelete(item.id)}>
																<button className="dropdown-item tbl-action" onClick={() => handleDelete(item.id)}>
																	Xoá
																</button>
															</li>
															<li className="tbl-action">
																<button className="dropdown-item tbl-action">
																	<Link
																		to={`/staff/organize/report/${item.id}`}  
																		style={{color: "black", textDecoration: "none"}}   
																	>
																		Báo cáo
																	</Link>
																</button>
															</li>
															<li className="tbl-action" onClick={() => handleToggleStatus(item.id, item.organizeExamStatus)}>
																<button
																	className="dropdown-item tbl-action"
																	onClick={() =>
																		handleToggleStatus(item.id, item.organizeExamStatus)
																	}
																>
																	{item.organizeExamStatus.toLowerCase() === "active"
																		? "Đóng"
																		: "Kích hoạt"}
																</button>
															</li>
														</ul>
													</div>
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
				</>
			)}
    </div>
  )
}

export default OrganizeExamPage;