
   
const currentUser = sessionStorage.getItem('currentUser');
const displayName = sessionStorage.getItem('displayName');

    if (!currentUser) {
        window.location.href = 'login.html';
    }

document.getElementById('currentUserName').textContent = `${displayName}님`;

        // 로그아웃
document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.clear();
    location.href = 'login.html';
});
