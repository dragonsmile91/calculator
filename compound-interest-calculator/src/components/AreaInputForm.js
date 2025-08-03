import React, { useState } from 'react';
import { Square } from 'lucide-react';
import styles from './AreaInputForm.module.css';

/**
 * AreaInputForm - 평 계산기 입력 폼
 */
const AreaInputForm = ({ onCalculate, onReset }) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    m2Value: '',
    pyungValue: ''
  });

  // 평수 변환 상태 관리
  const [pyungConversionData, setPyungConversionData] = useState({
    pyungValue: '',
    m2Value: ''
  });

  // ㎡ 변환 상태 관리
  const [m2ConversionData, setM2ConversionData] = useState({
    m2Value: '',
    pyungValue: ''
  });

  // 유효성 검사 상태
  const [errors, setErrors] = useState({});

  // 대표 평수 버튼들
  const commonPyungValues = [18, 24, 28, 32, 36, 40, 48, 52];
  const commonM2Values = [59.5, 79.34, 92.56, 105.79, 119.01, 132.4, 158.88, 172.12];

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
   * 평수 버튼 클릭 처리
   */
  const handlePyungButtonClick = (pyungValue) => {
    const m2Value = (pyungValue * 3.31).toFixed(2);
    setPyungConversionData({
      pyungValue: pyungValue.toString(),
      m2Value: m2Value
    });
  };

  /**
   * ㎡ 버튼 클릭 처리
   */
  const handleM2ButtonClick = (m2Value) => {
    const pyungValue = (m2Value * 0.3025).toFixed(2);
    setM2ConversionData({
      m2Value: m2Value.toString(),
      pyungValue: pyungValue
    });
  };

  /**
   * 유효성 검사
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.m2Value && !formData.pyungValue) {
      newErrors.general = '값을 입력해주세요';
    } else {
      if (formData.m2Value && (isNaN(formData.m2Value) || parseFloat(formData.m2Value) <= 0)) {
        newErrors.m2Value = '올바른 숫자를 입력해주세요';
      }
      if (formData.pyungValue && (isNaN(formData.pyungValue) || parseFloat(formData.pyungValue) <= 0)) {
        newErrors.pyungValue = '올바른 숫자를 입력해주세요';
      }
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
      // 입력된 값에 따라 변환 타입 결정
      const conversionType = formData.m2Value ? 'm2ToPyung' : 'pyungToM2';
      const inputValue = formData.m2Value || formData.pyungValue;
      
      onCalculate({
        inputValue: inputValue,
        conversionType: conversionType
      });
    }
  };

  /**
   * 폼 초기화
   */
  const handleReset = () => {
    setFormData({
      m2Value: '',
      pyungValue: ''
    });
    setPyungConversionData({
      pyungValue: '',
      m2Value: ''
    });
    setM2ConversionData({
      m2Value: '',
      pyungValue: ''
    });
    setErrors({});
    onReset();
  };

  return (
    <div className={styles['input-form-container']}>
      <div className={styles['form-header']}>
        <h2>평 계산기</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles['input-form']}>
        <div className={styles['form-section']}>
          <h3>평 -> ㎡</h3>
          
          <div className={styles['conversion-container']}>
            <div className={styles['button-section']}>
              <div className={styles['button-group']}>
                <div className={styles['button-container']}>
                  {commonPyungValues.map((value) => (
                    <button
                      key={`pyung-${value}`}
                      type="button"
                      onClick={() => handlePyungButtonClick(value)}
                      className={styles['quick-button']}
                    >
                      {value}평
                    </button>
                  ))}
                </div>
              </div>

              {/* <div className={styles['button-group']}>
                <h4>㎡ → 평</h4>
                <div className={styles['button-container']}>
                  {commonM2Values.map((value) => (
                    <button
                      key={`m2-${value}`}
                      type="button"
                      onClick={() => handleM2ButtonClick(value)}
                      className={styles['quick-button']}
                    >
                      {value}㎡
                    </button>
                  ))}
                </div>
              </div> */}
            </div>

            <div className={styles['divider']}></div>

            <div className={styles['result-section']}>
              <div className={styles['result-display']}>
                <div className={styles['result-group']}>
                  <h5>평 기준</h5>
                  <div className={styles['result-item']}>
                    <span className={styles['result-label']}>평</span>
                    <span className={styles['result-value-black']}>
                      {pyungConversionData.pyungValue ? parseFloat(pyungConversionData.pyungValue).toLocaleString('ko-KR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) : '0.00'} 평
                    </span>
                  </div>
                  <div className={styles['result-item']}>
                    <span className={styles['result-label']}>㎡</span>
                    <span className={styles['result-value']}>
                      {pyungConversionData.m2Value ? parseFloat(pyungConversionData.m2Value).toLocaleString('ko-KR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) : '0.00'} ㎡
                    </span>
                  </div>
                </div>
                
                {/* <div className={styles['result-group']}>
                  <h5>㎡ 기준</h5>
                  <div className={styles['result-item']}>
                    <span className={styles['result-label']}>제곱미터(㎡)</span>
                    <span className={styles['result-value']}>
                      {formData.m2Value ? parseFloat(formData.m2Value).toLocaleString('ko-KR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) : '0.00'} ㎡
                    </span>
                  </div>
                  <div className={styles['result-item']}>
                    <span className={styles['result-label']}>평</span>
                    <span className={styles['result-value']}>
                      {formData.pyungValue ? parseFloat(formData.pyungValue).toLocaleString('ko-KR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) : '0.00'} 평
                    </span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

                                 <div className={styles['form-section']}>
           <h3>㎡ -> 평</h3>
           
           <div className={styles['conversion-container']}>
             <div className={styles['button-section']}>
               <div className={styles['button-group']}>
                 <div className={styles['button-container']}>
                   {commonM2Values.map((value) => (
                     <button
                       key={`m2-${value}`}
                       type="button"
                       onClick={() => handleM2ButtonClick(value)}
                       className={styles['quick-button']}
                     >
                       {value}㎡
                     </button>
                   ))}
                 </div>
               </div>
             </div>

             <div className={styles['divider']}></div>

             <div className={styles['result-section']}>
               <div className={styles['result-display']}>
                 <div className={styles['result-group']}>
                   <h5>㎡ 기준</h5>
                   <div className={styles['result-item']}>
                     <span className={styles['result-label']}>㎡</span>
                     <span className={styles['result-value-black']}>
                       {m2ConversionData.m2Value ? parseFloat(m2ConversionData.m2Value).toLocaleString('ko-KR', {
                         minimumFractionDigits: 2,
                         maximumFractionDigits: 2
                       }) : '0.00'} ㎡
                     </span>
                   </div>
                   <div className={styles['result-item']}>
                     <span className={styles['result-label']}>평</span>
                     <span className={styles['result-value']}>
                       {m2ConversionData.pyungValue ? parseFloat(m2ConversionData.pyungValue).toLocaleString('ko-KR', {
                         minimumFractionDigits: 2,
                         maximumFractionDigits: 2
                       }) : '0.00'} 평
                     </span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className={styles['form-section']}>
          <h3>직접 입력</h3>
          
          <div className={styles['input-row']}>
            <div className={styles['input-group']}>
              <label htmlFor="m2Value">제곱미터(㎡)</label>
              <div className={styles['input-wrapper']}>
                <input
                  type="number"
                  id="m2Value"
                  name="m2Value"
                  value={formData.m2Value}
                  onChange={handleInputChange}
                  placeholder="예: 100"
                  className={styles['number-input']}
                  step="0.01"
                  min="0"
                />
                <span className={styles['unit-label']}>㎡</span>
              </div>
              {errors.m2Value && <span className={styles.error}>{errors.m2Value}</span>}
            </div>

            <div className={styles['input-group']}>
              <label htmlFor="pyungValue">평</label>
              <div className={styles['input-wrapper']}>
                <input
                  type="number"
                  id="pyungValue"
                  name="pyungValue"
                  value={formData.pyungValue}
                  onChange={handleInputChange}
                  placeholder="예: 30"
                  className={styles['number-input']}
                  step="0.01"
                  min="0"
                />
                <span className={styles['unit-label']}>평</span>
              </div>
              {errors.pyungValue && <span className={styles.error}>{errors.pyungValue}</span>}
            </div>
          </div>

          <div className={styles['form-actions']}>
            <button type="submit" className={styles['calculate-button']}>
              계산하기
            </button>
            <button type="button" onClick={handleReset} className={styles['reset-button']}>
              초기화
            </button>
          </div>
          
          {errors.general && <span className={styles.error}>{errors.general}</span>}
        </div>
      </form>
    </div>
  );
};

export default AreaInputForm; 