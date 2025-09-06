import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useSearchParams, useNavigate, useLocation  } from "react-router-dom";
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
import { IdCardIcon } from "@radix-ui/react-icons";
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Add } from "@mui/icons-material";
import FormDivideStudent from "../../components/FormDivideStudent/FormDivideStudent";

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
	const navigate = useNavigate();
	const [showFormDivide, setShowFormDivide] = useState(false);
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const [sessionRoom, setSessionRoom] = useState({
		roomId: "",
		supervisorIds: [],
	});

  const handleOpenForm = () => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("showFormDivide", "true");
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
    setShowFormDivide(true);
  };

  const handleCloseForm = () => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete("showFormDivide");
    const newUrl = newSearchParams.toString()
      ? `${location.pathname}?${newSearchParams.toString()}`
      : location.pathname;
    navigate(newUrl, { replace: true });
    setShowFormDivide(false);
  };

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		setShowFormDivide(params.get("showFormDivide") === "true");
	}, [location.search]);


	useEffect(() => {
		if (showForm && inputRef.current) {
			inputRef.current.focus();
		}
	}, [showForm]);

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
		if (location.state?.refresh) {
			fetchData();
		}
	}, [location.state]);

	useEffect(() => {
		fetchData();
	}, [organizeId, sessionId, keyword, page, pageSize]);
		
	const [formData, setFormData] = useState({
		roomId: "",
		// roomName: "",
		supervisorIds: [],
		// candidateList: [],
	});

	const preAddNew = () => {
		setEditingRoomOrganize(null); 
		setFormData({
			roomId: "",
			// roomName: "",
			supervisorIds: [],
			// candidateList: [],
		});
		setShowForm(true);
	};
	
	useEffect(() => {
		if (showForm && inputRef.current) {
				inputRef.current.focus();
		}
	}, [showForm]);

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Dữ liệu thêm mới:", formData);
		if (editingRoomOrganize) {
			// Gọi API cập nhật
			console.log("Gọi API cập nhật");
		} else {
			// Gọi API thêm mới
			console.log("Gọi API thêm mới");
			try {
				const response = await ApiService.post(`/organize-exams/${organizeId}/sessions/${sessionId}/rooms`, formData);
				console.log("Thêm mới thành công:", response.data);
				showToast("success", "Thêm phòng thi thành công!");
				fetchData();
			} catch (error) {
				console.error("Lỗi khi thêm mới:", error);
				showToast("error", "Không thể thêm phòng thi. Vui lòng thử lại sau");
				return;
			}
		}
		resetForm();
		setShowForm(false);
	};

	const preEdit = (account) => {
		setFormData({
			roomId: account.roomId,
			// roomName: account.roomName,
			supervisorIds: account.supervisorIds,
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
				setRoomsOrganize(prev => prev.filter(room => room.roomId !== id));
				showToast("success", "Phòng thi đã bị xóa!");
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
			const statusLabel = newStatus === "active" ? "Kích hoạt" : "Đóng";

			// Cập nhật state (sau này sẽ gửi API để cập nhật cơ sở dữ liệu)
			setRows((prevRows) =>
			  prevRows.map((row) =>
				row.roomId === id ? { ...row, roomStatus: newStatus } : row
			  )
			);
			console.log("organizeExamId được đổi status:", id)
			showToast("success", `Trạng thái đã chuyển sang "${statusLabel}"`);
		  }
		});
	};

	const resetForm = () => {
		setFormData({
			roomId: "",
			// roomName: "",
			supervisorIds: "",
			// candidateList: "",
		});
		setEditingRoomOrganize(null);
	}

	return (
		<div className="p-4">
			{/* Breadcrumb */}
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/staff/dashboard" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
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

			{showFormDivide ? (
				<FormDivideStudent onClose={handleCloseForm}/>
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

          <div className='right-header'>
						<AddButton onClick={handleOpenForm}>
							<i className="fas fa-plus me-2"></i>
              Thêm mới
						</AddButton>
          </div>
        </div>

				<div className="room-organize-table-container mt-3">
					<div className="table-responsive" style={{minHeight: "230px"}}>
						<table className="table sample-table tbl-organize-hover table-hover">
							<thead style={{fontSize: "14px"}}>
								<tr className="align-middle fw-medium">
									<th className="title-row text-center">STT</th> 
									<th className="title-row">Phòng</th>
									<th className="title-row">Giám thị</th>
									<th className="text-center">Số lượng thí sinh</th>
									<th className="text-center">Thí sinh</th>
									<th className="title-row text-center">Trạng thái</th>
									<th className="title-row text-center">Bảng điểm</th>
									<th className="text-center">Thao tác</th>
								</tr>
							</thead>
							<tbody style={{fontSize: "14px"}}>
							{roomsOrganize.length === 0 ? (
								<tr>
									<td colSpan="8" className="text-center fw-semibold text-muted"
											style={{ height: "100px", verticalAlign: "middle" }}>
										Không có dữ liệu
									</td>
								</tr>
							) : (
								roomsOrganize.map((item, index) => (
									<tr key={item.roomInSessionId} className="align-middle">
										<td className="text-center">{index + 1}</td>
										<td
											onClick={() => navigate(`/staff/organize/${organizeId}/${sessionId}/${item.roomInSessionId}`, {
											})}
											style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
										>
											{item.roomName} - {item.roomLocation}
										</td>
										<td
											onClick={() => navigate(`/staff/organize/${organizeId}/${sessionId}/${item.roomInSessionId}`, {
											})}
											style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
										>
											{item.supervisors.map((supervisor, idx) => (
												<span key={supervisor.userId}>
													{supervisor.supervisorName} - {supervisor.userCode}
													{idx < item.supervisors.length - 1 ? ", " : ""}
												</span>
											))}
										</td>
										<td className="text-center"
											onClick={() => navigate(`/staff/organize/${organizeId}/${sessionId}/${item.roomInSessionId}`, {
											})}
											style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
										>
											{item.totalCandidates}
										</td>
										<td
											onClick={() => navigate(`/staff/organize/${organizeId}/${sessionId}/${item.roomInSessionId}`, {
											})}
											style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
											className="text-hover-primary text-center"
										>
											Danh sách thí sinh
										</td>
										<td>
											<div className="d-flex align-items-center justify-content-center">
												<span className={`badge mt-1 ${item.roomStatus === "active" ? "bg-primary" : "bg-secondary"}`}>
													{item.roomStatus === "active" ? "Kích hoạt" : "Đóng"}
												</span>
											</div>
										</td>
										<td>
											{item.roomStatus !== "active" ? (
												<Link
													to={`/staff/organize/score/${organizeId}/${sessionId}/${item.roomInSessionId}`}
													className="d-flex text-hover-primary align-items-center justify-content-center"
													style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}
												>
													In bảng điểm
												</Link>
											) : (
												<div
													className="d-flex align-items-center justify-content-center"
													style={{ cursor: "not-allowed", color: "gray" }}
												>
													In bảng điểm
												</div>
											)}
										</td>
										<td className="text-center align-middle">
											<div className="dropdown d-inline-block">
												<button
													type="button"
													data-bs-toggle="dropdown"
													aria-expanded="false"
													className="dropdown-toggle-icon"
												>
													<i className="fas fa-ellipsis-v"></i>
												</button>
												<ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom "
													style={{
														right: "50%",
														transform: 'translate3d(-10px, 10px, 0px)',
													}}
												>
													{/* <li className="tbl-action" onClick={() => preEdit(item)}> 
														<button className="dropdown-item tbl-action" onClick={() => preEdit(item)}>
															Chỉnh sửa
														</button>
													</li> */}
													<li className="tbl-action" onClick={() => handleDelete(item.roomId)}>
														<button className="dropdown-item tbl-action" onClick={() => handleDelete(item.roomId)}>
															Xoá
														</button>
													</li>
													<li className="tbl-action" onClick={() => handleToggleStatus(item.roomId, item.roomStatus)}>
														<button
															className="dropdown-item tbl-action"
															onClick={() =>
																handleToggleStatus(item.roomId, item.roomStatus)
															}
														>
															{item.roomStatus.toLowerCase() === "active"
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
							p: 3,
							borderRadius: "8px",
							boxShadow: 3,
							mx: "auto",
							position: "relative",
							top: "-60px",
						}}
						onSubmit={handleSubmit}
					>
						<p className="fw-bold mb-4">
							{editingRoomOrganize ? "Chỉnh sửa thông tin phòng thi" : "Thêm phòng thi"}
						</p>
						<Grid container spacing={2}>										
						<Grid item xs={12}>
						<ReactSelect
								fullWidth
								className="basic-single "
								classNamePrefix="select"
								placeholder="Phòng thi"
								name="color"
								options={roomOptions}
								value={roomOptions.find(option => option.value === formData.roomId) || null}
								onChange={(option) => setFormData({ ...formData, roomId: option.value })}
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
							<Grid item xs={12}>
							<ReactSelect
									fullWidth
									className="basic-single "
									classNamePrefix="select"
									placeholder="Giám thị"
									name="color"
									inputRef={inputRef}
									options={supervisorOptions}
									value={formData.supervisorIds.map(id => supervisorOptions.find(option => option.value === id))}
									onChange={(selectedOptions) => {
										const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
										setFormData({ ...formData, supervisorIds: selectedIds });
									}}
									isMulti
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
							{/* <Grid item xs={6}>
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
							</Grid> */}
						</Grid>		
						{/* Buttons */}
						<Grid container spacing={2} sx={{ mt: 1, justifyContent: "flex-end" }}>
								<Grid item xs={3}>
									<CancelButton style={{width: "100%"}} onClick={() => setShowForm(false)}>
										Hủy
									</CancelButton>
								</Grid>
								<Grid item xs={3}>
									<AddButton style={{width: "100%"}}>
										{editingRoomOrganize ? "Cập nhật" : "Lưu"}
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

export default RoomOrganizePage;