// config/database.js
// MongoDB 데이터베이스 연결 설정

const mongoose = require('mongoose');

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공!');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    // 서버리스 환경에서는 process.exit(1)을 하지 않고 에러를 던져서 
    // Vercel이 에러 로그를 남기게 합니다.
    throw error;
  }
};

module.exports = connectDB;
