// routes/auth.js
// 회원가입, 로그인 API

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 회원가입
router.post('/signup', async (req, res) => {
  try {
    const { username, displayName, password } = req.body;

    // 필수 항목 확인
    if (!username || !displayName || !password) {
      return res.status(400).json({ message: '모든 항목을 입력해주세요' });
    }

    // 아이디 중복 확인
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: '이미 사용 중인 아이디입니다' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const user = new User({
      username: username.toLowerCase(),
      displayName,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: '회원가입 성공!',
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName
      }
    });

  } catch (error) {
    console.error('회원가입 에러 디테일:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다: ' + error.message });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다' });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // 7일간 유효
    );

    res.json({
      message: '로그인 성공!',
      token,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName
      }
    });

  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
