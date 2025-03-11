import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ListQuestionPage.css";
import Swal from "sweetalert2";
import SearchBox from "../../components/SearchBox/SearchBox";

const ListQuestionPage = () => {
    const { subjectId } = useParams();
    const [subjectName, setSubjectName] = useState("Sample Subject");
    const [editQuestionId, setEditQuestionId] = useState(null);
    const [shuffleQuestion, setShuffleQuestion] = useState(false);

    const [questions, setQuestions] = useState([
        {
        id: 1,
        questionText: "What is the capital of France?",
        options: [
            { optionText: "Berlin", isCorrectOption: false },
            { optionText: "Madrid", isCorrectOption: false },
            { optionText: "Paris", isCorrectOption: true },
            { optionText: "Rome", isCorrectOption: false },
        ],
        },
        {
        id: 2,
        questionText: "Which planet is known as the Red Planet?",
        options: [
            { optionText: "Earth", isCorrectOption: false },
            { optionText: "Mars", isCorrectOption: true },
            { optionText: "Jupiter", isCorrectOption: false },
            { optionText: "Saturn", isCorrectOption: false },
        ],
        },
    ]);

    const [newQuestion, setNewQuestion] = useState({
        questionText: "",
        options: [{ optionText: "", isCorrectOption: false }, { optionText: "", isCorrectOption: false }],
    });

    const handleAddOption = () => {
        setNewQuestion({ ...newQuestion, options: [...newQuestion.options, { optionText: "", isCorrectOption: false }] });
    };

    const handleRemoveOption = (index) => {
        const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
        setNewQuestion({ ...newQuestion, options: updatedOptions });
    };

    const handleSaveQuestion = () => {
        if (newQuestion.questionText.trim() === "" || newQuestion.options.some(opt => opt.optionText.trim() === "")) {
        Swal.fire("Lỗi", "Vui lòng nhập đầy đủ câu hỏi và đáp án!", "error");
        return;
        }

        if (editQuestionId !== null) {
        // Cập nhật câu hỏi
        setQuestions(
            questions.map(q => (q.id === editQuestionId ? { ...newQuestion, id: editQuestionId } : q))
        );
        setEditQuestionId(null);
        } else {
        // Thêm câu hỏi mới
        const newId = questions.length + 1;
        setQuestions([...questions, { ...newQuestion, id: newId }]);
        }

        setNewQuestion({ questionText: "", options: [{ optionText: "", isCorrectOption: false }, { optionText: "", isCorrectOption: false }] });

        // Đóng modal
        document.getElementById("closeModalBtn").click();
    };

    const handleEditQuestion = (question) => {
        setEditQuestionId(question.id);
        setNewQuestion({ questionText: question.questionText, options: question.options });

        // Mở modal
        new window.bootstrap.Modal(document.getElementById("questionModal")).show();
    };

    const handleUploadClick = async () => {
        const { value: file } = await Swal.fire({
            title: "Chọn file",
            input: "file",
            inputAttributes: {
            accept: "image/*",
            "aria-label": "Tải ảnh lên",
            },
        });
    
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
            Swal.fire({
                title: "Tải lên thành công",
                icon: "success",
            });
            };
            reader.readAsDataURL(file);
        }
        };

    return (
        <div className="container list-question-container me-0">
            <h5 className="text-center mb-3">Questions for Subject: {subjectName}</h5>
            <div className="d-flex">
                <div className="search-container">
                    <SearchBox></SearchBox>
                </div>
                <div className="d-flex justify-content-end ms-auto">
                    <button
                    className="btn btn-success mb-3"
                    data-bs-toggle="modal"
                    data-bs-target="#questionModal"
                    onClick={() => {
                        setEditQuestionId(null); 
                        setNewQuestion({ questionText: "", options: [{ optionText: "", isCorrectOption: false }, { optionText: "", isCorrectOption: false }] });
                    }}
                    >
                    Thêm câu hỏi mới
                    </button>
                    <button className="upload-btn ms-2" onClick={handleUploadClick}>
                        Upload File
                    </button>
                </div>
            </div>

            {questions.map((question) => (
                <div key={question.id} className="card mb-2">
                    <div className="card-header d-flex justify-content-between">
                        <h6>{question.questionText}</h6>
                        <div className="d-flex" style={{ marginLeft: "50px" }}>
                        <button className="btn btn-primary me-2" onClick={() => handleEditQuestion(question)}>Edit</button>
                        <button className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                    <ul className="list-group">
                        {question.options.map((option, index) => (
                        <li key={index} className={option.isCorrectOption ? "list-group-item list-group-item-success" : "list-group-item"}>
                            {option.optionText}
                        </li>
                        ))}
                    </ul>
                </div>
            ))}

            {/* Modal Bootstrap thuần */}
            <div className="modal fade" id="questionModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title">{editQuestionId ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <textarea
                            type="text"
                            className="form-control mb-3 "
                            placeholder="Nhập câu hỏi"
                            value={newQuestion.questionText}
                            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                        />
                        {newQuestion.options.map((option, index) => (
                            <div key={index} className="input-group mb-2">
                            <div className="input-group-text">
                                <input
                                type="checkbox"
                                checked={option.isCorrectOption}
                                onChange={() => {
                                    const newOptions = [...newQuestion.options];
                                    newOptions[index].isCorrectOption = !newOptions[index].isCorrectOption;
                                    setNewQuestion({ ...newQuestion, options: newOptions });
                                }}
                                />
                            </div>
                            <input
                                type="text"
                                className="form-control m-0"
                                placeholder="Nhập đáp án"
                                value={option.optionText}
                                onChange={(e) => {
                                const newOptions = [...newQuestion.options];
                                newOptions[index].optionText = e.target.value;
                                setNewQuestion({ ...newQuestion, options: newOptions });
                                }}
                            />
                            <button className="btn btn-danger" onClick={() => handleRemoveOption(index)}>X</button>
                            </div>
                        ))}
                        <button className="btn btn-outline-secondary me-2 mt-2" onClick={handleAddOption}>
                            Thêm đáp án
                        </button>
                        <div className="form-check mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="shuffleQuestion"
                                checked={shuffleQuestion}
                                onChange={() => setShuffleQuestion(!shuffleQuestion)}
                            />
                            <label className="form-check-label" htmlFor="shuffleQuestion">
                                Đảo thứ tự đáp án
                            </label>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success" onClick={handleSaveQuestion}>
                                {editQuestionId ? "Cập nhật" : "Lưu"}
                            </button>
                            <button id="closeModalBtn" className="btn btn-secondary" data-bs-dismiss="modal">
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListQuestionPage;
