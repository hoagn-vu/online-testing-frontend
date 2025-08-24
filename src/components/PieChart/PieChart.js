import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import PropTypes from "prop-types";
import React, { useRef, useState, useEffect } from "react";

// Đăng ký các thành phần Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({
  title,
  labels,
  dataPoints,
  width,
  height,
  isShowLegend = true,
  onImageGenerated,
  convertToImage = false,
}) => {
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
  }, [convertToImage, onImageGenerated]);

  const data = {
    labels: labels, // Ví dụ: ["Nộp bài thành công", "Bị dừng thi"]
    datasets: [
      {
        label: title,
        data: dataPoints, // Ví dụ: [120, 30]
        backgroundColor: ["#65cdb3ff", "#f98d8dff", "#bcbcbcff"], // Màu xanh cho thành công, đỏ cho dừng thi
        borderColor: ["#4A88D9", "#FF6B6B", "#9b9b9bff"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Cho phép điều chỉnh kích thước tự do
    animation: {
      onComplete: () => {
        if (
          chartRef.current &&
          chartRef.current.canvas &&
          typeof onImageGenerated === "function"
        ) {
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
        display: false,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} thí sinh (${percentage}%)`;
          },
        },
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
      }}
    >
      {chartImage ? (
        <img src={chartImage} alt="Biểu đồ" style={{ width: "100%" }} />
      ) : (
        <Pie ref={chartRef} data={data} options={options} />
      )}
    </div>
  );
};

PieChart.propTypes = {
  title: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataPoints: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isShowLegend: PropTypes.bool,
  onImageGenerated: PropTypes.func,
  convertToImage: PropTypes.bool,
};

PieChart.defaultProps = {
  onImageGenerated: () => {}, // Giá trị mặc định để tránh lỗi
};

export default PieChart;