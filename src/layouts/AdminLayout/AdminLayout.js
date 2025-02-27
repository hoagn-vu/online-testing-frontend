import React from 'react';
import Header from '../../components/Header/Header'
import logo from '../../assets/logo/logo.png'
import avatar from '../../assets/images/avar.jpg'
import Sidebar from '../../components/Sidebar/Sidebar'

const AdminLayout = () => {

    return (
        <div>
            <Header 
                username="Phương Linh" 
                avatarUrl={avatar}
                logoUrl={logo}
            />
            <Sidebar/>
        </div>
    );
}

export default AdminLayout;
