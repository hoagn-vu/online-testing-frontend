import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement} from "chart.js";
import LineChart from '../../components/LineChart/LineChart'
import './Dashboard.css'

ChartJS.register( CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement );

const Dashboard = () => {
  // Thông tin linechart gian lận
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const dataPoints = [10, 20, 30, 25, 15, 35];

  return (
    <div className="dashboard-page">
        {/* Biểu đồ đường - Gian lận qua từng kỳ thi */}
        <div className="bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-semibold">Số lượng thí sinh gian lận</h2>
            <LineChart title="Số lượng thí sinh gian lận" labels={labels} dataPoints={dataPoints} color="rgba(255, 99, 132, 1)" 
                width={400} height={200}
            />
        </div>
    </div>
  );
};

export default Dashboard;
