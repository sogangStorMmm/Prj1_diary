// 1. 세션 체크 및 초기화
const currentUser = sessionStorage.getItem('currentUser');
const displayName = sessionStorage.getItem('displayName');

// 페이지 진입 시 로그인 상태 확인
if (!currentUser) {
    alert('로그인이 필요합니다.');
    window.location.replace('login.html');
}

// 2. UI 초기화
document.getElementById('currentUserName').textContent = `${displayName}님`;

// 3. 게시글 목록 불러오기
async function loadPosts() {
    const postList = document.getElementById('postList');

    try {
        // 백엔드에서 게시글 목록 가져오기 (내 글 + 파트너 글)
        const result = await api.get('/post');
        const sharedPosts = result.posts;

        if (sharedPosts.length === 0) {
            postList.innerHTML = `
                <div class="empty-state">
                    <p>표시할 게시글이 없습니다.</p>
                    <small>상호 팔로우 중인 파트너와 소식을 공유해보세요!</small>
                </div>`;
            return;
        }

        // 게시글 목록 렌더링
        postList.innerHTML = sharedPosts.map(post => {
            const date = new Date(post.createdAt);
            const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

            // 작성자 구분
            const isMe = post.author.username === currentUser;
            const authorLabel = isMe ? '나' : post.author.displayName;

            return `
                <div class="post-item" onclick="viewPost('${post._id}')">
                    <div class="post-item-title">${post.title}</div>
                    <div class="post-item-meta">
                        <span class="author-tag" style="color: #667eea; font-weight: bold;">${authorLabel}</span> · ${dateStr}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        postList.innerHTML = `<div class="empty-state">게시글을 불러오는 중 오류가 발생했습니다: ${error.message}</div>`;
    }
}

// 4. 게시글 상세보기 이동
function viewPost(postId) {
    window.location.href = `board-view.html?id=${postId}`;
}

// 5. 이벤트 리스너
document.getElementById('writeBtn').addEventListener('click', function () {
    window.location.href = 'board-write.html';
});

document.getElementById('logoutBtn').addEventListener('click', function () {
    if (confirm('로그아웃 하시겠습니까?')) {
        sessionStorage.clear();
        alert('로그아웃되었습니다.');
        window.location.href = 'login.html';
    }
});

// 6. 초기 실행
loadPosts();
