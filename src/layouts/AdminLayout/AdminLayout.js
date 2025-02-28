import React, { useState } from 'react';
import Header from '../../components/Header/Header'
import logo from '../../assets/logo/logo1.png'
import avatar from '../../assets/images/avar.jpg'
import Sidebar from '../../components/Sidebar/Sidebar'
import AccountPage from '../../pages/AccountPage/AccountPage';
import { Outlet } from 'react-router-dom'; // Import Outlet

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="admin-layout">
            <Header 
                username="Phương Linh" 
                avatarUrl={avatar}
                logoUrl={logo}
            />
            <div className="admin-main">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className={`main-content ${isSidebarOpen ? "expanded" : "collapsed"}`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
