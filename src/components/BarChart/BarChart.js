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

const BarChart = ({ title, labels, dataPoints, width, height, isShowLegend=true, onImageGenerated, convertToImage = false }) => {
  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null);

  useEffect(() => {
    if (convertToImage && chartRef.current && chartRef.current.chart) {
      setTimeout(() => {
        try {
          const chartInstance = chartRef.current.chart;
          const chartImage = chartInstance.toBase64Image();
          if (onImageGenerated && typeof onImageGenerated === "function") {
            onImageGenerated(chartImage);
          }
        } catch (error) {
          console.error("Lỗi khi tạo ảnh từ biểu đồ:", error);
        }
      }, 500);
    }
  }, [convertToImage]);
  
  
  
  
  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: dataPoints,
        backgroundColor: "#4A88D9",
        borderColor: "#4A88D9",
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép điều chỉnh kích thước tự do
    animation: {
      onComplete: () => {
        if (chartRef.current && chartRef.current.canvas && typeof onImageGenerated === "function") {
          const chartImage = chartRef.current.canvas.toDataURL("image/png");
          onImageGenerated(chartImage);
        }
      },
    },
    plugins: {
      legend: {
        display: isShowLegend,
        position: "bottom",
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
      className="bg-white p-3"
      style={{
        width: width || "100%",
        height: height || "300px",
        borderRadius: "15px",
        boxShadow: "4px 4px 27px 0 rgba(181, 180, 180, 0.25)",
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
  convertToImage: PropTypes.bool,

};

BarChart.defaultProps = {
  onImageGenerated: () => {}, // Thêm giá trị mặc định để tránh lỗi
};

export default BarChart;
