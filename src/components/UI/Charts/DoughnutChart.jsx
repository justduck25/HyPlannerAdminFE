import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ data, title }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const chartData = {
    labels: data?.labels || ['FREE', 'VIP'],
    datasets: [
      {
        data: data?.values || [85, 15],
        backgroundColor: [
          '#e2e8f0',
          '#ff6b9d',
        ],
        borderColor: [
          '#cbd5e1',
          '#ec4899',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-content">
        <Doughnut options={options} data={chartData} />
      </div>
    </div>
  );
};

export default DoughnutChart;
