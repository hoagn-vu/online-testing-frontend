import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import PropTypes from "prop-types";
import React, {useRef, useState, useEffect } from "react";

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ title, labels, dataPoints, width, height, isShowLegend=true, onImageGenerated }) => {
  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      try {
        const chartInstance = chartRef.current;
        const chartImage = chartInstance.toBase64Image(); // Chuyển biểu đồ thành hình ảnh
        if (onImageGenerated) {
          onImageGenerated(chartImage); // Gửi hình ảnh về component cha
        }
      } catch (error) {
        console.error("Lỗi khi tạo ảnh từ biểu đồ:", error);
      }
    }
  }, [labels, dataPoints]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: dataPoints,
        backgroundColor: "rgba(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép điều chỉnh kích thước tự do
    plugins: {
      legend: {
        display: isShowLegend,
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      className="bg-white  p-2"
      style={{
        width: width || "100%",
        height: height || "300px",
        borderRadius: "15px",
        boxShadow: "0px 1px 15px rgba(107, 106, 106, 0.1)",
      }}
    >
      {chartImage ? <img src={chartImage} alt="Biểu đồ" style={{ width: "100%" }} /> : <Bar ref={chartRef} data={data} options={options} />}
    </div>
  );
};

BarChart.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataPoints: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isShowLegend: PropTypes.bool,
  onImageGenerated: PropTypes.func,

};

export default BarChart;
