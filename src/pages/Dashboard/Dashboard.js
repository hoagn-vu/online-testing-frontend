import React, { useState, useEffect, useRef } from "react";
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import {Autocomplete, TextField} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import BarChart from "../../components/BarChart/BarChart";
import CardDashboard from "../../components/CardDashboard/CardDashboard";
import LineChart from "../../components/LineChart/LineChart";
import "./Dashboard.css";
import { FaDollarSign } from "react-icons/fa";
import MyCalendar from "../../components/Calender/Calender";
import NotificationDashboard from "../../components/NotificationCard/NotificationCard";
import { Link, useNavigate  } from "react-router-dom";
import ApiService from "../../services/apiService";
import ReactSelect from 'react-select';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const Dashboard = () => {
  // Thông tin linechart gian lận
  //const labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"];
  //const dataPoints = [10, 20, 30, 65, 113, 155, 96, 35, 25, 15];
  const [listOrganizeExam, setListOrganizeExam] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRoom, setTotalRoom] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [role, setRole] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  //const subjectOptions = [/*...*/];
  const [totalCandidate, setTotalCandidate] = useState(0);
  const [totalOthers, setTotalOthers] = useState(0);
  const [organizeExamOptions, setOrganizeExamOptions] = useState([]);
  const [organizeExamChosen, setOrganizeExamChosen] = useState();
  const [subjectName, setSubjectName] = useState("");
  const [dataPoints, setDataPoints] = useState([])
  const [labels, setLabels] = useState([])
  const [organizeExamId, setOrganizeExamId] = useState(null);
  const [scoreDistributionArray, setScoreDistributionArray] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [subjectId, setSubjectId] = useState(null);
  const [countCandidate, setCountCandidate] = useState(0);
  const [countStaffLecturerSupervisor, setCountStaffLecturerSupervisor] = useState(0);
  const [countOrganizeExamDone, setCountOrganizeExamDone] = useState(0);
  const [countRoom, setCountRoom] = useState(0);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get('/organize-exams', {
        params: { page, pageSize, keyword },
      });
      setListOrganizeExam(response.data.organizeExams);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const fetchDataRoom = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get('/rooms', {
        params: { page, pageSize, keyword },
      });
      setTotalRoom(response.data.total);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const fetchNumber = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get('/statistics/dashboard-statistic');
      setCountCandidate(response.data.countCandidate);
      setCountStaffLecturerSupervisor(response.data.countStaffLecturerSupervisor);
      setCountOrganizeExamDone(response.data.countOrganizeExamDone);
      setCountRoom(response.data.countRoom);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchNumber();
  }, []);

  /*useEffect(() => {
    const fetchOrganizeExamOptions = async () => {
      try {
        const response = await ApiService.get("/organize-exams");
        const options = response.data.organizeExams.map((item) => ({
          value: item.id,
          label: item.organizeExamName
        }));
        setOrganizeExamOptions(options);
        if (options.length > 0) {
        // ✅ Chọn kỳ thi đầu tiên (mới nhất)
        const latestExam = options[0];
        setOrganizeExamChosen(latestExam.value);
        setOrganizeExamId(latestExam.value);
        fetchChart(latestExam.value);
      }
      } catch (error) {
        console.error("Failed to fetch organize options: ", error);
      }
    };

    fetchOrganizeExamOptions();
  }, []);*/

  useEffect(() => {
    if (!subjectId) return;
    const fetchOrganizeExamOptions = async () => {
      try {
        const response = await ApiService.get("/organize-exams/options", {
          params: { subjectId: subjectId, status: "done" },
        });
        const options = response.data.map((item) => ({
          value: item.id,
          label: item.organizeExamName
        }));
        setOrganizeExamOptions(options);
        if (options.length > 0) {
          // ✅ Chọn kỳ thi đầu tiên khi đổi môn
          const latestExam = options[0];
          setOrganizeExamId(latestExam.value);
          fetchChart(latestExam.value);
        } else {
          setOrganizeExamId(null); // Nếu môn đó chưa có kỳ thi
        }
      } catch (error) {
        console.error("Failed to fetch organize options: ", error);
      }
    };

    fetchOrganizeExamOptions();
  }, [subjectId]);

  useEffect(() => {
    const fetchSubjectOptions = async () => {
      try {
        const response = await ApiService.get("/subjects/options");
        const options = response.data.map((item) => ({
          value: item.id,
          label: item.subjectName
        }));
        setSubjectOptions(options);
        if (options.length > 0) {
          setSubjectId(options[0].value);
          setSubjectName(options[0].label);
        }
      } catch (error) {
        console.error("Failed to fetch subject options: ", error);
      }
    };

    fetchSubjectOptions();
  }, []);

  useEffect(() => {
    if (organizeExamId) {
      fetchChart(organizeExamId);
    }
  }, [organizeExamId]);

  useEffect(() => {
    fetchChart(organizeExamId);
  }, [organizeExamId]);

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

  const fetchChart = async (id) => {
    setIsLoading(true);
    try {
      const response = await ApiService.get(`/statistics/get-update-organize-exam-grade-stats?organizeExamId=${id}`);
      setSubjectName(response.data.data.subjecName);
      
      const { array, ranges, counts } = convertBinsToArray(response.data.data.scoreDistribution);
      setScoreDistributionArray(array);
      setLabels(ranges);
      setDataPoints(counts);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, keyword]);

  return (
    <div className="dashboard-page p-4">
      <div className="justify-between gap-4 w-full card-dash">
        <CardDashboard
          title="Số lượng thí sinh"
          value={"+ " + countCandidate}
          icon={<i className="fa-solid fa-users"></i>}
        />
        <CardDashboard
          title="Cán bộ nhân viên"
          value={"+ " + countStaffLecturerSupervisor}
          icon={<i className="fa-solid fa-chalkboard-user"></i>}
        />
        <CardDashboard
          title="Kỳ thi đã tổ chức"
          value={"+ " + countOrganizeExamDone}
          icon={<i className="fa-solid fa-calendar"></i>}
        />
        <CardDashboard
          title="Số lượng phòng thi"
          value={"+ " + countRoom}
          icon={<i className="fa-solid fa-door-open"></i>}
        />
      </div>
      {/* Biểu đồ đường - Gian lận qua từng kỳ thi */}
      <div className="content-1">
        <div className="left-panel">
          <div className="barchart-score">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="m-0 ps-3 pt-3 fw-bold">Tỷ lệ phân bố điểm: {subjectName}</p>
              </div>
              <div className="d-flex gap-2 pt-3 pe-3">
                {/* <select className="form-select form-select-sm" aria-label="Small select example"
                  style={{width:'170px'}}
                >
                  <option selected>Môn học</option>
                  <option value="1">Giải tích 1</option>
                  <option value="2">Triết học</option>
                  <option value="3">Thiết kế giao diện người dùng</option>
                </select> */}
                {/* <ReactSelect
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Chọn phân môn"
                  options={subjectOptions}
                  onChange={(selectedOption) => 
                    setExamData({...examData, subjectId: selectedOption?.value})
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: "30px",        // Chiều cao tổng thể
                      fontSize: "13px",
                      width: "200px",
                      minHeight: "30px",
                      borderRadius: "6px"
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      height: "30px",
                      padding: "0 8px",       // Tuỳ chỉnh padding nếu cần
                      display: "flex",
                      alignItems: "center",   // Căn giữa nội dung theo chiều dọc
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: "30px",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}								
                /> */}
                {/* <ReactSelect
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Chọn kỳ thi"
                  options={subjectOptions}
                  onChange={(selectedOption) => 
                    setExamData({...examData, subjectId: selectedOption?.value})
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: "30px",        // Chiều cao tổng thể
                      fontSize: "13px",
                      width: "250px",
                      minHeight: "30px",
                      borderRadius: "6px"
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      height: "30px",
                      padding: "0 8px",       // Tuỳ chỉnh padding nếu cần
                      display: "flex",
                      alignItems: "center",   // Căn giữa nội dung theo chiều dọc
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: "30px",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}								
                /> */}
                <Autocomplete
                  className="ms-2"
                  options={subjectOptions} 
                  getOptionLabel={(option) => option.label}
                  value={
                    subjectOptions.find((opt) => opt.value === subjectId) || null
                  }
                  onChange={(event, newValue) => {
                    setSubjectId(newValue?.value || null);
                    setSubjectName(newValue?.label || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn phân môn"
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        minWidth: 220,
                        "& .MuiInputBase-root": {
                          height: "40px",
                          width: "220px",
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
                  className="ms-2"
                  options={organizeExamOptions} 
                  getOptionLabel={(option) => option.label}
                  value={
                    organizeExamOptions.find((opt) => opt.value === organizeExamId) || null
                  }
                  onChange={(event, newValue) => setOrganizeExamId(newValue?.value || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn kỳ thi"
                      size="small"
                      sx={{
                        backgroundColor: "white",
                        minWidth: 220,
                        "& .MuiInputBase-root": {
                          height: "40px",
                          width: "250px",
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
              </div>
            </div>
            <BarChart
              title="Số lượng thí sinh"
              labels={labels}
              dataPoints={dataPoints}
              width="100%"
              height="350px"
            />
          </div>

          <div className="pt-4" >
            <div className="d-flex justify-content-between align-items-center">
              <p className="fw-bold m-0" style={{fontSize: "18px"}}>Danh sách kỳ thi</p>
              <div className="d-flex align-items-center all-btn"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/staff/organize")}
              >
                <p className="m-0" style={{color: '#545454'}}>Hiển thị tất cả</p>
                <i className="fa-solid fa-angle-right ms-2" aria-hidden="true" style={{ color: "#545454" }}></i>
              </div>
            </div>

            <div className="organize-dash mt-3 p-2">
              <div className="organize-examtable-container">
                <div className="table-responsive">
                  <table className="table organize-exam-table sample-table tbl-organize-hover table-hover" style={{fontSize: "14px"}}>
                    <thead>
                      <tr className="align-middle fw-medium">
                        <th className="text-center">STT</th>
                        <th>Kỳ thi</th>
                        <th>Phân môn</th>
                        <th className="text-center">Thời gian (M)</th>
                        <th className="text-center">Trạng thái</th>
                        <th className="text-center">Báo cáo</th>
                      </tr>
                    </thead>
                    <tbody>
                    {listOrganizeExam.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="text-center fw-semibold text-muted"
                            style={{ height: "100px", verticalAlign: "middle" }}>
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      listOrganizeExam.slice(0, 5).map((item, index) => (
                        <tr key={item.id} className="align-middle">
                          <td
                            onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
                              state: { organizeExamName: item.organizeExamName },
                            })}
                            style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
                            className="text-center"
                          >
                            {index + 1}
                          </td>
                          <td
                            onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
                              state: { organizeExamName: item.organizeExamName },
                            })}
                            style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
                            className="text-hover-primary"
                          >
                            {item.organizeExamName}
                          </td>
                          <td
                            onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
                              state: { organizeExamName: item.organizeExamName },
                            })}
                            style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
                          >
                            {item.subjectName}
                          </td>
                          <td
                            onClick={() => navigate(`/staff/organize/${encodeURIComponent(item.id)}`, {
                              state: { organizeExamName: item.organizeExamName },
                            })}
                            style={{ cursor: "pointer", textDecoration: "none", color: "black" }}
                            className="text-center"
                          >
                            {item.duration/60}
                          </td>
                          <td>
                          <div className="form-check form-switch d-flex align-items-center justify-content-center" >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              checked={item.organizeExamStatus.toLowerCase() === "active"}
                              onChange={() =>
                                handleToggleStatus(item.id, item.organizeExamStatus)
                              }
                            />
                            <span className={`badge ms-2 mt-1 ${item.organizeExamStatus === "Active" || "available" ? "bg-primary" : "bg-secondary"}`}>
                              {item.organizeExamStatus === "Active" || "available" ? "Kích hoạt" : "Đóng"}
                            </span>
                          </div>
                        </td>
                          <td className="text-center">
                            <Link
                              to={`/staff/organize/report/${item.id}`}     
                              style={{ color: "blue", cursor: "pointer" }}
                              className="report-hover"
                            >
                              Chi tiết
                            </Link>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>               
              </div>
            </div>

          </div>
        </div>
        
        <div className="calendar p-2">
          <MyCalendar
          />
          <hr className="border-top border-secondary opacity-25 my-3" />
          <div className="ps-3 mb-3 d-flex justify-content-between align-items-center">
            <p className="fw-bold m-0">Thông báo</p>
          </div>
          <div className="ps-3">
            <NotificationDashboard/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
