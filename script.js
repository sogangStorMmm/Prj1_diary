// 로그인 확인
const currentUser = sessionStorage.getItem('currentUser');
const displayName = sessionStorage.getItem('displayName');

if (!currentUser) {
    // 로그인 안 되어 있으면 로그인 페이지로
    //alert('로그인이 필요합니다.'); 
    // 자꾸 입장하자마자 alert() 떠서 우선 지움 
    window.location.href = 'login.html';
}

// 현재 사용자 이름 표시
document.getElementById('currentUserName').textContent = `${displayName}님으로 로그인 중`;

// 로그아웃 버튼
document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.clear();
    alert('로그아웃되었습니다.');
    window.location.href = 'login.html';
});

// 오늘 날짜를 기본값으로 설정
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').value = today;

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
        selectedImage = null;
        preview.innerHTML = '';
    }
});

// 일기 데이터를 저장할 배열 (실제로는 서버에 저장해야 함)
let diaries = JSON.parse(localStorage.getItem('diaries')) || [];

// 폼 제출 처리
document.getElementById('diaryForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    // 일기 객체 생성 (로그인한 사용자가 자동으로 작성자가 됨)
    const diary = {
        id: Date.now(),
        author: currentUser,
        authorName: displayName,
        date: date,
        title: title,
        content: content,
        image: selectedImage  // 사진 데이터 추가
    };

    // 배열에 추가
    diaries.unshift(diary);
    
    // localStorage에 저장
    localStorage.setItem('diaries', JSON.stringify(diaries));

    // 화면 갱신
    displayDiaries();

    // 폼 초기화
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('date').value = today;
    document.getElementById('image').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    selectedImage = null;

    alert('일기가 저장되었습니다! 📝\n상대방만 읽을 수 있어요.');
});

// 일기 목록 표시 함수 (상대방이 쓴 일기만 보임)
function displayDiaries() {
    const container = document.getElementById('diaryEntries');
    
    // 상대방이 쓴 일기만 필터링
    const otherDiaries = diaries.filter(diary => diary.author !== currentUser);

    if (otherDiaries.length === 0) {
        container.innerHTML = '<div class="empty-state">아직 상대방이 작성한 일기가 없습니다.</div>';
        return;
    }

    container.innerHTML = otherDiaries.map(diary => `
        <div class="diary-item">
            <div class="diary-header">
                <span class="diary-title">${diary.title}</span>
                <span class="diary-meta">${diary.authorName} · ${diary.date}</span>
            </div>
            <div class="diary-content">${diary.content}</div>
            ${diary.image ? `<div class="diary-image"><img src="${diary.image}" alt="일기 사진" class="diary-thumbnail" onclick="openModal('${diary.image}')"></div>` : ''}
        </div>
    `).join('');
}

// 이미지 모달 열기/닫기
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

// 모달 닫기 이벤트
document.querySelector('.modal-close').addEventListener('click', closeModal);
document.getElementById('imageModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// 페이지 로드 시 일기 목록 표시
displayDiaries();