import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement} from "chart.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import LineChart from '../../components/LineChart/LineChart'
import BarChart from "../../components/BarChart/BarChart";
import CardDashboard from "../../components/CardDashboard/CardDashboard";
import './Dashboard.css'
import { FaDollarSign, FaGlobe, FaTrophy } from "react-icons/fa"; // Import icons từ react-icons

ChartJS.register( CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement );

const Dashboard = () => {
    // Thông tin linechart gian lận
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const dataPoints = [10, 20, 30, 25, 15, 35];

    const stats = [
    { title: "Today's Money", value: "$53,000", percentage: 55, icon: <FaDollarSign className="icon" />},
    { title: "Today's Users", value: "2,300", percentage: 3, icon: <FaGlobe className="icon" />},
    { title: "New Clients", value: "+3,462", percentage: -2, icon: <FaTrophy className="icon" /> },
    ];

  return (
    <div className="dashboard-page">
        <div className="justify-between gap-6 w-full card-dash">
            <CardDashboard title="Người dùng mới" value="+200" icon={<FaDollarSign />} />
            <CardDashboard title="Người dùng mới" value="+200" icon={<FaDollarSign />} />
            <CardDashboard title="Người dùng mới" value="+200" icon={<FaDollarSign />} />
        </div>
        {/* Biểu đồ đường - Gian lận qua từng kỳ thi */} 
        <div className="content-1">
            <div className="line-chart">
                <h4 className="text-lg font-semibold">Số lượng thí sinh gian lận</h4>
                <LineChart title="Số lượng thí sinh gian lận" labels={labels} dataPoints={dataPoints} color="rgba(255, 99, 132, 1)" 
                    width="100%" height="300px" 
                />
            </div>
            <div className="barchart-score">
                <h4 className="text-lg font-semibold">Tỷ lệ phân bố điểm</h4>
                <BarChart title="Tỷ lệ phân bố điểm" labels={labels} dataPoints={dataPoints} 
                width="100%" height="300px" 
                />
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
