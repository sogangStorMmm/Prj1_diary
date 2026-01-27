// 로그인 확인
const currentUser = sessionStorage.getItem('currentUser');
const displayName = sessionStorage.getItem('displayName');

if (!currentUser) {
    alert('로그인이 필요합니다.');
    window.location.href = 'login.html';
}

// URL에서 postId 가져오기 (수정 모드)
const urlParams = new URLSearchParams(window.location.search);
const editPostId = urlParams.get('edit');
let isEditMode = false;
let editingPost = null;

// 수정 모드면 기존 데이터 불러오기
if (editPostId) {
    isEditMode = true;
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    editingPost = posts.find(p => p.id === parseInt(editPostId));
    
    if (editingPost) {
        document.getElementById('title').value = editingPost.title;
        document.getElementById('content').value = editingPost.content;
        
        if (editingPost.image) {
            selectedImage = editingPost.image;
            document.getElementById('imagePreview').innerHTML = `<img src="${editingPost.image}" alt="미리보기">`;
        }
        
        document.querySelector('h1').textContent = '✏️ 글 수정';
    }
}

// 이미지 미리보기
let selectedImage = null;

document.getElementById('image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            selectedImage = event.target.result;
            preview.innerHTML = `<img src="${selectedImage}" alt="미리보기">`;
        };
        
        reader.readAsDataURL(file);
    } else {
        selectedImage = isEditMode ? editingPost.image : null;
        preview.innerHTML = '';
    }
});

// 취소 버튼
document.getElementById('cancelBtn').addEventListener('click', function() {
    if (confirm('작성을 취소하시겠습니까?')) {
        window.location.href = 'board.html';
    }
});

// 폼 제출
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    if (isEditMode) {
        // 수정 모드
        const postIndex = posts.findIndex(p => p.id === parseInt(editPostId));
        if (postIndex !== -1) {
            posts[postIndex] = {
                ...posts[postIndex],
                title: title,
                content: content,
                image: selectedImage,
                updatedAt: new Date().toISOString()
            };
        }
    } else {
        // 새 글 작성
        const post = {
            id: Date.now(),
            title: title,
            content: content,
            image: selectedImage,
            author: currentUser,
            authorName: displayName,
            createdAt: new Date().toISOString(),
            comments: []
        };
        
        posts.unshift(post);
    }
    
    localStorage.setItem('posts', JSON.stringify(posts));
    
    alert(isEditMode ? '게시글이 수정되었습니다!' : '게시글이 작성되었습니다!');
    window.location.href = 'board.html';
});