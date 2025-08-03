import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import styles from './StockProfitResultDisplay.module.css';

/**
 * StockProfitResultDisplay - 주식 수익률 계산 결과 표시
 */
function StockProfitResultDisplay({ calculationData }) {
  const {
    buyAmount,
    sellAmount,
    buyCommission,
    sellCommission,
    sellTax,
    totalBuyCost,
    totalSellRevenue,
    profit,
    profitRate
  } = calculationData;

  // 숫자 포맷팅 함수
  const formatNumber = (num) => {
    return new Intl.NumberFormat('ko-KR').format(Math.round(num));
  };

  // 수익률 포맷팅 함수
  const formatPercentage = (rate) => {
    return rate.toFixed(2);
  };

  // 수익/손실 여부 판단
  const isProfit = profit > 0;
  const isLoss = profit < 0;

  return (
    <div className={styles['result-display']}>
      <div className={styles['result-header']}>
        <h2>수익률 계산 결과</h2>
        <div className={`${styles['profit-indicator']} ${isProfit ? styles.profit : isLoss ? styles.loss : styles.neutral}`}>
          {isProfit ? <TrendingUp size={35} /> : isLoss ? <TrendingDown size={35} /> : <DollarSign size={35} />}
          <span className={styles['profit-amount']}>
            {isProfit ? '+' : ''}{formatNumber(profit)}원
          </span>
          <span className={styles['profit-rate']}>
            {isProfit ? '+' : ''}{formatPercentage(profitRate)}%
          </span>
        </div>
      </div>

      <div className={styles['result-content']}>
        <div className={styles['result-section']}>
          <h3>매매 정보</h3>
          
          <div className={styles['result-grid']}>
            <div className={styles['result-item']}>
              <label>매수금액</label>
              <span className={styles.value}>{formatNumber(buyAmount)}원</span>
            </div>
            
            <div className={styles['result-item']}>
              <label>매도금액</label>
              <span className={styles.value}>{formatNumber(sellAmount)}원</span>
            </div>
            
            <div className={styles['result-item']}>
              <label>매수수수료</label>
              <span className={styles.value}>{formatNumber(buyCommission)}원</span>
            </div>
            
            <div className={styles['result-item']}>
              <label>매도수수료</label>
              <span className={styles.value}>{formatNumber(sellCommission)}원</span>
            </div>
            
            <div className={styles['result-item']}>
              <label>매도세금</label>
              <span className={styles.value}>{formatNumber(sellTax)}원</span>
            </div>
          </div>
        </div>

        <div className={styles['result-section']}>
          <h3>손익 분석</h3>
          
          <div className={styles['result-grid']}>
            <div className={styles['result-item']}>
              <label>총 매수비용</label>
              <span className={styles.value}>{formatNumber(totalBuyCost)}원</span>
            </div>
            
            <div className={styles['result-item']}>
              <label>총 매도수익</label>
              <span className={styles.value}>{formatNumber(totalSellRevenue)}원</span>
            </div>
            
            <div className={`${styles['result-item']} ${styles.highlight}`}>
              <label>손익</label>
              <span className={`${styles.value} ${isProfit ? styles.profit : isLoss ? styles.loss : ''}`}>
                {isProfit ? '+' : ''}{formatNumber(profit)}원
              </span>
            </div>
            
            <div className={`${styles['result-item']} ${styles.highlight}`}>
              <label>수익률</label>
              <span className={`${styles.value} ${isProfit ? styles.profit : isLoss ? styles.loss : ''}`}>
                {isProfit ? '+' : ''}{formatPercentage(profitRate)}%
              </span>
            </div>
          </div>
        </div>

        {/* <div className={styles['result-summary']}>
          <div className={`${styles['summary-card']} ${isProfit ? styles.profit : isLoss ? styles.loss : styles.neutral}`}>
            <div className={styles['summary-icon']}>
              {isProfit ? <TrendingUp size={32} /> : isLoss ? <TrendingDown size={32} /> : <DollarSign size={32} />}
            </div>
            <div className={styles['summary-content']}>
              <h4>
                {isProfit ? '수익' : isLoss ? '손실' : '손익 없음'}
              </h4>
              <p className={styles['summary-amount']}>
                {isProfit ? '+' : ''}{formatNumber(profit)}원
              </p>
              <p className={styles['summary-rate']}>
                {isProfit ? '+' : ''}{formatPercentage(profitRate)}%
              </p>
            </div>
          </div>
        </div> */}

        <div className={styles['result-note']}>
          <h4>참고사항</h4>
          <ul>
            <li>매수수수료 = 매수단가 × 매수수량 × 매매수수료(%)</li>
            <li>매도수수료 = 매도단가 × 매수수량 × 매매수수료(%)</li>
            <li>매도세금 = 매도단가 × 매수수량 × 세금(%)</li>
            <li>수익률 = (손익 ÷ 총 매수비용) × 100</li>
            <li>실제 수수료는 증권사마다 다를 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StockProfitResultDisplay; 