import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaFileAlt, FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SupervisorHomePage.css";
import { useSelector, useDispatch } from "react-redux";
import ApiService from "../../services/apiService";
import { useNavigate } from "react-router-dom";

const SupervisorHomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await ApiService.get(`/trackexam/all-track-exams?userId=${user.id}`);
        setExams(response.data.trackExams);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      }
    };

    fetchExams();
  }, [user.id]);

  const [selectedExam, setSelectedExam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleExamClick = (exam) => {
    // setSelectedExam(exam);
    // setShowModal(true);
    navigate(`/supervisor/monitor/${exam.organizeExamId}/${exam.sessionId}/${exam.roomId}`);
  };

  return (
    <div className="home-candi-page">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 d-flex info-exam-content">
          {/* Cột 1: Thông tin thí sinh */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center w-full info-content">
            {/* Avatar */}
            <h2>Thông tin giám thị</h2>
            <div className=" icon icon-user">
              <FaUserCircle style={{ fontSize: "130px", color: "#206ee3" }} />
            </div>
            {/* Thông tin thí sinh */}
            <p className="mt-4 font-semibold">
              <span className="fw-bold">Họ tên: </span>
              <span>{user?.fullName}</span>
            </p>
            <p className="text-gray-500">
              <span className="fw-bold">Mã giám thị: </span>
              <span>{user?.userCode}</span>
            </p>
          </div>

          {/* Cột 2: Danh sách bài thi */}
          <div className="bg-white shadow-md rounded-lg p-6 w-full exam-content">
            <h2 className="text-xl font-semibold">Phòng thi</h2>
            <ul className="space-y-2 detail-list-exam">
              {exams.map((exam, index) => (
                <ol
                  key={index}
                  className="flex items-center space-x-2 text-blue-600 cursor-pointer p-0 pt-3"
                >
                  <div
                    className="cursor-pointer baithi cursor-pointer"
                    onClick={() => handleExamClick(exam)}
                  >
                    <i className="fa-solid fa-door-open me-2" style={{color: "#206ee3"}}></i>
                    <span>{exam.organizeExamName} - {exam.sessionName} - {exam.roomName}</span>
                  </div>
                </ol>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Xác nhận */}
      <div className="form-announce">
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header className="bg-light">
            <Modal.Title className="text-center w-100">Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <h5 className="fw-bold pb-2">Xác nhận giám sát phòng thi</h5>
            <p>
              Bạn chuẩn bị giám sát phòng thi: <strong>{selectedExam}</strong>
            </p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button
              variant="primary"
              onClick={() => {
                setShowModal(false);
                console.log(`Bắt đầu bài thi: ${selectedExam}`);
                // Điều hướng sang trang làm bài
              }}
            >
              Bắt đầu
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Quay lại
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SupervisorHomePage;
