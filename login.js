document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // localStorage에서 사용자 목록 가져오기
    const users = JSON.parse(localStorage.getItem('users')) || {};

    // 로그인 검증
    if (users[username] && users[username].password === password) {
        // 로그인 성공 - 세션 저장
        sessionStorage.setItem('currentUser', username);
        sessionStorage.setItem('displayName', users[username].displayName);
        
        alert(`${users[username].displayName}님 환영합니다! 🎉`);
        
        // 메인 페이지로 이동
        window.location.href = 'menu.html';
    } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
});
