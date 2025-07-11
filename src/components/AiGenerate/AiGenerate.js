import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams  } from "react-router-dom";
import { Modal, Spinner } from 'react-bootstrap';
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Add } from "@mui/icons-material";
import "./AiGenerate.css";
import Nodata from "../../assets/images/no-data1.png"
import PropTypes from 'prop-types';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import CreatableSelect from 'react-select/creatable';
import Swal from "sweetalert2";

const AiGenerate = ({ onClose  }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]); 
  const [editingIndex, setEditingIndex] = useState(null);
  
  const { subjectId, questionBankId } = useParams();
  const [ subjectName, setSubjectName ] = useState("");
  const [ questionBankName, setQuestionBankName ] = useState("");	
  const [showModal, setShowModal] = useState(false); // State để quản lý modal
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: [{ optionText: "", isCorrect: false }],
    tags: ["", ""], // [chuyên đề, mức độ]
    isRandomOrder: false,
  });
  const [editQuestionId, setEditQuestionId] = useState(null);

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
    const question = generatedQuestions[index];
    setEditQuestionId(index);
    setNewQuestion({
      questionText: question.question,
      options: question.allAnswers.map((ans) => ({
        optionText: ans,
        isCorrect: ans === question.correctAnswer,
      })),
      tags: ["Dễ", ""],
      isRandomOrder: false,
    });

    const modalElement = document.getElementById('questionModal');
    const bsModal = new window.bootstrap.Modal(modalElement);
    bsModal.show();
  };

  const handleDelete = (index) => {
    Swal.fire({
      title: "Bạn có chắc chắn xóa?",
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const newQuestions = [...generatedQuestions];
        newQuestions.splice(index, 1); // Xóa phần tử tại vị trí index
        setGeneratedQuestions(newQuestions);

        Swal.fire({
          title: "Đã xóa!",
          text: "Câu hỏi đã bị xóa.",
          icon: "success",
        });
      }
    });
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
  
  const [selectedQuestions, setSelectedQuestions] = useState([]); // State để theo dõi câu hỏi được chọn
  // Chọn/c bỏ chọn câu hỏi
  const handleSelectQuestion = (index) => {
    setSelectedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Chọn tất cả
  const handleSelectAll = () => {
    const allIndices = generatedQuestions.map((_, i) => i);
    setSelectedQuestions(allIndices);
  };
// Xử lý thay đổi chuyên đề hoặc mức độ
  const handleTagChange = (tagIndex, newValue) => {
    const updatedTags = [...newQuestion.tags];
    updatedTags[tagIndex] = newValue ? newValue.value : "";
    setNewQuestion({ ...newQuestion, tags: updatedTags });
  };

  // Thêm đáp án mới
  const handleAddOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, { optionText: "", isCorrect: false }],
    });
  };

  // Xóa đáp án
  const handleRemoveOption = (index) => {
    const newOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  // Lưu câu hỏi từ modal
  const handleSaveQuestion = () => {
    const updatedQuestions = [...generatedQuestions];
    const correctOption = newQuestion.options.find((opt) => opt.isCorrect);
    updatedQuestions[editQuestionId] = {
      question: newQuestion.questionText,
      correctAnswer: correctOption ? correctOption.optionText : "",
      allAnswers: newQuestion.options.map((opt) => opt.optionText),
    };
    setGeneratedQuestions(updatedQuestions);
    setShowModal(false); // Đóng modal
    setEditQuestionId(null);
    setNewQuestion({
      questionText: "",
      options: [{ optionText: "", isCorrect: false }],
      tags: ["", ""],
      isRandomOrder: false,
    });
  };
  // Dữ liệu mẫu cho CreatableSelect
  const allChapters = [{ value: "Chuyên đề 1", label: "Chuyên đề 1" }, { value: "Chuyên đề 2", label: "Chuyên đề 2" }];
  const allLevels = [
    { value: "Dễ", label: "Dễ" },
    { value: "Trung bình", label: "Trung bình" },
    { value: "Khó", label: "Khó" },
  ];
  return (
    <div className="">
      <h5 className="mb-3 fw-bold" style={{color: '#1976d2', fontSize: "20px"}}>Sinh câu hỏi bằng AI</h5>
      
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
      {generatedQuestions.length > 0 && (
        <div className="mb-3 mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={selectedQuestions.length === generatedQuestions.length}
            onChange={handleSelectAll}
            style={{ marginRight: '10px', }}
          />
          <span>Chọn tất cả</span>
        </div>
      )}

      <div className="d-flex flex-column w-100"> 
        {generatedQuestions.map((q, index) => (
          <div key={index} className="d-flex align-items-start mb-3"> {/* Căn xchỉnh theo đầu */}
            <div className="d-flex align-items-center"> {/* Khoảng cách giữa checkbox và card */}
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectedQuestions.includes(index)}
                onChange={() => handleSelectQuestion(index)}
                style={{ marginRight: '15px',  }}
              />
            </div>
            <div className="card flex-grow-1"> {/* Cho card mở rộng hết không gian còn lại */}
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
                <div className="d-flex" style={{ marginLeft: "50px" }}>
                  <button className="btn pe-1 ps-1" style={{ fontSize: "20px" }} onClick={() => handleEdit(index)}>
                    <i className="fa-solid fa-pen-to-square" style={{color: "#A6A6A6"}}></i>	
                  </button>
                  <button className="btn pe-1 ps-1" style={{ fontSize: "20px" }} onClick={() => handleDelete(index)} >
                    <i className="fa-solid fa-trash-can" style={{color: "#A6A6A6"}}></i>
                  </button>
                </div>
                {/* <div className="text-end" style={{ minWidth: "150px" }}>
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
                </div> */}
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
          </div>
        ))}
      </div>

      {/* Chỉ hiển thị khi đã có ít nhất 1 câu hỏi */}
      {generatedQuestions.length > 0 && (
        <div className="d-flex justify-content-end mt-3">
          <AddButton className="ms-2">
            Lưu vào ngân hàng câu hỏi
          </AddButton>
        </div>
      )}
      {/* Modal chỉnh sửa câu hỏi */}
      <div className="modal fade" id="questionModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content p-3">
            <div className="modal-header">
              <h5 className="modal-title">{editQuestionId !== null ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="d-flex" style={{ display: "flex", width: "100%", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <p className="mb-1">Chọn chuyên đề kiến thức:</p>
                  <CreatableSelect
                    isClearable
                    options={allChapters}
                    value={newQuestion.tags[0] ? { value: newQuestion.tags[0], label: newQuestion.tags[0] } : null}
                    onChange={(newValue) => handleTagChange(0, newValue)}
                    menuPortalTarget={document.body}
                    placeholder="Chọn chuyên đề kiến thức"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      container: (provided) => ({ ...provided, flex: 1 }),
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <p className="mb-1">Mức độ:</p>
                  <CreatableSelect
                    isClearable
                    options={allLevels}
                    value={newQuestion.tags[1] ? { value: newQuestion.tags[1], label: newQuestion.tags[1] } : null}
                    onChange={(newValue) => handleTagChange(1, newValue)}
                    menuPortalTarget={document.body}
                    placeholder="Chọn mức độ"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      container: (provided) => ({ ...provided, flex: 1 }),
                    }}
                  />
                </div>
              </div>
              <div>
                <p className="mb-1 mt-2">
                  <span style={{ color: "red" }}>*</span> Câu hỏi:
                </p>
                <textarea
                  type="text"
                  className="form-control mb-2"
                  placeholder="Nhập câu hỏi"
                  value={newQuestion.questionText}
                  onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                />
              </div>
              <div className="form-check mt-0 mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="shuffleQuestion"
                  checked={newQuestion.isRandomOrder}
                  onChange={(e) => setNewQuestion({ ...newQuestion, isRandomOrder: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="shuffleQuestion">
                  Đảo thứ tự đáp án
                </label>
              </div>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="input-group mb-2">
                  <div className="input-group-text">
                    <input
                      className="form-check-input m-0"
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={() => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index].isCorrect = !newOptions[index].isCorrect;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                    />
                  </div>
                  <textarea
                    className="form-control m-0"
                    placeholder="Nhập đáp án"
                    value={option.optionText}
                    rows={1}
                    onChange={(e) => {
                      const newOptions = [...newQuestion.options];
                      newOptions[index].optionText = e.target.value;
                      setNewQuestion({ ...newQuestion, options: newOptions });
                    }}
                    style={{ resize: "none", overflow: "hidden", minHeight: "40px" }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                  />
                  <button
                    className="btn btn-danger d-flex align-items-center justify-content-center"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
              <button
                className="btn btn-outline-secondary mt-1"
                style={{ fontSize: "14px" }}
                onClick={handleAddOption}
              >
                <i className="fa-solid fa-plus me-2"></i>
                Thêm đáp án
              </button>
            </div>
            <div className="modal-footer">
              <CancelButton style={{width: "100px"}} id="closeModalBtn"data-bs-dismiss="modal">Hủy</CancelButton>
              <AddButton style={{ width: "100px" }} onClick={handleSaveQuestion}>
                {editQuestionId !== null ? "Cập nhật" : "Lưu"}
              </AddButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

AiGenerate.propTypes = {
    onClose: PropTypes.func.isRequired,

};

export default AiGenerate;