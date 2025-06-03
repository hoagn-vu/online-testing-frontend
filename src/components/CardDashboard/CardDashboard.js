import React from "react";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./CardDashboard.css";
import PropTypes from "prop-types";

const CardDashboard = ({ title, value, icon }) => {
  return (
    <div
      className="bg-white items-center justify-between p-3 d-flex card-dash"
      style={{ boxShadow: "0px 4px 10px rgba(107, 106, 106, 0.1)", margin: '10px' }}
    >
      <div>
        <h6 className=" font-semibold">{title}</h6>
        <p className="fw-bold m-0">{value}</p>
      </div>
      <div className="d-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg icon-card">
        <div className="frame-icon">{icon}</div>
      </div>
    </div>
  );
};

CardDashboard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  icon: PropTypes.element,
};

export default CardDashboard;
