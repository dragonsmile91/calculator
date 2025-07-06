import React from 'react';
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
  Filler
} from 'chart.js';
import { formatNumberInteger, formatPercentage } from '../utils/formatters';
import './CompoundGraph.css';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * CompoundGraph - 복리 계산 결과를 그래프로 표시하는 컴포넌트
 * 라인 차트로 투자 성과를 시각화
 */
function CompoundGraph({ yearlyData }) {
  if (!yearlyData || yearlyData.length === 0) {
    return (
      <div className="compound-graph">
        <div className="graph-header">
          <h3>투자 성과 그래프</h3>
        </div>
        <div className="graph-placeholder">
          <p>계산 결과가 없습니다.</p>
        </div>
      </div>
    );
  }

  // 차트 데이터 준비
  const labels = yearlyData.map(item => `${item.year}년`);
  const totalAmounts = yearlyData.map(item => item.total);
  const profitRates = yearlyData.map(item => item.profitRate);

  // 최종 결과 계산
  const finalTotal = totalAmounts[totalAmounts.length - 1];
  const finalProfitRate = profitRates[profitRates.length - 1];

  const chartData = {
    labels,
    datasets: [
      {
        label: '총액',
        data: totalAmounts,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return context[0].label;
          },
          label: (context) => {
            const year = context.label;
            const totalAmount = totalAmounts[context.dataIndex];
            const profitRate = profitRates[context.dataIndex];
            
            return [
              `연도: ${year}`,
              `총액: ${formatNumberInteger(totalAmount)}원`,
              `수익률: ${formatPercentage(profitRate)}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatNumberInteger(value) + '원';
          }
        }
      }
    }
  };

  return (
    <div className="compound-graph">


      <div className="graph-info">
        <div className="info-box">
          <span className="info-label">총액:</span>
          <span className="info-value">{formatNumberInteger(finalTotal)}원</span>
        </div>
        <div className="info-box">
          <span className="info-label">수익률:</span>
          <span className="info-value">{formatPercentage(finalProfitRate)}</span>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default CompoundGraph; 