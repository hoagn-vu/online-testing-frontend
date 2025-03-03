import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ title, labels, dataPoints, color = 'rgba(75, 192, 192, 1)' }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: dataPoints,
        fill: false,
        borderColor: color,
        tension: 0.1,
        pointRadius: 5,
        pointBackgroundColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
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
        ticks: {
          stepSize: 1,
          suggestedMax: Math.max(...dataPoints) + 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-2 " style={{ width: '100%', height: '300px', borderRadius: '15px',
      boxShadow: '0px 1px 15px rgba(107, 106, 106, 0.1)',
     }}>
        <Line data={data} options={options} />
    </div>
  ) 
};

export default LineChart;
