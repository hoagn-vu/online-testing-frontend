import React, { useState } from 'react';
import "./NotificationCard.css"

function NotificationDashboard() {

  return (
    <div className='d-flex align-items-center mb-4'>
			<div className='notification-icon me-4'>
				<i className="fa-regular fa-bell" aria-hidden="true" style={{ color: "#1976D2" }}></i>
			</div>
			<div>
				<p className='m-0 fs-14'>Phương Linh - Đăng nhập vào hệ thống</p>
				<p className='m-0 fs-14' style={{ color: "#8D8E97" }}>12:00:00</p>
			</div>

    </div>
  );
}

export default NotificationDashboard;