import React, { useState } from 'react';
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./AccountPage.css";

const dummyAccounts = {
    "Thí sinh": [
        { id: 1, studentId: "SV001", name: "Nguyễn Văn A", dob: "01/01/2000", username: "nguyenvana", status: "active" },
        { id: 2, studentId: "SV002", name: "Trần Thị B", dob: "15/05/2001", username: "tranthib", status: "disabled" },
    ],
    "Giám thị": [
        { id: 3, studentId: "GT001", name: "Lê Văn C", dob: "22/09/1990", username: "levanc", status: "active" },
    ],
    "Quản trị viên": [
        { id: 4, studentId: "QT001", name: "Phạm Thị D", dob: "05/06/1985", username: "phamthid", status: "active" },
    ],
    "Cán bộ phụ trách ca thi": [
        { id: 5, studentId: "CB001", name: "Hoàng Văn E", dob: "12/12/1980", username: "hoangvane", status: "active" },
    ],
};

const AccountPage = () => {
    const [selectedRole, setSelectedRole] = useState("Thí sinh");

    return (
        <div className="account-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumb-container">
                <Link to="/" className="breadcrumb-link">Home</Link>
                <span> / </span>
                <span className="breadcrumb-current">Quản lý tài khoản</span>
            </nav>

            {/* Thanh chọn vai trò */}
            <div className="role-tabs">
                {Object.keys(dummyAccounts).map((role) => (
                    <button
                        key={role}
                        className={`role-tab ${selectedRole === role ? "active" : ""}`}
                        onClick={() => setSelectedRole(role)}
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* Thanh tìm kiếm + Nút thêm mới + Upload */}
            <div className="account-actions">
                <input type="text" placeholder="Tìm kiếm tài khoản..." className="search-box" />
                <button className="add-btn">Thêm mới</button>
                <button className="upload-btn">Upload File</button>
            </div>

            {/* Hiển thị bảng theo vai trò đã chọn */}
            <div className="account-table-container">
                <h5>Danh sách tài khoản {selectedRole}</h5>
                <table className="account-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Mã SV</th>
                            <th>Họ Tên</th>
                            <th>Ngày Sinh</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Trạng thái</th>
                            <th>Chỉnh sửa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyAccounts[selectedRole].map((account, index) => (
                            <tr key={account.id}>
                                <td>{index + 1}</td>
                                <td>{account.studentId}</td>
                                <td>{account.name}</td>
                                <td>{account.dob}</td>
                                <td>{account.username}</td>
                                <td>******</td>
                                <td>
                                    <select defaultValue={account.status}>
                                        <option value="active">Active</option>
                                        <option value="disabled">Disabled</option>
                                    </select>
                                </td>
                                <td>
                                    <button className="edit-btn"><FaEdit /></button>
                                    <button className="delete-btn"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccountPage;
