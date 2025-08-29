import React, {useRef, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ReportEachOrganizePage.css";
import BarChart from "../../components/BarChart/BarChart";
import { useReactToPrint } from "react-to-print"; // Import thư viện
import ApiService from "../../services/apiService";

const ReportEachOrganizePage = () => {
  const [chartImage, setChartImage] = useState(null);
  const { organizeExamId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [organizeExamName, setOrganizeExamName] = useState([]);
  const [subjecName, setSubjecName] = useState([]);
  const [totalCandidate, setTotalCandidate] = useState([]);
  const [maxScore, setMaxScore] = useState([]);
  const [minScore, setMinScore] = useState([]);
  const [averageScore, setAverageScore] = useState([]);
  const [scoreDistributionArray, setScoreDistributionArray] = useState([]);

  const [dataPoints, setDataPoints] = useState([])
  const [labels, setLabels] = useState([])

  const [belowFiveCount, setBelowFiveCount] = useState(0);
  const [belowFivePercent, setBelowFivePercent] = useState("0%");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/statistics/get-update-organize-exam-grade-stats", {
        params: { organizeExamId: organizeExamId },
      });
      setOrganizeExamName(response.data.data.organizeExamName);
      setSubjecName(response.data.data.subjectName);
      setTotalCandidate(response.data.data.totalCandidates);
      setMaxScore(response.data.data.maxScore);
      setMinScore(response.data.data.minScore);
      setAverageScore(response.data.data.averageScore);

      const count = getBelowFiveCount(response.data.data.scoreDistribution);
      setBelowFiveCount(count);
      setBelowFivePercent(((count / response.data.data.totalCandidates) * 100).toFixed(2) + "%");
      
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
  }, [organizeExamId]);

  const getBelowFiveCount = (scoreDistribution) => {
    let count = 0;
    for (const [key, value] of Object.entries(scoreDistribution)) {
      const match = key.match(/bin(\d+)_(\d+)/);
      if (match) {
        const end = parseInt(match[2], 10);
        if (end <= 5) {
          count += value;
        }
      }
    }
    return count;
  };

  const convertBinsToArray = (obj) => {
    const arr = Object.entries(obj)
      .map(([key, value]) => {
        const match = key.match(/bin(\d+)_(\d+)/);
        if (match) {
          const start = match[1];
          const end = match[2];
          return {
            range: `${start} đến <${end}`,
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

  const handlePrint = () => {
    const printContent = document.getElementById("printable-report-table").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); 
  };

  const calculatePercentage = (count, total) => ((count / total) * 100).toFixed(2) + "%";
  
  console.log(scoreDistributionArray);
  console.log(labels);
  console.log(dataPoints);

  return (
    <div className="p-4">
      <nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
        <Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
        <span className="ms-2 me-3"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-between">
          <Link to="/staff/organize" className="breadcrumb-between">Quản lý kỳ thi</Link></span>
        <span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
        <span className="breadcrumb-current"> Báo cáo</span>
      </nav>

      <div 
        className="print-button-fixed"
      >
        <button 
          className="btn btn-primary" 
          style={{ fontSize: "14px" }} 
          onClick={handlePrint}
        >
          <i className="fas fa-print me-2 mt-1"></i>
          In báo cáo
        </button>
      </div>

      <div className="border container" id="printable-report-table" 
        style={{ 
          width: "21cm", 
          minHeight: "29.7cm", 
          padding: "2cm", 
          backgroundColor: "white",
          boxSizing: "border-box" 
        }}
      >
        {!isLoading ? (
          <>
            <div className="report-header" style={{fontSize: "14px"}}>
              <div>
              <h6>TRƯỜNG ĐẠI HỌC ABC</h6>
              <p>PHÒNG ĐẢM BẢO CHẤT LƯỢNG</p>
              <hr className="underline-report container"></hr>
              </div>
              <div>
              <h6>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h6>
              <p>Độc lập - Tự do - Hạnh phúc</p>
              <hr className="underline-report container"></hr>
              </div>
            </div>

            <h4 className="report-title">BÁO CÁO KẾT QUẢ PHÂN TÍCH PHỔ ĐIỂM</h4>

            <h6 style={{ fontSize: "14px" }}>1. Thông tin chung</h6>
            <div className="mb-1 ms-3" style={{ fontSize: "14px" }}>
              <p className="mb-0"><strong>- Kỳ thi: </strong>{organizeExamName}</p>
              <p className="mb-0"><strong>- Môn học: </strong>{subjecName}</p>
            </div>

            <p style={{ fontSize: "14px" }} className="mb-1">2. Báo cáo chung kết quả phân tích phổ điểm</p>
            <p style={{ fontSize: "14px" }} className="mb-2">2.1 Bảng tần số</p>
            <table className="table table-bordered table-custom-score table-custom-freq">
              <thead>
                <tr>
                  <th>Phổ điểm</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-center">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                {scoreDistributionArray.map((item, index) => (
                  <tr key={index}>
                    <td>{item.range}</td>
                    <td className="text-center">{item.count}</td>
                    <td className="text-center">{calculatePercentage(item.count, totalCandidate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h6 className="mt-3 mb-2" style={{ fontSize: "14px" }} >2.2 Phổ điểm</h6>
            {chartImage ? (
              <img src={chartImage} alt="Biểu đồ phổ điểm" style={{ width: "100%" }} />
            ) : (
              <BarChart
                title="Tỷ lệ phân bố điểm"
                labels={labels}
                dataPoints={dataPoints}
                width="100%"
                height="300px"
                isShowLegend={false}
                onImageGenerated={setChartImage}
                convertToImage={true} 
              />
            )}

            <h6 className="mt-3 mb-3" style={{ fontSize: "14px" }} >2.3 Một số chỉ số thống kê cơ bản</h6>
            <table className="table table-bordered table-custom-score tbl-analyse">
              <thead>
              <tr>
                <th>Tiêu chí</th>
                <th className="text-center">Giá trị</th>
                <th className="text-center">Phần trăm</th>
              </tr>
              </thead>
              <tbody>
                <tr className="text-center"><td>Tổng số sinh viên dự thi</td><td>{totalCandidate}</td><td>100%</td></tr>
                <tr className="text-center"><td>Điểm trung bình</td><td>{averageScore}</td><td>-</td></tr>
                <tr className="text-center">
                  <td>Điểm cao nhất</td>
                  <td>{Number(maxScore).toFixed(2)}</td>
                  <td>-</td>
                </tr>
                <tr className="text-center"><td>Điểm thấp nhất</td><td>{minScore}</td><td>-</td></tr>
                {/* <tr className="text-center"><td>Điểm số nhiều thí sinh đạt nhất</td><td>{sampleReportData.mostCommonScore}</td><td>-</td></tr> */}
                <tr className="text-center"><td>Số sinh viên đạt &lt;5</td><td>{belowFiveCount}</td><td>{belowFivePercent}</td></tr>
              </tbody>
            </table>
          </>
      ) : (
        <div className="text-center" style={{ fontSize: "14px" }}>
          <i className="fa fa-spinner fa-spin fa-3x"></i>
          <p>Đang tải dữ liệu...</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default ReportEachOrganizePage;
