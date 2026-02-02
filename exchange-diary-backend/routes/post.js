// routes/post.js
// 게시판 API

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// 게시글 작성
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: '제목과 내용을 입력해주세요' });
    }
    
    const post = new Post({
      author: req.userId,
      title,
      content,
      image
    });
    
    await post.save();
    
    res.status(201).json({ 
      message: '게시글 작성 완료!',
      post 
    });
    
  } catch (error) {
    console.error('게시글 작성 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 게시글 목록 (상호 팔로우 + 내 글)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // 상호 팔로우 찾기
    const followingIds = user.following.map(id => id.toString());
    const followerIds = user.followers.map(id => id.toString());
    const mutualIds = followingIds.filter(id => followerIds.includes(id));
    
    // 내 글 + 상호 팔로우한 사람들의 글
    const authorIds = [...mutualIds, req.userId.toString()];
    
    const posts = await Post.find({ 
      author: { $in: authorIds }
    })
      .populate('author', 'username displayName')
      .populate('comments.author', 'username displayName')
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({ posts });
    
  } catch (error) {
    console.error('게시글 목록 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 게시글 상세보기
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username displayName')
      .populate('comments.author', 'username displayName');
    
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }
    
    res.json({ post });
    
  } catch (error) {
    console.error('게시글 상세 조회 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 게시글 수정
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }
    
    // 본인 글인지 확인
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: '수정 권한이 없습니다' });
    }
    
    const { title, content, image } = req.body;
    
    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image !== undefined ? image : post.image;
    post.updatedAt = new Date();
    
    await post.save();
    
    res.json({ 
      message: '게시글 수정 완료!',
      post 
    });
    
  } catch (error) {
    console.error('게시글 수정 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 게시글 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }
    
    // 본인 글인지 확인
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: '삭제 권한이 없습니다' });
    }
    
    await post.deleteOne();
    
    res.json({ message: '게시글 삭제 완료!' });
    
  } catch (error) {
    console.error('게시글 삭제 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 댓글 작성
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }
    
    post.comments.push({
      author: req.userId,
      content
    });
    
    await post.save();
    
    // 댓글 작성자 정보 포함하여 응답
    await post.populate('comments.author', 'username displayName');
    
    res.status(201).json({ 
      message: '댓글 작성 완료!',
      post 
    });
    
  } catch (error) {
    console.error('댓글 작성 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

// 댓글 삭제
router.delete('/:postId/comments/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다' });
    }
    
    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: '댓글을 찾을 수 없습니다' });
    }
    
    // 본인 댓글인지 확인
    if (comment.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: '삭제 권한이 없습니다' });
    }
    
    comment.deleteOne();
    await post.save();
    
    res.json({ message: '댓글 삭제 완료!' });
    
  } catch (error) {
    console.error('댓글 삭제 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
