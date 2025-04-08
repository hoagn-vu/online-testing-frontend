import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaChevronDown } from "react-icons/fa";
// Import icon
import "./HeaderSupervisor.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const HeaderSupervisor = ({ username, avatarUrl, logoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="header-candidate-container">
      <img src={logoUrl} alt="Logo" className="logo" />

      <div className="user-info position-relative">
      <nav className="flex space-x-6 history">
          <Link
            to="/supervisor/home"
            className="text-black hover:text-blue-500 his-under"
          >
            Trang chủ
          </Link>
        </nav>
        
        <img src={avatarUrl} alt="Avatar" className="avatar" onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}/>
        <span className="username" onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>{username}</span>

        {/* Nút mở dropdown */}
        <button className="dropdown-btn" onClick={() => setIsOpen(!isOpen)}>
          <FaChevronDown />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <ul className="dropdown-menu show position-absolute end-0 mt-2 custom-dropdown">
          <li>
            <a
              className="dropdown-item d-flex justify-content-between align-items-center"
              onClick={handleLogout}
              style={{ gap: "8px" }}
            >
              <span>Đăng xuất</span>
              <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
        )}
      </div>
    </div>
  );
};

HeaderSupervisor.propTypes = {
  username: PropTypes.string,
  avatarUrl: PropTypes.string,
  logoUrl: PropTypes.string,
};

export default HeaderSupervisor;
