# 교환일기 백엔드 서버

Node.js + MongoDB를 이용한 교환일기 백엔드 API 서버입니다.

## 📦 설치 방법

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 만들고 아래 내용을 입력하세요:

```
MONGODB_URI=여기에_MongoDB_Atlas_URI_입력
JWT_SECRET=아무_복잡한_문자열
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 3. MongoDB Atlas 설정
1. https://www.mongodb.com/cloud/atlas 접속
2. 무료 클러스터 생성
3. Database Access에서 사용자 생성
4. Network Access에서 0.0.0.0/0 추가 (모든 IP 허용)
5. Connect > Connect your application에서 URI 복사
6. `.env` 파일의 MONGODB_URI에 붙여넣기

## 🚀 실행 방법

### 개발 모드 (자동 재시작)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버가 http://localhost:5000 에서 실행됩니다.

## 📡 API 엔드포인트

### 인증 (auth)
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인

### 팔로우 (follow)
- `GET /api/follow/search/:username` - 사용자 검색
- `POST /api/follow/follow/:userId` - 팔로우
- `DELETE /api/follow/follow/:userId` - 언팔로우
- `GET /api/follow/my-follows` - 내 팔로우 정보

### 일기 (diary)
- `POST /api/diary` - 일기 작성
- `GET /api/diary/mutual` - 상호 팔로우 일기 목록
- `GET /api/diary/my` - 내 일기 목록
- `GET /api/diary/:id` - 일기 상세보기
- `PUT /api/diary/:id` - 일기 수정
- `DELETE /api/diary/:id` - 일기 삭제

### 게시판 (post)
- `POST /api/post` - 게시글 작성
- `GET /api/post` - 게시글 목록
- `GET /api/post/:id` - 게시글 상세보기
- `PUT /api/post/:id` - 게시글 수정
- `DELETE /api/post/:id` - 게시글 삭제
- `POST /api/post/:id/comments` - 댓글 작성
- `DELETE /api/post/:postId/comments/:commentId` - 댓글 삭제

## 🔒 인증 방식

JWT (JSON Web Token) 사용
- 로그인 후 받은 토큰을 `Authorization: Bearer {token}` 헤더에 포함

## 📁 프로젝트 구조

```
backend/
├── server.js           # 메인 서버
├── config/
│   └── database.js    # DB 연결
├── models/            # 데이터 스키마
│   ├── User.js
│   ├── Diary.js
│   └── Post.js
├── routes/            # API 라우트
│   ├── auth.js
│   ├── follow.js
│   ├── diary.js
│   └── post.js
└── middleware/
    └── auth.js        # JWT 인증
```

## 🌐 배포 (Render)

1. GitHub에 코드 푸시
2. https://render.com 접속
3. New > Web Service
4. GitHub 저장소 연결
5. 환경변수 설정
6. Deploy!

## ⚠️ 주의사항

- `.env` 파일은 절대 GitHub에 올리지 마세요
- MongoDB URI에 비밀번호가 포함되어 있습니다
- JWT_SECRET은 복잡하게 설정하세요
