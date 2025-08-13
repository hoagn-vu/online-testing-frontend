import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MonitorOrganizePage.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import dayjs from "dayjs";
import { Chip } from "@mui/material";
import ApiService from "../../services/apiService";

const MonitorOrganizePage = () => {
  const listCandidate = [
		{
			roomId: "CAND001",
			roomName: "BIT220172",
			roomOrganizeStatus: "Đang diễn ra",
			startAt: "2025-04-10T13:00:00Z",
			endAt: "2025-04-10T13:00:00Z",
		},
		{
			roomId: "CAND002",
			roomName: "BIT220172",
			roomOrganizeStatus: "Hoàn thành",
			startAt: "2025-04-10T13:00:00Z",
			endAt: "2025-04-10T13:00:00Z",
		},
	];

  const [selectedExam, setSelectedExam] = useState(null);
  const [showModal, setShowModal] = useState(false);
	const { organizeId, sessionId } = useParams();
	const location = useLocation();
	const { sessionName} = location.state || {};
	const organizeExamName = location.state?.organizeExamName || localStorage.getItem("organizeExamName");
	const [listRoom, setListRoom] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [keyword, setKeyword] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/organize-exams/rooms", {
        params: { 
					orgExamId: organizeId, 
					ssId: sessionId, 
					keyword, page, pageSize },
      });
      setListRoom(response.data.rooms);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
    setIsLoading(false);
  };

	useEffect(() => {
		fetchData();
	}, [organizeId, sessionId, keyword, page, pageSize]);

  // Xử lý khi nhấn vào bài thi
  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

	const [rows, setRows] = useState(listCandidate);
    
	const getChipColor = (status) => {
		switch (status) {
			case "Đang diễn ra":
				return "warning"; // Màu vàng
			case "Hoàn thành":
				return "success"; // Màu xanh lá
			default:
				return "default"; // Màu mặc định
		}
	};

  return (
    <div className="p-4">
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
				<span className="breadcrumb-current">Giám sát</span>
			</nav>
			
			<div className="tbl-shadow p-3">
				<div>
						<h4 className="d-flex align-items-center justify-content-center">Giám sát kỳ thi: </h4> 
						<h5 className="d-flex align-items-center justify-content-center">Ca thi: </h5>
				</div>

				<div className="session-table-container mt-2">
							<div className="table-responsive">
								<table className="table sample-table tbl-organize">
									<thead style={{fontSize: "14px"}}>
										<tr className="align-middle fw-medium">
											<th scope="col" className="title-row text-center">STT</th> 
											<th scope="col" className="title-row">Phòng thi</th>
											<th scope="col" className="title-row text-center">Tiến độ</th>
											<th scope="col" className="title-row text-center">Bắt đầu</th>
											<th scope="col" className="title-row text-center">Kết thúc</th>
											<th scope="col" className="title-row text-center">Trạng thái</th>
											<th scope="col" className="title-row text-center">Điểm</th>
										</tr>
									</thead>
									<tbody style={{ fontSize: "14px" }}>
										{listRoom.length === 0 ? (
											<tr>
												<td colSpan="6" className="text-center fw-semibold text-muted"
														style={{ height: "100px", verticalAlign: "middle" }}>
													Không có dữ liệu
												</td>
											</tr>
										) : (
											listRoom.map((row, index) =>
													<tr key={row.roomInSessionId} className="align-middle">
														<td className="text-center">{index + 1}</td>
														<td>{row.roomName}</td>
														<td className="text-center">?/?</td>
														<td className="text-center">{dayjs(row.startAt).format("DD/MM/YYYY HH:mm")}</td>
														<td className="text-center">{dayjs(row.endAt).format("DD/MM/YYYY HH:mm")}</td>
														<td className="text-center">
															<Chip
																label={row.roomOrganizeStatus}
																color={getChipColor(row.roomOrganizeStatus)}
																variant="filled" // Hoặc "filled" nếu muốn nền màu đậm
															/>
														</td>											
														<td className="text-center">
															<Link className="text-hover-primary"
																	to={`/staff/organize/score/${organizeId}/${sessionId}/${row.roomInSessionId}`}
																	style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}>
																In bảng điểm
															</Link>
														</td>
													</tr>
												)
											)
										}
									</tbody>
				
								</table>
							</div>
						</div>			

			</div>
    </div>
  );
};

export default MonitorOrganizePage;