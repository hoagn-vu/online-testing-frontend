import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaChevronDown } from "react-icons/fa";
import "./HeaderCandidate.css";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/authApi";

const HeaderCandidate = ({ avatarUrl, logoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    dispatch(authApi.util.resetApiState());
    navigate("/");
  };

  return (
    <div className="header-candidate-container">
      <img src={logoUrl} alt="Logo" className="logo" />

      <div className="user-info position-relative">
      <nav className="flex space-x-6 history">
          <Link
            to="/candidate/home"
            className="text-black hover:text-blue-500 his-under"
          >
            Trang chủ
          </Link>
        </nav>
        <nav className="flex space-x-6 history">
          <Link
            to="/candidate/history"
            className="text-black hover:text-blue-500 his-under"
          >
            Lịch sử thi
          </Link>
        </nav>
        <img src={avatarUrl} alt="Avatar" className="avatar" />
        <span className="username">{user?.username}</span>

        {/* Nút mở dropdown */}
        <button className="dropdown-btn" onClick={() => setIsOpen(!isOpen)}>
          <FaChevronDown />
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <ul className="dropdown-menu show position-absolute end-0 mt-2">
            <li>
              <a className="dropdown-item" onClick={handleLogout}>
                Đăng xuất
              </a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

HeaderCandidate.propTypes = {
  username: PropTypes.string,
  avatarUrl: PropTypes.string,
  logoUrl: PropTypes.string,
};

export default HeaderCandidate;
