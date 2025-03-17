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

  // Thông tin linechart gian lận
  const labels = ["0 đến <1", "1 đến <2", "2 đến <3", "3 đến <4", "4 đến <5", "5 đến <6", "6 đến <7", "7 đến <8", "8 đến <9", "9 đến <10"];
  const dataPoints = [10, 20, 30, 25, 15, 35,10, 20, 50, 25];

//   const componentRef = useRef();
//   const printRef = useRef<HTMLDivElement>(null);    
//   const handlePrint = useReactToPrint({
//     documentTitle: 'Title',
//     contentRef: componentRef,
//  })
//   console.log(componentRef.current);
  
  return (
    <div className="container-report-organize">
      <nav className="mb-2">
        <a href="/admin">Home</a> / <span className="breadcrumb-current">Quản lý kỳ thi</span>
      </nav>

      <div className="mb-3 d-flex ms-auto justify-content-end">
        {/* <Print onClick={handlePrint}></Print> */}
        <button className="btn btn-primary" onClick={handlePrint}>In báo cáo</button>
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
        <h6>1. Thông tin chung</h6>
        <div className="mb-3" style={{fontSize: "14px"}}>
            <table className="table table-bordered custom-table-general">
                <tbody>
                    <tr>
                    <td><strong>Học kỳ:</strong> Xuân Năm học 2024-2025</td>
                    <td style={{minWidth: "180px"}}><strong>Ngành:</strong> CNTT&TT</td>
                    </tr>
                    <tr>
                    <td><strong>Tên học phần:</strong> Lập trình Game</td>
                    <td><strong>Tổng số lớp:</strong> 10</td>
                    </tr>
                    <tr>
                    <td colSpan="2"><strong>Kỳ thi:</strong> Kết thúc học phần</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* Bảng tần số */}
        <h6>2. Báo cáo chung kết quả phân tích phổ điểm</h6>
        <h6>2.1 Bảng tần số</h6>
        <table className="table table-bordered table-custom-score table-custom-freq">
            <thead>
                <tr>
                    <th>Phổ điểm</th>
                    <th>Số lượng</th>
                    <th>Tỷ lệ</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>0 đến &lt;1</td><td> 10 </td><td> 12% </td></tr>
                <tr><td>1 đến &lt;2</td><td> 10 </td><td> 12% </td></tr>
                <tr><td>2 đến &lt;3</td><td> 10 </td><td> 12% </td></tr>
                <tr><td>3 đến &lt;4</td><td> 10 </td><td> 12% </td></tr>
                <tr><td>4 đến &lt;5</td><td> 10 </td><td> 12% </td></tr>
                <tr><td>5 đến &lt;6</td><td> 10 </td><td> 12% </td></tr>
                <tr><td>6 đến &lt;7</td><td> 10 </td><td> 12% </td></tr>
                <tr><td>7 đến &lt;8</td><td> 10 </td><td> 12% </td></tr>
                <tr><td>8 đến &lt;9</td><td> 10 </td><td> 12% </td></tr>
                <tr><td>9 đến &lt;10</td><td> 10 </td><td> 12% </td></tr>
            </tbody>
        </table>

        {/* Biểu đồ phổ điểm */}
        <h6 className="mt-2">2.2 Phổ điểm</h6>
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
        <h6 className="mt-2">2.3 Một số chỉ số thống kê cơ bản</h6>
        <table className="table table-bordered table-custom-score tbl-analyse">
            <thead>
            <tr>
                <th>Tiêu chí</th>
                <th>Giá trị</th>
                <th>Phần trăm</th>
            </tr>
            </thead>
            <tbody>
              <tr><td>Tổng số sinh viên dự thi</td><td>--</td><td>--</td></tr>
              <tr><td>Điểm trung bình</td><td>--</td><td>--</td></tr>
              <tr><td>Điểm cao nhất</td><td>--</td><td>--</td></tr>
              <tr><td>Điểm thấp nhất</td><td>--</td><td>--</td></tr>
              <tr><td>Điểm số nhiều thí sinh đạt nhất</td><td>--</td><td>--</td></tr>
              <tr><td>Số sinh viên đạt &lt;5</td><td>--</td><td>--</td></tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportEachOrganizePage;
