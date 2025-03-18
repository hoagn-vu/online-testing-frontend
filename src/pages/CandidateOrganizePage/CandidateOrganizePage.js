import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./CandidateOrganizePage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import {Chip, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ReactSelect  from 'react-select';

const listCandidate = [
  {
    candidateId: "CAND001",
    userCode: "BIT220172",
    fullName: "Hoàng Nguyên Vũ",
    gender: "Nam",
    dateOfBirth: "21/05/2003",
    examId: "EXAM123"
  },
  {
    candidateId: "CAND002",
    userCode: "BIT220172",
    fullName: "Ngô Đức Thuận",
    gender: "Nam",
    dateOfBirth: "21/05/2004",
    examId: "EXAM124"
  },
];

const CandidateOrganizePage = () => {
  const [showForm, setShowForm] = useState(false);
  const paginationModel = { page: 0, pageSize: 5 };
  const inputRef = useRef(null);

	const processData = (data) => {
		return data.map((item) => {
				const nameParts = item.fullName.trim().split(" ");
				const firstName = nameParts.pop(); // Lấy phần cuối cùng là firstName
				const lastName = nameParts.join(" "); // Phần còn lại là lastName
				return {
						...item,
						firstName, 
						lastName
				};
		});
	};
	
	const [rows, setRows] = useState(processData(listCandidate));
	
	useEffect(() => {
		if (showForm && inputRef.current) {
						inputRef.current.focus();
		}
		}, [showForm]);
	
	const [formData, setFormData] = useState({
		candidateList: "",
	});

	const handleAddNew = () => {
	setFormData({
		candidateList: "",
	});
	setTimeout(() => setShowForm(true), 0); 
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

			<div className="session-table-container mt-3">
				<div className="table-responsive">
					<table className="table sample-table tbl-organize table-striped">
						<thead style={{fontSize: "14px"}}>
							<tr className="align-middle fw-medium">
								<th scope="col" className="title-row text-center">STT</th> 
								<th scope="col" className="title-row">MSSV</th>
								<th scope="col" className="title-row">Họ và tên đệm</th>
								<th scope="col" className="title-row">Tên</th>
								<th scope="col" className="title-row">Ngày sinh</th>
								<th scope="col" className="title-row">Giới tính</th>
								<th scope="col" className="title-row">Thao tác</th>
							</tr>
						</thead>
						<tbody style={{fontSize: "14px"}}>
							{processData(rows).map((item, index) => (
								<tr key={item.candidateId} className="align-middle">
									<td className="text-center">{index + 1}</td>
									<td>{item.userCode}</td>
									<td>{item.lastName}</td>
									<td>{item.firstName}</td>
									<td>{item.dateOfBirth}</td>
									<td>{item.gender}</td>
									<td>
										<button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}}  onClick={() => handleDelete(item.candidateId)}>
											<i className="fas fa-trash-alt"></i>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
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