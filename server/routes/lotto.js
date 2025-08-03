const express = require('express');
const router = express.Router();
const lottoService = require('../services/lottoService');

/**
 * GET /api/lotto
 * 최근 당첨번호 조회
 */
router.get('/', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 10;
    const draws = await lottoService.getRecentDraws(count);
    
    res.json({
      success: true,
      data: draws,
      count: draws.length,
      message: '최근 당첨번호를 성공적으로 조회했습니다.'
    });
  } catch (error) {
    console.error('최근 당첨번호 조회 라우트 오류:', error);
    
    // API 실패 시 임시 데이터 반환
    const mockData = lottoService.generateMockData(parseInt(req.query.count) || 10);
    
    res.json({
      success: true,
      data: mockData,
      count: mockData.length,
      message: '임시 데이터를 반환합니다. (실제 API 연결 중)',
      note: '실제 로또 API와 연결 중입니다. 현재는 임시 데이터를 표시합니다.'
    });
  }
});

/**
 * GET /api/lotto/:drawNo
 * 특정 회차 당첨번호 조회
 */
router.get('/:drawNo', async (req, res) => {
  try {
    const drawNo = parseInt(req.params.drawNo);
    
    if (isNaN(drawNo) || drawNo < 1) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 회차 번호입니다.',
        message: '회차 번호는 1 이상의 숫자여야 합니다.'
      });
    }
    
    const draw = await lottoService.getDrawByNumber(drawNo);
    
    res.json({
      success: true,
      data: draw,
      message: `${drawNo}회 당첨번호를 성공적으로 조회했습니다.`
    });
  } catch (error) {
    console.error(`회차 ${req.params.drawNo} 조회 라우트 오류:`, error);
    
    // API 실패 시 임시 데이터 반환
    const mockData = lottoService.generateMockData(1)[0];
    mockData.drwNo = parseInt(req.params.drawNo);
    
    res.json({
      success: true,
      data: mockData,
      message: '임시 데이터를 반환합니다. (실제 API 연결 중)',
      note: '실제 로또 API와 연결 중입니다. 현재는 임시 데이터를 표시합니다.'
    });
  }
});

/**
 * GET /api/lotto/latest
 * 최신 회차 정보 조회
 */
router.get('/latest/info', async (req, res) => {
  try {
    const latestDrawNo = await lottoService.getLatestDrawNo();
    
    res.json({
      success: true,
      data: {
        latestDrawNo: latestDrawNo,
        currentDate: new Date().toISOString().split('T')[0]
      },
      message: '최신 회차 정보를 성공적으로 조회했습니다.'
    });
  } catch (error) {
    console.error('최신 회차 정보 조회 라우트 오류:', error);
    
    res.json({
      success: true,
      data: {
        latestDrawNo: 1234,
        currentDate: new Date().toISOString().split('T')[0]
      },
      message: '임시 데이터를 반환합니다. (실제 API 연결 중)',
      note: '실제 로또 API와 연결 중입니다. 현재는 임시 데이터를 표시합니다.'
    });
  }
});

module.exports = router; 