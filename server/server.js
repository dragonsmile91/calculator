const express = require('express');
const cors = require('cors');
const lottoRoutes = require('./routes/lotto');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use('/api/lotto', lottoRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: '로또 당첨번호 API 서버가 실행 중입니다.',
    version: '1.0.0',
    endpoints: {
      'GET /api/lotto': '최근 당첨번호 조회',
      'GET /api/lotto/:drawNo': '특정 회차 당첨번호 조회'
    }
  });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '서버 내부 오류가 발생했습니다.',
    message: err.message 
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ error: '요청한 엔드포인트를 찾을 수 없습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📡 API 엔드포인트: http://localhost:${PORT}/api/lotto`);
}); 