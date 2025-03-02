import React from 'react';
import logo from '../../assets/logo/logo.png'
import avatar from '../../assets/images/avar.jpg'
import HeaderCandidate from '../../components/HeaderCandidate/HeaderCandidate';
import HomeCandidate from '../../pages/HomeCandidate/HomeCandidate';
import { Outlet } from 'react-router-dom'; // Import Outlet

const DefaultLayout = () => {

    return (
        <div>
            <HeaderCandidate 
                username="Phương Linh" 
                avatarUrl={avatar}
                logoUrl={logo}
            />
            <div className="candi-main">
                <div className="main-content-candi">
                    <Outlet />
                </div>
            </div>

        </div>
    );
}

export default DefaultLayout;