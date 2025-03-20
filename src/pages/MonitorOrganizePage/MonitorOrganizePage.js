import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MonitorOrganizePage.css";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const MonitorOrganizePage = () => {
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
	const { id: organizeId, sessionId } = useParams();
	
  // Xử lý khi nhấn vào bài thi
  const handleExamClick = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

    const [rows, setRows] = useState((listCandidate));
    
  return (
    <div className="exam-management-page">
			<nav>
				<Link to="/admin">Home</Link> / 
				<span className="breadcrumb-current">Quản lý kỳ thi</span>
			</nav>
			
			<div className="mb-4">
					<h4 className="d-flex align-items-center justify-content-center">Giám sát kỳ thi: </h4> 
					<h5 className="d-flex align-items-center justify-content-center">Ca thi: </h5>
			</div>
			<div>
					<table className="table table-hover table-bordered custom-table-monitor">
						<thead className="table-dark">
							<tr>
								<th>#</th>
								<th>Phòng thi</th>
								<th>Trạng thái</th>
								<th>Bắt đầu</th>
								<th>Kết thúc</th>
								<th>Tiến độ</th>
								<th>Điểm</th>
							</tr>
						</thead>
						<tbody>
							{(rows).map((row, index) => (
								<tr key={row.candidateId}>
									<td>{index + 1}</td>
									<td>{row.userCode}</td>
									<td>{row.gender}</td>
									<td>{row.dateOfBirth}</td>
									<td></td>
									<td>{row.dateOfBirth}</td>
									<td><Link to={`/admin/organize/score/${organizeId}/${sessionId}`}>In bảng điểm</Link></td>
								</tr>
							))}
						</tbody>
					</table>
			</div>
    </div>
  );
};

export default MonitorOrganizePage;
