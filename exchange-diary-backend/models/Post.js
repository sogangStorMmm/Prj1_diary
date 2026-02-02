// models/Post.js
// 게시글 데이터 구조 정의

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  // 작성자
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  
  // 이미지 URL (선택)
  image: {
    type: String,
    default: null
  },
  
  // 댓글 목록
  comments: [commentSchema],
  
  // 작성일
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // 수정일
  updatedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Post', postSchema);
