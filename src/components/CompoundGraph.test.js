import React from 'react';
import { render, screen } from '@testing-library/react';
import CompoundGraph from './CompoundGraph';

// Chart.js 모킹
jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options }) => (
    <div data-testid="chart-line">
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-options">{JSON.stringify(options)}</div>
    </div>
  ),
}));

describe('CompoundGraph', () => {
  const mockYearlyData = [
    { year: 0, amount: 1000, interest: 0 },
    { year: 1, amount: 1050, interest: 50 },
    { year: 2, amount: 1102.5, interest: 102.5 },
  ];

  test('렌더링 테스트', () => {
    render(<CompoundGraph yearlyData={mockYearlyData} />);
    
    expect(screen.getByText('복리 성장 그래프')).toBeInTheDocument();
  });

  test('데이터가 있을 때 차트 표시', () => {
    render(<CompoundGraph yearlyData={mockYearlyData} />);
    
    expect(screen.getByTestId('chart-line')).toBeInTheDocument();
    expect(screen.getByTestId('chart-data')).toBeInTheDocument();
    expect(screen.getByTestId('chart-options')).toBeInTheDocument();
  });

  test('데이터가 없을 때 placeholder 표시', () => {
    render(<CompoundGraph yearlyData={[]} />);
    
    expect(screen.getByText('데이터를 입력하여 그래프를 확인하세요.')).toBeInTheDocument();
    expect(screen.queryByTestId('chart-line')).not.toBeInTheDocument();
  });

  test('props가 없을 때 기본값 처리', () => {
    render(<CompoundGraph />);
    
    expect(screen.getByText('데이터를 입력하여 그래프를 확인하세요.')).toBeInTheDocument();
  });

  test('차트 데이터 구조 검증', () => {
    render(<CompoundGraph yearlyData={mockYearlyData} />);
    
    const chartData = screen.getByTestId('chart-data');
    const data = JSON.parse(chartData.textContent);
    
    expect(data.labels).toEqual([0, 1, 2]);
    expect(data.datasets).toHaveLength(1);
    expect(data.datasets[0].label).toBe('투자 금액');
    expect(data.datasets[0].data).toEqual([1000, 1050, 1102.5]);
  });

  test('차트 옵션 검증', () => {
    render(<CompoundGraph yearlyData={mockYearlyData} />);
    
    const chartOptions = screen.getByTestId('chart-options');
    const options = JSON.parse(chartOptions.textContent);
    
    expect(options.responsive).toBe(true);
    expect(options.maintainAspectRatio).toBe(false);
    expect(options.plugins.title.text).toBe('복리 성장 추이');
    expect(options.scales.x.title.text).toBe('투자 기간 (년)');
    expect(options.scales.y.title.text).toBe('금액 (원)');
  });

  test('접근성 테스트', () => {
    render(<CompoundGraph yearlyData={mockYearlyData} />);
    
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  test('CSS 클래스 적용 확인', () => {
    const { container } = render(<CompoundGraph yearlyData={mockYearlyData} />);
    
    expect(container.querySelector('.compound-graph')).toBeInTheDocument();
    expect(container.querySelector('.graph-container')).toBeInTheDocument();
  });

  test('빈 데이터 배열 처리', () => {
    render(<CompoundGraph yearlyData={[]} />);
    
    expect(screen.getByText('데이터를 입력하여 그래프를 확인하세요.')).toBeInTheDocument();
    expect(screen.getByTestId('chart-line')).not.toBeInTheDocument();
  });

  test('null 데이터 처리', () => {
    render(<CompoundGraph yearlyData={null} />);
    
    expect(screen.getByText('데이터를 입력하여 그래프를 확인하세요.')).toBeInTheDocument();
  });

  test('undefined 데이터 처리', () => {
    render(<CompoundGraph yearlyData={undefined} />);
    
    expect(screen.getByText('데이터를 입력하여 그래프를 확인하세요.')).toBeInTheDocument();
  });
}); 