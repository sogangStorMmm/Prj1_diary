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

let selectedImage = null;

// 수정 모드면 기존 데이터 불러오기
async function loadEditData() {
    if (editPostId) {
        isEditMode = true;
        try {
            const result = await api.get(`/post/${editPostId}`);
            editingPost = result.post;

            document.getElementById('title').value = editingPost.title;
            document.getElementById('content').value = editingPost.content;

            if (editingPost.image) {
                selectedImage = editingPost.image;
                document.getElementById('imagePreview').innerHTML = `<img src="${editingPost.image}" alt="미리보기">`;
            }

            document.querySelector('h1').textContent = '✏️ 글 수정';
        } catch (error) {
            alert('게시글을 불러올 수 없습니다: ' + error.message);
            window.location.href = 'board.html';
        }
    }
}

// 이미지 미리보기
document.getElementById('image').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imagePreview');

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
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
document.getElementById('cancelBtn').addEventListener('click', function () {
    if (confirm('작성을 취소하시겠습니까?')) {
        window.location.href = 'board.html';
    }
});

// 폼 제출
document.getElementById('postForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    try {
        if (isEditMode) {
            // 수정 모드
            await api.put(`/post/${editPostId}`, {
                title,
                content,
                image: selectedImage
            });
            alert('게시글이 수정되었습니다!');
        } else {
            // 새 글 작성
            await api.post('/post', {
                title,
                content,
                image: selectedImage
            });
            alert('게시글이 작성되었습니다!');
        }
        window.location.href = 'board.html';
    } catch (error) {
        alert(error.message || '게시글 저장 중 오류가 발생했습니다.');
    }
});

// 초기 데이터 로드
loadEditData();
