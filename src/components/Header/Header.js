import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaChevronDown } from "react-icons/fa";
// Import icon
import "./Header.css";
import PropTypes from "prop-types";

const Header = ({ username, avatarUrl, logoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="header-container">
      <img src={logoUrl} alt="Logo" className="logo" />

      <div className="user-info position-relative">
        <img src={avatarUrl} alt="Avatar" className="avatar" />
        <span className="username">{username}</span>

        <button className="dropdown-btn" onClick={() => setIsOpen(!isOpen)}>
          <FaChevronDown />
        </button>

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

Header.propTypes = {
  username: PropTypes.string,
  avatarUrl: PropTypes.string,
  logoUrl: PropTypes.string,
};

export default Header;
