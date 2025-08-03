import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Calendar, CalendarDays } from 'lucide-react';
import styles from './HundredDayInputForm.module.css';

/**
 * HundredDayInputForm - 100일 계산기 입력 폼
 */
const HundredDayInputForm = forwardRef(({ onCalculate, onReset }, ref) => {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    selectedDate: new Date().toISOString().split('T')[0] // 오늘 날짜를 기본값으로
  });

  // 드롭다운 상태 관리
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // 캘린더 표시 상태
  const [showCalendar, setShowCalendar] = useState(true);
  
  // 캘린더 네비게이션 상태
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  
  // 유효성 검사 상태
  const [errors, setErrors] = useState({});
  
  // 계산 실행 여부 추적
  const [hasCalculated, setHasCalculated] = useState(false);

  // 컴포넌트 마운트 시 초기 설정
  useEffect(() => {
    const today = new Date();
    setFormData({
      selectedDate: today.toISOString().split('T')[0]
    });
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth() + 1);
    setSelectedDay(today.getDate());
    setCalendarYear(today.getFullYear());
    setCalendarMonth(today.getMonth());
    setShowCalendar(true);
    setHasCalculated(false);
    setErrors({});
  }, []);

  // ref를 통해 부모 컴포넌트에서 접근할 수 있는 메서드들
  useImperativeHandle(ref, () => ({
    scrollToCalculateButton: () => {
      setTimeout(() => {
        const formSection = document.querySelector(`.${styles['form-section']}`);
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }));

  /**
   * 드롭다운 변경 처리
   */
  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    updateSelectedDate(year, selectedMonth, selectedDay);
  };

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    updateSelectedDate(selectedYear, month, selectedDay);
  };

  const handleDayChange = (e) => {
    const day = parseInt(e.target.value);
    setSelectedDay(day);
    updateSelectedDate(selectedYear, selectedMonth, day);
  };

  /**
   * 증감 버튼 처리
   */
  const handleYearIncrement = () => {
    const newYear = selectedYear + 1;
    setSelectedYear(newYear);
    updateSelectedDate(newYear, selectedMonth, selectedDay);
    // 년도 드롭다운에 포커스
    setTimeout(() => {
      const yearSelect = document.getElementById('yearSelect');
      if (yearSelect) {
        yearSelect.focus();
      }
    }, 100);
  };

  const handleYearDecrement = () => {
    const newYear = selectedYear - 1;
    setSelectedYear(newYear);
    updateSelectedDate(newYear, selectedMonth, selectedDay);
    // 년도 드롭다운에 포커스
    setTimeout(() => {
      const yearSelect = document.getElementById('yearSelect');
      if (yearSelect) {
        yearSelect.focus();
      }
    }, 100);
  };

  const handleMonthIncrement = () => {
    let newMonth = selectedMonth + 1;
    let newYear = selectedYear;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear = selectedYear + 1;
      setSelectedYear(newYear);
    }
    
    setSelectedMonth(newMonth);
    updateSelectedDate(newYear, newMonth, selectedDay);
    // 월 드롭다운에 포커스
    setTimeout(() => {
      const monthSelect = document.getElementById('monthSelect');
      if (monthSelect) {
        monthSelect.focus();
      }
    }, 100);
  };

  const handleMonthDecrement = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear = selectedYear - 1;
      setSelectedYear(newYear);
    }
    
    setSelectedMonth(newMonth);
    updateSelectedDate(newYear, newMonth, selectedDay);
    // 월 드롭다운에 포커스
    setTimeout(() => {
      const monthSelect = document.getElementById('monthSelect');
      if (monthSelect) {
        monthSelect.focus();
      }
    }, 100);
  };

  const handleDayIncrement = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    let newDay = selectedDay + 1;
    let newMonth = selectedMonth;
    let newYear = selectedYear;
    
    if (newDay > daysInMonth) {
      newDay = 1;
      newMonth = selectedMonth + 1;
      
      if (newMonth > 12) {
        newMonth = 1;
        newYear = selectedYear + 1;
        setSelectedYear(newYear);
      }
      
      setSelectedMonth(newMonth);
    }
    
    setSelectedDay(newDay);
    updateSelectedDate(newYear, newMonth, newDay);
    // 일 드롭다운에 포커스
    setTimeout(() => {
      const daySelect = document.getElementById('daySelect');
      if (daySelect) {
        daySelect.focus();
      }
    }, 100);
  };

  const handleDayDecrement = () => {
    let newDay = selectedDay - 1;
    let newMonth = selectedMonth;
    let newYear = selectedYear;
    
    if (newDay < 1) {
      newMonth = selectedMonth - 1;
      
      if (newMonth < 1) {
        newMonth = 12;
        newYear = selectedYear - 1;
        setSelectedYear(newYear);
      }
      
      setSelectedMonth(newMonth);
      newDay = new Date(newYear, newMonth, 0).getDate();
    }
    
    setSelectedDay(newDay);
    updateSelectedDate(newYear, newMonth, newDay);
    // 일 드롭다운에 포커스
    setTimeout(() => {
      const daySelect = document.getElementById('daySelect');
      if (daySelect) {
        daySelect.focus();
      }
    }, 100);
  };

  /**
   * 선택된 날짜 업데이트
   */
  const updateSelectedDate = (year, month, day) => {
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormData(prev => ({
      ...prev,
      selectedDate: dateString
    }));
    
    // 에러 초기화
    if (errors.selectedDate) {
      setErrors(prev => ({
        ...prev,
        selectedDate: ''
      }));
    }

    // 첫 번째 계산 이후에만 자동으로 계산 실행
    if (hasCalculated) {
      setTimeout(() => {
        const newFormData = {
          selectedDate: dateString
        };
        onCalculate(newFormData);
      }, 100);
    }
  };

  /**
   * 날짜 입력 변경 처리
   */
  const handleDateInputChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      selectedDate: value
    }));
    
    // 에러 초기화
    if (errors.selectedDate) {
      setErrors(prev => ({
        ...prev,
        selectedDate: ''
      }));
    }
  };

  /**
   * 캘린더에서 날짜 선택 처리
   */
  const handleCalendarDateSelect = (e) => {
    const { value } = e.target;
    const selectedDate = new Date(value);
    
    // 드롭다운 상태 업데이트
    setSelectedYear(selectedDate.getFullYear());
    setSelectedMonth(selectedDate.getMonth() + 1);
    setSelectedDay(selectedDate.getDate());
    
    // 폼 데이터 업데이트
    setFormData(prev => ({
      ...prev,
      selectedDate: value
    }));
    setShowCalendar(false);
    
    // 에러 초기화
    if (errors.selectedDate) {
      setErrors(prev => ({
        ...prev,
        selectedDate: ''
      }));
    }

    // 캘린더에서 날짜 선택 시 자동으로 계산 실행
    setTimeout(() => {
      const newFormData = {
        selectedDate: value
      };
      onCalculate(newFormData);
    }, 100);
  };

  /**
   * 유효성 검사
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.selectedDate) {
      newErrors.selectedDate = '날짜를 선택해주세요';
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
      setHasCalculated(true);
      onCalculate(formData);
    }
  };

  /**
   * 폼 초기화
   */
  const handleReset = () => {
    const today = new Date();
    setFormData({
      selectedDate: today.toISOString().split('T')[0]
    });
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth() + 1);
    setSelectedDay(today.getDate());
    setCalendarYear(today.getFullYear());
    setCalendarMonth(today.getMonth());
    setErrors({});
    setShowCalendar(true);
    setHasCalculated(false);
    
    // 결과 섹션도 초기화
    if (onReset) {
      onReset();
    }
  };

  /**
   * 드롭다운 옵션 생성 함수
   */
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  const generateMonthOptions = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const generateDayOptions = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  /**
   * 캘린더 팝업 열기
   */
  const openCalendar = () => {
    setShowCalendar(true);
    // 현재 선택된 날짜로 캘린더 초기화
    setCalendarYear(selectedYear);
    setCalendarMonth(selectedMonth - 1);
  };

  /**
   * 캘린더 네비게이션
   */
  const goToPreviousMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  /**
   * 캘린더 날짜 선택
   */
  const handleCalendarDateClick = (year, month, day) => {
    // 시간대 차이를 피하기 위해 직접 날짜 문자열 생성
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // 드롭다운 상태 업데이트
    setSelectedYear(year);
    setSelectedMonth(month + 1);
    setSelectedDay(day);
    
    // 폼 데이터 업데이트
    setFormData(prev => ({
      ...prev,
      selectedDate: dateString
    }));
    setShowCalendar(false);
    
    // 에러 초기화
    if (errors.selectedDate) {
      setErrors(prev => ({
        ...prev,
        selectedDate: ''
      }));
    }

    // 초기화 상태에서 캘린더 선택 시 바로 계산 실행
    if (!hasCalculated) {
      setHasCalculated(true);
      setTimeout(() => {
        const newFormData = {
          selectedDate: dateString
        };
        onCalculate(newFormData);
      }, 100);
    } else {
      // 첫 번째 계산 이후에는 자동으로 계산 실행
      setTimeout(() => {
        const newFormData = {
          selectedDate: dateString
        };
        onCalculate(newFormData);
      }, 100);
    }
  };

  /**
   * 캘린더 렌더링
   */
  const renderCalendar = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const isCurrentMonth = month === calendarMonth;
      const isSelected = year === selectedYear && month === selectedMonth - 1 && day === selectedDay;
      const isToday = year === new Date().getFullYear() && 
                     month === new Date().getMonth() && 
                     day === new Date().getDate();
      
      days.push(
        <button
          key={i}
          type="button"
          onClick={() => handleCalendarDateClick(year, month, day)}
          className={`${styles['calendar-day']} ${
            isCurrentMonth ? styles['current-month'] : styles['other-month']
          } ${isSelected ? styles['selected'] : ''} ${
            isToday ? styles['today'] : ''
          }`}
          disabled={!isCurrentMonth}
        >
          {day}
        </button>
      );
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return (
      <div className={styles['calendar-container']}>
        <div className={styles['calendar-navigation']}>
          <button type="button" onClick={goToPreviousMonth} className={styles['nav-button']}>
            ‹
          </button>
          <span className={styles['calendar-title']}>
            {calendarYear}년 {calendarMonth + 1}월
          </span>
          <button type="button" onClick={goToNextMonth} className={styles['nav-button']}>
            ›
          </button>
        </div>
        <div className={styles['calendar-weekdays']}>
          <div className={styles['weekday']}>일</div>
          <div className={styles['weekday']}>월</div>
          <div className={styles['weekday']}>화</div>
          <div className={styles['weekday']}>수</div>
          <div className={styles['weekday']}>목</div>
          <div className={styles['weekday']}>금</div>
          <div className={styles['weekday']}>토</div>
        </div>
        <div className={styles['calendar-days']}>
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className={styles['input-form-container']}>
      <div className={styles['form-header']}>
        <h2>100일 계산기</h2>
        {/* <p> 100일 후의 날짜를 계산해드립니다</p> */}
      </div>

      <form onSubmit={handleSubmit} className={styles['input-form']}>
        <div className={styles['form-section']}>
          <h3>시작 날짜를 선택해주세요</h3>
          
          <div className={styles['date-input-container']}>
            <div className={styles['input-group']}>
              <div className={styles['date-dropdown-container']}>
                <div className={styles['date-dropdown-group']}>
                  <select 
                    value={selectedYear} 
                    onChange={handleYearChange}
                    className={styles['date-dropdown']}
                    id="yearSelect"
                  >
                    {generateYearOptions().map(year => (
                      <option key={year} value={year}>{year}년</option>
                    ))}
                  </select>
                  <div className={styles['increment-buttons']}>
                    <button type="button" onClick={handleYearIncrement} className={styles['increment-button']}>+1년</button>
                    <button type="button" onClick={handleYearDecrement} className={styles['increment-button']}>-1년</button>
                  </div>
                </div>
                
                <div className={styles['date-dropdown-group']}>
                  <select 
                    value={selectedMonth} 
                    onChange={handleMonthChange}
                    className={styles['date-dropdown']}
                    id="monthSelect"
                  >
                    {generateMonthOptions().map(month => (
                      <option key={month} value={month}>{month}월</option>
                    ))}
                  </select>
                  <div className={styles['increment-buttons']}>
                    <button type="button" onClick={handleMonthIncrement} className={styles['increment-button']}>+1달</button>
                    <button type="button" onClick={handleMonthDecrement} className={styles['increment-button']}>-1달</button>
                  </div>
                </div>
                
                <div className={styles['date-dropdown-group']}>
                  <select 
                    value={selectedDay} 
                    onChange={handleDayChange}
                    className={styles['date-dropdown']}
                    id="daySelect"
                  >
                    {generateDayOptions().map(day => (
                      <option key={day} value={day}>{day}일</option>
                    ))}
                  </select>
                  <div className={styles['increment-buttons']}>
                    <button type="button" onClick={handleDayIncrement} className={styles['increment-button']}>+1일</button>
                    <button type="button" onClick={handleDayDecrement} className={styles['increment-button']}>-1일</button>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={openCalendar}
                  className={styles['calendar-button']}
                >
                  <Calendar size={20} />
                </button>
              </div>
              {errors.selectedDate && <span className={styles.error}>{errors.selectedDate}</span>}
            </div>
            
            {showCalendar && (
              <div className={styles['calendar-popup']}>
                <div className={styles['calendar-header']}>
                  <h4>날짜 선택</h4>
                  <button
                    type="button"
                    onClick={() => setShowCalendar(false)}
                    className={styles['close-button']}
                  >
                    ✕
                  </button>
                </div>
                <div className={styles['calendar-grid']}>
                  {renderCalendar()}
                </div>
                <div className={styles['calendar-note']}>
                  <CalendarDays size={16} />
                  <span>날짜를 선택하면 자동으로 계산됩니다</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles['form-actions']}>
          <button type="submit" className={styles['calculate-button']}>
            100일 계산하기
          </button>
          <button type="button" onClick={handleReset} className={styles['reset-button']}>
            초기화
          </button>
        </div>
      </form>
    </div>
  );
});

HundredDayInputForm.displayName = 'HundredDayInputForm';

export default HundredDayInputForm; 