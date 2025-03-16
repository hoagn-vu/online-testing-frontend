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
			<Link to="/supervisor/home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
				<ChevronLeftIcon /> Quay về
			</Link>
			<div className="mb-4">
				<h4 className="d-flex align-items-center justify-content-center">Giám sát kỳ thi: </h4> 
				<h5 className="d-flex align-items-center justify-content-center">Ca thi: </h5>
				<h5 className="d-flex align-items-center justify-content-center">Phòng thi: </h5>
			</div>
			<div>
				<table className="table table-hover table-bordered custom-table">
					<thead className="table-dark">
						<tr>
							<th>#</th>
							<th>Mã sinh viên</th>
							<th className="text-wrap" style={{ maxWidth: "100px" }}>Họ và tên đệm</th>
							<th>Tên</th>
							<th>Trạng thái</th>
							<th>Bắt đầu làm bài</th>
							<th>Tiến độ</th>
							<th>Nộp bài</th>
							<th>Điểm số</th>
							<th>Cảnh cáo</th>
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
								<td>{row.dateOfBirth}</td>
								<td></td>
								<td>{row.dateOfBirth}</td>
								<td><Link>Dừng thi</Link></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
    </div>
  );
};

export default MonitoringPage;
