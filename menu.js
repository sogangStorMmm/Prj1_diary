const currentUser = sessionStorage.getItem('currentUser');
const displayName = sessionStorage.getItem('displayName');

    if (!currentUser) {
        window.location.href = 'login.html';
    }

document.getElementById('currentUserName').textContent = `${displayName}님`;


// ⭐ 뒤로가기/앞으로가기 감지
window.addEventListener('pageshow', function(event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        checkLogin();
    }
});



        // 로그아웃
document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.clear();
    location.href = 'login.html';
});
