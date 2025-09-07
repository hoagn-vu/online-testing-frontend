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
		try {
			const response = await ApiService.get("/exams", {
        params: { keyword, page, pageSize },
      });
			setListExam(response.data.exams);
			setTotalCount(response.data.totalCount);
		} catch (error) {
			console.error("Lỗi lấy dữ liệu:", error);
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
				await ApiService.put(`/exams/${id}`, { examStatus: "deleted" }); 
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
								<th className=" text-center" style={{ width: "120px"}}>Thao tác</th>
							</tr>
						</thead>
						<tbody>
						{listExam.length === 0 ? (
								<tr>
									<td colSpan="6" className="text-center fw-semibold text-muted"
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
					<Box
						component="form"
						sx={{
							width: "700px",
							backgroundColor: "white",
							borderRadius: "8px",
							boxShadow: 3,
							mx: "auto",
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
					</Box>
				</div>
			)}
		</div>
	);
};

export default ExamManagementPage;
