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
import image from "../../../src/assets/images/img-def.png"
import DragDropModal from "../../components/DragDrop/DragDrop";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";

const AddQuestion = ({ onClose, onSuccess  }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]); 
  const [editingIndex, setEditingIndex] = useState(null);
  
  const { subjectId, questionBankId } = useParams();
  const [ subjectName, setSubjectName ] = useState("");
  const [ questionBankName, setQuestionBankName ] = useState("");	
  //const [openAddImageModal, setOpenAddImageModal] = useState(false);
  const [imageList, setImageList] = useState([]); // mảng ảnh cho từng câu hỏi
  const [openAddImageModal, setOpenAddImageModal] = useState(false);
  const [selectedQIndex, setSelectedQIndex] = useState(null); // câu hỏi đang sửa ảnh
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const navigate = useNavigate();
  const [allChapters, setAllChapters] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  useEffect(() => {
    const fetchTagsClassification = async () => {
      try {
        const response = await ApiService.get(
          `/subjects/questions/tags-classification?subjectId=${subjectId}&questionBankId=${questionBankId}&type=both`
        );

        const data = response.data;

        // Lấy các chapter khác rỗng và loại bỏ trùng lặp
        const chapters = Array.from(new Set(data.map(item => item.chapter).filter(ch => ch && ch.trim() !== "")))
          .map(ch => ({ value: ch, label: ch }));

        // Lấy các level khác rỗng và loại bỏ trùng lặp
        const levels = Array.from(new Set(data.map(item => item.level).filter(lv => lv && lv.trim() !== "")))
          .map(lv => ({ value: lv, label: lv }));

        setAllChapters(chapters);
        //setAllLevels(levels);
      } catch (error) {
        console.error("Lỗi khi lấy chapter/level:", error);
      }
    };

    fetchTagsClassification();
  }, [subjectId, questionBankId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/level", {
        params: { keyword, page, pageSize },
      });
      setAllLevels(response.data.levels.map((item) => ({ value: item.levelName, label: item.levelName })));
    } catch (error) {
      console.error("Failed to fetch data: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  },[])

  const handleSaveQuestions = async () => {
    try {
      const formData = new FormData();

      addedQuestions.forEach((q, qIndex) => {
        formData.append(`questions[${qIndex}].questionText`, stripHtml(q.questionText));
        formData.append(`questions[${qIndex}].questionType`, q.questionType);
        formData.append(`questions[${qIndex}].questionStatus`, q.questionStatus);
        formData.append(`questions[${qIndex}].isRandomOrder`, q.isRandomOrder);

        q.tags.forEach((tag, tIndex) => {
          formData.append(`questions[${qIndex}].tags[${tIndex}]`, tag);
        });

        q.options.forEach((opt, oIndex) => {
          formData.append(`questions[${qIndex}].options[${oIndex}].optionText`, opt.optionText);
          formData.append(`questions[${qIndex}].options[${oIndex}].isCorrect`, opt.isCorrect);
        });

        // ✅ Nếu có ảnh thì append file
        if (imageList[qIndex]?.file) {
          formData.append(`questions[${qIndex}].images`, imageList[qIndex].file);
        }
      });

      const response = await ApiService.post(
        `/subjects/${subjectId}/question-banks/${questionBankId}/questions-with-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Thêm câu hỏi thành công:", response.data);
      await Swal.fire({
        text: "Thêm câu hỏi thành công!",
        icon: "success",
      });
      if (onSuccess) await onSuccess();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi thêm câu hỏi:", error);
      alert("Có lỗi xảy ra khi thêm câu hỏi ❌");
    }
    // try {
    //   const payload = addedQuestions.map(q => ({
    //     questionType: q.questionType,
    //     questionText: stripHtml(q.questionText),
    //     questionStatus: q.questionStatus,
    //     options: q.options.map(opt => ({
    //       optionText: opt.optionText,
    //       isCorrect: opt.isCorrect
    //     })),
    //     isRandomOrder: q.isRandomOrder,
    //     tags: newQuestion.tags.filter(t => t && t.trim() !== ""),
    //     imgLinks: imageList[q.id] ? [imageList[q.id]] : [] // nếu bạn lưu link ảnh
    //   }));

    //   console.log("Payload gửi đi:", payload);

    //   const response = await ApiService.post(
    //    `/subjects/questions?subjectId=${subjectId}&questionBankId=${questionBankId}`,
    //    payload
    //   );
    //   console.log("Thêm câu hỏi thành công:", response.data);
    //   await Swal.fire({
    //     text: "Thêm câu hỏi thành công!",
    //     icon: "success",
    //   });
    //   if (onSuccess) {
    //     await onSuccess(); // nếu fetchData là async
    //   }
    //   onClose();
    //   window.location.reload(); 
    // } catch (error) {
    //   console.error("Lỗi khi thêm câu hỏi:", error);
    //   alert("Có lỗi xảy ra khi thêm câu hỏi ❌");
    // }
  };

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
    const currentOptions = updated[qIndex].options;

    // Chỉ cho phép tick nhiều checkbox nếu isMultipleChoice là true
    if (isMultipleChoice || !currentOptions[optIndex].isCorrect) {
      currentOptions[optIndex].isCorrect = !currentOptions[optIndex].isCorrect;
    } else {
      // Chế độ Single Choice: Chỉ cho phép một checkbox được tick, nhưng cho phép uncheck
      const currentCorrectCount = currentOptions.filter((opt) => opt.isCorrect).length;
      if (currentCorrectCount === 1 && currentOptions[optIndex].isCorrect) {
        // Nếu chỉ còn một đáp án đúng và đang uncheck, cho phép uncheck
        currentOptions[optIndex].isCorrect = false;
      } else {
        // Uncheck tất cả các đáp án khác và chỉ tick cái được chọn
        currentOptions.forEach((opt, i) => {
          opt.isCorrect = i === optIndex;
        });
      }
    }
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
    // imageLinks: [],
    images: []
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

  const handleAddImage = () => {
    setOpenAddImageModal(true);
  };

  const handleFilesDropped = (files) => {
    // if (files.length > 0 && selectedQIndex !== null) {
    //   const newImageUrl = URL.createObjectURL(files[0]);

    //   setImageList(prev => {
    //     const updated = [...prev];
    //     updated[selectedQIndex] = newImageUrl;
    //     return updated;
    //   });

    //   setOpenAddImageModal(false); // đóng modal
    //   setSelectedQIndex(null);     // reset
    // }
    if (files.length > 0 && selectedQIndex !== null) {
      const file = files[0]; // chỉ 1 ảnh (hoặc bạn cho multiple)
      setImageList((prev) => {
        const updated = [...prev];
        updated[selectedQIndex] = {
          file,                                   // file gốc để gửi API
          preview: URL.createObjectURL(file)      // link để hiển thị
        };
        return updated;
      });

      setOpenAddImageModal(false);
      setSelectedQIndex(null);
    }
  };

  const handleRemoveImage = (qIndex) => {
    setImageList(prev => {
      const updated = [...prev];
      updated[qIndex] = null; // hoặc undefined
      return updated;
    });
  };

  const handleTagChange = (index, newValue) => {
    setNewQuestion((prev) => {
      const updatedTags = [...prev.tags]; // clone
      updatedTags[index] = newValue ? newValue.value : "";
      console.log("Tags mới:", updatedTags);
      return { ...prev, tags: updatedTags }; // tạo object mới
    });
  };


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
            onCreateOption={(inputValue) => handleTagChange(0, { value: inputValue, label: inputValue })}
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

            <div className="row">
              <div className="col-8">
                <QuillEditor value={q.questionText} onChange={(val) => handleQuestionTextChange(qIndex, val)} />
              </div>
              <div className="col-4">
                <div style={{ width: "100%", height: "100%", position: "relative", paddingTop: "56.25%" }}>
                  <img
                    src={imageList[qIndex]?.preview || image}
                    alt="Ảnh câu hỏi"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                  {/* Nút thay ảnh + xoá ảnh */}
                  <div style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    display: "flex",
                    gap: "8px"
                  }}>
                    <button
                      //onClick={() => handleAddImage(qIndex)}
                      className="btn btn-light shadow-sm border"
                      style={{}}
                      title="Thay ảnh"
                      onClick={() => {
                        setSelectedQIndex(qIndex); // ✅ lưu chỉ số câu hỏi
                        setOpenAddImageModal(true); // ✅ mở modal
                      }}
                    >
                      <i className="fas fa-upload"></i>
                    </button>

                    <button
                      onClick={() => handleRemoveImage(qIndex)}
                      className="btn btn-light shadow-sm border"
                      style={{}}
                      title="Xoá ảnh"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>  
              </div>
            </div>

            <DragDropModal
              open={openAddImageModal}
              onClose={() => {
                setOpenAddImageModal(false);
                setSelectedQIndex(null);
              }}
              onFilesDropped={handleFilesDropped}
              title="Kéo Thả Ảnh Vào Đây"
            />

            <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
              <div className="form-check form-switch m-0">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  checked={q.isRandomOrder}
                  onChange={(e) => {
                    const updated = [...addedQuestions];
                    updated[qIndex].isRandomOrder = e.target.checked;
                    setAddedQuestions(updated);
                  }}
                />
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
                    disabled={!isMultipleChoice && addedQuestions[qIndex].options.filter(o => o.isCorrect).length > 0 && !opt.isCorrect}
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
        <AddButton onClick={handleSaveQuestions}>
          <i className="fas fa-plus me-2"></i> Lưu câu hỏi
        </AddButton>
      </Box>
    </div>
  );
};

AddQuestion.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default AddQuestion;
