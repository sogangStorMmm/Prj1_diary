// config/database.js
// MongoDB 데이터베이스 연결 설정

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas에 연결
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB 연결 성공!');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    process.exit(1); // 연결 실패시 서버 종료
  }
};

module.exports = connectDB;
