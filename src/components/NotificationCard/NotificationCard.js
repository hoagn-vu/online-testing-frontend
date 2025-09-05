import React, { useState, useEffect } from 'react';
import "./NotificationCard.css"
import ApiService from "../../services/apiService";

function NotificationDashboard() {
	const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

	const fetchLogData = async () => {
		setIsLoading(true);
		try {
			const response = await ApiService.get("/logs");
			setLogs(response.data);
		} catch (error) {
			console.error("Failed to fetch data: ", error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchLogData();
	}, []);
	const formatDateTime = (isoString) => {
		const date = new Date(isoString);

		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();

		return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
	};

  return (
    <div>
      {isLoading ? (
        <p>Đang tải thông báo...</p>
      ) : (
        logs.slice(0, 6).map((log) => (
          <div key={log.id} className="d-flex align-items-center mb-4">
            <div className="notification-icon me-4">
              <i className="fa-regular fa-bell" aria-hidden="true" style={{ color: "#1976D2" }}></i>
            </div>
            <div>
              <p className="m-0 fs-14">{log.madeBy} - {log.logDetails}</p>
              <p className="m-0 fs-14" style={{ color: "#8D8E97" }}>
								{formatDateTime(log.logAt)}              
							</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationDashboard;