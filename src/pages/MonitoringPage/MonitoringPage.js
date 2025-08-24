import React, { useState, useEffect, useContext, use } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaFileAlt, FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MonitoringPage.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ApiService from "../../services/apiService";

const MonitoringPage = () => {
	const { organizeExamId, sessionId, roomId } = useParams();

  const [listCandidate, setListCandidate] = useState([]);
	const [organizeExamName, setOrganizeExamName] = useState("");
	const [sessionName, setSessionName] = useState("");
	const [roomName, setRoomName] = useState("");

	const [startTrack, setStartTrack] = useState(false);

  const [selectedExam, setSelectedExam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await ApiService.get(`/trackexam/get-candidate-details?organizeExamId=${organizeExamId}&sessionId=${sessionId}&roomId=${roomId}`);
      setListCandidate(response.data.candidates);
			setOrganizeExamName(response.data.organizeExamName);
			setSessionName(response.data.sessionName);
			setRoomName(response.data.roomName);
    } catch (error) {
      console.error("Failed to fetch candidate data:", error);
    }
  };

	useEffect(() => {
		const interval = setInterval(() => {
			if (startTrack) {
				fetchData();
			}
		}, 3000);

		return () => clearInterval(interval);
	}, [organizeExamId, sessionId, roomId, startTrack]);

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

	const convertStatus = (status) => {
		switch (status) {
			case "terminate":
				return ["Hủy thi", "bg-danger"];
			case "in_exam":
				return ["Đang thi", "bg-primary"];
			case "not_started":
				return ["Chưa thi", "bg-warning"];
			default:
				return ["Khác", "bg-secondary"];
		}
	};

	const formatTime = (timeString) => {
		// const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" };
		const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
		return new Date(timeString).toLocaleTimeString("vi-VN", options);
	};

	const handleToggleRoomStatus = async () => {
		try {
			const response = await ApiService.post(`/process-take-exams/toggle-room-status`, {
				organizeExamId: organizeExamId,
				sessionId: sessionId,
				roomId: roomId
			});
			if (response.data.newStatus === "closed") {
				setStartTrack(false);
				fetchData();
			} else if (response.data.newStatus === "active") {
				setStartTrack(true);
				fetchData();
			}
		} catch (error) {
			console.error("Failed to update room status:", error);
		}
	};

	// Dừng thi
	const handleTerminate = async (userId, reason) => {
		try {
			await ApiService.put(`/users/update-take-exam`, { 
				userId: userId,
				organizeExamId: organizeExamId,
				sessionId: sessionId,
				roomId: roomId,
				type: "terminate",
				status: reason
			});
			
			fetchData();
		} catch (error) {
			console.error("Failed to terminate exam:", error);
		}
	};

	// Mở lại
	const handleReopen = async (userId) => {
		try {
			await ApiService.put(`/users/update-take-exam`, {
				userId: userId,
				organizeExamId: organizeExamId,
				sessionId: sessionId,
				roomId: roomId,
				type: "reopen",
				status: "in_exam"
			});

			fetchData();
		} catch (error) {
			console.error("Failed to reopen exam:", error);
		}
	};

	// Reset lại bài mới (để sẵn, tạm thời chưa dùng)
	const handleRestart = async (candidateId) => {
		try {
			await ApiService.put(`/users/update-take-exam`, {
				userId: candidateId,
				organizeExamId: organizeExamId,
				sessionId: sessionId,
				roomId: roomId,
				type: "restart"
			});

			fetchData();
		} catch (error) {
			console.error("Failed to restart exam:", error);
		}
	};

  return (
    <div className="home-super-page" style={{paddingTop: "90px"}}>
			<div className="tbl-shadow rounded-3 p-4 bg-white">
				<Link to="/supervisor/home" className="back-link">
					<ChevronLeftIcon /> Quay về danh sách kỳ thi
				</Link>

				{/* Khối thông tin kỳ thi */}
				<div className="exam-info-card">
					<h4 className="text-center fw-bold mb-3">
						<i className="fas fa-chalkboard-teacher me-2 text-primary"></i>
						Giám sát kỳ thi: <span className="text-dark">{organizeExamName}</span>
					</h4>
					<div className="exam-info-details">
						<p><strong>Ca thi:</strong> <span className="text-primary">{sessionName}</span></p>
						<p><strong>Phòng thi:</strong> <span>{roomName}</span></p>
						<p><strong>Mật khẩu thí sinh:</strong> <span className="badge bg-warning text-dark">Chưa biết có thêm vào không</span></p>
					</div>
					<div className="text-center">
						<button className="btn btn-primary" onClick={handleToggleRoomStatus}>
							{startTrack ? "Đóng phòng thi" : "Kích hoạt phòng thi"}
						</button>
					</div>
				</div>

    		{/* Bảng giám sát thí sinh */}
				<div className="monitor-table mt-4">
					<table className="table table-hover align-middle">
						<thead>
							<tr>
								<th>#</th>
								<th>Mã SV</th>
								<th>Họ và tên đệm</th>
								<th>Tên</th>
								<th>Trạng thái</th>
								<th>Bắt đầu (thời gian)</th>
								<th>Tiến độ</th>
								<th>Nộp bài (thời gian)</th>
								<th>Điểm</th>
								<th>Cảnh cáo (số lần)</th>
								<th>Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{processData(listCandidate).map((row, index) => (
								<tr key={row.userCode}>
									<td>{index + 1}</td>
									<td className="fw-bold">{row.userCode}</td>
									<td>{row.lastName}</td>
									<td>{row.firstName}</td>
									<td>
										<span className={`badge ${convertStatus(row.status)[1]}`}>
											{convertStatus(row.status)[0] || "Chờ"}
										</span>
									</td>
									<td>{formatTime(row.startAt) || "-"}</td>
									<td>
										<div className="progress progress-sm">
											<div className="progress-bar" style={{ width: `${(row.progress / row.totalQuestions) * 100}%` }}></div>
										</div>
										<small>{row.progress + "/" + row.totalQuestions}</small>
									</td>
									<td>{row.status === "done" && row.finishAt ? formatTime(row.finishAt) : "-"}</td>
									<td>
										<span>{row.totalScore && row.status === "done" ? row.totalScore : "-"}</span>
									</td>
									<td>
										<span>{row.violationCount}</span>
									</td>
									<td>
										{row.status === "terminate" ? (
											// <span className="badge bg-warning">Đã dừng thi</span>
											<button
												className="btn btn-sm btn-outline-danger"
											>
												<i className="fas fa-stop-circle me-1"></i> Mở lại
											</button>
										) : (
											<button
												className="btn btn-sm btn-outline-danger"
												data-bs-toggle="modal"
												data-bs-target="#violationModal"
											>
												<i className="fas fa-stop-circle me-1"></i> Dừng thi
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal Bootstrap */}
      <div className="modal fade mt-4" id="violationModal" tabIndex="-1" aria-labelledby="violationModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="violationModalLabel">Xử lý vi phạm</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <h4>Thí sinh: </h4>
              <p>Lý do:</p>
              <textarea className="form-control" rows="3" placeholder="Nhập lý do..."></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
              <button type="button" className="btn btn-primary">Xác nhận</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;
