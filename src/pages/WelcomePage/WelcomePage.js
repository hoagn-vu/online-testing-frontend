import React, { useState, useEffect } from "react";

const WelcomePage = () => {
    const [uFullname, setUFullname] = useState(null);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem("userId");
        const storedUserFullname = sessionStorage.getItem("userFullname");
    
        if (!storedUserId || !storedUserFullname) {
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("userFullname");
            window.location.href = "/";
        } else {
            setUFullname(storedUserFullname);
        }
    }, []);    

    const handleLogout = () => {
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("userFullname");
        window.location.href = "/";
    }

    return (
        <div>
            <h1>Welcome, {uFullname}</h1>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
    );
}

export default WelcomePage;