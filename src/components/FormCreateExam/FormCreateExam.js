import React, { useState, useEffect, useRef, use } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import "./FormCreateExam.css";
import PropTypes from 'prop-types';
import {TextField, Autocomplete, Grid, Box } from "@mui/material";
import ReactSelect  from 'react-select';
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";
import AddButton from "../AddButton/AddButton";
import CancelButton from "../CancelButton/CancelButton";

const FormCreateExam = ({ onClose, initialData  }) => {
  const [listDisplay, setListDisplay] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const inputRef = useRef(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [subjectChosen, setSubjectChosen] = useState(null);
  const [bankOptions, setBankOptions] = useState([]);
  const [bankChosen, setBankChosen] = useState(null);
  const [tagClassification, setTagClassification] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]); 
  const [levelOptions, setLevelOptions] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null); 
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [totalScore, setTotalScore] = useState(10);
  const [scores, setScores] = useState({});  
  const [examCode, setExamCode] = useState("");
  const [examName, setExamName] = useState("");
  const [searchParams] = useSearchParams();
  const { examId: editExamId } = useParams(); 
  const isEditMode = Boolean(editExamId) && searchParams.get("showFormCreateExam") === "true";
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { examId } = useParams();

  // Gỡ lỗi editExamId
  useEffect(() => {
    console.log("editExamId:", editExamId);
    console.log("showFormCreateExam:", searchParams.get("showFormCreateExam"));
    console.log("isEditMode:", isEditMode);
    console.log("URL hiện tại:", window.location.href);
  }, [editExamId, searchParams]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Khởi tạo dữ liệu từ initialData nếu có
    if (initialData) {
      setExamCode(initialData.examCode || "");
      setExamName(initialData.examName || "");
      setTotalScore(initialData.totalScore || 0);
      setScores(initialData.scores || {});
      setSelectedItems(initialData.questions.map((q) => q.questionId) || []);
      // Ánh xạ subjectName và questionBankName sang subjectId và questionBankId
      const fetchInitialSubjectId = async () => {
        const subjects = await ApiService.get("/subjects/options");
        const subject = subjects.data.find((s) => s.subjectName === initialData.subjectName);
        setSubjectChosen(subject?.id || null);
      };
      const fetchInitialBankId = async () => {
        if (subjectChosen) {
          const banks = await ApiService.get("/subjects/question-bank-options", {
            params: { subjectId: subjectChosen },
          });
          const bank = banks.data.find((b) => b.questionBankName === initialData.questionBankName);
          setBankChosen(bank?.questionBankId || null);
        }
      };
      fetchInitialSubjectId();
      fetchInitialBankId();
    }
  }, [initialData, subjectChosen]);

  useEffect(() => {
    const fetchSubjectOptions = async () => {
      try {
        const response = await ApiService.get("/subjects/options");
        setSubjectOptions(response.data.map((item) => ({ value: item.id, label: item.subjectName })));
      } catch (error) {
        console.error("Failed to fetch subject options: ", error);
      }
    };

    fetchSubjectOptions();
  }, []);

  useEffect(() => {
    const fetchBankOptions = async () => {
      try {
        const response = await ApiService.get("/subjects/question-bank-options", {
          params: { subjectId: subjectChosen },
        });
        setBankOptions(response.data.map((item) => ({ value: item.questionBankId, label: item.questionBankName })));
      } catch (error) {
        console.error("Failed to fetch bank options: ", error);
      }
    };

    if (subjectChosen) {
      fetchBankOptions();
    }
  }, [subjectChosen]);
  
  useEffect(() => {
    const fetchTagsClassification = async () => {
      try {
        const response = await ApiService.get("/subjects/questions/tags-classification", {
          params: { subjectId: subjectChosen, questionBankId: bankChosen },
        });
        setTagClassification(response.data.map((item) => ({ ...item, questionCount: 0 })));
        // Lấy danh sách chapter duy nhất
        const uniqueChapters = [...new Set(response.data.map((item) => item.chapter))];
        setChapterOptions(uniqueChapters.map((chapter) => ({ value: chapter, label: chapter })));   
        // Lấy danh sách level duy nhất
        const uniqueLevels = [...new Set(response.data.map((item) => item.level))];
        setLevelOptions(uniqueLevels.map((level) => ({ value: level, label: level })));
      } catch (error) {
        console.error("Failed to fetch tag classification: ", error);
      }
    };
    if (subjectChosen && bankChosen) {
      fetchTagsClassification();
    } else {
      setTagClassification([]);
      setChapterOptions([]);
      setLevelOptions([]);
    }
  }, [subjectChosen, bankChosen]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await ApiService.get("/subjects/questions", {
          params: { subId: subjectChosen, qbId: bankChosen },
        });
        setQuestions(response.data.questions || []);
      } catch (error) {
        console.error("Failed to fetch bank options: ", error);
      }
    };

    if (subjectChosen && bankChosen) {
      fetchQuestions();
    } else {
      setQuestions([]);
    }
  }, [subjectChosen, bankChosen]);

  useEffect(() => {
    if (subjectChosen && bankChosen) {
      const filteredQuestions = questions.filter((q) => {
        const chapterMatch = !selectedChapter || q.tags[0] === selectedChapter.value;
        const levelMatch = !selectedLevel || q.tags[1] === selectedLevel.value;
        return chapterMatch && levelMatch;
      });
      setListDisplay(filteredQuestions);
    }
  }, [subjectChosen, bankChosen, selectedChapter, selectedLevel, questions]);


  useEffect(() => {
    // ✅ CHỈ chia đều điểm khi đang tạo mới (không có initialData)
    if (!initialData) {
      if (selectedItems.length > 0 && totalScore > 0) {
        const defaultScore = totalScore / selectedItems.length;
        const newScores = {};
        selectedItems.forEach((questionId) => {
          newScores[questionId] = defaultScore;
        });
        setScores(newScores);
      } else {
        setScores({});
      }
    }
  }, [selectedItems, totalScore, initialData]);

  const updateExam = async (examId, data) => {
    setIsLoading(true);
    try {
      const response = await ApiService.put(`/exams/${examId}`, data);
      if (response.status >= 200 && response.status < 300) {
        return true; // thành công
      } else {
        throw new Error("Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Failed to update exam:", error);
      throw error; // ném lỗi ra ngoài để handleSubmit bắt được
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(listDisplay.map((item) => item.questionId));
    } else {
      setSelectedItems([]);
    }
  };
  
  const handleSelectItem = (e, questionId) => {
    if (!questionId) {
      console.error("questionId is undefined, check listDisplay data");
      return;
    }
    console.log("handleSelectItem called with questionId:", questionId);
    if (e.target.checked) {
      setSelectedItems([...selectedItems, questionId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== questionId));
    }
  };

  const handleRemoveItem = (questionId) => {
    setSelectedItems(selectedItems.filter((id) => id !== questionId));
  };

  const handleScoreChange = (questionId, value) => {
  const newScore = parseFloat(value) || 0;
  if (newScore < 0) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Điểm không được nhỏ hơn 0!",
    });
    return;
  }

  setScores((prevScores) => {
    const currentScores = { ...prevScores };
    const oldScore = currentScores[questionId] || 0;
    const scoreDifference = newScore - oldScore;

    if (scoreDifference !== 0) {
      const currentTotal = Object.values(currentScores).reduce((sum, score) => sum + score, 0);
      const newTotal = currentTotal - oldScore + newScore;

      if (newTotal > totalScore) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Tổng điểm vượt quá tổng điểm đã nhập!",
        });
        return prevScores;
      }

      return {
        ...currentScores,
        [questionId]: newScore,
      };
    }

    return prevScores;
  });
};

