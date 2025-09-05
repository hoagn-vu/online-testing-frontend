import React, { useState, useEffect } from "react";
import "./AutoStatisticPage.css";
import AddButton from "../../components/AddButton/AddButton";
import { Link, useParams } from "react-router-dom";
import ApiService from "../../services/apiService";
import { Autocomplete, TextField } from "@mui/material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import plugin
import BarChart from "../../components/BarChart/BarChart";
import PieChart from "../../components/PieChart/PieChart";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels); // Đăng ký plugin
const AutoStatisticPage = () => {
  const { organizeExamId, sessionId, roomId, candidateId } = useParams();
  const [organizeExamName, setOrganizeExamName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [duration, setDuration] = useState("");
  const [totalScore, setTotalScore] = useState("");
  const [listQuestions, setListQuestions] = useState([]);
  const [openAnswers, setOpenAnswers] = useState({});
  const [dataPoints, setDataPoints] = useState([])
  const [labels, setLabels] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [scoreDistributionArray, setScoreDistributionArray] = useState([]);
  const [totalCandidates, setTotalCandidates] = useState("");
  const [totalCandidateTerminated, setTotalCandidateTerminated] = useState("");
  const [totalCandidateNotParticipated, setTotalCandidateNotParticipated] = useState("");
  //const [organizeExamId, setOrganizeExamId] = useState(null);
  const [organizeExamOptions, setOrganizeExamOptions] = useState([]);

  const fetchData = async () => {
    try {
      const response = await ApiService.get("/statistics/organize-exam/ramdom-exam-status", {
        params: {
          organizeExamId: organizeExamId,
        },
      });
      
      setOrganizeExamName(response.data.data.organizeExamName || "Kỳ thi mẫu");
      setSessionName(response.data.data.sessionName || "Ca thi mẫu");
      setRoomName(response.data.data.roomName || "Phòng thi mẫu");
      setCandidateName(response.data.data.fullName || "Thí sinh mẫu");
      setSubjectName(response.data.data.subjectName || "Môn thi mẫu");
      setDuration(response.data.data.duration || "60 phút");
      setTotalScore(response.data.data.totalScore || 10);
      setListQuestions(response.data.data.questions || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organizeExamId]);

  useEffect(() => {
    const initState = {};
    listQuestions.forEach((q) => {
      initState[q.questionId] = true;
    });
    setOpenAnswers(initState);
  }, [listQuestions]);

  const toggleAnswer = (id) => {
    setOpenAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getChartData = (options, totalSelections) => {
    const labels = options.map((_, index) => String.fromCharCode(65 + index)); // A, B, C, D
    const data = options.map((opt) => {
      return totalSelections > 0 ? (opt.selectedCount / totalSelections) * 100 : 0;
    });
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: (context) => {
            const index = context.dataIndex;
            const isCorrect = options[index].isCorrect;
            return isCorrect ? "#4CAF50" : "#E0E0E0";
          },
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: "end", // Đặt nhãn ở cuối cột
        align: "end", // Căn giữa với cạnh cuối
        clip: false,
        clamp: true, // Giữ nhãn trong vùng vẽ
        color: "#000", // Màu chữ
        font: { size: 12 }, // Cỡ chữ
        formatter: (value) => `${value.toFixed(1)}%`, // Hiển thị phần trăm với 1 chữ số thập phân
      },
    },
    layout: {
      padding: {
        right: 40, // ✨ chừa khoảng trống để không bị mất chữ
      },
    },
    scales: {
      x: { display: false }, // Bỏ trục X
      y: {
        display: true,
        grid: { display: false }, // Bỏ lưới
        ticks: { font: { size: 12 } }, // Điều chỉnh cỡ chữ nhãn nếu cần
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    barThickness: 25,
  };

  const convertBinsToArray = (obj) => {
    const arr = Object.entries(obj)
      .map(([key, value]) => {
        const match = key.match(/bin(\d+)_(\d+)/);
        if (match) {
          const start = match[1];
          const end = match[2];
          return {
            range: `${start} - ${end}`,
            count: value
          };
        }
        return null;
      })
      .filter(Boolean);

    const ranges = arr.map(item => item.range);
    const counts = arr.map(item => item.count);

    return { array: arr, ranges, counts };
  };

  const fetchChart = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/statistics/get-update-organize-exam-grade-stats", {
        params: { organizeExamId: organizeExamId },
      });
      setSubjectName(response.data.data.subjectName);
      
      const { array, ranges, counts } = convertBinsToArray(response.data.data.scoreDistribution);
      setScoreDistributionArray(array);
      setLabels(ranges);
      setDataPoints(counts);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
    setIsLoading(false);
  };

  const fetchPieChart = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/statistics/get-participation-violation-by-id", {
        params: { organizeExamId: organizeExamId },
      });      
      setTotalCandidates(response.data.data.totalCandidates);
      setTotalCandidateTerminated(response.data.data.totalCandidateTerminated);
      setTotalCandidateNotParticipated(response.data.data.totalCandidateNotParticipated);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (organizeExamId) {
      fetchChart(organizeExamId);
      fetchPieChart(organizeExamId);
    }
  }, [organizeExamId]);

  return (
    <div className="p-4">
      {/* <nav className="breadcrumb-container mb-3" style={{ fontSize: "14px" }}>
        <Link to="/" className="breadcrumb-link">
          <i className="fa fa-home pe-1" aria-hidden="true"></i>
        </Link>
        <span className="ms-2 me-2">
          <i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i>
        </span>
        <span className="breadcrumb-current">Thống kê theo đề ngẫu nhiên</span>
      </nav> */}
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/staff/dashboard" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        <span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-between">
          <Link to="/staff/organize" className="breadcrumb-between">Quản lý kỳ thi</Link></span>
        <span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current">Thống kê kỳ thi: {organizeExamName}</span>
      </nav>

      <p className="text-center mb-2 fw-bold text-blue-holo mt-2" style={{fontSize: "24px"}}>THỐNG KÊ</p>

      <div className="row mb-3">
        <div className="col-8">
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <p className="text-center mb-1 fw-bold">Biểu đồ phân bố điểm</p>
            <BarChart
              title="Số lượng thí sinh"
              labels={labels}
              dataPoints={dataPoints}
              width="100%"
              height="350px"
            />
          </div>
        </div>
        <div className="col-4 ps-0">
          <div className="bg-white p-3 rounded shadow-sm h-100">
            <p className="text-center mb-1 fw-bold">Tỷ lệ thí sinh tham gia kỳ thi</p>
            <PieChart
              labels={[
                "Thí sinh nộp bài thành công",
                "Thí sinh bị dừng thi",
                "Không thi",
              ]}
              dataPoints={[
                totalCandidates - totalCandidateTerminated - totalCandidateNotParticipated,
                totalCandidateTerminated,
                totalCandidateNotParticipated,
              ]}
              width="100%"
              height="350px"
              isShowLegend={true}
              convertToImage={false}
            />
          </div>
        </div>
      </div>
      <div className="candidate-exam-result">
        <div className="tbl-shadow">
          {listQuestions.map((q, index) => {
            const correctCount = listQuestions.reduce(
              (count, question) => count + (question.correctSelections || 0),
              0
            );
            const pointPerCorrect = correctCount > 0 ? totalScore / correctCount : 0;
            const isOpen = openAnswers[q.questionId] || false;

            return (
              <div key={q.questionId} id={`question-${index + 1}`} className="border p-3 mt-4 rounded m-3">
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <p style={{ fontSize: "15px" }} className="mb-0">
                      <i className="fa-solid fa-question me-1"></i> Câu {index + 1}
                    </p>
                  </div>
                  <div className="d-flex mb-0 align-items-center">
                    <i
                      className={`fa-solid ms-3 mt-1 ${isOpen ? "fa-chevron-down" : "fa-chevron-up"}`}
                      style={{ cursor: "pointer", transition: "transform 0.3s" }}
                      onClick={() => toggleAnswer(q.questionId)}
                    ></i>
                  </div>
                </div>
                <h6 className="fw-bold mt-2">{q.questionText}</h6>
                {isOpen && (
                  <div className={`collapse ${isOpen ? "show" : ""}`}>
                    <div className="pt-2 row">
                      <div className="col-8">
                        {q.options.map((option, index) => {
                          const isCorrect = option.isCorrect;
                          let className = "option mb-1";
                          if (isCorrect) {
                            className += " correct";
                          }
                          const optionLetter = String.fromCharCode(65 + index) + "."; // 65 là mã ASCII của 'A'
                          return (
                            <p key={option.optionId} className={className}>
                              {optionLetter} {option.optionText}
                            </p>
                          );
                        })}
                      </div>
                      {/* Biểu đồ */}
                      <div className="col-5" style={{ height: "160px", width: "300px", marginTop: "-15px"}}>
                        <Bar
                          data={getChartData(q.options, q.totalSelections)}
                          options={chartOptions}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AutoStatisticPage;