import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultDisplay from './ResultDisplay';

describe('ResultDisplay 컴포넌트', () => {
  const mockCalculationData = {
    principal: 1000000,
    finalAmount: 1628894.63,
    totalProfit: 628894.63,
    profitRate: 62.89,
    cagr: 5.00,
    realRate: 60.68,
    inflationRate: 2.0,
    time: 10,
    rate: 0.05,
    formattedPrincipal: '1,000,000',
    formattedFinalAmount: '1,628,894.63',
    formattedTotalProfit: '628,894.63',
    formattedProfitRate: '62.89%',
    formattedCAGR: '5.00%',
    formattedRealRate: '60.68%',
    growthStages: {
      doubling: { year: 14, amount: 2000000, multiplier: 2 },
      tripling: { year: 22, amount: 3000000, multiplier: 3 },
      tenfold: { year: 47, amount: 10000000, multiplier: 10 },
      milestones: [
        { year: 5, amount: 1276281.56, growthRate: 27.63 },
        { year: 10, amount: 1628894.63, growthRate: 62.89 },
        { year: 15, amount: 2078928.18, growthRate: 107.89 }
      ]
    }
  };

  describe('기본 렌더링', () => {
    test('계산 데이터가 없을 때 아무것도 렌더링하지 않아야 한다', () => {
      const { container } = render(<ResultDisplay calculationData={null} />);
      expect(container.firstChild).toBeNull();
    });

    test('제목이 올바르게 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('계산 결과')).toBeInTheDocument();
    });

    test('모든 섹션 제목이 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('투자 성과')).toBeInTheDocument();
      expect(screen.getByText('수익률 분석')).toBeInTheDocument();
      expect(screen.getByText('투자 정보')).toBeInTheDocument();
    });
  });

  describe('투자 성과 섹션', () => {
    test('원금이 올바르게 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('원금')).toBeInTheDocument();
      expect(screen.getByText('1,000,000원')).toBeInTheDocument();
    });

    test('최종 금액이 올바르게 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('최종 금액')).toBeInTheDocument();
      expect(screen.getByText('1,628,894.63원')).toBeInTheDocument();
    });

    test('총 수익이 올바르게 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('총 수익')).toBeInTheDocument();
      expect(screen.getByText('628,894.63원')).toBeInTheDocument();
    });
  });

  describe('수익률 분석 섹션', () => {
    test('수익률이 올바르게 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('수익률')).toBeInTheDocument();
      expect(screen.getByText('62.89%')).toBeInTheDocument();
    });

    test('CAGR이 올바르게 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('연평균 수익률 (CAGR)')).toBeInTheDocument();
      expect(screen.getByText('5.00%')).toBeInTheDocument();
    });

    test('인플레이션이 있을 때 실질 수익률이 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('실질 수익률 (인플레이션 고려)')).toBeInTheDocument();
      expect(screen.getByText('60.68%')).toBeInTheDocument();
    });

    test('인플레이션이 0일 때 실질 수익률이 표시되지 않아야 한다', () => {
      const dataWithoutInflation = {
        ...mockCalculationData,
        inflationRate: 0
      };
      render(<ResultDisplay calculationData={dataWithoutInflation} />);
      expect(screen.queryByText('실질 수익률 (인플레이션 고려)')).not.toBeInTheDocument();
    });
  });

  describe('투자 정보 섹션', () => {
    test('투자 기간이 올바르게 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('투자 기간')).toBeInTheDocument();
      expect(screen.getByText('10년')).toBeInTheDocument();
    });

    test('연이율이 올바르게 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('연이율')).toBeInTheDocument();
      expect(screen.getByText('5.00%')).toBeInTheDocument();
    });

    test('인플레이션이 있을 때 인플레이션율이 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('인플레이션율')).toBeInTheDocument();
      expect(screen.getByText('2.00%')).toBeInTheDocument();
    });

    test('인플레이션이 0일 때 인플레이션율이 표시되지 않아야 한다', () => {
      const dataWithoutInflation = {
        ...mockCalculationData,
        inflationRate: 0
      };
      render(<ResultDisplay calculationData={dataWithoutInflation} />);
      expect(screen.queryByText('인플레이션율')).not.toBeInTheDocument();
    });
  });

  describe('성장 단계 섹션', () => {
    test('성장 단계 제목이 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('성장 단계')).toBeInTheDocument();
    });

    test('2배 도달 시점이 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('2배 도달')).toBeInTheDocument();
      expect(screen.getByText('14년')).toBeInTheDocument();
    });

    test('3배 도달 시점이 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('3배 도달')).toBeInTheDocument();
      expect(screen.getByText('22년')).toBeInTheDocument();
    });

    test('10배 도달 시점이 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('10배 도달')).toBeInTheDocument();
      expect(screen.getByText('47년')).toBeInTheDocument();
    });

    test('성장 단계 데이터가 없을 때 섹션이 표시되지 않아야 한다', () => {
      const dataWithoutGrowthStages = {
        ...mockCalculationData,
        growthStages: null
      };
      render(<ResultDisplay calculationData={dataWithoutGrowthStages} />);
      expect(screen.queryByText('성장 단계')).not.toBeInTheDocument();
    });
  });

  describe('마일스톤 섹션', () => {
    test('주요 마일스톤 제목이 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('주요 마일스톤')).toBeInTheDocument();
    });

    test('모든 마일스톤이 올바르게 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      
      // 5년 마일스톤
      expect(screen.getByText('5년')).toBeInTheDocument();
      expect(screen.getByText('1,276,281원')).toBeInTheDocument();
      expect(screen.getByText('+27.63%')).toBeInTheDocument();
      
      // 10년 마일스톤
      expect(screen.getByText('10년')).toBeInTheDocument();
      expect(screen.getByText('1,628,894원')).toBeInTheDocument();
      expect(screen.getByText('+62.89%')).toBeInTheDocument();
      
      // 15년 마일스톤
      expect(screen.getByText('15년')).toBeInTheDocument();
      expect(screen.getByText('2,078,928원')).toBeInTheDocument();
      expect(screen.getByText('+107.89%')).toBeInTheDocument();
    });

    test('마일스톤 데이터가 없을 때 섹션이 표시되지 않아야 한다', () => {
      const dataWithoutMilestones = {
        ...mockCalculationData,
        growthStages: {
          ...mockCalculationData.growthStages,
          milestones: []
        }
      };
      render(<ResultDisplay calculationData={dataWithoutMilestones} />);
      expect(screen.queryByText('주요 마일스톤')).not.toBeInTheDocument();
    });

    test('성장 단계 데이터가 없을 때 마일스톤도 표시되지 않아야 한다', () => {
      const dataWithoutGrowthStages = {
        ...mockCalculationData,
        growthStages: null
      };
      render(<ResultDisplay calculationData={dataWithoutGrowthStages} />);
      expect(screen.queryByText('주요 마일스톤')).not.toBeInTheDocument();
    });
  });

  describe('조건부 렌더링', () => {
    test('인플레이션이 0일 때 실질 수익률과 인플레이션율이 표시되지 않아야 한다', () => {
      const dataWithoutInflation = {
        ...mockCalculationData,
        inflationRate: 0
      };
      render(<ResultDisplay calculationData={dataWithoutInflation} />);
      
      expect(screen.queryByText('실질 수익률 (인플레이션 고려)')).not.toBeInTheDocument();
      expect(screen.queryByText('인플레이션율')).not.toBeInTheDocument();
    });

    test('성장 단계 데이터가 없을 때 관련 섹션들이 표시되지 않아야 한다', () => {
      const dataWithoutGrowthStages = {
        ...mockCalculationData,
        growthStages: null
      };
      render(<ResultDisplay calculationData={dataWithoutGrowthStages} />);
      
      expect(screen.queryByText('성장 단계')).not.toBeInTheDocument();
      expect(screen.queryByText('주요 마일스톤')).not.toBeInTheDocument();
    });
  });

  describe('데이터 포맷팅', () => {
    test('금액이 천 단위 구분자와 함께 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('1,000,000원')).toBeInTheDocument();
      expect(screen.getByText('1,628,894.63원')).toBeInTheDocument();
    });

    test('퍼센트가 올바른 형식으로 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('62.89%')).toBeInTheDocument();
      expect(screen.getByText('5.00%')).toBeInTheDocument();
    });

    test('마일스톤 금액이 올바르게 포맷되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      expect(screen.getByText('1,276,281.56원')).toBeInTheDocument();
      expect(screen.getByText('1,628,894.63원')).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    test('모든 중요한 정보가 텍스트로 표시되어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      
      // 주요 결과들이 텍스트로 표시되는지 확인
      expect(screen.getByText('1,000,000원')).toBeInTheDocument();
      expect(screen.getAllByText('1,628,894.63원')).toHaveLength(2); // 최종 금액과 마일스톤에 모두 표시
      expect(screen.getByText('628,894.63원')).toBeInTheDocument();
      expect(screen.getByText('62.89%')).toBeInTheDocument();
    });

    test('구조적인 제목 계층이 있어야 한다', () => {
      render(<ResultDisplay calculationData={mockCalculationData} />);
      
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      
      expect(h2Elements).toHaveLength(1); // "계산 결과"
      expect(h3Elements.length).toBeGreaterThan(0); // 섹션 제목들
    });
  });
}); 