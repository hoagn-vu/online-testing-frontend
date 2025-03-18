import React, { useState, useEffect } from "react";
import {FaUserCog, FaQuestionCircle, FaThLarge, FaFileAlt, FaBuilding, } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";
import { Link, useLocation, NavLink } from "react-router-dom";

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
          className={location.pathname === "/staff/dashboard" ? "active" : ""}
          data-title="Dashboard"
        >
          <FaThLarge className="icon" />
          <NavLink  to="/staff/dashboard">
            <span>Dashboard</span>
          </NavLink >
        </li>
        <li
          className={
            location.pathname === "/staff/accountmanage" ? "active" : ""
          }
          data-title="Quản lý tài khoản"
        >
          <FaUserCog className="icon" />
          <NavLink  to="/staff/accountmanage">
            <span>Quản lý tài khoản</span>
          </NavLink >
        </li>

        <li
          className= {location.pathname.startsWith("/staff/organize") ? "active" : ""}
          data-title="Quản lý kỳ thi"
        >
          <FaThLarge className="icon" />
          <NavLink  to="/staff/organize">
            <span>Quản lý kỳ thi</span>
          </NavLink >
        </li>

        <li
          className= {location.pathname.startsWith("/staff/question") ? "active" : ""}
          data-title="Ngân hàng câu hỏi"
        >
          <FaQuestionCircle className="icon" />
          <NavLink  to="/staff/question">
            <span>Ngân hàng câu hỏi</span>
          </NavLink >
        </li>

        <li
          className= {location.pathname.startsWith("/staff/matrix") ? "active" : ""}
          data-title="Quản lý ma trận đề"
        >
          <FaThLarge className="icon" />
          <NavLink  to="/staff/matrix-exam">
            <span>Quản lý ma trận đề</span>
          </NavLink >
        </li>

        <li
          className={location.pathname.startsWith("/staff/exam") ? "active" : ""}
          data-title="Quản lý đề thi"
        >
          <FaFileAlt className="icon" />
          <NavLink  to="/staff/exam">
            <span>Quản lý đề thi</span>
          </NavLink >
        </li>

        <li
          className={
            location.pathname === "/staff/room" ? "active" : ""
          }
          data-title="Quản lý phòng thi"
        >
          <FaQuestionCircle className="icon" />
          <NavLink  to="/staff/room">
            <span>Quản lý phòng thi</span>
          </NavLink >
        </li>

        <li
          className={location.pathname === "/staff/log" ? "active" : ""}
          data-title="Nhật ký sử dụng"
        >
          <FaBuilding className="icon" />
          <NavLink  to="/staff/log">
            <span>Nhật ký sử dụng</span>
          </NavLink >
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
