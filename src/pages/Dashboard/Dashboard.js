// import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BarChart from "../../components/BarChart/BarChart";
import CardDashboard from "../../components/CardDashboard/CardDashboard";
import LineChart from "../../components/LineChart/LineChart";
import "./Dashboard.css";
import { FaDollarSign } from "react-icons/fa";

// Import icons từ react-icons

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const Dashboard = () => {
  // Thông tin linechart gian lận
  const labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10"];
  const dataPoints = [10, 20, 30, 65, 113, 155, 96, 35, 25, 15];

  return (
    <div className="dashboard-page p-4">
      <div className="justify-between gap-4 w-full card-dash">
        <CardDashboard
          title="Người dùng mới"
          value="+200"
          icon={<FaDollarSign />}
        />
        <CardDashboard
          title="Người dùng mới"
          value="+200"
          icon={<FaDollarSign />}
        />
        <CardDashboard
          title="Người dùng mới"
          value="+200"
          icon={<FaDollarSign />}
        />
        <CardDashboard
          title="Người dùng mới"
          value="+200"
          icon={<FaDollarSign />}
        />
      </div>
      {/* Biểu đồ đường - Gian lận qua từng kỳ thi */}
      <div className="content-1">
        {/* <div className="line-chart">
          <LineChart
            title="Số lượng thí sinh gian lận"
            labels={labels}
            dataPoints={dataPoints}
            color="rgba(255, 99, 132, 1)"
            width="100%"
            height="300px"
          />
        </div> */}
        <div className="barchart-score">
          <BarChart
            title="Tỷ lệ phân bố điểm"
            labels={labels}
            dataPoints={dataPoints}
            width="125%"
            height="350px"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
