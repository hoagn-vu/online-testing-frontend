import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaFileAlt, FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomeCandidate.css";
import { useSelector } from "react-redux";
import ApiService from "../../services/apiService";
import { useNavigate } from "react-router-dom";

const HomeCandidate = () => {
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await ApiService.get("/organize-exams/candidate-get-list", {
          params: { candidateId: user.id },
        });
        setExams(response.data);
      } catch (error) {
        console.error("Failed to fetch exam list: ", error);
      }
    };

    fetchExam();
  }, [user.id]);

  const [selectedExam, setSelectedExam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Xử lý khi nhấn vào bài thi
  const handleExamClick = (organizeExamId, sessionId, roomId, takeExamId) => {
    // setSelectedExam(exam);
    // setShowModal(true);
    navigate("/candidate/take-exam/" + organizeExamId + "/" + sessionId + "/" + roomId + "/" + takeExamId);
  };
  
  // Hàm xử lý khi nhấp vào bài thi: chỉ hiển thị modal
  const handleShowModal = (exam) => {
    setSelectedExam(exam); // Lưu toàn bộ đối tượng exam
    setShowModal(true);
  };
  
  return (
    <div className="home-candi-page">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 d-flex info-exam-content">
          {/* Cột 1: Thông tin thí sinh */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center w-full info-content">
            {/* Avatar */}
            <h2>Thông tin thí sinh</h2>
            <div className=" icon icon-user">
              <FaUserCircle style={{ fontSize: "130px", color: "#206ee3" }} />
            </div>
            {/* Thông tin thí sinh */}
            <p className="mt-4 font-semibold">
              <span className="fw-bold">Họ tên: </span>
              <span>{user.fullName}</span>
            </p>
            <p className="text-gray-500">
              <span className="fw-bold">Mã sinh viên: </span>
              <span>{user.userCode}</span>
            </p>
          </div>

          {/* Cột 2: Danh sách bài thi */}
          <div className="bg-white shadow-md rounded-lg p-6 w-full exam-content">
            <h2 className="text-xl font-semibold">Bài thi</h2>
            <ul className="space-y-2 detail-list-exam">
              {exams.map((exam, index) => (
                <ol
                  key={exam.id}
                  className="flex items-center space-x-2 text-blue-600 cursor-pointer p-0 pt-3"
                >
                  <div
                    className="cursor-pointer baithi cursor-pointer d-flex align-items-center"
                    onClick={() => handleShowModal(exam)}
                  >
                    <FaFileAlt className="text-blue-400 icon me-2" />
                    <span>{exam.organizeExamName}</span>
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
            <h5 className="fw-bold pb-2">Xác nhận làm bài thi</h5>
            <p>
              Bạn chuẩn bị thực hiện bài thi: <strong>{selectedExam?.organizeExamName}</strong>
            </p>
            <p>Trình duyệt sẽ vào chế độ toàn màn hình</p>
            <p className="text-danger">
              Không được thoát ra ngoài khi đang thực hiện bài thi
            </p>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button
              variant="primary"
              onClick={() => {
                setShowModal(false);
                if (selectedExam) {
                  // Gọi handleExamClick với các tham số cần thiết
                  handleExamClick(
                    selectedExam.id,
                    selectedExam.sessionId,
                    selectedExam.roomId,
                    selectedExam.userTakeExamId
                  );
                }
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

export default HomeCandidate;
