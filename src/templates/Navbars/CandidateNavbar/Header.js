import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../../assets/images/logo.png";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = "/";
  };

  const goHome = (e) => {
    e.preventDefault();
    navigate("/candidate");
  };

  const goHistory = (e) => {
    e.preventDefault();
    navigate("/history");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow custom-navbar">
      <div className="container header-comp-container">
        {/* Logo */}
        <Link className="navbar-brand" onClick={(e) => goHome(e)}>
          <img src={logo} alt="Logo" className="me-2" />
        </Link>

        {/* Toggle button (bars) chỉ hiển thị trên màn hình nhỏ */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links và các nút (hiển thị trên màn hình lớn) */}
        <div className="collapse navbar-collapse nav-link-menu-list">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-6">
            <li className="nav-item">
              <div>
                <Link className="nav-link" onClick={(e) => goHome(e)}>
                  Trang chủ
                </Link>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" onClick={(e) => goHistory(e)}>
                Lịch sử thi
              </Link>
            </li>
          </ul>

          <li className="nav-item dropdown d-none d-lg-block">
            <Link
              className="nav-link dropdown-toggle d-flex align-items-center text-white"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {/* <img src='https://i.imgur.com/jzX5Wa6.png' alt="User" style={{ width: '45px' }} className='rounded-circle avatar-img me-2'/> */}
              <FaUserCircle style={{ fontSize: "40px", color: "#2b99e8" }} />
              <span className="nav-username ms-2 fs-6">Người dùng</span>
            </Link>
            <ul
              className="dropdown-menu text-dark dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              {/* <li>                                        
                                <Link className="dropdown-item" id="account-dropdown-item" to="/profile">Hồ sơ</Link>
                            </li>
                            <li><Link className="dropdown-item" id="account-dropdown-item" to="/favorite">Yêu thích</Link></li>
                            <li><Link className="dropdown-item" id="account-dropdown-item" to="/history">Lịch sử xem</Link></li>
                            <li><hr className="dropdown-divider" /></li> */}
              <li>
                <Link
                  className="dropdown-item  "
                  id="account-dropdown-item"
                  onClick={handleLogout}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    Đăng xuất
                    <i className="fa-solid fa-right-from-bracket"></i>
                  </div>
                </Link>
              </li>
            </ul>
          </li>
        </div>

        {/* Sidebar (offcanvas) chỉ hiển thị trên màn hình nhỏ */}
        <div
          className="offcanvas offcanvas-start bg-dark d-lg-none"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header d-flex align-items-center justify-content-between">
            <div className="nav-item dropdown d-lg-none text-white">
              <Link
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="offcanvasNavbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="https://i.imgur.com/jzX5Wa6.png"
                  alt="User"
                  style={{ width: "45px" }}
                  className="rounded-circle me-2"
                />
                <span className="nav-username fs-6">Người dùng</span>
              </Link>
              <ul
                className="dropdown-menu bg-dark"
                aria-labelledby="offcanvasNavbarDropdown"
              >
                <li>
                  <Link
                    className="dropdown-item text-white"
                    id="account-dropdown-item"
                    to="/profile"
                  >
                    Hồ sơ
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item text-white"
                    id="account-dropdown-item"
                    to="/history"
                  >
                    Lịch sử xem
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    className="dropdown-item text-white"
                    id="account-dropdown-item"
                    onClick={handleLogout}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      Đăng xuất
                      <i className="fa-solid fa-right-from-bracket"></i>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search">
                  Tìm kiếm
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/favorite">
                  Yêu thích
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
