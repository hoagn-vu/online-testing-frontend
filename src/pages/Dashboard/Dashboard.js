import React, { useState, useEffect, useRef } from "react";
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import {Chip, Box, Button, Grid, MenuItem, Select, IconButton, TextField, Pagination, NumberInput, FormControl, FormGroup, FormControlLabel, Typography, duration } from "@mui/material";
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
  const labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"];
  const dataPoints = [10, 20, 30, 65, 113, 155, 96, 35, 25, 15];
  const [listOrganizeExam, setListOrganizeExam] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const subjectOptions = [/*...*/];

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

  useEffect(() => {
    fetchData();
  }, [page, pageSize, keyword]);

  return (
    <div className="dashboard-page p-4">
      <div className="justify-between gap-4 w-full card-dash">
        <CardDashboard
          title="Số lượng thí sinh"
          value="+200"
          icon={<i className="fa-solid fa-users"></i>}
        />
        <CardDashboard
          title="Cán bộ nhân viên"
          value="+200"
          icon={<i className="fa-solid fa-chalkboard-user"></i>}
        />
        <CardDashboard
          title="Kỳ thi đã tổ chức"
          value="+200"
          icon={<i className="fa-solid fa-calendar"></i>}
        />
        <CardDashboard
          title="Người dùng mới"
          value="+200"
          icon={<FaDollarSign />}
        />
      </div>
      {/* Biểu đồ đường - Gian lận qua từng kỳ thi */}
      <div className="content-1">
        <div className="left-panel">
          <div className="barchart-score">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="m-0 ps-3 pt-3 fw-bold">Tỷ lệ phân bố điểm: Giải tích 1</p>
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
                <ReactSelect
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
                />
                <ReactSelect
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Chọn kỳ"
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
                      listOrganizeExam.map((item, index) => (
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
                            {item.duration}
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
            <div className="d-flex align-items-center all-btn"
                style={{ cursor: "pointer" }}
              >
              <p className="m-0" style={{color: '#545454'}}>Hiển thị tất cả</p>
              <i className="fa-solid fa-angle-right ms-2" aria-hidden="true" style={{ color: "#545454" }}></i>
            </div>
          </div>
          <div className="ps-3">
            <NotificationDashboard/>
            <NotificationDashboard/>
            <NotificationDashboard/>
            <NotificationDashboard/>
            <NotificationDashboard/>
            <NotificationDashboard/>
            <NotificationDashboard/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
