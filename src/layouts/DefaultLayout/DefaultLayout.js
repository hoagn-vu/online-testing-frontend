import React from 'react';
import logo from '../../assets/logo/logo.png'
import avatar from '../../assets/images/avar.jpg'
import HeaderCandidate from '../../components/HeaderCandidate/HeaderCandidate';
import HomeCandidate from '../../pages/HomeCandidate/HomeCandidate';
const DefaultLayout = () => {

    return (
        <div>
            <HeaderCandidate 
                username="Phương Linh" 
                avatarUrl={avatar}
                logoUrl={logo}
            />
            <HomeCandidate/>
        </div>
    );
}

export default DefaultLayout;