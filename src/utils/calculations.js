/**
 * 복리 계산 관련 유틸리티 함수들
 */

/**
 * 복리 계산 함수
 * @param {number} principal - 원금
 * @param {number} rate - 연이율 (소수점으로 입력, 예: 0.05 = 5%)
 * @param {number} time - 투자 기간 (년)
 * @param {number} frequency - 복리 빈도 (기본값: 1, 연 1회)
 * @returns {number} 최종 금액
 */
export function calculateCompoundInterest(principal, rate, time, frequency = 1) {
  if (principal <= 0 || rate < 0 || time < 0 || frequency <= 0) {
    throw new Error('모든 값은 양수여야 합니다.');
  }
  
  // 0년 투자는 원금을 반환
  if (time === 0) {
    return principal;
  }
  
  const amount = principal * Math.pow(1 + rate / frequency, frequency * time);
  return Math.round(amount * 100) / 100; // 소수점 2자리까지 반올림
}

/**
 * 연별 복리 계산 데이터 생성
 * @param {number} principal - 원금
 * @param {number} rate - 연이율 (소수점)
 * @param {number} time - 투자 기간 (년)
 * @returns {Array} 연별 계산 데이터 배열
 */
export function generateYearlyData(principal, rate, time) {
  const yearlyData = [];
  
  for (let year = 1; year <= time; year++) {
    const total = principal * Math.pow(1 + rate, year);
    const interest = total - principal;
    const profitRate = (interest / principal) * 100;
    
    yearlyData.push({
      year,
      principal,
      interest,
      total,
      profitRate
    });
  }
  
  return yearlyData;
}

/**
 * 월별 성장 데이터 생성 함수
 * @param {number} principal - 원금
 * @param {number} rate - 연이율 (소수점으로 입력)
 * @param {number} time - 투자 기간 (년)
 * @returns {Array} 월별 데이터 배열
 */
export function generateMonthlyData(principal, rate, time) {
  if (principal <= 0 || rate < 0 || time < 0) {
    throw new Error('모든 값은 양수여야 합니다.');
  }
  
  const monthlyData = [];
  const months = time * 12;
  
  for (let month = 0; month <= months; month++) {
    const year = month / 12;
    const amount = calculateCompoundInterest(principal, rate, year);
    const interest = amount - principal;
    
    monthlyData.push({
      month: month,
      year: Math.round(year * 100) / 100,
      amount: amount,
      interest: interest,
      principal: principal
    });
  }
  
  return monthlyData;
}

/**
 * 성장 단계 분석 (2배, 3배, 10배 도달 시점)
 * @param {number} principal - 원금
 * @param {number} rate - 연이율 (소수점)
 * @param {number} time - 투자 기간 (년)
 * @returns {Array} 성장 단계 데이터 배열
 */
export function analyzeGrowthStages(principal, rate, time) {
  const stages = [
    { name: '2배 도달', multiplier: 2 },
    { name: '3배 도달', multiplier: 3 },
    { name: '10배 도달', multiplier: 10 }
  ];
  
  const growthStages = [];
  
  stages.forEach(stage => {
    const targetAmount = principal * stage.multiplier;
    const reachYear = Math.log(stage.multiplier) / Math.log(1 + rate);
    const profitRate = (stage.multiplier - 1) * 100;
    
    // 투자 기간 내에 도달하는 경우만 포함
    if (reachYear <= time) {
      growthStages.push({
        name: stage.name,
        targetAmount,
        reachYear: Math.ceil(reachYear),
        profitRate
      });
    }
  });
  
  return growthStages;
}

/**
 * 종합 수익률 분석
 * @param {number} principal - 원금
 * @param {number} rate - 연이율 (소수점)
 * @param {number} time - 투자 기간 (년)
 * @returns {Object} 종합 분석 결과
 */
