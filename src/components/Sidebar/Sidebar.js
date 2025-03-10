import React, { useState, useEffect } from "react";
import {FaUserCog, FaQuestionCircle, FaThLarge, FaFileAlt, FaBuilding, } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); 
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
      <ul className="menu-list">
        <li
          className={location.pathname === "/admin/dashboard" ? "active" : ""}
          data-title="Dashboard"
        >
          <FaThLarge className="icon" />
          <Link to="/admin/dashboard">
            <span>Dashboard</span>
          </Link>
        </li>
        <li
          className={
            location.pathname === "/admin/accountmanage" ? "active" : ""
          }
          data-title="Quản lý tài khoản"
        >
          <FaUserCog className="icon" />
          <Link to="/admin/accountmanage">
            <span>Quản lý tài khoản</span>
          </Link>
        </li>

        <li data-title="Quản lý kỳ thi">
          <FaThLarge className="icon" /> <span>Quản lý kỳ thi</span>
        </li>

        <li
          className={
            location.pathname === "/admin/question" ? "active" : ""
          }
          data-title="Ngân hàng câu hỏi"
        >
          <FaQuestionCircle className="icon" />
          <Link to="/admin/question">
            <span>Ngân hàng câu hỏi</span>
          </Link>
        </li>

        <li data-title="Quản lý ma trận đề">
          <FaThLarge className="icon" /> <span>Quản lý ma trận đề</span>
        </li>
        <li data-title="Quản lý đề thi">
          <FaFileAlt className="icon" /> <span>Quản lý đề thi</span>
        </li>

        <li
          className={
            location.pathname === "/admin/room" ? "active" : ""
          }
          data-title="Quản lý phòng thi"
        >
          <FaQuestionCircle className="icon" />
          <Link to="/admin/room">
            <span>Quản lý phòng thi</span>
          </Link>
        </li>

        <li
          className={location.pathname === "/admin/log" ? "active" : ""}
          data-title="Nhật ký sử dụng"
        >
          <FaBuilding className="icon" />
          <Link to="/admin/log">
            <span>Nhật ký sử dụng</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
