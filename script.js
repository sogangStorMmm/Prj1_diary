
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



//앞뒤로 가기 감지
window.addEventListener('pageshow', function (event) {
    // 캐시에서 복원된 경우
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        checkLogin();
    }
});



// 로그아웃 버튼
document.getElementById('logoutBtn').addEventListener('click', function () {
    sessionStorage.clear();
    alert('로그아웃되었습니다.');
    window.location.href = 'login.html';
});

// 오늘 날짜를 기본값으로 설정
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').value = today;

// 이미지 처리 (미리보기 없음)
let selectedImage = null;

document.getElementById('image').addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            selectedImage = event.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        selectedImage = null;
    }
});

// 일기 데이터를 저장할 배열 (실제로는 서버에 저장해야 함)
let diaries = JSON.parse(localStorage.getItem('diaries')) || [];

// 폼 제출 처리
document.getElementById('diaryForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
        // 일기 객체 생성 및 백엔드 저장
        const result = await api.post('/diary', {
            date,
            title,
            content,
            image: selectedImage
        });

        // 성공 시 로컬 배열 업데이트
        diaries.unshift(result.diary);

        // 화면 갱신
        displayDiaries();

        // 폼 초기화
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        document.getElementById('date').value = today;
        document.getElementById('image').value = '';
        selectedImage = null;

        alert('일기가 저장되었습니다! 📝\n상대방만 읽을 수 있어요.');
    } catch (error) {
        alert(error.message || '일기 저장 중 오류가 발생했습니다.');
    }
});

// 페이지네이션 변수
let currentPage = 1;
const itemsPerPage = 10;

// 상호 팔로우 확인 함수
function getMutualFollows() {
    const followData = JSON.parse(localStorage.getItem('followData')) || {};

    if (!followData[currentUser]) {
        return [];
    }

    const myFollowing = followData[currentUser].following || [];
    const myFollowers = followData[currentUser].followers || [];

    // 내가 팔로우하고 나도 팔로우한 사람들 (상호 팔로우)
    const mutualFollows = myFollowing.filter(user => myFollowers.includes(user));

    return mutualFollows;
}

// 일기 목록 표시 함수 (상호 팔로우한 사람들의 일기만 보임)
async function displayDiaries() {
    const container = document.getElementById('diaryEntries');

    try {
        // 백엔드에서 상호 팔로우한 사람들의 일기 가져오기
        const result = await api.get('/diary/mutual');
        diaries = result.diaries;

        if (diaries.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>표시할 일기가 없습니다.</p>
                    <p style="margin-top: 10px; font-size: 14px;">
                        <a href="follow.html" style="color: #667eea; text-decoration: underline;">팔로우 관리</a>에서 파트너를 확인해보세요!
                    </p>
                </div>
            `;
            return;
        }

        // 페이지네이션 계산
        const totalPages = Math.ceil(diaries.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentDiaries = diaries.slice(startIndex, endIndex);

        // 일기 목록 (제목만 표시)
        container.innerHTML = currentDiaries.map(diary => `
            <div class="diary-item-preview" onclick="viewDiary('${diary._id}')">
                <div class="diary-header">
                    <span class="diary-title">${diary.title}</span>
                    <span class="diary-meta">${diary.author.displayName} · ${diary.date}</span>
                </div>
            </div>
        `).join('');

        // 페이지네이션 버튼
        if (totalPages > 1) {
            container.innerHTML += `
                <div class="pagination">
                    <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="page-btn">이전</button>
                    <span class="page-info">페이지 ${currentPage} / ${totalPages}</span>
                    <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="page-btn">다음</button>
                </div>
            `;
        }
    } catch (error) {
        container.innerHTML = `<div class="empty-state">일기를 불러오는 중 오류가 발생했습니다: ${error.message}</div>`;
    }
}

// 페이지 변경
function changePage(page) {
    const mutualFollows = getMutualFollows();
    const mutualDiaries = diaries.filter(diary => mutualFollows.includes(diary.author));
    const totalPages = Math.ceil(mutualDiaries.length / itemsPerPage);

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayDiaries();
}

// 일기 상세보기
async function viewDiary(diaryId) {
    try {
        const result = await api.get(`/diary/${diaryId}`);
        const diary = result.diary;

        const modal = document.getElementById('diaryModal');
        const modalContent = document.getElementById('diaryModalContent');

        modalContent.innerHTML = `
            <div class="diary-detail">
                <div class="diary-detail-header">
                    <h2>${diary.title}</h2>
                    <span class="diary-detail-meta">${diary.author.displayName} · ${diary.date}</span>
                </div>
                <div class="diary-detail-content">${diary.content}</div>
                ${diary.image ? `<div class="diary-detail-image"><img src="${diary.image}" alt="일기 사진" onclick="openImageModal('${diary.image}')"></div>` : ''}
            </div>
        `;

        modal.classList.add('active');
    } catch (error) {
        alert(error.message || '일기 내용을 불러올 수 없습니다.');
    }
}

// 일기 모달 닫기
function closeDiaryModal() {
    const modal = document.getElementById('diaryModal');
    modal.classList.remove('active');
}

// 이미지 모달 열기/닫기
function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    modal.classList.add('active');
    modalImg.src = imageSrc;
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
}

// 모달 닫기 이벤트
document.addEventListener('DOMContentLoaded', function () {
    // 이미지 모달 닫기
    const imageModalClose = document.querySelector('#imageModal .modal-close');
    if (imageModalClose) {
        imageModalClose.addEventListener('click', closeImageModal);
    }

    document.getElementById('imageModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeImageModal();
        }
    });

    // 일기 모달 닫기
    const diaryModalClose = document.querySelector('#diaryModal .modal-close');
    if (diaryModalClose) {
        diaryModalClose.addEventListener('click', closeDiaryModal);
    }

    document.getElementById('diaryModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeDiaryModal();
        }
    });
});

// 페이지 로드 시 일기 목록 표시
displayDiaries();