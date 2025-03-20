import React, {useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ReportEachOrganizePage.css";
import BarChart from "../../components/BarChart/BarChart";
import { useReactToPrint } from "react-to-print"; // Import thư viện

const ReportEachOrganizePage = () => {
  const [chartImage, setChartImage] = useState(null);

  const handlePrint = () => {
    const printContent = document.getElementById("printable-report-table").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); 
  };

  // const labels = ["0 đến <1", "1 đến <2", "2 đến <3", "3 đến <4", "4 đến <5", "5 đến <6", "6 đến <7", "7 đến <8", "8 đến <9", "9 đến <10"];
  // const dataPoints = [10, 20, 30, 25, 15, 35,10, 20, 50, 25];
  
  const sampleReportData = {
    organizeExamName: "Kỳ thi cuối kỳ",
    subjectName: "Giải tích",
    totalRoom: 8,
    scoreDistribution: [
      { range: "0 đến <1", count: 5 },
      { range: "1 đến <2", count: 10 },
      { range: "2 đến <3", count: 15 },
      { range: "3 đến <4", count: 25 },
      { range: "4 đến <5", count: 30 },
      { range: "5 đến <6", count: 20 },
      { range: "6 đến <7", count: 18 },
      { range: "7 đến <8", count: 12 },
      { range: "8 đến <9", count: 8 },
      { range: "9 đến <10", count: 7 },
    ],
    totalStudents: 150,
    avgScore: 5.8,
    maxScore: 9.5,
    minScore: 0.5,
    mostCommonScore: 5,
    belowFiveCount: 45,
  };
  
  // Tính tỷ lệ phần trăm dựa trên tổng số sinh viên
  const calculatePercentage = (count, total) => ((count / total) * 100).toFixed(2) + "%";
  
  const labels = sampleReportData.scoreDistribution.map(item => item.range);
  const dataPoints = sampleReportData.scoreDistribution.map(item => item.count);
  
  return (
    <div className="container-report-organize">
      <nav className="mb-2">
        <a href="/admin">Home</a> / <span className="breadcrumb-current">Quản lý kỳ thi</span>
      </nav>

      <div className="mb-3 d-flex ms-auto justify-content-end">
        {/* <Print onClick={handlePrint}></Print> */}
        <button className="btn btn-primary" style={{fontSize: "14px"}} onClick={handlePrint}>
          <i className="fas fa-print me-2 mt-1 "></i>  
          In báo cáo</button>
      </div>

      <div className="border container" id="printable-report-table" 
        style={{ 
          width: "21cm", 
          minHeight: "29.7cm", 
          padding: "2cm", 
          backgroundColor: "white",
          boxSizing: "border-box" 
        }}>
        <div className="report-header" style={{fontSize: "14px"}}>
            <div>
            <h6>TRƯỜNG ĐẠI HỌC CMC</h6>
            <p>PHÒNG ĐẢM BẢO CHẤT LƯỢNG</p>
            <hr className="underline-report container"></hr>
            </div>
            <div>
            <h6>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h6>
            <p>Độc lập - Tự do - Hạnh phúc</p>
            <hr className="underline-report container"></hr>
            </div>
        </div>

        {/* Tiêu đề báo cáo */}
        <h4 className="report-title">BÁO CÁO KẾT QUẢ PHÂN TÍCH PHỔ ĐIỂM</h4>

        {/* Thông tin chung */}
        <h6 style={{ fontSize: "14px" }}>1. Thông tin chung</h6>
        <div className="mb-1 ms-3" style={{ fontSize: "14px" }}>
          <p className="mb-0"><strong>- Kỳ thi: </strong>{sampleReportData.organizeExamName}</p>
          <p className="mb-0"><strong>- Môn học: </strong>{sampleReportData.subjectName}</p>
          <p className="mb-0"><strong>- Tổng số lớp: </strong>{sampleReportData.totalRoom}</p>
        </div>

        {/* Bảng tần số */}
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
              {sampleReportData.scoreDistribution.map((item, index) => (
                <tr key={index}>
                  <td>{item.range}</td>
                  <td className="text-center">{item.count}</td>
                  <td className="text-center">{calculatePercentage(item.count, sampleReportData.totalStudents)}</td>
                </tr>
              ))}
            </tbody>
        </table>

        {/* Biểu đồ phổ điểm */}
        <h6 className="mt-3 mb-0" style={{ fontSize: "14px" }} >2.2 Phổ điểm</h6>
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


        {/* Chỉ số thống kê cơ bản */}
        <h6 className="mt-3 mb-2" style={{ fontSize: "14px" }} >2.3 Một số chỉ số thống kê cơ bản</h6>
        <table className="table table-bordered table-custom-score tbl-analyse">
            <thead>
            <tr>
                <th>Tiêu chí</th>
                <th className="text-center">Giá trị</th>
                <th className="text-center">Phần trăm</th>
            </tr>
            </thead>
            <tbody>
              <tr className="text-center"><td>Tổng số sinh viên dự thi</td><td>{sampleReportData.totalStudents}</td><td>100%</td></tr>
              <tr className="text-center"><td>Điểm trung bình</td><td>{sampleReportData.avgScore}</td><td>-</td></tr>
              <tr className="text-center"><td>Điểm cao nhất</td><td>{sampleReportData.maxScore}</td><td>-</td></tr>
              <tr className="text-center"><td>Điểm thấp nhất</td><td>{sampleReportData.minScore}</td><td>-</td></tr>
              <tr className="text-center"><td>Điểm số nhiều thí sinh đạt nhất</td><td>{sampleReportData.mostCommonScore}</td><td>-</td></tr>
              <tr className="text-center"><td>Số sinh viên đạt &lt;5</td><td>{sampleReportData.belowFiveCount}</td><td>{calculatePercentage(sampleReportData.belowFiveCount, sampleReportData.totalStudents)}</td></tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportEachOrganizePage;
