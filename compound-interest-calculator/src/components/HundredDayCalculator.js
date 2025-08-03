import React, { useState, useRef, useEffect } from 'react';
import HundredDayInputForm from './HundredDayInputForm';
import HundredDayResultDisplay from './HundredDayResultDisplay';
import styles from './HundredDayCalculator.module.css';

/**
 * HundredDayCalculator - 100일 계산기 메인 컴포넌트
 * 입력, 결과를 통합 관리
 */
function HundredDayCalculator() {
  // 상태 관리
  const [calculationResult, setCalculationResult] = useState(null);
  
  // 스크롤을 위한 ref
  const inputFormRef = useRef(null);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    setCalculationResult(null);
  }, []);

  /**
   * 계산 처리 함수
   * @param {Object} formData - 입력 폼 데이터
   */
  const handleCalculate = (formData) => {
    const { selectedDate } = formData;
    
    // 100일 계산
    const result = calculateHundredDays(selectedDate);
    setCalculationResult(result);
    
    // 계산 완료 후 스크롤을 계산하기 버튼까지 이동
    setTimeout(() => {
      if (inputFormRef.current) {
        inputFormRef.current.scrollToCalculateButton();
      }
    }, 100);
  };

  /**
   * 결과 초기화 함수
   */
  const handleReset = () => {
    setCalculationResult(null);
  };

  /**
   * 100일 계산 함수
   */
  const calculateHundredDays = (selectedDate) => {
    const startDate = new Date(selectedDate);
    const hundredDaysLater = new Date(startDate);
    hundredDaysLater.setDate(startDate.getDate() + 100);
    
    // 요일 배열
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    
    // 날짜 포맷팅
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}년 ${month}월 ${day}일`;
    };
    
    return {
      startDate: formatDate(startDate),
      startWeekday: weekdays[startDate.getDay()],
      hundredDaysLater: formatDate(hundredDaysLater),
      hundredDaysWeekday: weekdays[hundredDaysLater.getDay()],
      startDateObj: startDate,
      hundredDaysLaterObj: hundredDaysLater
    };
  };

  return (
    <div className={styles.calculator}>
      <div className={styles['calculator-section']}>
        <HundredDayInputForm ref={inputFormRef} onCalculate={handleCalculate} onReset={handleReset} />
      </div>
      
      {calculationResult && (
        <div className={styles['calculator-section']}>
          <div className={styles['results-container']}>
            <HundredDayResultDisplay calculationData={calculationResult} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HundredDayCalculator; 