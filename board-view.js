// 로그인 확인
const currentUser = sessionStorage.getItem('currentUser');
const displayName = sessionStorage.getItem('displayName');

if (!currentUser) {
    alert('로그인이 필요합니다.');
    window.location.href = 'login.html';
}

// URL에서 postId 가져오기
const urlParams = new URLSearchParams(window.location.search);
const postId = parseInt(urlParams.get('id'));




// 게시글 불러오기
const posts = JSON.parse(localStorage.getItem('posts')) || [];
const post = posts.find(p => p.id === postId);

if (!post) {
    alert('게시글을 찾을 수 없습니다.');
    window.location.href = 'board.html';
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 게시글 표시
function displayPost() {
    const postView = document.getElementById('postView');
    
    const isAuthor = post.author === currentUser;
    const actionButtons = isAuthor ? `
        <div class="post-actions">
            <button class="edit-btn" onclick="editPost()">수정</button>
            <button class="delete-btn" onclick="deletePost()">삭제</button>
            <button class="back-btn" onclick="goBack()">목록</button>
        </div>
    ` : `
        <div class="post-actions">
            <button class="back-btn" onclick="goBack()">목록</button>
        </div>
    `;
    
    postView.innerHTML = `
        <div class="post-header">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <div>
                    <strong>${post.authorName}</strong> · ${formatDate(post.createdAt)}
                    ${post.updatedAt ? ' (수정됨)' : ''}
                </div>
                ${actionButtons}
            </div>
        </div>
        <div class="post-content">${post.content}</div>
        ${post.image ? `<div class="post-image"><img src="${post.image}" alt="게시글 이미지" onclick="openModal('${post.image}')"></div>` : ''}
    `;
    
    displayComments();
}

// 댓글 표시
function displayComments() {
    const commentList = document.getElementById('commentList');
    
    if (!post.comments || post.comments.length === 0) {
        commentList.innerHTML = '<div class="empty-state">첫 댓글을 작성해보세요!</div>';
        return;
    }
    
    commentList.innerHTML = post.comments.map(comment => {
        const isCommentAuthor = comment.author === currentUser;
        const deleteBtn = isCommentAuthor ? `<button class="comment-delete-btn" onclick="deleteComment(${comment.id})">삭제</button>` : '';
        
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${comment.authorName}</span>
                    <div>
                        <span>${formatDate(comment.createdAt)}</span>
                        ${deleteBtn}
                    </div>
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>
        `;
    }).join('');
}

// 댓글 작성
document.getElementById('commentBtn').addEventListener('click', function() {
    const commentInput = document.getElementById('commentInput');
    const content = commentInput.value.trim();
    
    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }
    
    const comment = {
        id: Date.now(),
        author: currentUser,
        authorName: displayName,
        content: content,
        createdAt: new Date().toISOString()
    };
    
    if (!post.comments) {
        post.comments = [];
    }
    
    post.comments.push(comment);
    
    // localStorage 업데이트
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        posts[postIndex] = post;
        localStorage.setItem('posts', JSON.stringify(posts));
    }
    
    commentInput.value = '';
    displayComments();
});

// 수정 버튼
function editPost() {
    window.location.href = `board-write.html?edit=${postId}`;
}

// 삭제 버튼
function deletePost() {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }
    
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const filteredPosts = posts.filter(p => p.id !== postId);
    localStorage.setItem('posts', JSON.stringify(filteredPosts));
    
    alert('게시글이 삭제되었습니다.');
    window.location.href = 'board.html';
}

// 목록으로
function goBack() {
    window.location.href = 'board.html';
}

// 댓글 삭제
function deleteComment(commentId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) {
        return;
    }
    
    post.comments = post.comments.filter(c => c.id !== commentId);
    
    // localStorage 업데이트
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        posts[postIndex] = post;
        localStorage.setItem('posts', JSON.stringify(posts));
    }
    
    displayComments();
}

// 이미지 모달
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    
    modal.classList.add('active');
    modalImg.src = imageSrc;
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
}

document.querySelector('.modal-close').addEventListener('click', closeModal);
document.getElementById('imageModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// 페이지 로드 시 게시글 표시
displayPost();