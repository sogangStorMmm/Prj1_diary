// 로그인 확인
const currentUser = sessionStorage.getItem('currentUser');
const displayName = sessionStorage.getItem('displayName');

if (!currentUser) {
    alert('로그인이 필요합니다.');
    window.location.href = 'login.html';
}

// 사용자 검색
async function searchUser() {
    const searchInput = document.getElementById('searchInput');
    const searchId = searchInput.value.trim();
    const resultDiv = document.getElementById('searchResult');

    if (!searchId) {
        resultDiv.innerHTML = '';
        return;
    }

    try {
        // 백엔드 사용자 검색 API 호출
        const result = await api.get(`/follow/search/${searchId}`);
        const user = result.user;

        resultDiv.innerHTML = `
            <div class="user-item">
                <div>
                    <div class="user-name">${user.displayName}</div>
                    <div class="user-id">@${user.username}</div>
                </div>
                ${user.isFollowing
                ? `<button class="unfollow-btn" onclick="unfollowUser('${user.id}')">언팔로우</button>`
                : `<button class="follow-btn" onclick="followUser('${user.id}')">팔로우</button>`
            }
            </div>
        `;
    } catch (error) {
        resultDiv.innerHTML = `<div class="user-item"><span style="color: #ff4444;">${error.message}</span></div>`;
    }
}

// 팔로우하기
async function followUser(userId) {
    try {
        await api.post(`/follow/follow/${userId}`);
        alert('팔로우했습니다!');
        searchUser();
        loadFollowLists();
    } catch (error) {
        alert(error.message || '팔로우 중 오류가 발생했습니다.');
    }
}

// 언팔로우하기
async function unfollowUser(userId) {
    if (!confirm('정말 언팔로우하시겠습니까?')) {
        return;
    }

    try {
        await api.delete(`/follow/follow/${userId}`);
        alert('언팔로우했습니다.');
        searchUser();
        loadFollowLists();
    } catch (error) {
        alert(error.message || '언팔로우 중 오류가 발생했습니다.');
    }
}

// 팔로우 목록 불러오기
async function loadFollowLists() {
    try {
        const result = await api.get('/follow/my-follows');

        const myFollowing = result.following;
        const myFollowers = result.followers;
        const mutualFollows = result.mutualFollows;

        const mutualIds = mutualFollows.map(f => f._id);

        // 팔로잉 목록
        const followingList = document.getElementById('followingList');
        if (myFollowing.length === 0) {
            followingList.innerHTML = '<div class="empty-state">팔로우한 사람이 없습니다</div>';
        } else {
            followingList.innerHTML = myFollowing.map(user => {
                const isMutual = mutualIds.includes(user._id);
                return `
                    <div class="user-item">
                        <div>
                            <div class="user-name">
                                ${user.displayName}
                                ${isMutual ? '<span class="status-badge status-mutual">교환일기 파트너</span>' : ''}
                            </div>
                            <div class="user-id">@${user.username}</div>
                        </div>
                        <button class="unfollow-btn" onclick="unfollowUser('${user._id}')">언팔로우</button>
                    </div>
                `;
            }).join('');
        }

        // 팔로워 목록
        const followerList = document.getElementById('followerList');
        if (myFollowers.length === 0) {
            followerList.innerHTML = '<div class="empty-state">팔로워가 없습니다</div>';
        } else {
            const followingIds = myFollowing.map(f => f._id);
            followerList.innerHTML = myFollowers.map(user => {
                const isMutual = mutualIds.includes(user._id);
                const isFollowingBack = followingIds.includes(user._id);

                return `
                    <div class="user-item">
                        <div>
                            <div class="user-name">
                                ${user.displayName}
                                ${isMutual ? '<span class="status-badge status-mutual">교환일기 파트너</span>' : ''}
                            </div>
                            <div class="user-id">@${user.username}</div>
                        </div>
                        ${isFollowingBack
                        ? `<button class="unfollow-btn" onclick="unfollowUser('${user._id}')">언팔로우</button>`
                        : `<button class="follow-btn" onclick="followUser('${user._id}')">팔로우 백</button>`
                    }
                    </div>
                `;
            }).join('');
        }

        // 상호 팔로우 목록
        const mutualList = document.getElementById('mutualList');
        if (mutualFollows.length === 0) {
            mutualList.innerHTML = '<div class="empty-state">아직 교환일기 파트너가 없습니다</div>';
        } else {
            mutualList.innerHTML = mutualFollows.map(user => `
                <div class="user-item">
                    <div>
                        <div class="user-name">
                            ${user.displayName}
                            <span class="status-badge status-mutual">💕</span>
                        </div>
                        <div class="user-id">@${user.username}</div>
                    </div>
                    <button class="unfollow-btn" onclick="unfollowUser('${user._id}')">언팔로우</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('팔로우 목록 로드 에러:', error);
    }
}

// 검색 입력 시 엔터키 처리
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchUser();
    }
});

// 페이지 로드 시 목록 불러오기
loadFollowLists();

// 검색 입력 시 엔터키 처리
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchUser();
    }
});

// 페이지 로드 시 목록 불러오기
loadFollowLists();