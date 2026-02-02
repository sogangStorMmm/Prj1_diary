// routes/diary.js
// 교환일기 API

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Diary = require('../models/Diary');
const User = require('../models/User');

// 일기 작성
router.post('/', auth, async (req, res) => {
  try {
    const { date, title, content, image } = req.body;
    
    if (!date || !title || !content) {
      return res.status(400).json({ message: '필수 항목을 입력해주세요' });
    }
    
    const diary = new Diary({
      author: req.userId,
      date,
      title,
      content,
      image
    });
    
    await diary.save();
    
    res.status(201).json({ 
      message: '일기 작성 완료!',
      diary 
    });
    
  } catch (error) {
    console.error('일기 작성 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 상호 팔로우한 사람들의 일기 가져오기
router.get('/mutual', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // 상호 팔로우 찾기
    const followingIds = user.following.map(id => id.toString());
    const followerIds = user.followers.map(id => id.toString());
    const mutualIds = followingIds.filter(id => followerIds.includes(id));
    
    // 상호 팔로우한 사람들의 일기만 가져오기
    const diaries = await Diary.find({ 
      author: { $in: mutualIds }
    })
      .populate('author', 'username displayName')
      .sort({ date: -1 })
      .limit(100);
    
    res.json({ diaries });
    
  } catch (error) {
    console.error('일기 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 내 일기 목록
router.get('/my', auth, async (req, res) => {
  try {
    const diaries = await Diary.find({ author: req.userId })
      .sort({ date: -1 })
      .limit(100);
    
    res.json({ diaries });
    
  } catch (error) {
    console.error('내 일기 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 일기 상세보기
router.get('/:id', auth, async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id)
      .populate('author', 'username displayName');
    
    if (!diary) {
      return res.status(404).json({ message: '일기를 찾을 수 없습니다' });
    }
    
    // 상호 팔로우 확인
    const user = await User.findById(req.userId);
    const followingIds = user.following.map(id => id.toString());
    const followerIds = user.followers.map(id => id.toString());
    const mutualIds = followingIds.filter(id => followerIds.includes(id));
    
    const authorId = diary.author._id.toString();
    
    // 본인 일기이거나 상호 팔로우 관계일 때만 조회 가능
    if (authorId !== req.userId.toString() && !mutualIds.includes(authorId)) {
      return res.status(403).json({ message: '조회 권한이 없습니다' });
    }
    
    res.json({ diary });
    
  } catch (error) {
    console.error('일기 상세 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 일기 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);
    
    if (!diary) {
      return res.status(404).json({ message: '일기를 찾을 수 없습니다' });
    }
    
    // 본인 일기인지 확인
    if (diary.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: '수정 권한이 없습니다' });
    }
    
    const { title, content, image } = req.body;
    
    diary.title = title || diary.title;
    diary.content = content || diary.content;
    diary.image = image !== undefined ? image : diary.image;
    
    await diary.save();
    
    res.json({ 
      message: '일기 수정 완료!',
      diary 
    });
    
  } catch (error) {
    console.error('일기 수정 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 일기 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const diary = await Diary.findById(req.params.id);
    
    if (!diary) {
      return res.status(404).json({ message: '일기를 찾을 수 없습니다' });
    }
    
    // 본인 일기인지 확인
    if (diary.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: '삭제 권한이 없습니다' });
    }
    
    await diary.deleteOne();
    
    res.json({ message: '일기 삭제 완료!' });
    
  } catch (error) {
    console.error('일기 삭제 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
