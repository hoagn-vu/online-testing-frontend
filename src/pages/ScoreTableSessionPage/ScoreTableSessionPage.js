import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ScoreTableSessionPage.css";
import Print from "@mui/icons-material/Print";


const ScoreTableSessionPage = () => {
  const listCandidate = [
    { candidateId: "CAND001", userCode: "BIT220172", fullName: "Hoàng Nguyên Vũ", firstName: "Vũ", score: 9.0, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220089", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220025", fullName: "Phan Thị Phương", firstName: "Linh", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220005", fullName: "Hoàng", firstName: "Mai", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220002", fullName: "Ngô Đức Minh", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220001", fullName: "Nguyễn Mai", firstName: "Anh", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220080", fullName: "Mai Đức", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220081", fullName: "Ngô Đức", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220085", fullName: "Phùng Đức", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220096", fullName: "Ngô Đức", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220115", fullName: "Nguyễn Đức", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220125", fullName: "Phạm Đức", firstName: "Vũ", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220147", fullName: "Ngô Đức", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220135", fullName: "Hoàng Đức", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220144", fullName: "Ngô Đức", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220202", fullName: "Lê Đức", firstName: "Hoàng", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220222", fullName: "Ngô Đức", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", userCode: "BIT220258", fullName: "Lê Đức", firstName: "Minh", score: 8.5, signature: "", note: "" },
    
  ];

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
    <div className="container-score-room">
      <nav className="mb-4">
        <a href="/admin">Home</a> / <span className="breadcrumb-current">Quản lý kỳ thi</span>
      </nav>

      {/* Nút in bảng điểm */}
      <div className="mt-2 mb-3 d-flex ms-auto justify-content-end">
        {/* <Print onClick={handlePrint}></Print> */}
        <button className="btn btn-primary" onClick={handlePrint}>In bảng điểm</button>
      </div>

      {/* Bảng điểm hiển thị luôn trên trang */}
      <div className="score-table-container p-4 border container" id="printable-score-table">
        <div className="d-flex justify-content-between text-center mb-3" style={{fontSize: "14px"}}>
          <div>
            <h6 className="fw-bold">TRƯỜNG ĐẠI HỌC CMC</h6>
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
          <span>Ngày</span><span className="ms-4 me-4">tháng</span><span>năm</span>
        </div>
        {/* Thông tin kỳ thi */}
        <div className="text-center mb-3">
          <h5 className="fw-bold">KẾT QUẢ THI</h5>
        </div>
        <div >
          <p className="mb-1"><strong>Kỳ thi:</strong> Cuối kỳ</p>
          <p className="mb-1"><strong>Phòng thi:</strong> 101</p>
          <p><strong>Môn thi:</strong> Toán cao cấp</p>
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
            {listCandidate.map((student, index) => (
              <tr key={student.candidateId}>
                <td className="text-center">{index + 1}</td>
                <td>{student.userCode}</td>
                <td>{student.fullName}</td>
                <td>{student.firstName}</td>
                <td className="text-center">{student.score}</td>
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
