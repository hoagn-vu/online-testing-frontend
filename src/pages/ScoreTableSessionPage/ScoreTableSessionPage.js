import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ScoreTableSessionPage.css";

const ScoreTableSessionPage = () => {
  const listCandidate = [
    { candidateId: "CAND001", fullName: "Hoàng Nguyên Vũ", firstName: "Vũ", score: 9.0, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
    { candidateId: "CAND002", fullName: "Ngô Đức Thuận", firstName: "Thuận", score: 8.5, signature: "", note: "" },
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
    <div className="exam-management-page">
      <nav className="mb-4">
        <a href="/admin">Home</a> / <span className="breadcrumb-current">Quản lý kỳ thi</span>
      </nav>

      {/* Bảng điểm hiển thị luôn trên trang */}
      <div className="score-table-container p-4 border" id="printable-score-table">
        {/* Quốc hiệu - Trường học */}
        <div className="d-flex justify-content-between text-center mb-3">
          <div>
            <h6 className="fw-bold">TRƯỜNG ĐẠI HỌC CMC</h6>
            <p>Phòng đảm bảo chất lượng</p>
          </div>
          <div>
            <h6 className="fw-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h6>
            <p>Độc lập - Tự do - Hạnh phúc</p>
          </div>
        </div>

        {/* Thông tin kỳ thi */}
        <div className="text-center mb-4">
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
              <th>STT</th>
              <th>Họ và tên đệm</th>
              <th>Tên</th>
              <th>Điểm số</th>
              <th>Chữ ký</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {listCandidate.map((student, index) => (
              <tr key={student.candidateId}>
                <td>{index + 1}</td>
                <td>{student.fullName}</td>
                <td>{student.firstName}</td>
                <td>{student.score}</td>
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

      {/* Nút in bảng điểm */}
      <div className="mt-3 text-center">
        <button className="btn btn-primary" onClick={handlePrint}>In bảng điểm</button>
      </div>
    </div>
  );
};

export default ScoreTableSessionPage;
