import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputForm from './InputForm';

describe('InputForm 컴포넌트', () => {
  const mockOnCalculate = jest.fn();

  beforeEach(() => {
    mockOnCalculate.mockClear();
  });

  describe('기본 렌더링', () => {
    test('모든 입력 필드가 렌더링되어야 한다', () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      expect(screen.getByLabelText(/원금/)).toBeInTheDocument();
      expect(screen.getByLabelText(/연이율/)).toBeInTheDocument();
      expect(screen.getByLabelText(/투자 기간/)).toBeInTheDocument();
      expect(screen.getByLabelText(/인플레이션율/)).toBeInTheDocument();
    });

    test('제목이 올바르게 표시되어야 한다', () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      expect(screen.getByText('투자 정보 입력')).toBeInTheDocument();
    });

    test('버튼들이 올바르게 렌더링되어야 한다', () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      expect(screen.getByText('계산하기')).toBeInTheDocument();
      expect(screen.getByText('초기화')).toBeInTheDocument();
    });
  });

  describe('입력 필드 동작', () => {
    test('원금 입력 필드가 올바르게 동작해야 한다', () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const principalInput = screen.getByLabelText(/원금/);
      fireEvent.change(principalInput, { target: { value: '1000000' } });
      
      expect(principalInput.value).toBe('1000000');
    });

    test('이율 입력 필드가 올바르게 동작해야 한다', () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const rateInput = screen.getByLabelText(/연이율/);
      fireEvent.change(rateInput, { target: { value: '5.5' } });
      
      expect(rateInput.value).toBe('5.5');
    });

    test('투자 기간 입력 필드가 올바르게 동작해야 한다', () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const timeInput = screen.getByLabelText(/투자 기간/);
      fireEvent.change(timeInput, { target: { value: '10' } });
      
      expect(timeInput.value).toBe('10');
    });

    test('인플레이션율 입력 필드가 올바르게 동작해야 한다', () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const inflationInput = screen.getByLabelText(/인플레이션율/);
      fireEvent.change(inflationInput, { target: { value: '2.0' } });
      
      expect(inflationInput.value).toBe('2.0');
    });
  });

  describe('폼 검증', () => {
    test('빈 원금에 대해 에러 메시지가 표시되어야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText('원금은 0보다 큰 숫자여야 합니다.')).toBeInTheDocument();
      });
    });

    test('음수 원금에 대해 에러 메시지가 표시되어야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const principalInput = screen.getByLabelText(/원금/);
      fireEvent.change(principalInput, { target: { value: '-1000' } });
      
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText('원금은 0보다 큰 숫자여야 합니다.')).toBeInTheDocument();
      });
    });

    test('음수 이율에 대해 에러 메시지가 표시되어야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const rateInput = screen.getByLabelText(/연이율/);
      fireEvent.change(rateInput, { target: { value: '-5' } });
      
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText('이율은 0 이상이어야 합니다.')).toBeInTheDocument();
      });
    });

    test('100% 초과 이율에 대해 에러 메시지가 표시되어야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const rateInput = screen.getByLabelText(/연이율/);
      fireEvent.change(rateInput, { target: { value: '150' } });
      
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText('이율은 100% 이하여야 합니다.')).toBeInTheDocument();
      });
    });

    test('음수 투자 기간에 대해 에러 메시지가 표시되어야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const timeInput = screen.getByLabelText(/투자 기간/);
      fireEvent.change(timeInput, { target: { value: '-5' } });
      
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText('투자 기간은 0보다 큰 숫자여야 합니다.')).toBeInTheDocument();
      });
    });

    test('음수 인플레이션율에 대해 에러 메시지가 표시되어야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const inflationInput = screen.getByLabelText(/인플레이션율/);
      fireEvent.change(inflationInput, { target: { value: '-2' } });
      
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText('인플레이션율은 0 이상이어야 합니다.')).toBeInTheDocument();
      });
    });
  });

  describe('유효한 입력 처리', () => {
    test('유효한 입력으로 계산 함수가 호출되어야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      // 유효한 데이터 입력
      fireEvent.change(screen.getByLabelText(/원금/), { target: { value: '1000000' } });
      fireEvent.change(screen.getByLabelText(/연이율/), { target: { value: '5.0' } });
      fireEvent.change(screen.getByLabelText(/투자 기간/), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText(/인플레이션율/), { target: { value: '2.0' } });
      
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(mockOnCalculate).toHaveBeenCalledWith({
          principal: 1000000,
          rate: 0.05, // 5%를 소수점으로 변환
          time: 10,
          inflationRate: 2.0
        });
      });
    });

    test('에러가 있을 때 계산 함수가 호출되지 않아야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      // 유효하지 않은 데이터 입력
      fireEvent.change(screen.getByLabelText(/원금/), { target: { value: '-1000' } });
      
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(mockOnCalculate).not.toHaveBeenCalled();
      });
    });
  });

  describe('초기화 기능', () => {
    test('초기화 버튼이 모든 필드를 초기화해야 한다', () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      // 데이터 입력
      fireEvent.change(screen.getByLabelText(/원금/), { target: { value: '1000000' } });
      fireEvent.change(screen.getByLabelText(/연이율/), { target: { value: '5.0' } });
      fireEvent.change(screen.getByLabelText(/투자 기간/), { target: { value: '10' } });
      fireEvent.change(screen.getByLabelText(/인플레이션율/), { target: { value: '2.0' } });
      
      // 초기화 버튼 클릭
      const resetButton = screen.getByText('초기화');
      fireEvent.click(resetButton);
      
      // 모든 필드가 초기화되었는지 확인
      expect(screen.getByLabelText(/원금/).value).toBe('');
      expect(screen.getByLabelText(/연이율/).value).toBe('');
      expect(screen.getByLabelText(/투자 기간/).value).toBe('');
      expect(screen.getByLabelText(/인플레이션율/).value).toBe('0');
    });

    test('초기화 버튼이 에러 메시지를 제거해야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      // 에러를 발생시키는 입력
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(screen.getByText('원금은 0보다 큰 숫자여야 합니다.')).toBeInTheDocument();
      });
      
      // 초기화 버튼 클릭
      const resetButton = screen.getByText('초기화');
      fireEvent.click(resetButton);
      
      // 에러 메시지가 사라졌는지 확인
      expect(screen.queryByText('원금은 0보다 큰 숫자여야 합니다.')).not.toBeInTheDocument();
    });
  });

  describe('에러 상태 관리', () => {
    test('입력 필드에 에러가 있을 때 error 클래스가 적용되어야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        const principalInput = screen.getByLabelText(/원금/);
        expect(principalInput).toHaveClass('error');
      });
    });

    test('에러가 해결되면 error 클래스가 제거되어야 한다', async () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      const principalInput = screen.getByLabelText(/원금/);
      
      // 에러 발생
      const calculateButton = screen.getByText('계산하기');
      fireEvent.click(calculateButton);
      
      await waitFor(() => {
        expect(principalInput).toHaveClass('error');
      });
      
      // 유효한 값 입력
      fireEvent.change(principalInput, { target: { value: '1000000' } });
      
      // 에러 클래스가 제거되었는지 확인
      expect(principalInput).not.toHaveClass('error');
    });
  });

  describe('접근성', () => {
    test('모든 입력 필드에 적절한 label이 있어야 한다', () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      expect(screen.getByLabelText(/원금/)).toBeInTheDocument();
      expect(screen.getByLabelText(/연이율/)).toBeInTheDocument();
      expect(screen.getByLabelText(/투자 기간/)).toBeInTheDocument();
      expect(screen.getByLabelText(/인플레이션율/)).toBeInTheDocument();
    });

    test('모든 입력 필드에 적절한 placeholder가 있어야 한다', () => {
      render(<InputForm onCalculate={mockOnCalculate} />);
      
      expect(screen.getByPlaceholderText('예: 1000000')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('예: 5.0')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('예: 10')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('예: 2.0')).toBeInTheDocument();
    });
  });
}); 