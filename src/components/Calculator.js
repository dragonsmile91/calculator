import React, { useState, useRef } from 'react';
import InputForm from './InputForm';
import ResultDisplay from './ResultDisplay';
import CompoundGraph from './CompoundGraph';
import { generateYearlyData, analyzeProfitability } from '../utils/calculations';
import './Calculator.css';

/**
 * Calculator - 복리계산기 메인 컴포넌트
 * 입력, 결과, 그래프를 통합 관리
 */
function Calculator() {
  // 상태 관리
  const [calculationResult, setCalculationResult] = useState(null);
  const [yearlyData, setYearlyData] = useState([]);
  
  // 스크롤을 위한 ref
  const inputFormRef = useRef(null);

  /**
   * 계산 처리 함수
   * @param {Object} formData - 입력 폼 데이터
   */
  const handleCalculate = (formData) => {
    const { principal, rate, time } = formData;
    
    // 연별 데이터 생성
    const yearlyDataResult = generateYearlyData(principal, rate, time);
    setYearlyData(yearlyDataResult);
    
    // 종합 수익률 분석
    const result = analyzeProfitability(principal, rate, time);
    setCalculationResult(result);
    
    // 계산 완료 후 스크롤을 계산하기 버튼까지 이동
    setTimeout(() => {
      if (inputFormRef.current) {
        inputFormRef.current.scrollToCalculateButton();
      }
    }, 100);
  };

  return (
    <div className="calculator">
      <div className="calculator-section">
        <InputForm ref={inputFormRef} onCalculate={handleCalculate} />
      </div>
      
      {calculationResult && (
        <div className="calculator-section">
          <div className="results-container">
            <CompoundGraph yearlyData={yearlyData} />
            <ResultDisplay calculationData={calculationResult} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator; 