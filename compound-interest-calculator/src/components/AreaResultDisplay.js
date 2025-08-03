import React from 'react';
import { Square, ArrowRight } from 'lucide-react';
import styles from './AreaResultDisplay.module.css';

/**
 * AreaResultDisplay - 평 계산기 결과 표시
 */
const AreaResultDisplay = ({ calculationData }) => {
  const { inputValue, inputUnit, outputValue, outputUnit, formula } = calculationData;

  /**
   * 숫자 포맷팅
   */
  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className={styles['result-container']}>
      <div className={styles['result-header']}>
        <div className={styles['result-icon']}>
          <Square size={24} />
        </div>
        <h2>변환 결과</h2>
      </div>

      <div className={styles['conversion-display']}>
        <div className={styles['input-value']}>
          <span className={styles['value']}>{formatNumber(inputValue)}</span>
          <span className={styles['unit']}>{inputUnit}</span>
        </div>
        
        <div className={styles['arrow-container']}>
          <ArrowRight size={24} />
        </div>
        
        <div className={styles['output-value']}>
          <span className={styles['value']}>{formatNumber(outputValue)}</span>
          <span className={styles['unit']}>{outputUnit}</span>
        </div>
      </div>

      <div className={styles['formula-card']}>
        <h3>계산 공식</h3>
        <div className={styles['formula']}>
          {formula}
        </div>
      </div>

      <div className={styles['info-card']}>
        <h3>참고 정보</h3>
        <div className={styles['info-content']}>
          <div className={styles['info-item']}>
            <strong>1㎡ = 0.3025평</strong>
            <span>제곱미터를 평으로 변환할 때 사용</span>
          </div>
          <div className={styles['info-item']}>
            <strong>1평 = 3.31㎡</strong>
            <span>평을 제곱미터로 변환할 때 사용</span>
          </div>
        </div>
      </div>


    </div>
  );
};

export default AreaResultDisplay; 