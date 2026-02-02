// models/User.js
// 사용자 데이터 구조 정의

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 아이디 (로그인용, 중복 불가)
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // 닉네임 (화면에 표시될 이름)
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  
  // 비밀번호 (암호화되어 저장)
  password: {
    type: String,
    required: true
  },
  
  // 팔로잉 목록 (내가 팔로우한 사람들)
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // 팔로워 목록 (나를 팔로우한 사람들)
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // 생성일
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
