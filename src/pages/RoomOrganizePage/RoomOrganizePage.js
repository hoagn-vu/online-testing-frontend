import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./RoomOrganizePage.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Chip, Box, Button, Grid, MenuItem, Pagination, IconButton, TextField, Checkbox, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";
import ReactSelect  from 'react-select';
import ApiService from "../../services/apiService";

const RoomOrganizePage = () => {
	const [showForm, setShowForm] = useState(false);
	const [editingRoomOrganize, setEditingRoomOrganize] = useState(null);
	const inputRef = useRef(null);

	const { organizeId, sessionId } = useParams();

	const [roomsOrganize, setRoomsOrganize] = useState([]);
	const [organizeExamName, setOrganizeExamName] = useState("");
	const [sessionName, setSessionName] = useState("");
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [isLoading, setIsLoading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [roomOptions, setRoomOptions] = useState([]);
	const [supervisorOptions, setSupervisorOptions] = useState([]);
	const [candidateGroupOptions, setCandidateGroupOptions] = useState([]);

	useEffect(() => {
		const fetchRoomOptions = async () => {
			try {
				const response = await ApiService.get("/rooms/get-options");
				setRoomOptions(response.data.map((room) => ({
					value: room.roomId,
					label: `${room.roomName} - ${room.roomLocation}`,
				})));
			} catch (error) {
				console.error("Failed to fetch room options", error);
			}
		};

		fetchRoomOptions();
	}, []);

	useEffect(() => {
		const fetchSupervisorOptions = async () => {
			try {
				const response = await ApiService.get("/users/get-by-role", {
					params: { role: "supervisor" },
				});
				setSupervisorOptions(response.data.map((staff) => ({
					value: staff.userId,
					label: `${staff.userCode} - ${staff.fullName}`,
				})));
			} catch (error) {
				console.error("Failed to fetch supervisor options", error);
			}
		};

		fetchSupervisorOptions();
	}, []);


	const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1);
  };

	const fetchData = async () => {
		try {
			const response = await ApiService.get("/organize-exams/rooms", {
				params: { orgExamId: organizeId, ssId: sessionId, keyword, page, pageSize },
			});
			setRoomsOrganize(response.data.rooms);
			setTotalCount(response.data.totalCount);
			setOrganizeExamName(response.data.organizeExamName);
			setSessionName(response.data.sessionName);
		} catch (error) {
			console.error("Failed to fetch data", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, [organizeId, sessionId, keyword, page, pageSize]);

	
		
	const [formData, setFormData] = useState({
		roomId: "",
		roomName: "",
		supervisorId: "",
		candidateList: "",
	});

	const preAddNew = () => {
		setEditingRoomOrganize(null); 
		setFormData({
			roomId: "",
			roomName: "",
			supervisorId: "",
			candidateList: "",
		});
		setShowForm(true);
	};
	
	useEffect(() => {
		if (showForm && inputRef.current) {
				inputRef.current.focus();
		}
	}, [showForm]);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Dữ liệu thêm mới:", formData);
		if (editingRoomOrganize) {
			// Gọi API cập nhật
			console.log("Gọi API cập nhật");
		} else {
			// Gọi API thêm mới
			console.log("Gọi API thêm mới");
		}
		resetForm();
		setShowForm(false);
	};

	const preEdit = (account) => {
		setFormData({
			roomId: account.roomId,
			roomName: account.roomName,
			supervisorId: account.supervisorId,
		});
		setEditingRoomOrganize(account);
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
				console.log("Xóa phòng thi có ID:", id);
	
				setRows(prevRows => {
					const updatedRows = prevRows.filter(row => row.roomId !== id);
					console.log("Danh sách sau khi xóa:", updatedRows);
					return updatedRows;
				});
	
				Swal.fire({
					title: "Đã xóa!",
					text: "Phòng thi đã bị xóa.",
					icon: "success",
				});
			}
		});
	};
	
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
				row.roomId === id ? { ...row, roomStatus: newStatus } : row
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

	const resetForm = () => {
		setFormData({
			roomId: "",
			roomName: "",
			supervisorId: "",
			candidateList: "",
		});
		setEditingRoomOrganize(null);
	}

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
				<span className="breadcrumb-current">{sessionName}</span>
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

				<div className="room-organize-table-container mt-3">
					<div className="table-responsive">
						<table className="table sample-table tbl-organize-hover table-hover">
							<thead style={{fontSize: "14px"}}>
								<tr className="align-middle fw-medium">
									<th scope="col" className="title-row text-center">STT</th> 
									<th scope="col" className="title-row">Mã phòng</th>
									<th scope="col" className="title-row">Phòng</th>
									<th scope="col" className="title-row">Giám thị</th>
									<th scope="col" className="title-row">Thí sinh</th>
									<th scope="col" className="title-row text-center">Trạng thái</th>
									<th className="text-center">Thao tác</th>
								</tr>
							</thead>
							<tbody style={{fontSize: "14px"}}>
								{roomsOrganize.map((item, index) => (
									<tr key={item.roomInSessionId} className="align-middle">
										<td className="text-center">{index + 1}</td>
										<td>{item.roomInSessionId}</td>
										<td>{item.roomName} - {item.roomLocation}</td>
										<td>{item.supervisors[0].supervisorName}</td>
										<td>
											<Link className="text-hover-primary"
												to={`/staff/organize/${organizeId}/${sessionId}/${item.roomInSessionId}`}
												style={{ textDecoration: "none", color: "black", cursor: "pointer" }}
											>
												Danh sách thí sinh
											</Link>
										</td>
										<td>
											<div className="form-check form-switch d-flex justify-content-center">
												<input
													className="form-check-input"
													type="checkbox"
													role="switch"
													checked={item.roomStatus.toLowerCase() === "active"}
													onChange={() =>
														handleToggleStatus(item.roomId, item.roomStatus)
													}
												/>
											</div>
										</td>
										<td className="text-center">
											<button className="btn btn-primary btn-sm" style={{width: "35px", height: "35px"}}  onClick={() => preEdit(item)}>
												<i className="fas fa-edit text-white "></i>
											</button>
											<button className="btn btn-danger btn-sm ms-2" style={{width: "35px", height: "35px"}}  onClick={() => handleDelete(item.roomId)}>
												<i className="fas fa-trash-alt"></i>
											</button>
										</td>
									</tr>
								))}
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
							width: "600px",
							backgroundColor: "white",
							p: 2,
							borderRadius: "8px",
							boxShadow: 3,
							mx: "auto",
							position: "relative",
							top: "-60px",
						}}
						onSubmit={handleSubmit}
					>
						<p className="text-align fw-bold">{editingRoomOrganize ? "Chỉnh sửa thông tin ca thi" : "Thêm phòng thi"}</p>
						<Grid container spacing={2}>										
						<Grid item xs={12}>
						<ReactSelect
								fullWidth
								className="basic-single "
								classNamePrefix="select"
								placeholder="Phòng thi"
								name="color"
								options={roomOptions}
								styles={{
									control: (base) => ({
										...base,
										height: "48px", // Tăng chiều cao
										minHeight: "40px",
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
									placeholder="Giám thị"
									name="color"
									options={supervisorOptions}
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
										placeholder="Nhóm thí sinh"
										name="color"
										options={roomOptions}
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
												{editingRoomOrganize ? "Cập nhật" : "Lưu"}
										</Button>
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

export default RoomOrganizePage;