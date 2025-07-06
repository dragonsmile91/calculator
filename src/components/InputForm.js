import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { addCommas, removeCommas, formatToUnit } from '../utils/formatters';
import './InputForm.css';

/**
 * InputForm - 투자 정보 입력 폼 컴포넌트
 * 원금, 투자기간, 연이율을 입력받아 계산을 실행
 */
const InputForm = forwardRef(({ onCalculate }, ref) => {
  // 상태 관리
  const [formData, setFormData] = useState({
    principal: '1,000,000',
    rate: '10.0',
    time: '20'
  });
  const [rawPrincipalValue, setRawPrincipalValue] = useState(1000000);
  const [errors, setErrors] = useState({});
  const calculateButtonRef = useRef(null);

  // 부모 컴포넌트에서 접근할 수 있는 메서드 노출
  useImperativeHandle(ref, () => ({
    scrollToCalculateButton: () => {
      if (calculateButtonRef.current) {
        calculateButtonRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  }));

  /**
   * 입력값 변경 처리 함수
   * @param {Event} e - 입력 이벤트
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // 원금 필드에만 한국어 단위 로직 적용
    if (name === 'principal') {
      const numericValue = value.replace(/[^0-9]/g, '');
      
      if (numericValue === '') {
        processedValue = '';
        setRawPrincipalValue(0);
      } else {
        const number = parseInt(numericValue);
        setRawPrincipalValue(number);
        processedValue = addCommas(number);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // 에러 상태 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * 폼 제출 처리 함수
   * @param {Event} e - 제출 이벤트
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 입력 검증
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 계산 실행 (원금에서 쉼표 제거)
    const calculationData = {
      principal: parseFloat(removeCommas(formData.principal)),
      rate: parseFloat(formData.rate) / 100, // 퍼센트를 소수점으로 변환
      time: parseFloat(formData.time)
    };

    onCalculate(calculationData);
  };

  /**
   * 폼 검증 함수
   * @param {Object} data - 검증할 데이터
   * @returns {Object} 에러 객체
   */
  const validateForm = (data) => {
    const errors = {};

    // 원금 검증 (쉼표 제거 후 검증)
    const principalValue = removeCommas(data.principal);
    if (!principalValue || parseFloat(principalValue) <= 0) {
      errors.principal = '원금은 0보다 큰 숫자여야 합니다.';
    }

    // 이율 검증
    if (!data.rate || data.rate < 0) {
      errors.rate = '이율은 0 이상이어야 합니다.';
    } else if (data.rate > 100) {
      errors.rate = '이율은 100% 이하여야 합니다.';
    } else if (data.rate.toString().length > 8) {
      errors.rate = '이율은 8자리 이하여야 합니다.';
    }

    // 투자 기간 검증
    if (!data.time || data.time <= 0) {
      errors.time = '투자 기간은 0보다 큰 숫자여야 합니다.';
    } else if (data.time > 999) {
      errors.time = '투자 기간은 999년 이하여야 합니다.';
    }

    return errors;
  };

  /**
   * 폼 초기화 함수
   */
  const handleReset = () => {
    setFormData({
      principal: '1,000,000',
      rate: '5.0',
      time: '10'
    });
    setRawPrincipalValue(1000000);
    setErrors({});
  };

  // 원금의 한국어 단위 텍스트
  const principalUnitText = formatToUnit(rawPrincipalValue);

  return (
    <div className="input-form">
      <h2>입력하기</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="principal">원금 (원)</label>
          <div className="input-with-unit">
            <input
              type="text"
              id="principal"
              name="principal"
              value={formData.principal}
              onChange={handleInputChange}
              className={errors.principal ? 'error' : ''}
            />
            {principalUnitText && (
              <div className="unit-text">
                {principalUnitText}
              </div>
            )}
          </div>
          {errors.principal && <span className="error-message">{errors.principal}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="time">투자 기간 (년)</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              step="1"
              min="1"
              max="999"
              className={errors.time ? 'error' : ''}
            />
            {formData.time && (
              <div className="unit-text">
                {formData.time}년
              </div>
            )}
          </div>
          {errors.time && <span className="error-message">{errors.time}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rate">연이율 (%)</label>
          <div className="input-with-unit">
            <input
              type="number"
              id="rate"
              name="rate"
              value={formData.rate}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              max="100"
              className={errors.rate ? 'error' : ''}
            />
            {formData.rate && (
              <div className="unit-text">
                {formData.rate}%
              </div>
            )}
          </div>
          {errors.rate && <span className="error-message">{errors.rate}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-calculate" ref={calculateButtonRef}>
            계산하기
          </button>
          <button type="button" className="btn-reset" onClick={handleReset}>
            초기화
          </button>
        </div>
      </form>
    </div>
  );
});

export default InputForm; 