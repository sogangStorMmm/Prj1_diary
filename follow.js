// 로그인 확인
const currentUser = sessionStorage.getItem('currentUser');
const displayName = sessionStorage.getItem('displayName');

if (!currentUser) {
    alert('로그인이 필요합니다.');
    window.location.href = 'login.html';
}

// 팔로우 데이터 가져오기
function getFollowData() {
    const followData = JSON.parse(localStorage.getItem('followData')) || {};
    if (!followData[currentUser]) {
        followData[currentUser] = {
            following: [],  // 내가 팔로우하는 사람들
            followers: []   // 나를 팔로우하는 사람들
        };
    }
    return followData;
}

// 팔로우 데이터 저장
function saveFollowData(followData) {
    localStorage.setItem('followData', JSON.stringify(followData));
}

// 사용자 검색
function searchUser() {
    const searchInput = document.getElementById('searchInput');
    const searchId = searchInput.value.trim();
    const resultDiv = document.getElementById('searchResult');
    
    if (!searchId) {
        resultDiv.innerHTML = '';
        return;
    }
    
    if (searchId === currentUser) {
        resultDiv.innerHTML = '<div class="user-item"><span style="color: #ff4444;">자기 자신은 팔로우할 수 없습니다</span></div>';
        return;
    }
    
    // 사용자 목록에서 검색
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (!users[searchId]) {
        resultDiv.innerHTML = '<div class="user-item"><span style="color: #ff4444;">존재하지 않는 사용자입니다</span></div>';
        return;
    }
    
    const followData = getFollowData();
    const isFollowing = followData[currentUser].following.includes(searchId);
    
    resultDiv.innerHTML = `
        <div class="user-item">
            <div>
                <div class="user-name">${users[searchId].displayName}</div>
                <div class="user-id">@${searchId}</div>
            </div>
            ${isFollowing 
                ? `<button class="unfollow-btn" onclick="unfollowUser('${searchId}')">언팔로우</button>`
                : `<button class="follow-btn" onclick="followUser('${searchId}')">팔로우</button>`
            }
        </div>
    `;
}

// 팔로우하기
function followUser(targetUser) {
    const followData = getFollowData();
    
    if (!followData[currentUser].following.includes(targetUser)) {
        followData[currentUser].following.push(targetUser);
        
        // 상대방의 팔로워 목록에 나 추가
        if (!followData[targetUser]) {
            followData[targetUser] = { following: [], followers: [] };
        }
        if (!followData[targetUser].followers.includes(currentUser)) {
            followData[targetUser].followers.push(currentUser);
        }
        
        saveFollowData(followData);
        alert('팔로우했습니다!');
        searchUser();
        loadFollowLists();
    }
}

// 언팔로우하기
function unfollowUser(targetUser) {
    if (!confirm('정말 언팔로우하시겠습니까?')) {
        return;
    }
    
    const followData = getFollowData();
    
    followData[currentUser].following = followData[currentUser].following.filter(u => u !== targetUser);
    
    // 상대방의 팔로워 목록에서 나 제거
    if (followData[targetUser]) {
        followData[targetUser].followers = followData[targetUser].followers.filter(u => u !== currentUser);
    }
    
    saveFollowData(followData);
    alert('언팔로우했습니다.');
    searchUser();
    loadFollowLists();
}

// 팔로우 목록 불러오기
function loadFollowLists() {
    const followData = getFollowData();
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    const myFollowing = followData[currentUser].following;
    const myFollowers = followData[currentUser].followers;
    
    // 상호 팔로우 찾기
    const mutualFollows = myFollowing.filter(user => myFollowers.includes(user));
    
    // 팔로잉 목록
    const followingList = document.getElementById('followingList');
    if (myFollowing.length === 0) {
        followingList.innerHTML = '<div class="empty-state">팔로우한 사람이 없습니다</div>';
    } else {
        followingList.innerHTML = myFollowing.map(userId => {
            const user = users[userId];
            if (!user) return '';
            
            const isMutual = mutualFollows.includes(userId);
            
            return `
                <div class="user-item">
                    <div>
                        <div class="user-name">
                            ${user.displayName}
                            ${isMutual ? '<span class="status-badge status-mutual">교환일기 파트너</span>' : ''}
                        </div>
                        <div class="user-id">@${userId}</div>
                    </div>
                    <button class="unfollow-btn" onclick="unfollowUser('${userId}')">언팔로우</button>
                </div>
            `;
        }).join('');
    }
    
    // 팔로워 목록
    const followerList = document.getElementById('followerList');
    if (myFollowers.length === 0) {
        followerList.innerHTML = '<div class="empty-state">팔로워가 없습니다</div>';
    } else {
        followerList.innerHTML = myFollowers.map(userId => {
            const user = users[userId];
            if (!user) return '';
            
            const isMutual = mutualFollows.includes(userId);
            const isFollowingBack = myFollowing.includes(userId);
            
            return `
                <div class="user-item">
                    <div>
                        <div class="user-name">
                            ${user.displayName}
                            ${isMutual ? '<span class="status-badge status-mutual">교환일기 파트너</span>' : ''}
                        </div>
                        <div class="user-id">@${userId}</div>
                    </div>
                    ${isFollowingBack 
                        ? `<button class="unfollow-btn" onclick="unfollowUser('${userId}')">언팔로우</button>`
                        : `<button class="follow-btn" onclick="followUser('${userId}')">팔로우 백</button>`
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
        mutualList.innerHTML = mutualFollows.map(userId => {
            const user = users[userId];
            if (!user) return '';
            
            return `
                <div class="user-item">
                    <div>
                        <div class="user-name">
                            ${user.displayName}
                            <span class="status-badge status-mutual">💕</span>
                        </div>
                        <div class="user-id">@${userId}</div>
                    </div>
                    <button class="unfollow-btn" onclick="unfollowUser('${userId}')">언팔로우</button>
                </div>
            `;
        }).join('');
    }
}

// 검색 입력 시 엔터키 처리
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchUser();
    }
});

// 페이지 로드 시 목록 불러오기
loadFollowLists();