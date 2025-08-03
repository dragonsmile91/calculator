import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, Trophy, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import './LottoChecker.css';

/**
 * LottoChecker - 로또 당첨번호 조회 컴포넌트
 */
function LottoChecker() {
  const [lottoData, setLottoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // 로또 번호 색상 매핑
  const getNumberColor = (number) => {
    if (number >= 1 && number <= 10) return '#FFD700'; // 노란색
    if (number >= 11 && number <= 20) return '#3498db'; // 파란색
    if (number >= 21 && number <= 30) return '#e74c3c'; // 빨간색
    if (number >= 31 && number <= 40) return '#95a5a6'; // 회색
    if (number >= 41 && number <= 45) return '#27ae60'; // 초록색
    return '#2c3e50'; // 기본색
  };

  // 숫자 포맷팅 함수
  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(lottoData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = lottoData.slice(startIndex, endIndex);

  // 페이지 변경 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 로또 번호 컴포넌트
  const LottoNumber = ({ number, isBonus = false }) => (
    <div 
      className={`lotto-number ${isBonus ? 'bonus' : ''}`}
      style={{ 
        backgroundColor: getNumberColor(number),
        border: isBonus ? '3px solid #ff6b35' : 'none'
      }}
    >
      {number}
    </div>
  );

  // 로또 회차 컴포넌트
  const LottoDraw = ({ draw }) => {
    // 총 당첨금액 계산 (당첨자 수 × 1등 당첨금)
    const totalPrize = draw.firstPrzwnerCo * draw.firstWinamnt;
    // 1등 당첨자별 당첨금액
    const prizePerPerson = draw.firstWinamnt;

    return (
      <div className="lotto-draw">
        <div className="draw-header">
          <div className="draw-info">
            <Calendar size={16} />
            <span className="draw-number">{draw.drwNo}회</span>
            <span className="draw-date">{draw.drwNoDate}</span>
          </div>
          <div className="prize-bottom">
            <span className="each-label">1등 당청금</span>
            <span className="prize-amount">{formatNumber(prizePerPerson)}원</span>
          </div>
        </div>
        
        <div className="numbers-container">
          <div className="main-numbers">
            {draw.drwtNo1 && <LottoNumber number={draw.drwtNo1} />}
            {draw.drwtNo2 && <LottoNumber number={draw.drwtNo2} />}
            {draw.drwtNo3 && <LottoNumber number={draw.drwtNo3} />}
            {draw.drwtNo4 && <LottoNumber number={draw.drwtNo4} />}
            {draw.drwtNo5 && <LottoNumber number={draw.drwtNo5} />}
            {draw.drwtNo6 && <LottoNumber number={draw.drwtNo6} />}
          </div>
          <div className="bonus-section">
            {draw.bnusNo && (
              <div className="bonus-number">
                <span className="bonus-label">보너스</span>
                <LottoNumber number={draw.bnusNo} isBonus={true} />
              </div>
            )}
            <div className="prize-info">
              <div className="prize-top">
                <div className="prize-labels">
                  <div className="total-label">총금액</div>
                  <div className="prize-label">당첨금액</div>
                </div>
                <div className="prize-amounts">
                  <div className="total-amount">{formatNumber(totalPrize)}원</div>
                  <div className="prize-detail">
                    <span className="winner-count">{draw.firstPrzwnerCo}명</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button 
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        
        {startPage > 1 && (
          <>
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button 
              className="pagination-button"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button 
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  // 로또 데이터 가져오기 (실제 API 호출)
  const fetchLottoData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 실제 백엔드 API 호출
      const response = await fetch('http://localhost:5000/api/lotto?count=20');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setLottoData(result.data);
        setCurrentPage(1); // 데이터 새로고침 시 첫 페이지로 이동
      } else {
        throw new Error(result.message || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('로또 데이터 로드 오류:', err);
      setError('로또 데이터를 불러오는데 실패했습니다. 서버를 확인해주세요.');
      
      // API 실패 시 임시 데이터 사용
      const mockData = [
        {
          drwNo: 1234,
          drwNoDate: '2025-07-11',
          drwtNo1: 7, drwtNo2: 12, drwtNo3: 23, drwtNo4: 28, drwtNo5: 35, drwtNo6: 42,
          bnusNo: 15,
          firstPrzwnerCo: 5,
          firstWinamnt: 2000000000
        },
        {
          drwNo: 1233,
          drwNoDate: '2025-07-05',
          drwtNo1: 3, drwtNo2: 11, drwtNo3: 19, drwtNo4: 27, drwtNo5: 33, drwtNo6: 44,
          bnusNo: 8,
          firstPrzwnerCo: 3,
          firstWinamnt: 3000000000
        },
        {
          drwNo: 1232,
          drwNoDate: '2025-06-28',
          drwtNo1: 5, drwtNo2: 14, drwtNo3: 22, drwtNo4: 29, drwtNo5: 38, drwtNo6: 41,
          bnusNo: 12,
          firstPrzwnerCo: 7,
          firstWinamnt: 1500000000
        }
      ];
      
      setLottoData(mockData);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchLottoData();
  }, []);

  return (
    <div className="lotto-checker">
      <div className="calculator-container">
        <div className="header-section">
          <h2>로또 당첨번호 조회</h2>
          <p>최근 당첨번호를 확인해보세요</p>
          <button 
            className="refresh-button" 
            onClick={fetchLottoData}
            disabled={loading}
          >
            <RefreshCw size={16} />
            새로고침
          </button>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>로또 데이터를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={fetchLottoData}>다시 시도</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="lotto-draws">
              {currentData.map((draw, index) => (
                <LottoDraw key={draw.drwNo || index} draw={draw} />
              ))}
            </div>
            
            {totalPages > 1 && <Pagination />}
          </>
        )}

        <div className="info-section">
          <h4>번호별 색상 의미</h4>
          <div className="color-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#FFD700' }}></div>
              <span>1-10번</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#3498db' }}></div>
              <span>11-20번</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
              <span>21-30번</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#95a5a6' }}></div>
              <span>31-40번</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#27ae60' }}></div>
              <span>41-45번</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LottoChecker; 