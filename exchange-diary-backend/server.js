// server.js
// 메인 서버 파일

require('dotenv').config(); // 환경변수 로드
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Express 앱 생성
const app = express();

// 데이터베이스 연결 (비동기로 시작하지만 mongoose가 내부적으로 버퍼링함)
connectDB().catch(err => console.error('Initial DB connection error:', err));

// 미들웨어
app.use(cors()); // CORS 허용 (프론트엔드 연결)
app.use(express.json({ limit: '10mb' })); // JSON 파싱 (이미지 base64 위해 10mb)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 라우트 연결
const authRoutes = require('./routes/auth');
const followRoutes = require('./routes/follow');
const diaryRoutes = require('./routes/diary');
const postRoutes = require('./routes/post');

// /api 경로와 일반 경로 모두 대응 가능하도록 설정
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/follow', followRoutes);
app.use('/follow', followRoutes);

app.use('/api/diary', diaryRoutes);
app.use('/diary', diaryRoutes);

app.use('/api/post', postRoutes);
app.use('/post', postRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '교환일기 API 서버',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth (회원가입, 로그인)',
      follow: '/api/follow (팔로우 관리)',
      diary: '/api/diary (교환일기)',
      post: '/api/post (게시판)'
    }
  });
});

// 404 에러 핸들링
app.use((req, res) => {
  res.status(404).json({ message: '존재하지 않는 경로입니다' });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('서버 에러 디테일:', err);
  res.status(500).json({
    message: '서버 오류가 발생했습니다',
    error: err.message
  });
});

// 서버 시작
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다`);
  });
}

module.exports = app;
