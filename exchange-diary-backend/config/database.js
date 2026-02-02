// config/database.js
// MongoDB 데이터베이스 연결 설정

const mongoose = require('mongoose');

const connectDB = async () => {
  // 이미 연결되어 있거나 연결 중인지 확인
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 만약 연결 중(readyState 2)이라면 기존 연결 시도를 기다림
  if (mongoose.connection.readyState === 2) {
    console.log('⏳ MongoDB 연결이 이미 진행 중입니다. 대기합니다...');
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => resolve(mongoose.connection));
      mongoose.connection.once('error', (err) => reject(err));
    });
  }

  try {
    console.log('--- DB 연결 진단 ---');
    console.log('MONGODB_URI 존재 여부:', !!process.env.MONGODB_URI);
    
    // Mongoose 6+ 에서는 default 옵션들이 있으므로 간단하게 연결
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 터지면 빨리 터지게 5초로 응답성 상향
    });
    
    console.log(`✅ MongoDB 연결 성공! (호스트: ${conn.connection.host})`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    throw error;
  }
};

module.exports = connectDB;

