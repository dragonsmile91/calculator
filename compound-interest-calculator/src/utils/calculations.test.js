import {
  calculateCompoundInterest,
  generateYearlyData,
  generateMonthlyData,
  generateGrowthStages,
  calculateTotalInterest,
  calculateProfitRate,
  calculateCAGR,
  calculateRealRate,
  analyzeProfitability,
  formatCurrency,
  formatPercentage,
  validateInputs
} from './calculations';

describe('복리 계산 함수 테스트', () => {
  
  describe('calculateCompoundInterest', () => {
    test('기본 복리 계산이 정확해야 한다', () => {
      const result = calculateCompoundInterest(1000, 0.05, 10);
      expect(result).toBe(1628.89);
    });

    test('1년 복리 계산이 정확해야 한다', () => {
      const result = calculateCompoundInterest(1000, 0.05, 1);
      expect(result).toBe(1050);
    });

    test('0년 투자는 원금을 반환해야 한다', () => {
      const result = calculateCompoundInterest(1000, 0.05, 0);
      expect(result).toBe(1000);
    });

    test('음수 원금에 대해 에러를 발생시켜야 한다', () => {
      expect(() => {
        calculateCompoundInterest(-1000, 0.05, 10);
      }).toThrow('모든 값은 양수여야 합니다.');
    });

    test('음수 이율에 대해 에러를 발생시켜야 한다', () => {
      expect(() => {
        calculateCompoundInterest(1000, -0.05, 10);
      }).toThrow('모든 값은 양수여야 합니다.');
    });

    test('음수 기간에 대해 에러를 발생시켜야 한다', () => {
      expect(() => {
        calculateCompoundInterest(1000, 0.05, -10);
      }).toThrow('모든 값은 양수여야 합니다.');
    });
  });

  describe('generateYearlyData', () => {
    test('연별 데이터가 올바른 구조를 가져야 한다', () => {
      const data = generateYearlyData(1000, 0.05, 5);
      
      expect(data).toHaveLength(6); // 0년부터 5년까지
      expect(data[0]).toHaveProperty('year', 0);
      expect(data[0]).toHaveProperty('amount', 1000);
      expect(data[5]).toHaveProperty('year', 5);
      expect(data[5]).toHaveProperty('formattedAmount');
      expect(data[5]).toHaveProperty('formattedGrowthRate');
    });

    test('첫 번째 해의 성장률은 0이어야 한다', () => {
      const data = generateYearlyData(1000, 0.05, 1);
      expect(data[0].growthRate).toBe(0);
    });

    test('포맷팅된 데이터가 포함되어야 한다', () => {
      const data = generateYearlyData(1000, 0.05, 1);
      expect(data[1]).toHaveProperty('formattedAmount');
      expect(data[1]).toHaveProperty('formattedInterest');
      expect(data[1]).toHaveProperty('formattedGrowthRate');
    });
  });

  describe('generateMonthlyData', () => {
    test('월별 데이터가 올바른 개수를 가져야 한다', () => {
      const data = generateMonthlyData(1000, 0.05, 1);
      expect(data).toHaveLength(13); // 0개월부터 12개월까지
    });

    test('월별 데이터의 year가 소수점으로 정확해야 한다', () => {
      const data = generateMonthlyData(1000, 0.05, 1);
      expect(data[6].year).toBe(0.5); // 6개월 = 0.5년
      expect(data[12].year).toBe(1); // 12개월 = 1년
    });
  });

  describe('generateGrowthStages', () => {
    test('성장 단계 데이터가 올바른 구조를 가져야 한다', () => {
      const stages = generateGrowthStages(1000, 0.05, 20);
      
      expect(stages).toHaveProperty('doubling');
      expect(stages).toHaveProperty('tripling');
      expect(stages).toHaveProperty('tenfold');
      expect(stages).toHaveProperty('milestones');
      expect(Array.isArray(stages.milestones)).toBe(true);
    });

    test('2배 도달 시점이 계산되어야 한다', () => {
      const stages = generateGrowthStages(1000, 0.05, 20);
      expect(stages.doubling).toBeTruthy();
      expect(stages.doubling.multiplier).toBe(2);
    });

    test('마일스톤이 5년 단위로 생성되어야 한다', () => {
      const stages = generateGrowthStages(1000, 0.05, 20);
      const milestoneYears = stages.milestones.map(m => m.year);
      expect(milestoneYears).toContain(5);
      expect(milestoneYears).toContain(10);
      expect(milestoneYears).toContain(15);
    });
  });

  describe('calculateTotalInterest', () => {
    test('총 이자가 정확히 계산되어야 한다', () => {
      const result = calculateTotalInterest(1628.89, 1000);
      expect(result).toBe(628.89);
    });

    test('원금과 같을 때 이자는 0이어야 한다', () => {
      const result = calculateTotalInterest(1000, 1000);
      expect(result).toBe(0);
    });
  });

  describe('calculateProfitRate', () => {
    test('수익률이 정확히 계산되어야 한다', () => {
      const result = calculateProfitRate(1628.89, 1000);
      expect(result).toBe(62.89);
    });

    test('원금과 같을 때 수익률은 0이어야 한다', () => {
      const result = calculateProfitRate(1000, 1000);
      expect(result).toBe(0);
    });

    test('음수 원금에 대해 에러를 발생시켜야 한다', () => {
      expect(() => {
        calculateProfitRate(1000, -1000);
      }).toThrow('원금은 0보다 커야 합니다.');
    });
  });

  describe('calculateCAGR', () => {
    test('CAGR이 정확히 계산되어야 한다', () => {
      const result = calculateCAGR(1628.89, 1000, 10);
      expect(result).toBe(5);
    });

    test('1년 투자 시 CAGR이 수익률과 같아야 한다', () => {
      const result = calculateCAGR(1050, 1000, 1);
      expect(result).toBe(5);
    });

    test('0년 투자에 대해 에러를 발생시켜야 한다', () => {
      expect(() => {
        calculateCAGR(1000, 1000, 0);
      }).toThrow('원금과 투자 기간은 0보다 커야 합니다.');
    });
  });

  describe('calculateRealRate', () => {
    test('실질 수익률이 정확히 계산되어야 한다', () => {
      const result = calculateRealRate(5, 2); // 5% 명목 수익률, 2% 인플레이션
      expect(result).toBe(2.94);
    });

    test('인플레이션이 0일 때 실질 수익률이 명목 수익률과 같아야 한다', () => {
      const result = calculateRealRate(5, 0);
      expect(result).toBe(5);
    });
  });

  describe('analyzeProfitability', () => {
    test('수익률 분석이 완전한 데이터를 반환해야 한다', () => {
      const analysis = analyzeProfitability(1000, 0.05, 10);
      
      expect(analysis).toHaveProperty('principal', 1000);
      expect(analysis).toHaveProperty('finalAmount');
      expect(analysis).toHaveProperty('totalProfit');
      expect(analysis).toHaveProperty('profitRate');
      expect(analysis).toHaveProperty('cagr');
      expect(analysis).toHaveProperty('realRate');
      expect(analysis).toHaveProperty('formattedPrincipal');
      expect(analysis).toHaveProperty('formattedFinalAmount');
      expect(analysis).toHaveProperty('formattedProfitRate');
    });

    test('인플레이션을 고려한 실질 수익률이 계산되어야 한다', () => {
      const analysis = analyzeProfitability(1000, 0.05, 10, 2);
      expect(analysis.inflationRate).toBe(2);
      expect(analysis.realRate).toBeLessThan(analysis.profitRate);
    });
  });

  describe('formatCurrency', () => {
    test('금액이 한국어 형식으로 포맷되어야 한다', () => {
      const result = formatCurrency(1234567);
      expect(result).toBe('1,234,567');
    });

    test('소수점이 있는 금액도 포맷되어야 한다', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('1,234.56');
    });
  });

  describe('formatPercentage', () => {
    test('퍼센트가 올바른 형식으로 포맷되어야 한다', () => {
      const result = formatPercentage(0.0523);
      expect(result).toBe('5.23%');
    });

    test('0 퍼센트도 올바르게 포맷되어야 한다', () => {
      const result = formatPercentage(0);
      expect(result).toBe('0.00%');
    });
  });

  describe('validateInputs', () => {
    test('유효한 입력에 대해 isValid가 true여야 한다', () => {
      const result = validateInputs(1000, 0.05, 10);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('음수 원금에 대해 에러를 반환해야 한다', () => {
      const result = validateInputs(-1000, 0.05, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('원금은 0보다 커야 합니다.');
    });

    test('음수 이율에 대해 에러를 반환해야 한다', () => {
      const result = validateInputs(1000, -0.05, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('이율은 0 이상이어야 합니다.');
    });

    test('음수 기간에 대해 에러를 반환해야 한다', () => {
      const result = validateInputs(1000, 0.05, -10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('투자 기간은 0보다 커야 합니다.');
    });

    test('100% 초과 이율에 대해 에러를 반환해야 한다', () => {
      const result = validateInputs(1000, 1.5, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('이율은 100% 이하여야 합니다.');
    });

    test('여러 에러가 동시에 감지되어야 한다', () => {
      const result = validateInputs(-1000, -0.05, -10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });
}); 