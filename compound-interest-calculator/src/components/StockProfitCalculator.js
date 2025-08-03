import React, { useState, useRef } from 'react';
import StockProfitInputForm from './StockProfitInputForm';
import StockProfitResultDisplay from './StockProfitResultDisplay';
import styles from './StockProfitCalculator.module.css';

/**
 * StockProfitCalculator - 주식 수익률 계산기 메인 컴포넌트
 * 입력, 결과를 통합 관리
 */
function StockProfitCalculator() {
  // 상태 관리
  const [calculationResult, setCalculationResult] = useState(null);
  
  // 스크롤을 위한 ref
  const inputFormRef = useRef(null);

  /**
   * 계산 처리 함수
   * @param {Object} formData - 입력 폼 데이터
   */
  const handleCalculate = (formData) => {
    const { buyPrice, buyQuantity, sellPrice, commission, tax } = formData;
    
    // 주식 수익률 계산
    const result = calculateStockProfit(buyPrice, buyQuantity, sellPrice, commission, tax);
    setCalculationResult(result);
    
    // 계산 완료 후 스크롤을 계산하기 버튼까지 이동
    setTimeout(() => {
      if (inputFormRef.current) {
        inputFormRef.current.scrollToCalculateButton();
      }
    }, 100);
  };

  /**
   * 주식 수익률 계산 함수
   */
  const calculateStockProfit = (buyPrice, buyQuantity, sellPrice, commission, tax) => {
    // 매수 금액
    const buyAmount = buyPrice * buyQuantity;
    
    // 매도 금액
    const sellAmount = sellPrice * buyQuantity;
    
    // 매수 수수료
    const buyCommission = buyAmount * (commission / 100);
    
    // 매도 수수료
    const sellCommission = sellAmount * (commission / 100);
    
    // 매도 세금
    const sellTax = sellAmount * (tax / 100);
    
    // 총 매수 비용
    const totalBuyCost = buyAmount + buyCommission;
    
    // 총 매도 수익
    const totalSellRevenue = sellAmount - sellCommission - sellTax;
    
    // 손익
    const profit = totalSellRevenue - totalBuyCost;
    
    // 수익률
    const profitRate = totalBuyCost > 0 ? (profit / totalBuyCost) * 100 : 0;
    
    return {
      buyAmount,
      sellAmount,
      buyCommission,
      sellCommission,
      sellTax,
      totalBuyCost,
      totalSellRevenue,
      profit,
      profitRate
    };
  };

  return (
    <div className={styles.calculator}>
      <div className={styles['calculator-section']}>
        <StockProfitInputForm ref={inputFormRef} onCalculate={handleCalculate} />
      </div>
      
      {calculationResult && (
        <div className={styles['calculator-section']}>
          <div className={styles['results-container']}>
            <StockProfitResultDisplay calculationData={calculationResult} />
          </div>
        </div>
      )}
    </div>
  );
}

export default StockProfitCalculator; 