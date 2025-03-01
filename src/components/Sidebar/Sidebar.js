import React, { useState, useEffect } from 'react';
import { FaBars, FaUserCog, FaQuestionCircle, FaThLarge, FaFileAlt, FaBuilding } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sidebar.css';
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation(); // Lấy URL hiện tại
    const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Theo dõi thay đổi kích thước màn hình
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>

            {/* Danh sách menu */}
            <ul className="menu-list">
                <li data-title="Dashboard"><FaThLarge className="icon" /> <span>Dashboard</span></li>
                <li className={location.pathname === "/admin/accountmanage" ? "active" : ""} 
                data-title="Quản lý tài khoản">
                <FaUserCog className="icon" />
                    <Link to="/admin/accountmanage"><span>Quản lý tài khoản</span></Link>
                </li>                
                <li data-title="Quản lý kỳ thi"><FaThLarge className="icon" /> <span>Quản lý kỳ thi</span></li>
                <li data-title="Ngân hàng câu hỏi"><FaQuestionCircle className="icon" /> <span>Ngân hàng câu hỏi</span></li>
                <li data-title="Quản lý ma trận đề"><FaThLarge className="icon" /> <span>Quản lý ma trận đề</span></li>
                <li data-title="Quản lý đề thi"><FaFileAlt className="icon" /> <span>Quản lý đề thi</span></li>
                <li data-title="Quản lý phòng thi"><FaBuilding className="icon" /> <span>Quản lý phòng thi</span></li>
                <li data-title="Nhật ký sử dụng"><FaBuilding className="icon" /> <span>Nhật ký sử dụng</span></li>
            </ul>
        </div>
    );
};

export default Sidebar;
