// models/Diary.js
// 일기 데이터 구조 정의

const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
  // 작성자 (User 참조)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // 날짜
  date: {
    type: Date,
    required: true
  },
  
  // 제목
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  // 내용
  content: {
    type: String,
    required: true
  },
  
  // 이미지 URL (선택사항)
  image: {
    type: String,
    default: null
  },
  
  // 작성일
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 날짜순 정렬 인덱스
diarySchema.index({ author: 1, date: -1 });

module.exports = mongoose.model('Diary', diarySchema);
