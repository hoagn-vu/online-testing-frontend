import React, { useState, useEffect, useRef} from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
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
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import FormCreateExam from "../../components/FormCreateExam/FormCreateExam";

const ExamManagementPage = () => {
	const [listExam, setListExam] = useState([]);
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [subjectOptions, setSubjectOptions] = useState([]);
	const [questionBankOptions, setQuestionBankOptions] = useState([]);
	const [showFormCreateExam, setShowFormCreateExam] = useState(false);
	const [refreshFlag, setRefreshFlag] = useState(false);
	const location = useLocation();
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [detailData, setDetailData] = useState([]);
	const [showChapter, setShowChapter] = useState(true);
	const [showLevel, setShowLevel] = useState(true);
	const [totalSelectedQuestions, setTotalSelectedQuestions] = useState(0);
	const [totalScore, setTotalScore] = useState(0);
	const [difficultyData, setDifficultyData] = useState([]);
	const dynamicColSpan = 1 + (showChapter ? 1 : 0) + (showLevel ? 1 : 0);
	const navigate = useNavigate();
	const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

	useEffect(() => {
		if (location.state?.refresh) {
			fetchData();
		}
	}, [location.state]);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const response = await ApiService.get("/exams", {
        params: { keyword, page, pageSize },
      });
			setListExam(response.data.exams);
			setTotalCount(response.data.totalCount);
		} catch (error) {
			console.error("Lỗi lấy dữ liệu:", error);
		} finally{
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [keyword, page, pageSize, refreshFlag]);

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

	const fetchQuestionBankOptions = async (subjectId) => {
		if (!subjectId) {
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
		examStatus: "available",
  });

  const preAddNew = () => {
		setEditingAccount(null); // Đảm bảo không ở chế độ chỉnh sửa
		setFormData({
			examCode: "",
			examName: "",
			subjectId: "",
			questionBankId: "",
			examStatus: "available",
		});
		setShowForm(true)
  };

  const handlePermissionChange = (permission) => {
  setFormData((prevData) => {
    const updatedPermissions = prevData.permissions.includes(permission)
    ? prevData.permissions.filter((p) => p !== permission)
    : [...prevData.permissions, permission];

    return { ...prevData, permissions: updatedPermissions };
  });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
		if (editingAccount) {
			try {
				await ApiService.put(`/exams/${editingAccount.id}`, formData);
				showToast("success", "Cập nhật tên đề thi thành công!");
				fetchData();
			} catch (error) {
				console.error("Failed to update exam", error);
			}
		}
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

	function showToast(type, message, onClose) {
		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 3000,
			timerProgressBar: true,
			didOpen: (toast) => {
				toast.onmouseenter = Swal.stopTimer;
				toast.onmouseleave = Swal.resumeTimer;
			}
		});

		return Toast.fire({
			icon: type,
			title: message,
			didClose: onClose
		});
	}

  const handleDelete = async (id) => {
		Swal.fire({
			title: "Bạn có chắc chắn xóa?",
			text: "Bạn sẽ không thể hoàn tác hành động này!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Xóa",
			cancelButtonText: "Hủy",
		}).then(async(result) => {
			if (result.isConfirmed) {
			console.log("Xóa tài khoản có ID:", id);
			try {
				await ApiService.delete(`/exams/${id}`); 
				showToast("success", "Xóa đề thi thành công!");
				// Sau khi xóa thì load lại danh sách
				fetchData();
			} catch (error) {
				console.error("Xóa thất bại:", error);
				showToast("error", error.message);
			}
			}
		});
  };

	const handleOpenFormCreateExam = () => {
		const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.set("showFormCreateExam", "true");
		navigate(`${location.pathname}?${newSearchParams.toString()}`);
		setShowFormCreateExam(true);  
	};

	const handleCloseFormCreateExam = () => {
		const newSearchParams = new URLSearchParams(location.search);
		newSearchParams.delete("showFormCreateExam");
		const newUrl = newSearchParams.toString()
			? `${location.pathname}?${newSearchParams.toString()}`
			: location.pathname;
		navigate(newUrl, { replace: true });
		setShowFormCreateExam(false);

		fetchData();
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		setShowFormCreateExam(params.get("showFormCreateExam") === "true");
	}, [location.search]);

	const handleGenerateExam = () => {
    navigate(`/staff/exam/generate-exam-matrix`);
  };

	const handleDetailMatrixClick = async (matrixId) => {
		try {
			const response = await ApiService.get(`/exam-matrices/${matrixId}`);
			const selectedMatrix = response.data?.data;

			if (!selectedMatrix) {
				throw new Error("Không tìm thấy ma trận với ID: " + matrixId);
			}

			// Lấy dữ liệu classification để bổ sung total
			const tagRes = await ApiService.get("/subjects/questions/tags-classification", {
				params: { 
					subjectId: selectedMatrix.subjectId, 
					questionBankId: selectedMatrix.questionBankId, 
					type: selectedMatrix.matrixType   // dùng selectedMatrix thay vì matrix
				},
			});
			const classification = tagRes.data || [];

			// Kết hợp matrixTags với classification để thêm total
			const tags = (selectedMatrix.matrixTags || []).map(tag => {
				if (tag.chapter && tag.chapter.trim() !== "") {
					if (tag.level && tag.level.trim() !== "") {
						const found = classification.find(c => c.chapter === tag.chapter && c.level === tag.level);
						return { ...tag, total: found ? found.total : 0 };
					} else {
						const chapterTotals = classification
							.filter(c => c.chapter === tag.chapter)
							.reduce((sum, c) => sum + (c.total || 0), 0);
						return { ...tag, total: chapterTotals };
					}
				} else {
					const levelTotals = classification
						.filter(c => c.level === tag.level)
						.reduce((sum, c) => sum + (c.total || 0), 0);
					return { ...tag, total: levelTotals };
				}
			});

			setDetailData(tags);
			const hasChapter = tags.some(tag => tag.chapter && tag.chapter.trim() !== "");
			const hasLevel = tags.some(tag => tag.level && tag.level.trim() !== "");

			setShowChapter(hasChapter);
			setShowLevel(hasLevel);

			setTotalSelectedQuestions(tags.reduce((sum, tag) => sum + (tag.questionCount || 0), 0));
			setTotalScore(tags.reduce((sum, tag) => sum + (tag.score || 0), 0));

			setDifficultyData(
				Object.entries(
					tags.reduce((acc, tag) => {
						const key = hasLevel ? (tag.level || "Không xác định") : (tag.chapter || "Không xác định");
						acc[key] = (acc[key] || 0) + (tag.questionCount || 0);
						return acc;
					}, {})
				).map(([key, questionCount]) =>
					hasLevel ? { level: key, questionCount } : { chapter: key, questionCount }
				)
			);

			setShowDetailModal(true);
			console.log("detailData:", tags);
			console.log("classification:", classification);
		} catch (error) {
			console.error("Lỗi lấy chi tiết ma trận:", error);
			showToast("error", "Không thể tải chi tiết ma trận. Vui lòng kiểm tra lại");
		}
	};
	return (
		<div className="p-4">
			{/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/staff/dashboard" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				
				<span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">Quản lý đề thi</span>
			</nav>

			{showFormCreateExam ? (
				<FormCreateExam
					onCreated={() => setRefreshFlag(prev => !prev)}
					onClose={handleCloseFormCreateExam}
				/>
			):(
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

          <div className='right-header'>
						<AddButton onClick={handleGenerateExam} className="me-2">
							<i className="fas fa-random me-2"></i>
              Sinh đề thi
						</AddButton>
						<AddButton onClick={handleOpenFormCreateExam}>
							<i className="fas fa-plus me-2"></i>
              Thêm mới
						</AddButton>
          </div>
        </div>

				<div className="table-responsive" style={{minHeight: "230px"}}>
					<table className="table sample-table table-hover tbl-organize-hover">
						<thead>
							<tr className="align-middle">
								<th className=" text-center" style={{ width: "50px"}}>STT</th>
								<th>Mã đề thi</th>
								<th>Tên đề thi</th>
								<th>Phân môn</th>
								<th>Bộ câu hỏi</th>
								<th className=" text-center">Ma trận sử dụng</th>
								<th className=" text-center" style={{ width: "120px"}}>Thao tác</th>
							</tr>
						</thead>
						<tbody>
						{isLoading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : listExam.length === 0 ? (
								<tr>
									<td colSpan="7" className="text-center fw-semibold text-muted"
											style={{ height: "100px", verticalAlign: "middle" }}>
										Không có dữ liệu
									</td>
								</tr>
							) : (
							listExam.map((item, index) => (
								<tr key={item.id} className="align-middle">
									<td className=" text-center">{index +1} </td>
									<td
										onClick={() => navigate(`/staff/exam/${item.id}`, {
										})}
										style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
										className="text-hover-primary"
									>
										{item.examCode}
									</td>
									<td
										onClick={() => navigate(`/staff/exam/${item.id}`, {
										})}
										style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
										className="text-hover-primary"
									>
										{item.examName}
									</td>
									<td
										onClick={() => navigate(`/staff/exam/${item.id}`, {
										})}
										style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
									>
										{item.subjectName}
									</td>
									<td
										onClick={() => navigate(`/staff/exam/${item.id}`, {
										})}
										style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
									>
										{item.questionBankName}
									</td>
									<td className="text-center"
										onClick={item.matrixName ? () => handleDetailMatrixClick(item.matrixId) : undefined}
										style={{
											cursor: item.matrixName ? "pointer" : "default",
											color: item.matrixName ? "black" : "#6c757d", // màu xám khi không có
											textDecoration: "none",
										}}
										onMouseEnter={(e) => {
											if (item.matrixName) {
												e.currentTarget.style.color = "#1c3cebff";
												//e.currentTarget.style.textDecoration = "underline";
											}
										}}
										onMouseLeave={(e) => {
											if (item.matrixName) {
												e.currentTarget.style.color = "black";
												e.currentTarget.style.textDecoration = "none";
											}
										}}
									>
										{item.matrixName && item.matrixName.trim() !== "" ? item.matrixName : "-"}
									</td>

									<td className="text-center align-middle">
                    <div className="dropdown d-inline-block">
                      <button
                        className="dropdown-toggle-icon"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom "
                        style={{
                          right: "50%",
                          transform: 'translate3d(-10px, 10px, 0px)',
                        }}
                      >
                        <li className="tbl-action" onClick={() => handleEdit(item)}> 
                          <button className="dropdown-item tbl-action" onClick={() => handleEdit(item)}>
                             Chỉnh sửa
                          </button>
                        </li>
                        <li className="tbl-action" onClick={() => handleDelete(item.id)}>
                          <button className="dropdown-item tbl-action" onClick={() => handleDelete(item.id)}>
                             Xoá
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

				<div className="sample-pagination d-flex justify-content-end align-items-center">
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
			)}
			
			{/* Form thêm đề thi */}
			{showForm && (
				<div className="form-overlay">
					<form
						style={{
							width: "700px",
							backgroundColor: "white",
							borderRadius: "8px",
							boxShadow: 3,
						}}
						onSubmit={handleSubmit}
					>
						<div 
							className="d-flex justify-content-between"
							style={{
								borderBottom: "1px solid #ccc",
								marginBottom: "20px",
							}}
						>
							<p className="fw-bold p-4 pb-0" style={{fontSize: "18px"}}>
								{editingAccount ? "Chỉnh sửa thông tin đề thi" : "Tạo đề thi"}
							</p>
							<button
								className="p-4"
								type="button"
								onClick={() => setShowForm(false)}
								style={{
									border: 'none',
									background: 'none',
									fontSize: '20px',
									cursor: 'pointer',
								}}
							><i className="fa-solid fa-xmark"></i></button>
						</div>
						<Grid container spacing={2} sx={{p: 3, pt: 1}}>										
							<Grid item xs={12}>
								<TextField
									fullWidth
									disabled
									label="Mã đề thi"
									value={formData.examCode}
									inputRef={inputRef}
									onChange={(e) =>
										setFormData({ ...formData, examCode: e.target.value })
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

							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Tên đề thi"
									required
									inputRef={inputRef}
									value={formData.examName}
									onChange={(e) =>
										setFormData({ ...formData, examName: e.target.value })
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
						</Grid>		
						{/* Buttons */}
						<Grid container spacing={2} sx={{justifyContent: "flex-end", p: 3, pt: 1 }}>
							<Grid item xs={3}>
								<CancelButton style={{width: "100%"}} onClick={() => setShowForm(false)}>
									Hủy
								</CancelButton>
							</Grid>
							<Grid item xs={3}>
								<AddButton style={{width: "100%"}}>
									{editingAccount ? "Cập nhật" : "Lưu"}
								</AddButton>
							</Grid>
						</Grid>
					</form>
				</div>
			)}

			{/* Modal chi tiết ma trận*/}
			{showDetailModal && (
			<div className="form-overlay">
				<div style={{ backgroundColor: "#ffff",borderRadius: "8px"}}>
					<div className="p-3"
						style={{
							borderBottom: '1px solid #ddd',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							backgroundColor: "#ffff",
							borderRadius: "8px"
						}}
					>
						<h5 className="modal-title fw-bold">Chi tiết ma trận: {listExam.matrixName}</h5>
						<button
							type="button"
							onClick={() => setShowDetailModal(false)}
							style={{
								border: 'none',
								background: 'none',
								fontSize: '20px',
								cursor: 'pointer',
							}}
						><i className="fa-solid fa-xmark"></i></button>
					</div>
					<div className="p-4" style={{ overflowY: 'auto',}}>
						<div className="d-flex gap-2 w-100" style={{ flexWrap: 'wrap' }}>
							<div className="table-responsive tbl-shadow pb-0 mb-0" style={{ flex: '1', fontSize: '14px' }}>
								<table className="table w-100 border border-gray-300">
									<thead>
										<tr className="bg-gray-200">
											<th className="border p-2">STT</th>
											{showChapter && <th className="border p-2">Chuyên đề kiến thức</th>}
											{showLevel && <th className="border p-2">Mức độ</th>}
											<th className="border p-2 text-center">Số lượng chọn / Tổng</th>
											<th className="border p-2 text-center">Đơn vị</th>
											<th className="border p-2 text-center">Tổng điểm</th>
											<th className="border p-2 text-center">Điểm/Câu</th>
										</tr>
									</thead>
									<tbody>
										{/* Nếu có chapter thì vẫn group theo chapter */}
										{showChapter ? (
											Object.entries(
												detailData.reduce((acc, tag) => {
													const key = tag.chapter || "Khác";
													if (!acc[key]) acc[key] = [];
													acc[key].push(tag);
													return acc;
												}, {})
											).map(([chapter, tags], chapterIndex) => (
												<React.Fragment key={chapterIndex}>
													{tags.map((tag, levelIndex) => (
														<tr key={`${chapterIndex}-${levelIndex}`} className="border">
															{levelIndex === 0 && (
																<td className="border p-2 text-center" rowSpan={tags.length}>
																	{chapterIndex + 1}
																</td>
															)}
															{levelIndex === 0 && (
																<td
																	className="border p-2"
																	rowSpan={tags.length}
																	style={{ minWidth: "300px" }}
																>
																	{chapter}
																</td>
															)}
															{showLevel && (
																<td className="border p-2" style={{ minWidth: "150px" }}>
																	{tag.level || "-"}
																</td>
															)}
															<td className="border p-2 text-center">{tag.questionCount} / {(tag.total || 0).toString().padStart(2, '0')}</td>
															<td className="border p-2 text-center">Câu</td>
															<td className="border p-2 text-center">{(tag.score || 0).toFixed(1)}</td>
															<td className="border p-2 text-center">
																{tag.questionCount === 0 ? "-" : (tag.score / tag.questionCount).toFixed(2)}
															</td>
														</tr>
													))}
												</React.Fragment>
											))
										) : (
											/* Nếu không có chapter thì không group, duyệt trực tiếp */
											detailData.map((tag, index) => (
												<tr key={index} className="border">
													<td className="border p-2 text-center">{index + 1}</td>
													{showLevel && (
														<td className="border p-2" style={{ minWidth: "150px" }}>
															{tag.level || "-"}
														</td>
													)}
													<td className="border p-2 text-center">{tag.questionCount} / {(tag.total || 0).toString().padStart(2, '0')}</td>
													<td className="border p-2 text-center">Câu</td>
													<td className="border p-2 text-center">{(tag.score || 0).toFixed(1)}</td>
													<td className="border p-2 text-center">
														{tag.questionCount === 0 ? "-" : (tag.score / tag.questionCount).toFixed(2)}
													</td>
												</tr>
												
											))
											
										)}
										<tr className="bg-gray-300 fw-bold">
											<td className="border p-2 text-center" colSpan={dynamicColSpan}>Tổng số câu hỏi</td>
											<td className="border p-2 text-center">{totalSelectedQuestions}</td>
											<td className="border p-2 text-center">Câu</td>
											<td className="border p-2 text-center">{totalScore.toFixed(1)}</td>
											<td className="border p-2 text-center">-</td>
										</tr>
									</tbody>

								</table>
							</div>

							<div className="p-2" style={{ minWidth: '250px', fontSize: '14px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', }}>
								<h5 className="text-center">Thống kê</h5>
								<table className="table table-bordered">
									<thead>
										<tr>
											<th style={{ border: '1px solid #ddd', textAlign: 'left', padding: '8px', minWidth: '130px' }}>
												{showLevel ? "Mức độ" : "Chuyên đề"}
											</th>
											<th style={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px' }}>Số lượng</th>
										</tr>
									</thead>
									<tbody>
										{difficultyData.map((row, index) => (
											<tr key={index}>
												<td style={{ border: '1px solid #ddd', padding: '8px' }}>
													{showLevel ? (row.level || "Không xác định") : (row.chapter || "Không xác định")}
												</td>
												<td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{row.questionCount}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div className="p-3" style={{borderTop: '1px solid #ddd', textAlign: 'right',}}>
						<button onClick={() => setShowDetailModal(false)}
							style={{
								border: '1px solid #ccc',
								backgroundColor: '#6c757d',
								color: '#fff',
								padding: '5px 15px',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							Đóng
						</button>
					</div>
				</div>
			</div>
			)}
		</div>
	);
};

export default ExamManagementPage;
