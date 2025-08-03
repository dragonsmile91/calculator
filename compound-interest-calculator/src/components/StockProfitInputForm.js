import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styles from './StockProfitInputForm.module.css';

/**
 * StockProfitInputForm - 주식 수익률 계산기 입력 폼
 */
const StockProfitInputForm = forwardRef(({ onCalculate }, ref) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    buyPrice: '',
    buyQuantity: '',
    sellPrice: '',
    commission: 0.015, // 기본 수수료 0.015%
    tax: 0.23 // 기본 세금 0.23%
  });

  // 유효성 검사 상태
  const [errors, setErrors] = useState({});

  // ref를 통해 부모 컴포넌트에서 접근할 수 있는 메서드들
  useImperativeHandle(ref, () => ({
    scrollToCalculateButton: () => {
      const button = document.querySelector(`.${styles['calculate-button']}`);
      if (button) {
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }));

  /**
   * 입력값 변경 처리
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * 유효성 검사
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.buyPrice || formData.buyPrice <= 0) {
      newErrors.buyPrice = '매수단가를 입력해주세요';
    }

    if (!formData.buyQuantity || formData.buyQuantity <= 0) {
      newErrors.buyQuantity = '매수수량을 입력해주세요';
    }

    if (!formData.sellPrice || formData.sellPrice <= 0) {
      newErrors.sellPrice = '매도단가를 입력해주세요';
    }

    if (formData.commission < 0 || formData.commission > 100) {
      newErrors.commission = '수수료는 0~100% 사이여야 합니다';
    }

    if (formData.tax < 0 || formData.tax > 100) {
      newErrors.tax = '세금은 0~100% 사이여야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 계산 실행
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCalculate(formData);
    }
  };

  /**
   * 폼 초기화
   */
  const handleReset = () => {
    setFormData({
      buyPrice: '',
      buyQuantity: '',
      sellPrice: '',
      commission: 0.015,
      tax: 0.23
    });
    setErrors({});
  };

  return (
    <div className={styles['input-form-container']}>
      <div className={styles['form-header']}>
        <h2>주식 수익률 계산기</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles['input-form']}>
        <div className={styles['form-section']}>
          <h3>매매 정보</h3>
          
          <div className={styles['trading-info-container']}>
            <div className={styles['input-group']}>
              <label htmlFor="buyPrice">매수단가 (원)</label>
              <input
                type="number"
                id="buyPrice"
                name="buyPrice"
                value={formData.buyPrice}
                onChange={handleInputChange}
                placeholder="예: 50000"
                step="0.01"
                min="0"
              />
              {errors.buyPrice && <span className={styles.error}>{errors.buyPrice}</span>}
            </div>

            <div className={styles['input-group']}>
              <label htmlFor="buyQuantity">매수수량 (주)</label>
              <input
                type="number"
                id="buyQuantity"
                name="buyQuantity"
                value={formData.buyQuantity}
                onChange={handleInputChange}
                placeholder="예: 10"
                step="1"
                min="1"
              />
              {errors.buyQuantity && <span className={styles.error}>{errors.buyQuantity}</span>}
            </div>

            <div className={styles['input-group']}>
              <label htmlFor="sellPrice">매도단가 (원)</label>
              <input
                type="number"
                id="sellPrice"
                name="sellPrice"
                value={formData.sellPrice}
                onChange={handleInputChange}
                placeholder="예: 55000"
                step="0.01"
                min="0"
              />
              {errors.sellPrice && <span className={styles.error}>{errors.sellPrice}</span>}
            </div>
          </div>
        </div>

        <div className={styles['form-section']}>
          <h3>수수료 및 세금</h3>
          
          <div className={styles['commission-tax-container']}>
            <div className={styles['input-group']}>
              <label htmlFor="commission">매매수수료 (%)</label>
              <input
                type="number"
                id="commission"
                name="commission"
                value={formData.commission}
                onChange={handleInputChange}
                placeholder="예: 0.015"
                step="0.001"
                min="0"
                max="100"
              />
              <small>기본값: 0.015% (대부분의 증권사)</small>
              {errors.commission && <span className={styles.error}>{errors.commission}</span>}
            </div>

            <div className={styles['input-group']}>
              <label htmlFor="tax">세금 (%)</label>
              <input
                type="number"
                id="tax"
                name="tax"
                value={formData.tax}
                onChange={handleInputChange}
                placeholder="예: 0.23"
                step="0.01"
                min="0"
                max="100"
              />
              <small>기본값: 0.23% (증권거래세)</small>
              {errors.tax && <span className={styles.error}>{errors.tax}</span>}
            </div>
          </div>
        </div>

        <div className={styles['form-actions']}>
          <button type="submit" className={styles['calculate-button']}>
            수익률 계산하기
          </button>
          <button type="button" onClick={handleReset} className={styles['reset-button']}>
            초기화
          </button>
        </div>
      </form>
    </div>
  );
});

StockProfitInputForm.displayName = 'StockProfitInputForm';

export default StockProfitInputForm; 