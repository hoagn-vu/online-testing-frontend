import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaChevronDown } from "react-icons/fa";
// Import icon
import "./HeaderCandidate.css";
import { Link } from "react-router-dom";

const HeaderCandidate = ({ username, avatarUrl, logoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="header-candidate-container">
      <img src={logoUrl} alt="Logo" className="logo" />

      <div className="user-info position-relative">
      <nav className="flex space-x-6 history">
          <Link
            to="/thisinh/home"
            className="text-black hover:text-blue-500 his-under"
          >
            Trang chủ
          </Link>
        </nav>
        <nav className="flex space-x-6 history">
          <Link
            to="/thisinh/history"
            className="text-black hover:text-blue-500 his-under"
          >
            Lịch sử thi
          </Link>
        </nav>
        <img src={avatarUrl} alt="Avatar" className="avatar" />
        <span className="username">{username}</span>

        {/* Nút mở dropdown */}
        <button className="dropdown-btn" onClick={() => setIsOpen(!isOpen)}>
          <FaChevronDown />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <ul className="dropdown-menu show position-absolute end-0 mt-2">
            <li>
              <a className="dropdown-item" href="#">
                Đăng xuất
              </a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default HeaderCandidate;
