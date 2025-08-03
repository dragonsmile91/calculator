import React, { useState } from 'react';
import { Square } from 'lucide-react';
import AreaInputForm from './AreaInputForm';
import AreaResultDisplay from './AreaResultDisplay';
import styles from './AreaCalculator.module.css';

/**
 * AreaCalculator - 평 계산기 메인 컴포넌트
 * 입력, 결과를 통합 관리
 */
function AreaCalculator() {
  // 상태 관리
  const [calculationResult, setCalculationResult] = useState(null);

  /**
   * 계산 처리 함수
   * @param {Object} formData - 입력 폼 데이터
   */
  const handleCalculate = (formData) => {
    const { inputValue, conversionType } = formData;
    
    // 평 계산
    const result = calculateArea(inputValue, conversionType);
    setCalculationResult(result);
  };

  /**
   * 결과 초기화 함수
   */
  const handleReset = () => {
    setCalculationResult(null);
  };

  /**
   * 평 계산 함수
   */
  const calculateArea = (inputValue, conversionType) => {
    const value = parseFloat(inputValue);
    
    if (conversionType === 'm2ToPyung') {
      // ㎡ → 평 변환 (1㎡ = 0.3025평)
      const pyung = value * 0.3025;
      return {
        inputValue: value,
        inputUnit: '㎡',
        outputValue: pyung,
        outputUnit: '평',
        conversionType: 'm2ToPyung',
        formula: `${value}㎡ × 0.3025 = ${pyung.toFixed(2)}평`
      };
    } else {
      // 평 → ㎡ 변환 (1평 = 3.31㎡)
      const m2 = value * 3.31;
      return {
        inputValue: value,
        inputUnit: '평',
        outputValue: m2,
        outputUnit: '㎡',
        conversionType: 'pyungToM2',
        formula: `${value}평 × 3.31 = ${m2.toFixed(2)}㎡`
      };
    }
  };

  return (
    <div className={styles.calculator}>
      <div className={styles['calculator-section']}>
        <AreaInputForm onCalculate={handleCalculate} onReset={handleReset} />
      </div>
      
      {calculationResult && (
        <div className={styles['calculator-section']}>
          <div className={styles['results-container']}>
            <AreaResultDisplay calculationData={calculationResult} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AreaCalculator; 