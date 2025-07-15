import React, { useState, useEffect, useRef, use } from "react";
import "./FormCreateExam.css";
import PropTypes from 'prop-types';
import {TextField, Autocomplete, Grid } from "@mui/material";
import ReactSelect  from 'react-select';
import ApiService from "../../services/apiService";

const FormCreateExam = ({ onClose  }) => {
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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  return (
    <div>
      <h5 className="mb-3 fw-bold" style={{color: '#1976d2', fontSize: "20px"}}>Tạo đề thi mới</h5>
      <div className="d-flex w-100">
        <div className="tbl-shadow flex-fill me-2">
          <div>
            <p className="mb-2">Tên đề thi:</p>
            <TextField
              fullWidth
              required
              // value={formData.organizeExamName}
              // inputRef={inputRef}
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
          <div className="mt-2">
            <p className="mb-2">Tổng điểm:</p>
            <TextField
              fullWidth
              required
              type="number"
              // value={formData.organizeExamName}
              // inputRef={inputRef}
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
                        <td>0.1</td> {/* Điểm mặc định, có thể tùy chỉnh */}
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="tbl-shadow flex-fill ms-2">
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
          <Autocomplete
            className="mt-3"
            options={subjectOptions}
            getOptionLabel={(option) => option.label}
            onChange={(event, newValue) => setSubjectChosen(newValue?.value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn phân môn"
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
          <Autocomplete
            className="mt-3"
            options={bankOptions} 
            getOptionLabel={(option) => option.label}
            onChange={(event, newValue) => setBankChosen(newValue?.value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn bộ câu hỏi"
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                className="mt-3"
                options={chapterOptions} 
                getOptionLabel={(option) => option.label}
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
  )
}

FormCreateExam.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default FormCreateExam;