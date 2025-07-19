import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaFileAlt, FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MonitoringPage.css";
import { Link, useNavigate  } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const MonitoringPage = () => {
  const listCandidate = [
		{
			candidateId: "CAND001",
			userCode: "BIT220172",
			fullName: "Hoàng Nguyên Vũ",
			gender: "Nam",
			dateOfBirth: "21/05/2003",
			examId: "EXAM123",
			status: "Đang thi",
		},
		{
			candidateId: "CAND002",
			userCode: "BIT220172",
			fullName: "Ngô Đức Thuận",
			gender: "Nam",
			dateOfBirth: "21/05/2004",
			examId: "EXAM124",
			status: "Đang thi",
		},
		{
			candidateId: "CAND002",
			userCode: "BIT220172",
			fullName: "Ngô Đức Thuận",
			gender: "Nam",
			dateOfBirth: "21/05/2004",
			examId: "EXAM124",
			status: "Đang thi",
		},
		{
			candidateId: "CAND002",
			userCode: "BIT220172",
			fullName: "Ngô Đức Thuận",
			gender: "Nam",
			dateOfBirth: "21/05/2004",
			examId: "EXAM124",
			status: "Đã nộp",
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

  const [selectedExam, setSelectedExam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Xử lý khi nhấn vào bài thi
  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };
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
	
  return (
    <div className="home-super-page" style={{paddingTop: "90px"}}>
			<div className="tbl-shadow rounded-3 p-4 bg-white">
    {/* Nút quay lại */}
    <Link to="/supervisor/home" className="back-link">
      <ChevronLeftIcon /> Quay về danh sách kỳ thi
    </Link>

    {/* Khối thông tin kỳ thi */}
    <div className="exam-info-card">
      <h4 className="text-center fw-bold mb-3">
        <i className="fas fa-chalkboard-teacher me-2 text-primary"></i>
        Giám sát kỳ thi: <span className="text-dark">Kết thúc học phần</span>
      </h4>
      <div className="exam-info-details">
        <p><strong>Ca thi:</strong> <span className="text-primary">Ca 01 (08:00 - 09:30)</span></p>
        <p><strong>Phòng thi:</strong> <span>Phòng 101</span></p>
        <p><strong>Mật khẩu thí sinh:</strong> <span className="badge bg-warning text-dark">ABC123</span></p>
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
          {processData(rows).map((row, index) => (
            <tr key={row.candidateId}>
              <td>{index + 1}</td>
              <td className="fw-bold">{row.userCode}</td>
              <td>{row.lastName}</td>
              <td>{row.firstName}</td>
              <td>
                <span className={`badge ${
                  row.status === "Đang thi"
                    ? "bg-success"
                    : row.status === "Đã nộp"
                    ? "bg-primary"
                    : "bg-secondary"
                }`}>
                  {row.status || "Chờ"}
								</span>
							</td>
							<td>{row.startTime || "-"}</td>
							<td>
								{row.status === "Đang thi" ? (
									<>
										<div className="progress progress-sm">
											<div className="progress-bar" style={{ width: `30%` }}></div>
										</div>
										<small>3/10</small>
									</>
								) : row.status === "Đã nộp" ? (
									<>
										<div className="progress progress-sm">
											<div className="progress-bar" style={{ width: `100%` }}></div>
										</div>
										<small>10/10</small>
									</>
								) : (
									"-"
								)}
							</td>
							<td>{row.submitTime || "-"}</td>
							<td>
								{row.score ? (
									<span className="badge bg-info text-dark">{row.score}</span>
								) : "-"}
							</td>
							<td>
								{row.warningCount > 0 ? (
									<span className="badge bg-danger">{row.warningCount}</span>
								) : (
									"-"
								)}
							</td>
							<td>
								<button
									className="btn btn-sm btn-outline-danger"
									data-bs-toggle="modal"
									data-bs-target="#violationModal"
								>
									<i className="fas fa-stop-circle me-1"></i> Dừng thi
								</button>
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
