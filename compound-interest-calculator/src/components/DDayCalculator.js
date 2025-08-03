import React, { useState, useEffect } from 'react';
import styles from './DDayCalculator.module.css';

/**
 * DDayCalculator - D-Day 계산기 컴포넌트
 */
function DDayCalculator() {
  // 오늘 날짜를 YYYY-MM-DD 형식으로 포맷
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 오늘 날짜를 기본값으로 설정
  const getDefaultTargetDate = () => {
    return formatDate(new Date());
  };

  const [targetDate, setTargetDate] = useState(getDefaultTargetDate());
  const [result, setResult] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showResult, setShowResult] = useState(false);

  // 년도, 월, 일 상태 추가
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // 현재 시간을 1초마다 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 년도, 월, 일이 변경될 때 targetDate 업데이트
  useEffect(() => {
    const year = selectedYear;
    const month = String(selectedMonth).padStart(2, '0');
    const day = String(selectedDay).padStart(2, '0');
    setTargetDate(`${year}-${month}-${day}`);
  }, [selectedYear, selectedMonth, selectedDay]);

  // 시간 차이 계산 (밀리초 단위)
  const calculateTimeDifference = (target, current) => {
    const diffMs = target.getTime() - current.getTime();
    const absDiffMs = Math.abs(diffMs);
    
    const diffDays = Math.floor(absDiffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((absDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((absDiffMs % (1000 * 60)) / 1000);

    return {
      days: diffMs >= 0 ? diffDays : -diffDays,
      hours: diffMs >= 0 ? diffHours : -diffHours,
      minutes: diffMs >= 0 ? diffMinutes : -diffMinutes,
      seconds: diffMs >= 0 ? diffSeconds : -diffSeconds,
      totalMs: diffMs
    };
  };

  // 날짜 차이 계산
  const calculateDDay = () => {
    if (!targetDate) {
      setResult(null);
      return;
    }

    // targetDate에서 년, 월, 일을 추출하여 0시 0분 0초로 생성
    const [year, month, day] = targetDate.split('-').map(Number);
    const target = new Date(year, month -1, day, 0, 0, 0, 0);
    const todayDate = new Date(currentTime);
    
    // 디버깅을 위한 console.log 추가
    console.log('=== D-Day 계산 디버깅 ===');
    console.log('Target Date:', targetDate);
    console.log('Target DateTime:', target.toLocaleString('ko-KR'));
    console.log('Current DateTime:', todayDate.toLocaleString('ko-KR'));
    console.log('Target Timestamp:', target.getTime());
    console.log('Current Timestamp:', todayDate.getTime());
    console.log('========================');
    
    // 정확한 시간 차이 계산 (시간 포함)
    const timeDiff = calculateTimeDifference(target, todayDate);
    
    // 일수 계산 (날짜만 비교)
    const targetDateOnly = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const todayDateOnly = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
    const diffTime = targetDateOnly.getTime() - todayDateOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 개월 수 계산
    const monthsDiff = (target.getFullYear() - todayDate.getFullYear()) * 12 + 
                      (target.getMonth() - todayDate.getMonth());

    // 과거/미래 판단 (시간 차이 기준)
    const isPast = timeDiff.totalMs < 0;

    setResult({
      days: diffDays,
      months: monthsDiff,
      isPast: isPast,
      targetDate: target,
      todayDate: todayDate,
      timeDifference: timeDiff
    });
  };

  // 확인하기 버튼 클릭 시 계산 실행
  const handleCalculate = () => {
    calculateDDay();
    setShowResult(true);
  };

  // 확인 후에는 currentTime이 바뀔 때마다 자동으로 계산
  useEffect(() => {
    if (showResult) {
      calculateDDay();
    }
  }, [currentTime]);

  // 요일 반환
  const getDayOfWeek = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  // 날짜 포맷팅 (YYYY년 MM월 DD일)
  const formatKoreanDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = getDayOfWeek(date);
    return `${year}년 ${month}월 ${day}일(${dayOfWeek})`;
  };
  // 시간 포맷팅 (HH:MM:SS)
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // 시간 차이 포맷팅
  const formatTimeDifference = (timeDiff) => {
    const { days, hours, minutes, seconds } = timeDiff;
    const absDays = Math.abs(days);
    const absHours = Math.abs(hours);
    const absMinutes = Math.abs(minutes);
    const absSeconds = Math.abs(seconds);

    if (absDays > 0) {
      return `${absDays}일 ${absHours}시간 ${absMinutes}분 ${absSeconds}초`;
    } else if (absHours > 0) {
      return `${absHours}시간 ${absMinutes}분 ${absSeconds}초`;
    } else if (absMinutes > 0) {
      return `${absMinutes}분 ${absSeconds}초`;
    } else {
      return `${absSeconds}초`;
    }
  };

  // 년도 옵션 생성 (현재 년도 기준 ±10년)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  // 월 옵션 생성
  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  // 일 옵션 생성 (선택된 월에 따라)
  const generateDayOptions = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  return (
    <div className={styles['dday-calculator']}>
      <div className={styles['calculator-container']}>
        <h2>D-Day 계산기</h2>
        
        {/* 현재 시간 표시 */}
        <div className={styles['current-time']}>
          <span>오늘 날짜: {formatKoreanDate(currentTime)}</span>
        </div>

        {/* 입력 폼 */}
        <div className={styles['input-form']}>
          <div className={styles['input-group']}>
            <label style={{ textAlign: 'center', display: 'block', marginBottom: '1rem' }}>목표 날짜를 선택해 주세요</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{ padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '1rem' }}
              >
                {generateYearOptions().map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
              
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                style={{ padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '1rem' }}
              >
                {generateMonthOptions().map(month => (
                  <option key={month} value={month}>{month}월</option>
                ))}
              </select>
              
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                style={{ padding: '0.75rem', border: '2px solid #e0e0e0', borderRadius: '6px', fontSize: '1rem' }}
              >
                {generateDayOptions().map(day => (
                  <option key={day} value={day}>{day}일</option>
                ))}
              </select>
              
              <button 
                onClick={handleCalculate}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '80px'
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>

        {/* 사용법 안내 */}
      </div>

      {/* 결과 표시 */}
      {showResult && result && (
        <div className={styles['results-container']}>
          <h3>D-Day 계산 결과</h3>
          
          {/* 목표 날짜 표시 */}
          <div className={styles['target-date-section']}>
            <div className={styles['target-date']}>
              <strong>목표 날짜:</strong> {formatKoreanDate(result.targetDate)}
            </div>
          </div>
          
          {/* D-Day 결과 표시 */}
          <div className={styles['dday-result-section']}>
            <div className={styles['dday-result']}>
              {result.isPast ? (
                <div className={styles['past-date']}>
                  <span className={styles['dday-number']}>D+{Math.abs(result.days)}</span>
                  <span className={styles['dday-text']}>지난 날짜입니다</span>
                  <div className={styles['time-difference']}>
                    <span className={styles['time-label']}>경과 시간:</span>
                    <span className={styles['time-value']}>{formatTimeDifference(result.timeDifference)}</span>
                  </div>
                </div>
              ) : (
                <div className={styles['future-date']}>
                  <span className={styles['dday-number']}>D-{result.days}</span>
                  <span className={styles['dday-text']}>남은 날짜입니다</span>
                  <div className={styles['time-difference']}>
                    <span className={styles['time-label']}>남은 시간:</span>
                    <span className={styles['time-value']}>{formatTimeDifference(result.timeDifference)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 추가 정보 표시 */}
          <div className={styles['additional-info-section']}>
            <div className={styles['additional-info']}>
              <div className={styles['info-item']}>
                <span className={styles.label}>일수 차이:</span>
                <span className={styles.value}>{Math.abs(result.days)}일</span>
              </div>
              <div className={styles['info-item']}>
                <span className={styles.label}>개월 수 차이:</span>
                <span className={styles.value}>{Math.abs(result.months)}개월</span>
              </div>
              <div className={styles['info-item']}>
                <span className={styles.label}>정확한 시간:</span>
                <span className={styles.value}>{formatTimeDifference(result.timeDifference)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DDayCalculator; 