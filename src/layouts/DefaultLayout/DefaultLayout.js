import React from 'react';
import logo from '../../assets/logo/logo.png'
import avatar from '../../assets/images/avar.jpg'
import HeaderCandidate from '../../components/HeaderCandidate/HeaderCandidate';

const DefaultLayout = () => {

    return (
        <div>
            <HeaderCandidate 
                username="Phương Linh" 
                avatarUrl={avatar}
                logoUrl={logo}
            />
        </div>
    );
}

export default DefaultLayout;