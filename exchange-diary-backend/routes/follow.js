// routes/follow.js
// 팔로우 관련 API

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// 사용자 검색
router.get('/search/:username', auth, async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username: username.toLowerCase() })
      .select('username displayName');
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    // 자기 자신인지 확인
    if (user._id.toString() === req.userId.toString()) {
      return res.status(400).json({ message: '자기 자신은 팔로우할 수 없습니다' });
    }
    
    // 팔로우 여부 확인
    const isFollowing = req.user.following.includes(user._id);
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        isFollowing
      }
    });
    
  } catch (error) {
    console.error('사용자 검색 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 팔로우하기
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 자기 자신 팔로우 방지
    if (userId === req.userId.toString()) {
      return res.status(400).json({ message: '자기 자신은 팔로우할 수 없습니다' });
    }
    
    // 대상 사용자 찾기
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    // 이미 팔로우 중인지 확인
    if (req.user.following.includes(userId)) {
      return res.status(400).json({ message: '이미 팔로우 중입니다' });
    }
    
    // 팔로우 추가
    req.user.following.push(userId);
    await req.user.save();
    
    // 상대방의 팔로워에 나 추가
    targetUser.followers.push(req.userId);
    await targetUser.save();
    
    res.json({ message: '팔로우 성공!' });
    
  } catch (error) {
    console.error('팔로우 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 언팔로우하기
router.delete('/follow/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 팔로잉 목록에서 제거
    req.user.following = req.user.following.filter(
      id => id.toString() !== userId
    );
    await req.user.save();
    
    // 상대방 팔로워에서 나 제거
    const targetUser = await User.findById(userId);
    if (targetUser) {
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== req.userId.toString()
      );
      await targetUser.save();
    }
    
    res.json({ message: '언팔로우 성공!' });
    
  } catch (error) {
    console.error('언팔로우 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 내 팔로우 정보 가져오기
router.get('/my-follows', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('following', 'username displayName')
      .populate('followers', 'username displayName');
    
    // 상호 팔로우 찾기
    const followingIds = user.following.map(f => f._id.toString());
    const followerIds = user.followers.map(f => f._id.toString());
    const mutualIds = followingIds.filter(id => followerIds.includes(id));
    
    res.json({
      following: user.following,
      followers: user.followers,
      mutualFollows: user.following.filter(f => 
        mutualIds.includes(f._id.toString())
      )
    });
    
  } catch (error) {
    console.error('팔로우 정보 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
