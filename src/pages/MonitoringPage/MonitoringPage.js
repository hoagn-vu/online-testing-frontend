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
			examId: "EXAM123"
		},
		{
			candidateId: "CAND002",
			userCode: "BIT220172",
			fullName: "Ngô Đức Thuận",
			gender: "Nam",
			dateOfBirth: "21/05/2004 21/05/2004",
			examId: "EXAM124"
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
    <div className="home-super-page">
			<Link className="mt-0" to="/supervisor/home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
				<ChevronLeftIcon /> Quay về
			</Link>
			<div className="mb-3 mt-1">
				<h5 className="d-flex align-items-center justify-content-center">Giám sát kỳ thi: </h5> 
				<h6 className="d-flex align-items-center justify-content-center">Ca thi: </h6>
				<h6 className="d-flex align-items-center justify-content-center">Phòng thi: </h6>
			</div>
			<div>
				<table className="table table-hover table-bordered custom-table monitor-tbl">
					<thead className="custom-header">
						<tr>
							<th>#</th>
							<th style={{width: "100px"}}>Mã sinh viên</th>
							<th className="text-wrap" style={{ maxWidth: "100px" }}>Họ và tên đệm</th>
							<th style={{minWidth: "70px"}}>Tên</th>
							<th>Trạng thái</th>
							<th>Bắt đầu</th>
							<th>Tiến độ</th>
							<th>Nộp bài</th>
							<th>Điểm số</th>
							<th>Cảnh cáo</th>
							<th>Thao tác</th>
						</tr>
					</thead>
					<tbody>
						{processData(rows).map((row, index) => (
							<tr key={row.candidateId}>
								<td>{index + 1}</td>
								<td>{row.userCode}</td>
								<td className="text-wrap">{row.lastName}</td>
								<td>{row.firstName}</td>
								<td>{row.gender}</td>
								<td>{row.dateOfBirth}</td>
								<td>0/10</td>
								<td>{row.dateOfBirth}</td>
								<td></td>
								<td>{row.dateOfBirth}</td>
								<td><Link data-bs-toggle="modal" data-bs-target="#violationModal">Dừng thi</Link></td>
							</tr>
						))}
					</tbody>
				</table>
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
