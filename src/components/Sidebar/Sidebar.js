import React, { useState } from 'react';
import { FaBars, FaUserCog, FaQuestionCircle, FaThLarge, FaFileAlt, FaBuilding } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
            {/* Nút Toggle Menu */}
            <button className="toggle-btn" onClick={toggleSidebar}>
                <FaBars />
            </button>

            {/* Danh sách menu */}
            <ul className="menu-list">
                <li data-title="Dashboard"><FaThLarge className="icon" /> <span>Dashboard</span></li>
                <li data-title="Quản lý tài khoản"><FaUserCog className="icon" /> <span>Quản lý tài khoản</span></li>
                <li data-title="Quản lý kỳ thi"><FaThLarge className="icon" /> <span>Quản lý kỳ thi</span></li>
                <li data-title="Ngân hàng câu hỏi"><FaQuestionCircle className="icon" /> <span>Ngân hàng câu hỏi</span></li>
                <li data-title="Quản lý ma trận đề"><FaThLarge className="icon" /> <span>Quản lý ma trận đề</span></li>
                <li data-title="Quản lý đề thi"><FaFileAlt className="icon" /> <span>Quản lý đề thi</span></li>
                <li data-title="Quản lý phòng thi"><FaBuilding className="icon" /> <span>Quản lý phòng thi</span></li>
            </ul>
        </div>
    );
};

export default Sidebar;
