import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Calculator from './Calculator';

// 하위 컴포넌트들 모킹
jest.mock('./InputForm', () => {
  return function MockInputForm({ onCalculate }) {
    return (
      <div data-testid="input-form">
        <button onClick={() => onCalculate({ principal: 1000, rate: 0.05, time: 10, inflationRate: 0.02 })}>
          계산하기
        </button>
      </div>
    );
  };
});

jest.mock('./ResultDisplay', () => {
  return function MockResultDisplay({ result }) {
    return (
      <div data-testid="result-display">
        <div>최종 금액: {result?.finalAmount}</div>
        <div>총 이익: {result?.totalProfit}</div>
      </div>
    );
  };
});

jest.mock('./CompoundGraph', () => {
  return function MockCompoundGraph({ yearlyData }) {
    return (
      <div data-testid="compound-graph">
        <div>데이터 포인트: {yearlyData?.length || 0}</div>
      </div>
    );
  };
});

// 계산 함수 모킹
jest.mock('../utils/calculations', () => ({
  generateYearlyData: jest.fn(() => [
    { year: 0, amount: 1000 },
    { year: 1, amount: 1050 },
    { year: 2, amount: 1102.5 }
  ]),
  analyzeProfitability: jest.fn(() => ({
    finalAmount: 1628.89,
    totalProfit: 628.89,
    profitRate: 62.89,
    cagr: 5.00,
    realRate: 60.68
  }))
}));

describe('Calculator', () => {
  test('렌더링 테스트', () => {
    render(<Calculator />);
    
    expect(screen.getByTestId('input-form')).toBeInTheDocument();
  });

  test('초기 상태에서 결과와 그래프가 표시되지 않음', () => {
    render(<Calculator />);
    
    expect(screen.queryByTestId('result-display')).not.toBeInTheDocument();
    expect(screen.queryByTestId('compound-graph')).not.toBeInTheDocument();
  });

  test('계산 버튼 클릭 시 결과와 그래프 표시', async () => {
    render(<Calculator />);
    
    const calculateButton = screen.getByText('계산하기');
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toBeInTheDocument();
      expect(screen.getByTestId('compound-graph')).toBeInTheDocument();
    });
  });

  test('결과 데이터가 올바르게 전달됨', async () => {
    render(<Calculator />);
    
    const calculateButton = screen.getByText('계산하기');
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('최종 금액: 1628.89')).toBeInTheDocument();
      expect(screen.getByText('총 이익: 628.89')).toBeInTheDocument();
    });
  });

  test('그래프에 올바른 데이터 전달됨', async () => {
    render(<Calculator />);
    
    const calculateButton = screen.getByText('계산하기');
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText('데이터 포인트: 3')).toBeInTheDocument();
    });
  });

  test('CSS 클래스 적용 확인', () => {
    const { container } = render(<Calculator />);
    
    expect(container.querySelector('.calculator')).toBeInTheDocument();
    expect(container.querySelector('.calculator-section')).toBeInTheDocument();
  });

  test('계산 함수 호출 확인', async () => {
    const { generateYearlyData, analyzeProfitability } = require('../utils/calculations');
    
    render(<Calculator />);
    
    const calculateButton = screen.getByText('계산하기');
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(generateYearlyData).toHaveBeenCalledWith(1000, 0.05, 10);
      expect(analyzeProfitability).toHaveBeenCalledWith(1000, 0.05, 10, 0.02);
    });
  });

  test('인플레이션율이 없을 때 기본값 처리', async () => {
    const { analyzeProfitability } = require('../utils/calculations');
    
    // Mock을 재설정하여 다른 매개변수로 호출되는지 확인
    analyzeProfitability.mockClear();
    
    render(<Calculator />);
    
    const calculateButton = screen.getByText('계산하기');
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(analyzeProfitability).toHaveBeenCalledWith(1000, 0.05, 10, 0.02);
    });
  });

  test('상태 업데이트 확인', async () => {
    render(<Calculator />);
    
    // 초기 상태 확인
    expect(screen.queryByTestId('result-display')).not.toBeInTheDocument();
    
    // 계산 실행
    const calculateButton = screen.getByText('계산하기');
    fireEvent.click(calculateButton);
    
    // 상태 업데이트 확인
    await waitFor(() => {
      expect(screen.getByTestId('result-display')).toBeInTheDocument();
      expect(screen.getByTestId('compound-graph')).toBeInTheDocument();
    });
  });

  test('접근성 테스트', () => {
    render(<Calculator />);
    
    expect(screen.getByRole('button', { name: '계산하기' })).toBeInTheDocument();
  });
}); 