import React from 'react';
import { formatNumberInteger, formatPercentage } from '../utils/formatters';
import './ResultDisplay.css';

/**
 * ResultDisplay - 계산 결과를 표시하는 컴포넌트
 * 투자 성과를 테이블 형태로 표시
 */
function ResultDisplay({ calculationData }) {
  if (!calculationData) return null;

  const { 
    yearlyData 
  } = calculationData;

  return (
    <div className="result-display">
      <div className="result-section">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>연도</th>
                <th>원금</th>
                <th>이자</th>
                <th>총액</th>
                <th>수익률</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.map((year, index) => (
                <tr key={index}>
                  <td>{year.year}년</td>
                  <td>{formatNumberInteger(year.principal)}원</td>
                  <td>{formatNumberInteger(year.interest)}원</td>
                  <td>{formatNumberInteger(year.total)}원</td>
                  <td>{formatPercentage(year.profitRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResultDisplay; 