const handleSave = async () => {
  const currentTotal = selectedItems.reduce((sum, qid) => {
    return sum + (scores[qid] ?? (initialData.questions.find(q => q.questionId === qid)?.questionScore ?? 0));
  }, 0);

  if (currentTotal !== totalScore) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: `Tổng điểm (${currentTotal.toFixed(2)}) không khớp với tổng điểm đã nhập (${totalScore})!`,
    });
    return;
  }

  const payload = {
    examCode: examCode,
    examName: examName,
    subjectId: subjectChosen,
    questionBankId: bankChosen,
    questionSets: selectedItems.map((qid) => ({
      questionId: qid,
      questionScore: scores[qid] ?? (initialData.questions.find(q => q.questionId === qid)?.questionScore ?? 0),
    })),
    examStatus: "available",
  };

  try {
    if (isEditMode) {
      console.log("Updating exam with data:", payload);
      await updateExam(examId, payload);
      Swal.fire({
        icon: "success",
        text: "Cập nhật đề thi thành công",
        draggable: true
      });
      onClose();
    } else {
      const res = ApiService.post("/exams", payload);
      Swal.fire({
        icon: "success",
        text: "Tạo đề thi thành công",
        draggable: true
      });
      onClose();
    }
  } catch (error) {
    console.error("Error saving exam:", error);
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Không thể lưu đề thi, vui lòng thử lại sau!",
    });
    return;
  }
};

  /*const handleSave = () => {
    const currentTotal = Object.values(scores).reduce((sum, score) => sum + (score || 0), 0);
    if (currentTotal !== totalScore) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Tổng điểm (${currentTotal.toFixed(2)}) không khớp với tổng điểm đã nhập (${totalScore})!`,
      });
      return;
    }
    // Logic lưu dữ liệu (nếu cần) ở đây
    Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Đã lưu thành công!",
    });
  };*/

  return (
    <div>
      <h5 className="mb-3 fw-bold" style={{ color: "#1976d2", fontSize: "20px" }}>
        {initialData ? "Chỉnh sửa đề thi" : "Tạo đề thi mới"}
      </h5>      
      <div className="container">
        <div className="row">
          <div className="tbl-shadow me-2 col">
            <div>
              <p className="mb-2">Mã đề thi:</p>
              <TextField
                fullWidth
                required
                value={examCode}
                disabled={!!initialData} // Vô hiệu hóa khi chỉnh sửa
                inputRef={inputRef}
                onChange={(e) => setExamCode(e.target.value)}
                sx={{
                  height: "40px",
                  "& .MuiInputBase-root": {
                    height: "40px",
                    fontSize: "14px",
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "14px",
                  },
                  "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                }}
              />           
            </div>
  
            <div className="d-flex mt-2">
              <div className="col-8 me-2">
                <p className="mb-2">Tên đề thi:</p>
                <TextField
                  fullWidth
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": {
                      height: "40px",
                      fontSize: "14px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                />           
              </div>
              <div className="">
                <p className="mb-2">Tổng điểm:</p>
                <TextField
                  fullWidth
                  required
                  type="number"
                  value={totalScore}
                  onChange={(e) => setTotalScore(parseFloat(e.target.value) || 0)}
                  sx={{
                    height: "40px",
                    "& .MuiInputBase-root": {
                      height: "40px",
                      fontSize: "14px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "14px",
                    },
                    "& .MuiInputLabel-root": { fontSize: "14px" }, // Giảm cỡ chữ label
                  }}
                  
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table sample-table table-hover tbl-organize-hover">
                <thead>
                  <tr className="align-middle">
                    <th scope="col" className="title-row"></th>
                    <th scope="col" className="title-row">STT</th>
                    <th scope="col" className="title-row">Nội dung</th>
                    <th scope="col" className="title-row">Điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((questionId, index) => {
                    const selectedQuestion = listDisplay.find((q) => q.questionId === questionId);
                    if (selectedQuestion) {
                      const scorePerQuestion = selectedItems.length > 0 ? (totalScore / selectedItems.length).toFixed(2) : 0;
                      return (
                        <tr key={questionId} className="align-middle">
                          <td className="text-center" style={{ width: "50px" }}>
                            <i
                              className="fa-solid fa-minus"
                              style={{ color: "red", cursor: "pointer" }}
                              onClick={() => handleRemoveItem(questionId)}
                            ></i>
                          </td>
                          <td>{index + 1}</td>
                          <td>{selectedQuestion.questionText}</td>
                          <td>
                            <TextField
                              type="number"
                              value={
                                scores[questionId] !== undefined
                                  ? scores[questionId]       // Nếu đã chỉnh sửa thì lấy từ state
                                  : selectedQuestion.questionScore ?? 0  // Nếu chưa thì giữ nguyên điểm gốc
                              }                             
                              onChange={(e) => handleScoreChange(questionId, e.target.value)}
                              size="small"
                              sx={{
                                width: "80px",
                                "& .MuiInputBase-root": {
                                  height: "40px",
                                  fontSize: "14px",
                                },
                                "& input": {
                                  fontSize: "14px",
                                  padding: "8px",
                                },
                              }}
                              inputProps={{ step: "0.5", min: "0" }}
                            />
                          </td>
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </table>
            </div>
            <div 
              style={{
                display: "flex",
                justifyContent: "flex-end",  
                gap: "10px",                 
                width: "100%"
              }}
            >
              <div style={{ display: "flex", width: "50%", gap: "10px" }}>
                <CancelButton onClick={onClose} type="button"
                  style={{ flex: 1 }}   
                >
                  Hủy
                </CancelButton>
                <AddButton style={{ flex: 1 }} onClick={handleSave}>
                  Lưu
                </AddButton>
              </div>
            </div>
          </div>
          <div className="tbl-shadow ms-2 col">
            <div className="sample-card-header d-flex justify-content-between align-items-center">
              <div className="search-box rounded d-flex align-items-center">
                <i className="search-icon me-3 pb-0 fa-solid fa-magnifying-glass" style={{fontSize: "12px"}}></i>
                <input
                  type="text"
                  className="search-input w-100"
                  placeholder="Tìm kiếm..."
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Autocomplete
                  className="mt-3"
                  disabled={isEditMode}                  
                  options={subjectOptions}
                  getOptionLabel={(option) => option.label}
                  value={subjectOptions.find((option) => option.value === subjectChosen) || null}
                  onChange={(event, newValue) => setSubjectChosen(newValue?.value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn phân môn"
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputBase-root": { height: "40px", fontSize: "14px" },
                        "& label": { fontSize: "14px" },
                        "& input": { fontSize: "14px" },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  className="mt-3"
                  disabled={isEditMode}
                  options={bankOptions}
                  getOptionLabel={(option) => option.label}
                  value={bankOptions.find((option) => option.value === bankChosen) || null}
                  onChange={(event, newValue) => {
                    if (!isEditMode) {
                      setBankChosen(newValue?.value);
                    }
                  }}                  
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn bộ câu hỏi"
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputBase-root": { height: "40px", fontSize: "14px" },
                        "& label": { fontSize: "14px" },
                        "& input": { fontSize: "14px" },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Autocomplete
                  className="mt-3"
                  options={chapterOptions} 
                  getOptionLabel={(option) => option.label}
                  value={chapterOptions.find((option) => option.value === selectedChapter?.value) || null}
                  onChange={(event, newValue) => setSelectedChapter(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn chuyên đề"
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputBase-root": {
                          height: "40px",
                          fontSize: "14px",
                        },
                        "& label": {
                          fontSize: "14px",
                        },
                        "& input": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  )}
                  slotProps={{
                    paper: {
                      sx: {
                        fontSize: "14px", // ✅ Cỡ chữ dropdown
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  className="mt-3"
                  options={levelOptions}
                  getOptionLabel={(option) => option.label}
                  value={levelOptions.find((option) => option.value === selectedLevel?.value) || null}
                  onChange={(event, newValue) => setSelectedLevel(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn mức độ"
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputBase-root": {
                          height: "40px",
                          fontSize: "14px",
                        },
                        "& label": {
                          fontSize: "14px",
                        },
                        "& input": {
                          fontSize: "14px",
                        },
                      }}
                    />
                  )}
                  slotProps={{
                    paper: {
                      sx: {
                        fontSize: "14px", // ✅ Cỡ chữ dropdown
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
            <div className="table-responsive">
              <table className="table sample-table table-hover tbl-organize-hover">
                <thead>
                  <tr className="align-middle">
                    <th scope="col" className="text-center title-row" style={{ width: "50px"}}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={listDisplay.length > 0 && listDisplay.every((item) => selectedItems.includes(item.questionId))}                  
                      />
                    </th>
                    <th scope="col" className="title-row">Nội dung</th>
                    <th scope="col" className="title-row">Độ khó</th>
                  </tr>
                </thead>
                  <tbody>
                    {listDisplay.map((item, index) => (
                      <tr key={item.questionId} className="align-middle">
                        <td className=" text-center" style={{ width: "50px" }}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            onChange={(e) => handleSelectItem(e, item.questionId)}
                            checked={selectedItems.includes(item.questionId)}
                          />
                        </td>
                        <td>{item.questionText}</td>
                        <td>{item.tags[1]}</td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

FormCreateExam.propTypes = {
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    examId: PropTypes.string,
    examCode: PropTypes.string,
    examName: PropTypes.string,
    subjectName: PropTypes.string,
    questionBankName: PropTypes.string,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        questionId: PropTypes.string,
        questionText: PropTypes.string,
        chapter: PropTypes.string,
        level: PropTypes.string,
        questionScore: PropTypes.number,
        options: PropTypes.array,
      })
    ),
    totalScore: PropTypes.number,
    scores: PropTypes.object,
  }),
};

export default FormCreateExam;