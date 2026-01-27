// 로그인 확인
const currentUser = sessionStorage.getItem('currentUser');
const displayName = sessionStorage.getItem('displayName');

if (!currentUser) {
    alert('로그인이 필요합니다.');
    window.location.href = 'login.html';
}

// 현재 사용자 표시
document.getElementById('currentUserName').textContent = `${displayName}님`;

// 로그아웃
document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.clear();
    alert('로그아웃되었습니다.');
    window.location.href = 'login.html';
});

// 글쓰기 버튼
document.getElementById('writeBtn').addEventListener('click', function() {
    window.location.href = 'board-write.html';
});

// 게시글 목록 불러오기
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postList = document.getElementById('postList');

    if (posts.length === 0) {
        postList.innerHTML = '<div class="empty-state">아직 작성된 게시글이 없습니다.</div>';
        return;
    }

    // 최신순 정렬
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    postList.innerHTML = posts.map(post => {
        const date = new Date(post.createdAt);
        const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        return `
            <div class="post-item" onclick="viewPost(${post.id})">
                <div class="post-item-title">${post.title}</div>
                <div class="post-item-meta">
                    ${post.authorName} · ${dateStr}
                </div>
            </div>
        `;
    }).join('');
}

// 게시글 보기
function viewPost(postId) {
    window.location.href = `board-view.html?id=${postId}`;
}

// 페이지 로드 시 게시글 목록 표시
loadPosts();