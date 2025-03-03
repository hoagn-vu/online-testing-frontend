import React, { useState, useEffect } from "react";

const WelcomePage = () => {
    const [uId, setUId] = useState(null);
    const [uFullname, setUFullname] = useState(null);

    useEffect(() => {
        setUId(sessionStorage.getItem("userId"));
        setUFullname(sessionStorage.getItem("userFullname"));

        if (!uId) {
            window.location.href = "/";
        }
    }, [uId]);

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