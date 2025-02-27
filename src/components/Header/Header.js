import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'

const Header = ({username, avatarUrl, logoUrl}) => {
    return (
        <div className="header-container">
            {/* Logo góc trái */}
            <img src={logoUrl} alt="Logo" className="logo" />

            {/* Avatar và tên góc phải */}
            <div className="user-info">
                <img src={avatarUrl} alt="Avatar" className="avatar" />
                <span className="username">{username}</span>
                
            </div>
        </div>
    );
}

export default Header;