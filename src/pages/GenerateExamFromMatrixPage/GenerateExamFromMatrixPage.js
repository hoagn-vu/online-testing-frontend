import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "./GenerateExamFromMatrixPage.css";
import PropTypes from 'prop-types';
import { Select, Box, Button, Grid, IconButton, TextField, Autocomplete } from "@mui/material";
import ApiService from "../../services/apiService";
import Swal from "sweetalert2";
import CancelButton from "../../components/CancelButton/CancelButton";
import AddButton from "../../components/AddButton/AddButton";

const GenerateExamFromMatrixPage = () => {
  const names = ['Chuyên đề', 'Mức độ'];
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [subjectChosen, setSubjectChosen] = useState(null);
  const [bankOptions, setBankOptions] = useState([]);
  const [bankChosen, setBankChosen] = useState(null);
  const [matrixOptions, setMatrixOptions] = useState([]);
  const [matrixChosen, setMatrixChosen] = useState(null); 
  const [tagClassification, setTagClassification] = useState([]);
  const [data, setData] = useState([]);
  const [detailData, setDetailData] = useState([]); 
  const [matrixName, setMatrixName] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editMatrixId = searchParams.get("id");
  const [totalScore, setTotalScore] = useState(10);
  const [matrixType, setMatrixType] = useState("both");
  const [showChapter, setShowChapter] = useState(true); // Để kiểm soát hiển thị cột Chuyên đề
  const [showLevel, setShowLevel] = useState(true); // Để kiểm soát hiển thị cột Mức độ
  const [totalSelectedQuestions, setTotalSelectedQuestions] = useState(0); // Tổng số câu hỏi
  const [difficultyData, setDifficultyData] = useState([]); // Dữ liệu thống kê
  const isEditMode = Boolean(editMatrixId);
  const [personName, setPersonName] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái isLoading
  const [matrixCount, setMatrixCount] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const isEdit = !!id;
  const [generatedExams, setGeneratedExams] = useState([]); // Lưu danh sách đề thi
  const [showExamModal, setShowExamModal] = useState(false); // Kiểm soát modal
  const [selectedExam, setSelectedExam] = useState(null); // Đề thi được chọn
  const [isGenerated, setIsGenerated] = useState(false);
  const [openAnswers, setOpenAnswers] = useState({});
  const [examDetailData, setExamDetailData] = useState([]); 
  const [editExamId, setEditExamId] = useState(null);
  const [editForm, setEditForm] = useState({ examCode: "", examName: "" });

  let finalType;
  if (isEditMode && matrixType) {
    finalType = matrixType;
  } else {
    finalType =
      personName.includes("Mức độ") && personName.includes("Chuyên đề")
        ? "both"
        : personName.includes("Chuyên đề")
        ? "chapter"
        : personName.includes("Mức độ")
        ? "level"
        : "both";
  }

  // Fetch subject options
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

  // Fetch bank options
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

  // Fetch matrix options
  useEffect(() => {
    const fetchMatrixOptions = async () => {
      try {
        const response = await ApiService.get("/exam-matrices/options", {
          params: { subjectId: subjectChosen, questionBankId: bankChosen },
        });
        setMatrixOptions(response.data.map((item) => ({ value: item.id, label: item.matrixName })));
      } catch (error) {
        console.error("Failed to fetch matrix options: ", error);
      }
    };
    if (subjectChosen && bankChosen) {
      fetchMatrixOptions();
    }
  }, [subjectChosen, bankChosen]);

  // Fetch matrix details when matrix is chosen
  const fetchMatrixDetail = async (matrixId) => {
    try {
      const response = await ApiService.get(`/exam-matrices/${matrixId}`);
      const matrix = response.data?.data || {};

      setMatrixName(matrix.matrixName || "");
      setSubjectChosen(matrix.subjectId || null);
      setBankChosen(matrix.questionBankId || null);

      const matrixTags = matrix.matrixTags || [];
      const hasOnlyChapter = matrixTags.every(tag => !tag.level || tag.level.trim() === "");
      const hasOnlyLevel = matrixTags.every(tag => !tag.chapter || tag.chapter.trim() === "");

      let detectedType = "both";
      if (hasOnlyChapter && !hasOnlyLevel) detectedType = "chapter";
      else if (hasOnlyLevel && !hasOnlyChapter) detectedType = "level";
      else if (hasOnlyChapter && hasOnlyLevel) detectedType = "chapter";
      setMatrixType(detectedType);

      const tagRes = await ApiService.get("/subjects/questions/tags-classification", {
        params: { subjectId: matrix.subjectId, questionBankId: matrix.questionBankId, type: detectedType },
      });
      const classification = tagRes.data || [];

      const tags = matrixTags.map(tag => {
        if (tag.chapter && tag.chapter.trim() !== "") {
          if (tag.level && tag.level.trim() !== "") {
            const found = classification.find(c => c.chapter === tag.chapter && c.level === tag.level);
            return { ...tag, total: found ? found.total : 0 };
          } else {
            const chapterTotals = classification
              .filter(c => c.chapter === tag.chapter)
              .reduce((sum, c) => sum + (c.total || 0), 0);
            return { ...tag, total: chapterTotals };
          }
        } else {
          const levelTotals = classification
            .filter(c => c.level === tag.level)
            .reduce((sum, c) => sum + (c.total || 0), 0);
          return { ...tag, total: levelTotals };
        }
      });

      setDetailData(tags);
      setShowChapter(tags.some(tag => tag.chapter && tag.chapter.trim() !== ""));
      setShowLevel(tags.some(tag => tag.level && tag.level.trim() !== ""));
      setTotalSelectedQuestions(tags.reduce((sum, tag) => sum + (tag.questionCount || 0), 0));
      setTotalScore(tags.reduce((sum, tag) => sum + (tag.score || 0), 0));

      // Tạo difficultyData
      setDifficultyData(
        Object.entries(
          tags.reduce((acc, tag) => {
            const key = detectedType === "level" ? (tag.level || "Không xác định") : (tag.chapter || "Không xác định");
            acc[key] = (acc[key] || 0) + (tag.questionCount || 0);
            return acc;
          }, {})
        ).map(([key, questionCount]) => (
          detectedType === "level" ? { level: key, questionCount } : { chapter: key, questionCount }
        ))
      );
    } catch (error) {
      console.error("Lỗi tải chi tiết ma trận:", error);
      Swal.fire("Lỗi!", "Không thể tải chi tiết ma trận", "error");
    }
  };

  // Handle matrix selection
  useEffect(() => {
    if (matrixChosen) {
      fetchMatrixDetail(matrixChosen);
    } else {
      setDetailData([]);
      setShowChapter(false);
      setShowLevel(false);
      setTotalSelectedQuestions(0);
      setTotalScore(10);
      setDifficultyData([]);
    }
  }, [matrixChosen]);

  // Reset data when personName changes
  useEffect(() => {
    if (!isEditMode && tagClassification.length > 0) {
      if (finalType === "level") {
        const groupedLevels = tagClassification.reduce((acc, item) => {
          const level = item.level || "Không xác định";
          const existing = acc.find((entry) => entry.level === level);
          if (existing) {
            existing.total += item.total || 0;
            existing.questionCount += item.questionCount || 0;
            existing.score += item.score || 0;
          } else {
            acc.push({
              level,
              total: item.total || 0,
              questionCount: 0,
              score: 0,
            });
          }
          return acc;
        }, []);
        setData(groupedLevels);
      } else if (finalType === "chapter") {
        setData(
          tagClassification.map((item) => ({
            chapter: item.chapter,
            levels: [{
              level: "",
              total: item.total || 0,
              questionCount: 0,
              score: 0,
            }],
          }))
        );
      } else {
        const groupedData = tagClassification.reduce((acc, item) => {
          const existing = acc.find((entry) => entry.chapter === item.chapter);
          if (existing) {
            existing.levels.push({
              level: item.level || "Không xác định",
              total: item.total || 0,
              questionCount: 0,
              score: 0,
            });
          } else {
            acc.push({
              chapter: item.chapter,
              levels: [{
                level: item.level || "Không xác định",
                total: item.total || 0,
                questionCount: 0,
                score: 0,
              }],
            });
          }
          return acc;
        }, []);
        setData(groupedData);
      }
      setTotalScore(10);
    }
  }, [personName, tagClassification, finalType, isEditMode]);

  // Fetch tag classification
  useEffect(() => {
    const fetchTagsClassification = async () => {
      try {
        let typeDefined = finalType;
        const response = await ApiService.get("/subjects/questions/tags-classification", {
          params: { subjectId: subjectChosen, questionBankId: bankChosen, type: typeDefined },
        });
        const classificationData = response.data;
        setTagClassification(classificationData.map((item) => ({ ...item, questionCount: 0 })));
        if (typeDefined === "level" && (!classificationData || classificationData.length === 0)) {
          Swal.fire({
            icon: "warning",
            title: "Không có dữ liệu mức độ!",
            text: "Không tìm thấy mức độ nào cho môn học và bộ câu hỏi đã chọn.",
          });
        }
      } catch (error) {
        console.error("Failed to fetch tag classification: ", error);
        Swal.fire("Lỗi!", "Không thể tải danh sách mức độ", "error");
      }
    };
    if (subjectChosen && bankChosen) {
      fetchTagsClassification();
    }
  }, [subjectChosen, bankChosen, finalType]);

  const createExamFromMatrix = async (generateExam) => {
    setIsLoading(true);
    try {
      const response = await ApiService.post("/exam-matrices/generate-exam", generateExam);
      if (!response.data || response.data.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Không có đề thi!",
          text: "API không trả về danh sách đề thi.",
        });
        return;
      }
      setDetailData([]);
      setGeneratedExams(response.data);
      if (response.data.length > 0) {
        handleSelectExam(response.data[0]);
      }
      setShowExamModal(true);
      setIsGenerated(true);
    } catch (error) {
      console.error("Failed to create exam from matrix: ", error);
    }
    setIsLoading(false);
  };

  // Hàm lấy câu hỏi theo examId
  const fetchExamQuestions = async (examId) => {
    try {
      const examDetailRes = await ApiService.get("/exams/questions", {
        params: { examId },
      });
      setExamDetailData(examDetailRes.data?.listQuestion || []);
      console.log(examDetailData);
    } catch (error) {
      console.error("Failed to fetch exam questions: ", error);
    }
  };

  // Khi click chọn đề thi khác
  const handleSelectExam = async (exam) => {
    setSelectedExam(exam);
    await fetchExamQuestions(exam.examId);
  };

  // Hàm xử lý sinh đề thi
  const handleSaveMatrix = async () => {
    if (!subjectChosen) {
      Swal.fire({
        icon: "warning",
        title: "Chưa chọn môn học!",
        text: "Vui lòng chọn môn học.",
      });
      return;
    }
    if (!bankChosen) {
      Swal.fire({
        icon: "warning",
        title: "Chưa chọn ngân hàng câu hỏi!",
        text: "Vui lòng chọn ngân hàng câu hỏi.",
      });
      return;
    }
    if (!matrixChosen) {
      Swal.fire({
        icon: "warning",
        title: "Chưa chọn ma trận!",
        text: "Vui lòng chọn ma trận đề thi.",
      });
      return;
    }
    if (!matrixCount) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu số lượng đề thi!",
        text: "Vui lòng nhập số lượng đề thi tạo sinh.",
      });
      return;
    }
    if (!data.length) {
      Swal.fire({
        icon: "warning",
        title: "Dữ liệu ma trận trống!",
        text: "Vui lòng nhập dữ liệu cho ma trận đề thi.",
      });
      return;
    }
    // Gọi API để sinh đề thi
    const generateExam = {
      examMatrixId: matrixChosen,
      numberGenerate: matrixCount,
    };
    await createExamFromMatrix(generateExam);
  };

  // Hàm Lưu đề thi
  const handleStoreExam = async () => {
    try {
      if (!generatedExams || generatedExams.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Chưa có đề thi!",
          text: "Vui lòng sinh đề thi trước khi lưu.",
        });
        return;
      }
      
      // Gọi API cập nhật cho tất cả exam song song
      await Promise.all(
        generatedExams.map((exam) =>
          ApiService.put(`/exams/${exam.examId}`, {
            examStatus: "available", 
          })
        )
      );

      // Update lại local state
      setGeneratedExams((prev) =>
        prev.map((exam) => ({
          ...exam,
          examStatus: "available",
        }))
      );

      Swal.fire({
        icon: "success",
        title: "Lưu đề thi thành công!",
        text: "Các đề thi đã được lưu vào hệ thống.",
      }).then(() => {
        navigate(`/staff/exam`, {
          state: { refresh: true },
        });
      });

    } catch (error) {
      console.error("Failed to save exam:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi khi lưu!",
        text: "Không thể lưu đề thi, vui lòng thử lại.",
      });
    }
  };

  const toggleAnswer = (id) => {
    setOpenAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  //Chỉnh sửa thông tin đề thi 
  const handleEditClick = (exam) => {
    setEditExamId(exam.examId);
    setEditForm({ examCode: exam.examCode, examName: exam.examName });
  };

  const handleCancelEdit = () => {
    setEditExamId(null);
    setEditForm({ examCode: "", examName: "" });
  };

  const handleSaveEdit = async (examId) => {
    try {
      // Gọi API update
      const response = await ApiService.put(`/exams/${examId}`, {
        examCode: editForm.examCode,
        examName: editForm.examName,
        examStatus: "pending",
      });

      console.log("API update success:", response.data);

      // Cập nhật local state sau khi API thành công
      setGeneratedExams((prev) =>
        prev.map((exam) =>
          exam.examId === examId
            ? { ...exam, examCode: editForm.examCode, examName: editForm.examName }
            : exam
        )
      );

      setEditExamId(null);
    } catch (error) {
      console.error("Failed to update exam:", error);
      // Có thể thêm Swal.fire để báo lỗi
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại",
        text: "Không thể lưu thông tin đề thi. Vui lòng thử lại!",
      });
    }
  };

  return (
    <div className="p-4">
      <nav className="breadcrumb-container mb-3" style={{ fontSize: "14px" }}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i></Link>
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Quản lý đề thi</span>
      </nav>

      <h5 className="mb-3 fw-bold" style={{ color: "#1976d2", fontSize: "20px" }}>
        Sinh đề thi từ ma trận
      </h5>

      <div className="d-flex mt-4">
        <div className="d-flex">
          <Autocomplete
            className="me-2"
            options={subjectOptions}
            getOptionLabel={(option) => option.label}
            value={subjectOptions.find(opt => opt.value === subjectChosen) || null}
            onChange={(event, newValue) => {
              setSubjectChosen(newValue?.value || null);
              if (!newValue) {
                // Reset các trạng thái liên quan khi môn học bị xóa
                setBankChosen(null);
                setBankOptions([]);
                setMatrixChosen(null);
                setMatrixOptions([]);
                setDetailData([]);
                setShowChapter(false);
                setShowLevel(false);
                setTotalSelectedQuestions(0);
                setTotalScore(10);
                setDifficultyData([]);
                setTagClassification([]);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={inputRef}
                label="Chọn phân môn"
                size="small"
                sx={{
                  backgroundColor: "white",
                  minWidth: 220,
                  "& .MuiInputBase-root": { height: "40px" },
                  "& label": { fontSize: "14px" },
                  "& input": { fontSize: "14px" },
                }}
              />
            )}
            slotProps={{ paper: { sx: { fontSize: "14px" } } }}
          />

          <Autocomplete
            className="me-2"
            options={bankOptions}
            getOptionLabel={(option) => option.label}
            value={bankOptions.find(opt => opt.value === bankChosen) || null}
            onChange={(event, newValue) => {
              setBankChosen(newValue?.value || null);
              setMatrixChosen(null); // Reset ma trận khi thay đổi ngân hàng
              setMatrixOptions([]); // Reset danh sách ma trận
              setDetailData([]); // Reset chi tiết ma trận
              setShowChapter(false);
              setShowLevel(false);
              setTotalSelectedQuestions(0);
              setTotalScore(10);
              setDifficultyData([]);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn bộ câu hỏi"
                size="small"
                sx={{
                  backgroundColor: "white",
                  minWidth: 220,
                  "& .MuiInputBase-root": { height: "40px", fontSize: "14px" },
                  "& label": { fontSize: "14px" },
                  "& input": { fontSize: "14px" },
                }}
              />
            )}
            slotProps={{ paper: { sx: { fontSize: "14px" } } }}
          />

          <Autocomplete
            className="me-2"
            options={matrixOptions}
            getOptionLabel={(option) => option.label}
            value={matrixOptions.find(opt => opt.value === matrixChosen) || null}
            onChange={(event, newValue) => {
              setMatrixChosen(newValue?.value || null);
              if (!newValue) {
                // Reset chi tiết ma trận khi ma trận bị xóa
                setDetailData([]);
                setShowChapter(false);
                setShowLevel(false);
                setTotalSelectedQuestions(0);
                setTotalScore(10);
                setDifficultyData([]);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn ma trận"
                size="small"
                sx={{
                  backgroundColor: "white",
                  minWidth: 250,
                  "& .MuiInputBase-root": { height: "40px" },
                  "& label": { fontSize: "14px" },
                  "& input": { fontSize: "14px" },
                }}
              />
            )}
            slotProps={{ paper: { sx: { fontSize: "14px" } } }}
          />

          <TextField
            required
            id="outlined-size-small"
            type="number"
            onChange={(e) => {
              const value = e.target.value;
              // Chỉ cho phép số nguyên dương hoặc rỗng
              if (value === "" || (/^[1-9]\d*$/.test(value))) {
                setMatrixCount(value);
              }
            }}
            size="small"
            inputProps={{ min: 1 }}
            label="Số lượng đề thi tạo sinh"
            sx={{
              backgroundColor: "white",
              "& .MuiOutlinedInput-root": { minHeight: "40px", minWidth: "250px", fontSize: "14px" },
              "& .MuiInputLabel-root": { fontSize: "14px" },
            }}
          />
        </div>
        <div className="d-flex ms-auto">
          <CancelButton onClick={() => navigate("/staff/exam")}>Hủy</CancelButton>
         <AddButton 
            onClick={isGenerated ? handleStoreExam : handleSaveMatrix} 
            className="ms-2"
          >
            <i className={`fas ${isGenerated ? "fa-save" : "fa-plus"} me-2`}></i>
            {isGenerated ? "Lưu đề thi" : "Sinh đề thi"}
          </AddButton>
        </div>
      </div>

      {/* Hiển thị chi tiết ma trận */}
      {detailData.length > 0 && !showExamModal && (
        <div className="mt-4">
          <h6 className="fw-bold" style={{ color: "#1976d2" }}>Chi tiết ma trận: {matrixOptions.find(opt => opt.value === matrixChosen)?.label}</h6>
          <div className="d-flex gap-2 w-100" style={{ flexWrap: 'wrap' }}>
            <div className="table-responsive tbl-shadow pb-0 mb-0" style={{ flex: '1', fontSize: '14px' }}>
              <table className="table w-100 border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">STT</th>
                    {showChapter && <th className="border p-2">Chuyên đề kiến thức</th>}
                    {showLevel && <th className="border p-2">Mức độ</th>}
                    <th className="border p-2 text-center">Số lượng chọn / Tổng</th>
                    <th className="border p-2 text-center">Đơn vị</th>
                    <th className="border p-2 text-center">Tổng điểm</th>
                    <th className="border p-2 text-center">Điểm/Câu</th>
                  </tr>
                </thead>
                <tbody>
                  {showChapter ? (
                    Object.entries(
                      detailData.reduce((acc, tag) => {
                        const key = tag.chapter || "Khác";
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(tag);
                        return acc;
                      }, {})
                    ).map(([chapter, tags], chapterIndex) => (
                      <React.Fragment key={chapterIndex}>
                        {tags.map((tag, levelIndex) => (
                          <tr key={`${chapterIndex}-${levelIndex}`} className="border">
                            {levelIndex === 0 && (
                              <td className="border p-2 text-center" rowSpan={tags.length}>
                                {chapterIndex + 1}
                              </td>
                            )}
                            {levelIndex === 0 && (
                              <td className="border p-2" rowSpan={tags.length} style={{ minWidth: "300px" }}>
                                {chapter}
                              </td>
                            )}
                            {showLevel && (
                              <td className="border p-2" style={{ minWidth: "150px" }}>
                                {tag.level || "-"}
                              </td>
                            )}
                            <td className="border p-2 text-center">{tag.questionCount} / {(tag.total || 0).toString().padStart(2, '0')}</td>
                            <td className="border p-2 text-center">Câu</td>
                            <td className="border p-2 text-center">{(tag.score || 0).toFixed(1)}</td>
                            <td className="border p-2 text-center">
                              {tag.questionCount === 0 ? "-" : (tag.score / tag.questionCount).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    detailData.map((tag, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2 text-center">{index + 1}</td>
                        {showLevel && (
                          <td className="border p-2" style={{ minWidth: "150px" }}>
                            {tag.level || "-"}
                          </td>
                        )}
                        <td className="border p-2 text-center">{tag.questionCount} / {(tag.total || 0).toString().padStart(2, '0')}</td>
                        <td className="border p-2 text-center">Câu</td>
                        <td className="border p-2 text-center">{(tag.score || 0).toFixed(1)}</td>
                        <td className="border p-2 text-center">
                          {tag.questionCount === 0 ? "-" : (tag.score / tag.questionCount).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-gray-300 fw-bold">
                    <td className="border p-2 text-center" colSpan={showChapter && showLevel ? 3 : showChapter || showLevel ? 2 : 1}>
                      Tổng số câu hỏi
                    </td>
                    <td className="border p-2 text-center">{totalSelectedQuestions}</td>
                    <td className="border p-2 text-center">Câu</td>
                    <td className="border p-2 text-center">{totalScore.toFixed(1)}</td>
                    <td className="border p-2 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-2 bg-white" style={{ minWidth: '250px', fontSize: '14px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
              <h5 className="text-center">Thống kê</h5>
              <table className="table table-bordered ">
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', textAlign: 'left', padding: '8px', minWidth: '130px' }}>
                      {showLevel ? "Mức độ" : "Chuyên đề"}
                    </th>
                    <th style={{ border: '1px solid #ddd', textAlign: 'center', padding: '8px' }}>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {difficultyData.map((row, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        {showLevel ? (row.level || "Không xác định") : (row.chapter || "Không xác định")}
                      </td>
                      <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{row.questionCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Khung hiển thị danh sách đề thi và câu hỏi */}
      {showExamModal && (
        <div className="mt-3" >
          <h6
            id="exam-modal-title"
            className="fw-bold"
            style={{ color: "#1976d2", marginBottom: "16px" }}
          >
            Danh sách đề thi đã sinh
          </h6>

          <div className="d-flex gap-3 w-100" style={{ flexWrap: "wrap" }}>
            {/* Bảng đề thi bên trái */}
            <div
              className="table-responsive tbl-shadow pb-0 mb-0"
              style={{ flex: 2, fontSize: "14px" }}
            >
              <table className="table sample-table table-hover tbl-organize-hover w-100">
                <thead>
                  <tr className="bg-gray-200 align-middle">
                    <th className="">STT</th>
                    <th className="">Mã đề thi</th>
                    <th className="">Tên đề thi</th>
                    <th className="text-center" style={{minWidth: "150px"}}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedExams.map((exam, index) => (
                    <tr
                      key={exam.examId}
                      className={`${
                        selectedExam?.examId === exam.examId ? "bg-light-blue" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelectExam(exam)}
                    >
                      <td className="p-2 text-center">{index + 1}</td>
                      {/* Nếu đang edit exam này thì show input */}
                      <td className="p-2">
                        {editExamId === exam.examId ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editForm.examCode}
                            onChange={(e) =>
                              setEditForm({ ...editForm, examCode: e.target.value })
                            }
                          />
                        ) : (
                          exam.examCode
                        )}
                      </td>

                      <td className="p-2">
                        {editExamId === exam.examId ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editForm.examName}
                            onChange={(e) =>
                              setEditForm({ ...editForm, examName: e.target.value })
                            }
                          />
                        ) : (
                          exam.examName
                        )}
                      </td>
                      <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                        {editExamId === exam.examId ? (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleSaveEdit(exam.examId)}
                            >
                              <i className="fa fa-save"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={handleCancelEdit}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn"
                            onClick={() => handleEditClick(exam)}
                          >
                            <i className="fa fa-edit" style={{color: "#3c65d6ff", fontSize:"20px"}}></i>
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            

            {/* Bảng câu hỏi bên phải */}
            <div
              className="p-2 bg-white"
              style={{
                flex: 2,
                fontSize: "14px",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
              >
              {/* Hiển thị tên đề thi */}
              {selectedExam && (
                <h6 className="text-center mb-3 mt-2">
                  Đề thi: {selectedExam.examName}
                </h6>
              )}
              {examDetailData.map((q, index) => {
              const isOpen = openAnswers[q.questionId];

              return (
                <div key={q.questionId} id={`question-${index + 2}`} className="border p-3 rounded m-3 mt-0 mb-2">
                  {/* Header */}
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <p style={{ fontSize: "15px" }} className="mb-0">
                        <i className="fa-solid fa-question me-1"></i> Câu {index + 1}:
                      </p>
                    </div>

                    <div className="d-flex mb-0 align-items-center">
                      <i className="fa-solid fa-star me-1 star-color"></i>
                      <p className="mb-0">
                        {q.questionScore} điểm
                      </p>

                      {/* Chevron toggle */}
                      <i
                        className={`fa-solid ms-3 mt-1 ${
                          isOpen ? "fa-chevron-down" : "fa-chevron-up"
                        }`}
                        style={{ cursor: "pointer", transition: "transform 0.3s" }}
                        onClick={() => toggleAnswer(q.questionId)}
                      ></i>
                    </div>
                  </div>

                  {/* Question text */}
                  <h6 className="fw-bold mt-2">{q.questionText}</h6>

                  {/* Collapse đáp án */}
                  {isOpen && (
                  <div className={`collapse ${isOpen ? "show" : ""}`}>
                    <div className="pt-2">
                      {q.options.map((option, index) => {
                        const isCorrect = option.isCorrect;
                        let className = "option mb-1";
                        if (isCorrect) {
                          className += " correct";
                        } 
                        
                        // Tạo nhãn ABCD từ index
                        const labels = ["A", "B", "C", "D", "E", "F"];

                        return (
                          <p key={option.optionId} className={className}>
                            {labels[index]}. {option.optionText}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

GenerateExamFromMatrixPage.propTypes = {
};

export default GenerateExamFromMatrixPage;