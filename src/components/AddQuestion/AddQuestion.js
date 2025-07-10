import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams  } from "react-router-dom";
import { Modal, Spinner } from 'react-bootstrap';
import AddButton from "../../components/AddButton/AddButton";
import CancelButton from "../../components/CancelButton/CancelButton";
import { Add } from "@mui/icons-material";
import "./AddQuestion.css";
import Nodata from "../../assets/images/no-data1.png"
import PropTypes from 'prop-types';
import QuillEditor from "../QuillEditor/QuillEditor";
import { CircularProgress, Typography, Box } from "@mui/material";
import CreatableSelect from "react-select/creatable";

const AddQuestion = ({ onClose  }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]); 
  const [editingIndex, setEditingIndex] = useState(null);
  
  const { subjectId, questionBankId } = useParams();
  const [ subjectName, setSubjectName ] = useState("");
  const [ questionBankName, setQuestionBankName ] = useState("");	

  const handleQuestionTextChange = (index, newContent) => {
    const updated = [...addedQuestions];
    updated[index].questionText = newContent;
    setAddedQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, newText) => {
    const updated = [...addedQuestions];
    updated[qIndex].options[optIndex].optionText = newText;
    setAddedQuestions(updated);
  };

  const handleToggleCorrect = (qIndex, optIndex) => {
    const updated = [...addedQuestions];
    updated[qIndex].options[optIndex].isCorrect = !updated[qIndex].options[optIndex].isCorrect;
    setAddedQuestions(updated);
  };

  const handleAddOptionToQuestion = (qIndex) => {
    const updated = [...addedQuestions];
    updated[qIndex].options.push({ optionText: "", isCorrect: false });
    setAddedQuestions(updated);
  };

  const handleRemoveOptionFromQuestion = (qIndex, optIndex) => {
    const updated = [...addedQuestions];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex);
    setAddedQuestions(updated);
  };
  
  const handleRemoveQuestion = (idToRemove) => {
    setAddedQuestions(prev => prev.filter(q => q.id !== idToRemove));
  };

  const [newQuestion, setNewQuestion] = useState({
    questionType: "single-choice",
    questionStatus: "available",
    questionText: "",
    options: [{ optionText: "", isCorrect: false }, { optionText: "", isCorrect: false }],
    isRandomOrder: false,
    tags: ["", ""],
  });

  const handleAddOption = () => {
		setNewQuestion({ ...newQuestion, options: [...newQuestion.options, { optionText: "", isCorrect: false }] });
	};

  const [addedQuestions, setAddedQuestions] = useState([
    {
      id: Date.now(), 
      questionType: "single-choice",
      questionStatus: "available",
      questionText: "",
      options: [
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false }
      ],
      isRandomOrder: false,
      tags: ["", ""],
    }
  ]);

  const handleAddQuestion = () => {
    const newQ = {
      id: Date.now(), 
      questionType: "single-choice",
      questionStatus: "available",
      questionText: "",
      options: [
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false }
      ],
      isRandomOrder: false,
      tags: ["", ""],
    };
    setAddedQuestions(prev => [...prev, newQ]);
  };
  const [allChapters, setAllChapters] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  return (
    <div className="">
      {/* <h5 className="mb-3 fw-bold" style={{color: '#1976d2', fontSize: "20px"}}>Thêm câu hỏi</h5> */}
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
              container: (provided) => ({ ...provided, flex: 1 })
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
              container: (provided) => ({ ...provided, flex: 1 })
            }}
          />
        </div>
      </div>
      
      {addedQuestions.map((q, qIndex) => (
        <div key={q.id} className="tbl-shadow p-4 mt-3">
          <div className="sample-card-header justify-content-between align-items-center mb-2">
            <div className="d-flex justify-content-between mb-2">
              <h5>Câu {qIndex + 1}</h5>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close" 
                onClick={() => handleRemoveQuestion(q.id)}
              ></button>
            </div>

            <QuillEditor value={q.questionText} onChange={(val) => handleQuestionTextChange(qIndex, val)} />

            <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
              <div className="form-check m-0">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label">Đảo thứ tự đáp án</label>
              </div>
              <div className="form-check form-switch m-0">
                <input className="form-check-input" type="checkbox" />
                <label className="form-check-label">Multiple Choice</label>
              </div>
            </div>

            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="input-group mb-2">
                <div className={`input-group-text`}>
                  <input
                    className="form-check-input m-0"
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={() => handleToggleCorrect(qIndex, optIndex)}
                  />
                </div>
                <textarea
                  className={`form-control m-0 ${opt.isCorrect ? 'correct-option' : ''}`}
                  placeholder="Nhập đáp án"
                  value={opt.optionText}
                  rows={1}
                  onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                  style={{ resize: "none", overflow: "hidden", minHeight: "40px" }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />
                <button
                  className="btn btn-danger d-flex align-items-center justify-content-center"
                  onClick={() => handleRemoveOptionFromQuestion(qIndex, optIndex)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}

            <button
              className="btn btn-outline-secondary mt-2"
              style={{ fontSize: "14px" }}
              onClick={() => handleAddOptionToQuestion(qIndex)}
            >
              <i className="fa-solid fa-plus me-2"></i>Thêm đáp án
            </button>
          </div>
        </div>
      ))}

      <button className="btn w-100 fw-bold" style={{backgroundColor: "#e9f1ff", color: "#206bda"}} onClick={handleAddQuestion}>
        <i className="fas fa-plus me-2"></i>Thêm câu hỏi
      </button>
      <Box className="mt-3" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <CancelButton onClick={onClose} type="button">
          Hủy
        </CancelButton>
        <AddButton >
          <i className="fas fa-plus me-2"></i> Lưu câu hỏi
        </AddButton>
      </Box>
    </div>
  );
};

AddQuestion.propTypes = {
    onClose: PropTypes.func.isRequired,

};

export default AddQuestion;