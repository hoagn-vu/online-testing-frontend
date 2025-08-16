import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ScoreTableSessionPage.css";
import Print from "@mui/icons-material/Print";
import { Link, useParams, useLocation } from "react-router-dom";
import ApiService from "../../services/apiService";

const ScoreTableSessionPage = () => {
  const { organizeId, sessionId } = useParams();
  const { roomId } = useParams();
  const location = useLocation();
  const { sessionNameFromLocate} = location.state || {};
  const organizeExamNameFromLocate = location.state?.organizeExamName || localStorage.getItem("organizeExamName");
  const [isLoading, setIsLoading] = useState(false);
  const [listCandidateWithResult, setListCandidateWithResult] = useState([]);
  const [subjectName, setSubjectName] = useState([]);
  const [organizeName, setOrganizeName] = useState([]);
  const [roomName, setRoomName] = useState([]);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await ApiService.get("/trackexam/get-report-info", {
        params: { 
					organizeExamId: organizeId, 
					sessionId: sessionId, 
          roomId: roomId,
        },
      });
      setListCandidateWithResult(response.data.candidates);
      setSubjectName(response.data.subjectName);
      setOrganizeName(response.data.organizeName);
      setRoomName(response.data.roomName);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [organizeId, sessionId, roomId]);

  const processData = (data) => {
    return data.map((item) => {
      const nameParts = item.fullName.trim().split(" ");
      const firstName = nameParts.pop(); // Lấy phần cuối cùng là firstName
      const lastName = nameParts.join(" "); // Phần còn lại là lastName
      return {
        ...item,
        firstName, 
        lastName
      };
    });
  };

  // Hàm chỉ in nội dung bảng điểm
  const handlePrint = () => {
    const printContent = document.getElementById("printable-score-table").innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Load lại trang để tránh lỗi hiển thị sau in
  };

  return (
    <div className="p-4">
			<nav className="breadcrumb-container mb-3" style={{fontSize: "14px"}}>
				<Link to="/" className="breadcrumb-link"><i className="fa fa-home pe-1" aria-hidden="true"></i> </Link> 
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
					<Link to="/staff/organize" className="breadcrumb-between">Quản lý kỳ thi</Link></span>
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-between">
				<Link 
					to={`/staff/organize/${organizeId}`} 
					state={{ organizeExamName: organizeExamNameFromLocate }} 
					className="breadcrumb-between">
					{organizeExamNameFromLocate}
				</Link></span>
				<span className="ms-2 me-2"><i className="fa fa-chevron-right fa-sm" aria-hidden="true"></i></span>
				<span className="breadcrumb-current">In bảng điểm</span>
			</nav>

      {/* Nút in bảng điểm */}
      <div className="mt-2 mb-3 d-flex ms-auto justify-content-end">
        {/* <Print onClick={handlePrint}></Print> */}
        <button className="btn btn-primary" style={{fontSize: "14px"}} onClick={handlePrint}>
          <i className="fas fa-print me-2 mt-1 "></i> 
          In bảng điểm</button>
      </div>

      {/* Bảng điểm hiển thị luôn trên trang */}
      <div className="score-table-container p-4 border container" id="printable-score-table">
        <div className="d-flex justify-content-between text-center mb-3" style={{fontSize: "14px"}}>
          <div>
            <h6 className="fw-bold">TRƯỜNG ĐẠI HỌC ABC</h6>
            <p>PHÒNG ĐẢM BẢO CHẤT LƯỢNG</p>
            <hr className="underline-report container"></hr>
          </div>
          <div>
            <h6 className="fw-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h6>
            <p>Độc lập - Tự do - Hạnh phúc</p>
            <hr className="underline-report container"></hr>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <span>Ngày</span><span className="ms-5 me-5">tháng</span><span>năm</span>
        </div>
        {/* Thông tin kỳ thi */}
        <div className="text-center mb-3">
          <h5 className="fw-bold">KẾT QUẢ THI</h5>
        </div>
        <div >
          <p className="mb-1"><strong>Kỳ thi:</strong> {organizeName}</p>
          <p className="mb-1"><strong>Phòng thi:</strong> {roomName}</p>
          <p><strong>Môn thi:</strong> {subjectName}</p>
        </div>

        {/* Bảng điểm */}
        <table className="table table-bordered table-custom-score">
          <thead className="table-dark">
            <tr>
              <th className="text-center">STT</th>
              <th>MSSV</th>
              <th>Họ và tên đệm</th>
              <th>Tên</th>
              <th className="text-center">Điểm số</th>
              <th className="text-center">Chữ ký</th>
              <th className="text-center">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {processData(listCandidateWithResult).map((student, index) => (
              <tr key={student.userId}>
                <td className="text-center">{index + 1}</td>
                <td>{student.userCode}</td>
                <td>{student.lastName}</td>
                <td>{student.firstName}</td>
                <td className="text-center">{student.totalScore}</td>
                <td>{student.signature}</td>
                <td>{student.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Chữ ký giám thị */}
        <div className="text-end mt-4">
          <p className="me-5 mb-1"><strong>Giám thị</strong></p>
          <p>(Ký và ghi rõ họ tên)</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreTableSessionPage;