export function analyzeProfitability(principal, rate, time) {
  // 연별 데이터 생성
  const yearlyData = generateYearlyData(principal, rate, time);
  
  // 최종 결과 계산
  const finalData = yearlyData[yearlyData.length - 1];
  const totalAmount = finalData.total;
  const totalProfit = finalData.interest;
  const profitRate = finalData.profitRate;
  
  // 성장 단계 분석
  const growthStages = analyzeGrowthStages(principal, rate, time);
  
  return {
    principal,
    totalAmount,
    totalProfit,
    profitRate,
    yearlyData,
    growthStages
  };
}

/**
 * 총 이자 계산 함수
 * @param {number} finalAmount - 최종 금액
 * @param {number} principal - 원금
 * @returns {number} 총 이자
 */
export function calculateTotalInterest(finalAmount, principal) {
  return Math.round((finalAmount - principal) * 100) / 100;
}

/**
 * 수익률 계산 함수
 * @param {number} finalAmount - 최종 금액
 * @param {number} principal - 원금
 * @returns {number} 수익률 (퍼센트)
 */
export function calculateProfitRate(finalAmount, principal) {
  if (principal <= 0) {
    throw new Error('원금은 0보다 커야 합니다.');
  }
  
  const profitRate = ((finalAmount - principal) / principal) * 100;
  return Math.round(profitRate * 100) / 100; // 소수점 2자리까지 반올림
}

/**
 * 연평균 수익률 계산 함수 (CAGR)
 * @param {number} finalAmount - 최종 금액
 * @param {number} principal - 원금
 * @param {number} time - 투자 기간 (년)
 * @returns {number} 연평균 수익률 (퍼센트)
 */
export function calculateCAGR(finalAmount, principal, time) {
  if (principal <= 0 || time <= 0) {
    throw new Error('원금과 투자 기간은 0보다 커야 합니다.');
  }
  
  const cagr = (Math.pow(finalAmount / principal, 1 / time) - 1) * 100;
  return Math.round(cagr * 100) / 100;
}

/**
 * 월별 복리 계산 함수 (월 납입 시)
 * @param {number} monthlyPayment - 월 납입금
 * @param {number} rate - 연이율 (소수점으로 입력)
 * @param {number} time - 투자 기간 (년)
 * @returns {number} 최종 금액
 */
export function calculateMonthlyCompoundInterest(monthlyPayment, rate, time) {
  if (monthlyPayment <= 0 || rate < 0 || time <= 0) {
    throw new Error('모든 값은 양수여야 합니다.');
  }
  
  const monthlyRate = rate / 12;
  const months = time * 12;
  
  // 월 납입 복리 공식: FV = PMT * ((1 + r)^n - 1) / r
  const amount = monthlyPayment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  return Math.round(amount * 100) / 100;
}

/**
 * 금액 포맷팅 함수 (천 단위 구분)
 * @param {number} amount - 금액
 * @returns {string} 포맷된 금액 문자열
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('ko-KR').format(amount);
}

/**
 * 퍼센트 포맷팅 함수
 * @param {number} rate - 비율 (소수점)
 * @returns {string} 포맷된 퍼센트 문자열
 */
export function formatPercentage(rate) {
  return `${(rate * 100).toFixed(2)}%`;
}

/**
 * 입력값 검증 함수
 * @param {number} principal - 원금
 * @param {number} rate - 이율
 * @param {number} time - 기간
 * @returns {Object} 검증 결과
 */
export function validateInputs(principal, rate, time) {
  const errors = [];
  
  if (!principal || principal <= 0) {
    errors.push('원금은 0보다 커야 합니다.');
  }
  
  if (!rate || rate < 0) {
    errors.push('이율은 0 이상이어야 합니다.');
  }
  
  if (!time || time <= 0) {
    errors.push('투자 기간은 0보다 커야 합니다.');
  }
  
  if (rate > 1) {
    errors.push('이율은 100% 이하여야 합니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
} 