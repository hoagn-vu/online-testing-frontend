import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./CandidateOrganizePage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import {Chip, Box, Button, Grid, MenuItem, Select, Pagination, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ReactSelect  from 'react-select';
import ApiService from "../../services/apiService";

const CandidateOrganizePage = () => {
  const [showForm, setShowForm] = useState(false);
  const inputRef = useRef(null);
	const { organizeId, sessionId, roomId } = useParams();

	const processData = (data) => {
		return data.map((item) => {
			const nameParts = item.candidateName.trim().split(" ");
			const firstName = nameParts.pop(); // Lấy phần cuối cùng là firstName
			const lastName = nameParts.join(" "); // Phần còn lại là lastName
			return {
				...item,
				firstName, 
				lastName
			};
		});
	};

	const [listCandidate, setListCandidate] = useState([]);
	const [organizeExamName, setOrganizeExamName] = useState("");
	const [sessionName, setSessionName] = useState("");
	const [roomName, setRoomName] = useState("");
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);

	const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const response = await ApiService.get(`/organize-exams/candidates`, {
				params: { orgExamId: organizeId, ssId: sessionId, rId: roomId, keyword, page, pageSize },
			});
			setListCandidate(response.data.candidates);
			setOrganizeExamName(response.data.organizeExamName);
			setSessionName(response.data.sessionName);
			setRoomName(response.data.roomName);
			setTotalCount(response.data.totalCount);
		} catch (error) {
			console.error("Failed to fetch data", error);
		}

		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, [organizeId, sessionId, roomId, keyword, page, pageSize]);
		
	useEffect(() => {
		if (showForm && inputRef.current) {
						inputRef.current.focus();
		}
		}, [showForm]);
	
	const [formData, setFormData] = useState({
		candidateList: "",
	});

	const preAddNew = () => {
		setFormData({
			candidateList: "",
		});
		setShowForm(true);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Dữ liệu thêm mới:", formData);
		setShowForm(false);
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
					console.log("Xóa thí thi có ID:", id);

					setRows(prevRows => {
						const updatedRows = prevRows.filter(row => row.candidateId !== id);
						console.log("Danh sách sau khi xóa:", updatedRows);
						return updatedRows;
					});

					Swal.fire({
						title: "Đã xóa!",
						text: "Thí thi đã bị xóa.",
						icon: "success",
					});
				}
			});
	};
	
	return (
		<div className="exam-management-page">
			{/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
					<Link to="/staff/organize" className="breadcrumb-between">Quản lý kỳ thi</Link></span>
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
				<Link 
					to={`/staff/organize/${organizeId}`} 
					state={{ organizeExamName: organizeExamName }} 
					className="breadcrumb-between">
					{organizeExamName}
				</Link></span>
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
				<Link 
					to={`/staff/organize/${organizeId}/${sessionId}`} 
					state={{ sessionName: sessionName }}
					className="breadcrumb-between">
					{sessionName}
				</Link></span>
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">Phòng {roomName}</span>
			</nav>

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
            <button className="btn btn-primary" style={{fontSize: "14px"}} onClick={preAddNew}>
              <i className="fas fa-plus me-2"></i>
              Thêm mới
            </button>
          </div>
        </div>

				<div className="session-table-container mt-3">
					<div className="table-responsive">
						<table className="table sample-table tbl-organize table-striped">
							<thead style={{fontSize: "14px"}}>
								<tr className="align-middle fw-medium">
									<th className="text-center">STT</th> 
									<th>MSSV</th>
									<th>Họ và tên đệm</th>
									<th>Tên</th>
									<th className="text-center">Ngày sinh</th>
									<th className="text-center">Giới tính</th>
									<th scope="col" className="title-row">Thao tác</th>
								</tr>
							</thead>
							<tbody style={{fontSize: "14px"}}>
								{processData(listCandidate).length === 0 ? (
									<tr>
										<td colSpan="7" className="text-center fw-semibold text-muted" 
											style={{ height: "100px", verticalAlign: "middle" }}>
										Không có dữ liệu
										</td>
									</tr>
								) : (
								processData(listCandidate).map((item, index) => (
									<tr key={item.candidateId} className="align-middle">
										<td className="text-center">{index + 1}</td>
										<td>{item.userCode}</td>
										<td>{item.lastName}</td>
										<td>{item.firstName}</td>
										<td className="text-center">{item.dateOfBirth}</td>
										<td className="text-center">{item.gender == "male" ? "Nam" : "Nữ"}</td>
										<td>
											<button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}}  onClick={() => handleDelete(item.candidateId)}>
												<i className="fas fa-trash-alt"></i>
											</button>
										</td>
									</tr>
								)))}
							</tbody>
						</table>
					</div>
					<div className="d-flex justify-content-end mb-2">
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
							width: "500px",
							backgroundColor: "white",
							p: 2,
							borderRadius: "8px",
							boxShadow: 3,
							mx: "auto",
						}}
						onSubmit={handleSubmit}
					>
						<p className="text-align fw-bold">Thêm thí sinh vào phòng thi</p>
						<Grid container>	
							<Grid item xs={12}>									
								<TextField
									id="outlined-multiline-flexible"
									label="Nhập mã sinh viên"
									placeholder="Nhập mã sinh viên"
									multiline
									maxRows={10}
									sx={{
										width: "100%",
										"& .MuiInputBase-input": {
											fontSize: "14px",
										},
										"& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
									}}
								/>
							</Grid>	
						</Grid>		
						{/* Buttons */}
						<Grid container spacing={2} sx={{ mt: 1 }}>
							<Grid item xs={6}>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									fullWidth 
								> Lưu </Button>
							</Grid>
							<Grid item xs={6}>
								<Button
										variant="outlined"
										color="secondary"
										fullWidth
										onClick={() => setShowForm(false)}
								> Hủy </Button>
							</Grid>
						</Grid>
					</Box>
				</div>
			)}
		</div>
	)
}

export default CandidateOrganizePage;