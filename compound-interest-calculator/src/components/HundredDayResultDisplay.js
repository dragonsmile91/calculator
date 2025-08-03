import React from 'react';
import { CalendarDays, ArrowRight } from 'lucide-react';
import styles from './HundredDayResultDisplay.module.css';

/**
 * HundredDayResultDisplay - 100일 계산 결과 표시
 */
function HundredDayResultDisplay({ calculationData }) {
  const {
    startDate,
    startWeekday,
    hundredDaysLater,
    hundredDaysWeekday
  } = calculationData;

  return (
    <div className={styles['result-display']}>
      <div className={styles['result-header']}>
        <div className={styles['date-indicator']}>
          <CalendarDays size={24} />
          <span className={styles['days-text']}>100일 후</span>
        </div>
      </div>

      <div className={styles['result-content']}>
        <div className={styles['result-section']}>
          <h3>날짜 정보</h3>
          
          <div className={styles['date-flow']}>
            <div className={styles['date-card']}>
              <div className={styles['date-label']}>시작 날짜</div>
              <div className={styles['date-value']}>{startDate}</div>
              <div className={styles['weekday']}>{startWeekday}</div>
            </div>
            
            <div className={styles['arrow-container']}>
              <ArrowRight size={32} />
              <span className={styles['arrow-text']}>100일 후</span>
            </div>
            
            <div className={`${styles['date-card']} ${styles['result-date']}`}>
              <div className={styles['date-label']}>100일 후</div>
              <div className={styles['date-value']}>{hundredDaysLater}</div>
              <div className={styles['weekday']}>{hundredDaysWeekday}</div>
            </div>
          </div>
        </div>




      </div>
    </div>
  );
}

export default HundredDayResultDisplay; 