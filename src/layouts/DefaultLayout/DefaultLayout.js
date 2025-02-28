import React from 'react';
import Header from '../../components/Header/Header'
import logo from '../../assets/logo/logo.png'
import avatar from '../../assets/images/avar.jpg'

const DefaultLayout = () => {

    return (
        <div>
            <Header 
                username="Phương Linh" 
                avatarUrl={avatar}
                logoUrl={logo}
            />
        </div>
    );
}

export default DefaultLayout;