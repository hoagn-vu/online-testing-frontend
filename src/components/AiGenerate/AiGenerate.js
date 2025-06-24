import React, { useEffect, useState } from "react";
import { Modal, Spinner } from 'react-bootstrap';
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Add } from "@mui/icons-material";
import "./AiGenerate.css";
import Nodata from "../../assets/images/no-data1.png"
import PropTypes from 'prop-types';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const AiGenerate = ({ onClose  }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]); 
  const [editingIndex, setEditingIndex] = useState(null);

  const handleGenerateQuestions = () => {
    setIsLoading(true);

    // Giả lập gọi API tạo câu hỏi
    setTimeout(() => {
      // Sau khi "gọi" xong, cập nhật danh sách câu hỏi
      const mockQuestions = [
        {
          question: "1 + 1 = ?",
          correctAnswer: "2",
          allAnswers: ["1", "2", "3", "4"]
        },
        {
          question: "Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy ?",
          correctAnswer: "Thứ tư",
          allAnswers: ["Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba ba ba ba ba ba ba ba ba ba ba ba ba baaaaaaaaaaa baa ba ba ba ba ba ab ab ab abab b a", "Thứ tư", "Chủ nhật", "Thứ bảy"]
        },
        {
          question: "Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy ?",
          correctAnswer: "Thứ bảy",
          allAnswers: ["Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba ba ba ba ba ba ba ba ba ba ba ba ba baaaaaaaaaaa baa ba ba ba ba ba ab ab ab abab b a", "Thứ tư", "Chủ nhật", "Thứ bảy"]
        },
        {
          question: "Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy ?",
          correctAnswer: "Thứ hai",
          allAnswers: ["Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba ba ba ba ba ba ba ba ba ba ba ba ba baaaaaaaaaaa baa ba ba ba ba ba ab ab ab abab b a", "Thứ tư", "Chủ nhật", "Thứ bảy"]
        },
        {
          question: "Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy ?",
          correctAnswer: "Thứ hai",
          allAnswers: ["Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba ba ba ba ba ba ba ba ba ba ba ba ba baaaaaaaaaaa baa ba ba ba ba ba ab ab ab abab b a", "Thứ tư", "Chủ nhật", "Thứ bảy"]
        },
        {
          question: "Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy ?",
          correctAnswer: "Thứ hai",
          allAnswers: ["Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba ba ba ba ba ba ba ba ba ba ba ba ba baaaaaaaaaaa baa ba ba ba ba ba ab ab ab abab b a", "Thứ tư", "Chủ nhật", "Thứ bảy"]
        },
        {
          question: "Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy ?",
          correctAnswer: "Thứ hai",
          allAnswers: ["Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba ba ba ba ba ba ba ba ba ba ba ba ba baaaaaaaaaaa baa ba ba ba ba ba ab ab ab abab b a", "Thứ tư", "Chủ nhật", "Thứ bảy"]
        },
        {
          question: "Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy ?",
          correctAnswer: "Thứ hai",
          allAnswers: ["Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba ba ba ba ba ba ba ba ba ba ba ba ba baaaaaaaaaaa baa ba ba ba ba ba ab ab ab abab b a", "Thứ tư", "Chủ nhật", "Thứ bảy"]
        },
        {
          question: "Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy ?",
          correctAnswer: "Thứ hai",
          allAnswers: ["Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba ba ba ba ba ba ba ba ba ba ba ba ba baaaaaaaaaaa baa ba ba ba ba ba ab ab ab abab b a", "Thứ tư", "Chủ nhật", "Thứ bảy"]
        },
        {
          question: "Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy Hôm nay là thứ mấy ?",
          correctAnswer: "Thứ hai",
          allAnswers: ["Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba Thứ ba ba ba ba ba ba ba ba ba ba ba ba ba baaaaaaaaaaa baa ba ba ba ba ba ab ab ab abab b a", "Thứ tư", "Chủ nhật", "Thứ bảy"]
        }
      ];
      setGeneratedQuestions(mockQuestions); 
      setIsLoading(false);
    }, 2000);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = () => {
    setEditingIndex(null);
  };

  const handleQuestionChange = (index, newQuestion) => {
    const updated = [...generatedQuestions];
    updated[index].question = newQuestion;
    setGeneratedQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, newCorrect) => {
    const updated = [...generatedQuestions];
    updated[qIndex].correctAnswer = newCorrect;
    setGeneratedQuestions(updated);
  };

  const handleAnswerChange = (qIndex, ansIndex, newAnswer) => {
    const updated = [...generatedQuestions];
    updated[qIndex].allAnswers[ansIndex] = newAnswer;
    setGeneratedQuestions(updated);
  };

  return (
    <div className="">
      <h5 className="mb-3 fw-bold" style={{color: '#1976d2', fontSize: "20px"}}>Tạo câu hỏi bằng AI</h5>
      
      <div className="row g-3 mb-1">
        <div className="col-md-6">
          <label className="form-label">Tải tài liệu đầu vào:</label>
          <input type="file" className="form-control " />
        </div>
        
        <div className="col-md-3">
          <label className="form-label">Số lượng câu hỏi:</label>
          <input type="number" className="form-control" placeholder="Ví dụ: 10" />
        </div>

        <div className="col-md-3 d-flex align-items-end">
          <AddButton className="me-2" onClick={handleGenerateQuestions}>
            <i className="fas fa-brain me-2"></i>Tạo câu hỏi
          </AddButton>
          <CancelButton onClick={onClose}>Hủy</CancelButton>
        </div>
      </div>
      
      <Modal
        show={isLoading}
        centered
        backdrop="static"
        keyboard={false}
        contentClassName="custom-loading-modal"
      >
        <Modal.Body>
          <div className="custom-loading-wrapper">
            <DotLottieReact
              className="custom-lottie"
              src="https://lottie.host/72773813-c3cd-45a9-bb4e-b1ad05a83ba4/ico6ouAZjB.lottie"
              loop
              autoplay
            />
            <div className="custom-loading-text">
              <i className="fas fa-brain me-2 text-primary"></i>
              Đang tạo câu hỏi bằng AI...
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {generatedQuestions.length === 0 && !isLoading && (
        <div className="text-center text-muted">
          <img src={Nodata} alt="No questions" style={{ maxWidth: "500px" }} />
          <p className="m-0">Chưa có câu hỏi nào được tạo. Hãy tải tài liệu và nhấn <strong>Tạo câu hỏi</strong></p>
        </div>
      )}

      {generatedQuestions.map((q, index) => (
        <div key={index} className="card mb-3 mt-3">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div style={{ flex: 1 }}>
              {editingIndex === index ? (
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="form-control"
                />
              ) : (
                <strong>{q.question}</strong>
              )}
              <div className="text-muted">Dễ</div>
            </div>
            <div className="text-end" style={{ minWidth: "150px" }}>
              {editingIndex === index ? (
                <button className="btn btn-success btn-sm me-2" onClick={handleSave}>
                  Lưu
                </button>
              ) : (
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(index)}>
                  Chỉnh sửa
                </button>
              )}
              <button className="btn btn-danger btn-sm">Xoá</button>
            </div>
          </div>

          <div className="list-group list-group-flush">
            {q.allAnswers.map((ans, i) => (
              <div
                key={i}
                className={`list-group-item d-flex align-items-center ${
                  ans === q.correctAnswer && editingIndex !== index ? "list-group-item-success" : ""
                }`}
              >
                {editingIndex === index ? (
                  <>
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={ans === q.correctAnswer}
                    onChange={() => handleCorrectAnswerChange(index, ans)}
                    className="form-check-input me-2"
                  />
                  <input
                    type="text"
                    value={ans}
                    onChange={(e) => handleAnswerChange(index, i, e.target.value)}
                    className="form-control"
                  />
                  </>
                ) : (
                  <>{ans}</>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Chỉ hiển thị khi đã có ít nhất 1 câu hỏi */}
      {generatedQuestions.length > 0 && (
        <div className="d-flex justify-content-end mt-3">
          <AddButton className="ms-2">
            Lưu tất cả vào ngân hàng câu hỏi
          </AddButton>
        </div>
      )}
    </div>
  );
};

AiGenerate.propTypes = {
    onClose: PropTypes.func.isRequired,

};

export default AiGenerate;