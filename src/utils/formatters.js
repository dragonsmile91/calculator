/**
 * 공통 포맷팅 유틸리티 함수들
 */

/**
 * 숫자를 천 단위 구분 쉼표로 포맷팅
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
export const formatNumber = (num) => {
  return num.toLocaleString('ko-KR');
};

/**
 * 숫자를 천 단위 구분 쉼표와 소수점 한 자리로 포맷팅
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
export const formatNumberWithDecimal = (num) => {
  return num.toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
};

/**
 * 숫자를 천 단위 구분 쉼표로 포맷팅 (정수만)
 * @param {number} num - 포맷팅할 숫자
 * @returns {string} 포맷팅된 문자열
 */
export const formatNumberInteger = (num) => {
  return Math.round(num).toLocaleString('ko-KR');
};

/**
 * 퍼센트를 소수점 한 자리까지 표시
 * @param {number} rate - 퍼센트 값
 * @returns {string} 포맷팅된 퍼센트 문자열
 */
export const formatPercentage = (rate) => {
  return `${rate.toFixed(1)}%`;
};

/**
 * 숫자를 만원 단위로 포맷팅
 * @param {number} value - 포맷팅할 숫자
 * @returns {string} 만원 단위 문자열
 */
export const formatToManWon = (value) => {
  return `${(value / 10000).toFixed(1)}만원`;
};

/**
 * 천 단위 구분 쉼표 추가 함수
 * @param {string} value - 숫자 문자열
 * @returns {string} 쉼표가 추가된 문자열
 */
export const addCommas = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 쉼표 제거 함수
 * @param {string} value - 쉼표가 포함된 문자열
 * @returns {string} 쉼표가 제거된 문자열
 */
export const removeCommas = (value) => {
  return value.toString().replace(/,/g, '');
};

/**
 * 숫자를 한국어 단위로 변환하는 함수
 * @param {number} num - 변환할 숫자
 * @returns {string} 한국어 단위가 포함된 문자열
 */
export const formatToUnit = (num) => {
  if (num === 0) return '';
  
  const units = [
    { value: 1000000000000000000, label: '해' },
    { value: 10000000000000000, label: '경' },
    { value: 1000000000000, label: '조' },
    { value: 100000000, label: '억' },
    { value: 10000, label: '만' },
    { value: 1000, label: '천' }
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      const quotient = Math.floor(num / unit.value);
      const remainder = num % unit.value;
      
      if (remainder === 0) {
        return `${addCommas(quotient)}${unit.label}원`;
      } else {
        const remainderText = formatToUnit(remainder);
        return `${addCommas(quotient)}${unit.label}${remainderText ? remainderText.replace('원', '') : ''}원`;
      }
    }
  }
  
  return `${addCommas(num)}원`;
}; 