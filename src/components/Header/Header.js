import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaChevronDown } from 'react-icons/fa'; // Import icon
import './Header.css';

const Header = ({ username, avatarUrl, logoUrl }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="header-container">
            {/* Logo góc trái */}
            <img src={logoUrl} alt="Logo" className="logo" />

            {/* Avatar + Tên + Nút mở dropdown */}
            <div className="user-info position-relative">
                <img src={avatarUrl} alt="Avatar" className="avatar" />
                <span className="username">{username}</span>

                {/* Nút mở dropdown */}
                <button 
                    className="dropdown-btn" 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FaChevronDown />
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                    <ul className="dropdown-menu show position-absolute end-0 mt-2">
                        <li><a className="dropdown-item" href="#">Thông tin cá nhân</a></li>
                        <li><a className="dropdown-item" href="#">Cài đặt</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="#">Đăng xuất</a></li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Header;
