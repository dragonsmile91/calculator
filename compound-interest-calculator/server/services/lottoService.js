const axios = require('axios');

// 동행복권 API 기본 URL
const LOTTO_API_BASE_URL = 'https://www.dhlottery.co.kr/common.do';

/**
 * 로또 당첨번호 조회 서비스
 */
class LottoService {
  
  /**
   * 최근 당첨번호 조회
   * @param {number} count - 조회할 회차 수 (기본값: 10)
   * @returns {Promise<Array>} 당첨번호 데이터 배열
   */
  async getRecentDraws(count = 10) {
    try {
      const draws = [];
      
      // 최신 회차부터 역순으로 조회
      for (let i = 0; i < count; i++) {
        const drawNo = await this.getLatestDrawNo();
        const drawData = await this.getDrawByNumber(drawNo - i);
        
        if (drawData) {
          draws.push(drawData);
        }
      }
      
      return draws;
    } catch (error) {
      console.error('최근 당첨번호 조회 중 오류:', error);
      throw new Error('최근 당첨번호를 불러오는데 실패했습니다.');
    }
  }

  /**
   * 특정 회차 당첨번호 조회
   * @param {number} drawNo - 회차 번호
   * @returns {Promise<Object>} 당첨번호 데이터
   */
  async getDrawByNumber(drawNo) {
    try {
      const response = await axios.get(LOTTO_API_BASE_URL, {
        params: {
          method: 'getLottoNumber',
          drwNo: drawNo
        },
        timeout: 10000
      });

      if (response.data && response.data.returnValue === 'success') {
        return this.parseDrawData(response.data);
      } else {
        throw new Error(`회차 ${drawNo} 데이터를 찾을 수 없습니다.`);
      }
    } catch (error) {
      console.error(`회차 ${drawNo} 조회 중 오류:`, error);
      throw new Error(`회차 ${drawNo} 데이터를 불러오는데 실패했습니다.`);
    }
  }

  /**
   * 최신 회차 번호 조회
   * @returns {Promise<number>} 최신 회차 번호
   */
  async getLatestDrawNo() {
    try {
      const response = await axios.get(LOTTO_API_BASE_URL, {
        params: {
          method: 'getLottoNumber',
          drwNo: 1
        },
        timeout: 10000
      });

      if (response.data && response.data.returnValue === 'success') {
        // 최신 회차는 현재 날짜 기준으로 계산
        const today = new Date();
        const startDate = new Date('2002-12-07'); // 로또 시작일
        const weeksSinceStart = Math.floor((today - startDate) / (7 * 24 * 60 * 60 * 1000));
        return Math.max(1, weeksSinceStart);
      } else {
        // API 실패 시 기본값 반환
        return 1234;
      }
    } catch (error) {
      console.error('최신 회차 조회 중 오류:', error);
      // API 실패 시 기본값 반환
      return 1234;
    }
  }

  /**
   * API 응답 데이터 파싱
   * @param {Object} data - API 응답 데이터
   * @returns {Object} 파싱된 당첨번호 데이터
   */
  parseDrawData(data) {
    return {
      drwNo: parseInt(data.drwNo),
      drwNoDate: data.drwNoDate,
      drwtNo1: parseInt(data.drwtNo1),
      drwtNo2: parseInt(data.drwtNo2),
      drwtNo3: parseInt(data.drwtNo3),
      drwtNo4: parseInt(data.drwtNo4),
      drwtNo5: parseInt(data.drwtNo5),
      drwtNo6: parseInt(data.drwtNo6),
      bnusNo: parseInt(data.bnusNo),
      firstPrzwnerCo: parseInt(data.firstPrzwnerCo),
      firstWinamnt: parseInt(data.firstWinamnt),
      returnValue: data.returnValue
    };
  }

  /**
   * 임시 데이터 생성 (API 실패 시 사용)
   * @param {number} count - 생성할 데이터 수
   * @returns {Array} 임시 데이터 배열
   */
  generateMockData(count = 10) {
    const mockData = [];
    const baseDrawNo = 1234;
    
    for (let i = 0; i < count; i++) {
      const drawNo = baseDrawNo - i;
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      
      mockData.push({
        drwNo: drawNo,
        drwNoDate: date.toISOString().split('T')[0],
        drwtNo1: Math.floor(Math.random() * 45) + 1,
        drwtNo2: Math.floor(Math.random() * 45) + 1,
        drwtNo3: Math.floor(Math.random() * 45) + 1,
        drwtNo4: Math.floor(Math.random() * 45) + 1,
        drwtNo5: Math.floor(Math.random() * 45) + 1,
        drwtNo6: Math.floor(Math.random() * 45) + 1,
        bnusNo: Math.floor(Math.random() * 45) + 1,
        firstPrzwnerCo: Math.floor(Math.random() * 10) + 1,
        firstWinamnt: Math.floor(Math.random() * 3000000000) + 1000000000,
        returnValue: 'success'
      });
    }
    
    return mockData;
  }
}

module.exports = new LottoService();
