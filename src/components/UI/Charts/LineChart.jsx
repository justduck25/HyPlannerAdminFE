import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data, title, period = 'month', onPeriodChange, onMonthsChange, months = 6 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
        },
      },
      x: {
        grid: {
          color: '#f1f5f9',
        },
      },
    },
  };

  const chartData = {
    labels: data?.labels || ['T6/24', 'T7/24', 'T8/24', 'T9/24', 'T10/24', 'T11/24'],
    datasets: [
      {
        label: period === 'month' ? 'Người dùng mới theo tháng' : 'Người dùng mới theo ngày',
        data: data?.values || [12, 19, 3, 5, 2, 3],
        borderColor: '#ff6b9d',
        backgroundColor: 'rgba(255, 107, 157, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#ff6b9d',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
        <div className="chart-controls">
          <select 
            value={months} 
            onChange={(e) => onMonthsChange && onMonthsChange(parseInt(e.target.value))}
            className="months-selector"
          >
            <option value={6}>6 tháng gần đây</option>
            <option value={12}>12 tháng gần đây</option>
          </select>
        </div>
      </div>
      <div className="chart-content">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default LineChart;
