// middleware/auth.js
// 로그인 확인 미들웨어 (JWT 토큰 검증)

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 헤더에서 토큰 가져오기
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '인증 토큰이 없습니다' });
    }
    
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 사용자 찾기
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    // req에 사용자 정보 추가
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다' });
  }
};

module.exports = auth;
