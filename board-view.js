// 로그인 확인
const currentUser = sessionStorage.getItem('currentUser');
const displayName = sessionStorage.getItem('displayName');

if (!currentUser) {
    alert('로그인이 필요합니다.');
    window.location.href = 'login.html';
}

// URL에서 postId 가져오기
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

let currentPost = null;

// 게시글 불러오기
async function loadPost() {
    try {
        const result = await api.get(`/post/${postId}`);
        currentPost = result.post;
        displayPost();
    } catch (error) {
        alert('게시글을 찾을 수 없습니다: ' + error.message);
        window.location.href = 'board.html';
    }
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 게시글 표시
function displayPost() {
    const postView = document.getElementById('postView');

    const isAuthor = currentPost.author.username === currentUser;
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
            <h2 class="post-title">${currentPost.title}</h2>
            <div class="post-meta">
                <div>
                    <strong>${currentPost.author.displayName}</strong> · ${formatDate(currentPost.createdAt)}
                    ${currentPost.updatedAt ? ' (수정됨)' : ''}
                </div>
                ${actionButtons}
            </div>
        </div>
        <div class="post-content">${currentPost.content}</div>
        ${currentPost.image ? `<div class="post-image"><img src="${currentPost.image}" alt="게시글 이미지" onclick="openModal('${currentPost.image}')"></div>` : ''}
    `;

    displayComments();
}

// 댓글 표시
function displayComments() {
    const commentList = document.getElementById('commentList');

    if (!currentPost.comments || currentPost.comments.length === 0) {
        commentList.innerHTML = '<div class="empty-state">첫 댓글을 작성해보세요!</div>';
        return;
    }

    commentList.innerHTML = currentPost.comments.map(comment => {
        const isCommentAuthor = comment.author.username === currentUser;
        const deleteBtn = isCommentAuthor ? `<button class="comment-delete-btn" onclick="deleteComment('${comment._id}')">삭제</button>` : '';

        return `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${comment.author.displayName}</span>
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
document.getElementById('commentBtn').addEventListener('click', async function () {
    const commentInput = document.getElementById('commentInput');
    const content = commentInput.value.trim();

    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    try {
        const result = await api.post(`/post/${postId}/comments`, { content });
        currentPost = result.post;
        commentInput.value = '';
        displayComments();
    } catch (error) {
        alert(error.message || '댓글 작성 중 오류가 발생했습니다.');
    }
});

// 수정 버튼
function editPost() {
    window.location.href = `board-write.html?edit=${postId}`;
}

// 삭제 버튼
async function deletePost() {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }

    try {
        await api.delete(`/post/${postId}`);
        alert('게시글이 삭제되었습니다.');
        window.location.href = 'board.html';
    } catch (error) {
        alert(error.message || '게시글 삭제 중 오류가 발생했습니다.');
    }
}

// 목록으로
function goBack() {
    window.location.href = 'board.html';
}

// 댓글 삭제
async function deleteComment(commentId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) {
        return;
    }

    try {
        await api.delete(`/post/${postId}/comments/${commentId}`);
        // 게시글 정보 다시 불러와서 댓글 목록 갱신
        const result = await api.get(`/post/${postId}`);
        currentPost = result.post;
        displayComments();
    } catch (error) {
        alert(error.message || '댓글 삭제 중 오류가 발생했습니다.');
    }
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
document.getElementById('imageModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeModal();
    }
});

// 페이지 로드 시 게시글 불러오기
loadPost();
