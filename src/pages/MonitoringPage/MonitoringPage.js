import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ApiService from "../../services/apiService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MonitoringPage.css";

const MonitoringPage = ({ examId, sessionId, roomId, onExit }) => {
  const [candidates, setCandidates] = useState([]);
  const [organizeExamName, setOrganizeExamName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [totalQuestion, setTotalQuestion] = useState(0);

	useEffect(() => {
		let intervalId;
	
		const fetchExamDetail = async () => {
			try {
				const response = await ApiService.get("/process-take-exams/track-exam-detail", {
					params: {
						organizeExamId: examId,
						sessionId: sessionId,
						roomId: roomId,
					},
				});
				const data = response.data;
				setCandidates(data.candidates || []);
				setOrganizeExamName(data.organizeExamName);
				setSessionName(data.sessionName);
				setRoomName(data.roomName);
				setTotalQuestion(data.totalQuestion);
			} catch (error) {
				console.error("Failed to fetch exam detail: ", error);
			}
		};
	
		if (examId && sessionId && roomId) {
			fetchExamDetail(); // gọi lần đầu tiên
			intervalId = setInterval(fetchExamDetail, 3000); // gọi mỗi 3 giây
		}
	
		return () => {
			if (intervalId) clearInterval(intervalId); // dọn dẹp khi unmount
		};
	}, [examId, sessionId, roomId]);
	

  const processData = (data) => {
    return data.map((item) => {
      const nameParts = item.fullName.trim().split(" ");
      const firstName = nameParts.pop();
      const lastName = nameParts.join(" ");
      return { ...item, firstName, lastName };
    });
  };

  const rows = processData(candidates);

	const getStatusLabel = (status) => {
		switch (status) {
			case "active":
				return "Khả dụng";
			case "inexam":
				return "Đang thi";
			case "reinexam":
				return "Mở lại";
			case "done":
				return "Đã nộp bài";
			case "terminate":
				return "Hủy thi";
			default:
				return status;
		}
	}

	const [selectedCandidate, setSelectedCandidate] = useState(null);
	const [reason, setReason] = useState("");
	const [actionType, setActionType] = useState("");

	const handleTerminateCandidate = (candidate) => {
		setSelectedCandidate(candidate);
		setActionType("terminate");
		setReason("");
	};
	
	const handleReinexamCandidate = (candidate) => {
		setSelectedCandidate(candidate);
		setActionType("reinexam");
		setReason("");
	};


	const handleCandidateClick = (candidate) => {
		setSelectedCandidate(candidate);
	}
	const handleModalClose = () => {
		setSelectedCandidate(null);
	}

	const handleConfirmAction = async () => {
		if (!selectedCandidate) return;
		try {
			await ApiService.post(
				"/process-take-exams/update-status",
				actionType === "terminate"
					? { type: "terminate", unrecognizedReason: reason }
					: { type: "reinexam" },
				{
					params: {
						userId: selectedCandidate.userId,
						takeExamId: selectedCandidate.takeExamId,
					},
				}
			);
	
			// Làm mới dữ liệu
			const response = await ApiService.get("/process-take-exams/track-exam-detail", {
				params: {
					organizeExamId: examId,
					sessionId: sessionId,
					roomId: roomId,
				},
			});
			setCandidates(response.data.candidates || []);
			setSelectedCandidate(null);
			setReason("");
			setActionType("");
			window.bootstrap.Modal.getInstance(document.getElementById("violationModal"))?.hide();
		} catch (error) {
			console.error("Thao tác thất bại:", error);
		}
	};

  return (
    <div className="home-super-page">
      <Link onClick={onExit} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <ChevronLeftIcon /> Quay về
      </Link>

      <div className="mb-4">
        <h4 className="d-flex align-items-center justify-content-center">
          Giám sát kỳ thi: {organizeExamName}
        </h4>
        <h5 className="d-flex align-items-center justify-content-center">
          Ca thi: {sessionName}
        </h5>
        <h5 className="d-flex align-items-center justify-content-center">
          Phòng thi: {roomName}
        </h5>
      </div>

      <div className="monitor-tbl">
        <table className="table table-hover table-bordered custom-table monitor-tbl">
          <thead className="custom-header">
            <tr>
              <th>#</th>
              <th style={{ width: "100px" }}>Mã sinh viên</th>
              <th className="text-wrap" style={{ maxWidth: "100px" }}>Họ và tên đệm</th>
              <th style={{ minWidth: "70px" }}>Tên</th>
              <th>Trạng thái</th>
              <th>Bắt đầu</th>
              <th>Tiến độ</th>
              <th>Nộp bài</th>
              <th>Điểm</th>
              <th>Cảnh cáo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.userId}>
                <td>{index + 1}</td>
                <td>{row.userCode}</td>
                <td className="text-wrap">{row.lastName}</td>
                <td>{row.firstName}</td>
                <td>{getStatusLabel(row.status)}</td>
                <td>{row.startedAt ? new Date(row.startedAt).toLocaleTimeString() : "Chưa bắt đầu"}</td>
                <td>{row.progress}/{totalQuestion}</td>
                <td>{row.status == "done" && row.finishedAt ? new Date(row.finishedAt).toLocaleTimeString() : "-"}</td>
                <td>{row.status == "done" ? row.totalScore : 0}</td>
                <td>{row.violationCount}</td>
								<td>
									{row.status !== "terminate" ? (
										<Link
											data-bs-toggle="modal"
											data-bs-target="#violationModal"
											onClick={() => handleTerminateCandidate(row)}
										>
											Dừng thi
										</Link>
									) : (
										<Link
											data-bs-toggle="modal"
											data-bs-target="#violationModal"
											onClick={() => handleReinexamCandidate(row)}
										>
											Mở lại
										</Link>
									)}
								</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal xử lý vi phạm */}
      <div className="modal fade mt-4" id="violationModal" tabIndex="-1" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">
								{actionType === "terminate" ? "Xác nhận dừng thi" : "Xác nhận mở lại"}
							</h5>
							<button className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className="modal-body">
							{selectedCandidate && (
								<>
									<h6>Thí sinh: {selectedCandidate.fullName}</h6>
									{actionType === "terminate" && (
										<>
											<p>Lý do dừng thi:</p>
											<textarea
												className="form-control"
												rows="3"
												value={reason}
												onChange={(e) => setReason(e.target.value)}
												placeholder="Nhập lý do..."
											></textarea>
										</>
									)}
								</>
							)}
						</div>
						<div className="modal-footer">
							<button className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
							<button className="btn btn-primary" onClick={handleConfirmAction}>Xác nhận</button>
						</div>
					</div>
				</div>
			</div>

    </div>
  );
};

MonitoringPage.propTypes = {
  examId: PropTypes.string.isRequired,
  sessionId: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
  onExit: PropTypes.func,
};

export default MonitoringPage;
