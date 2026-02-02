window.addEventListener('pageshow', function (event) {
    const isBackNavigation = event.persisted ||
        (window.performance && window.performance.navigation.type === 2);

    if (isBackNavigation) {
        sessionStorage.clear();
        alert('로그인을 다시 해주세요');
    } else {
        sessionStorage.clear();
    }
});

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        // 백엔드 로그인 API 호출
        const result = await api.post('/auth/login', {
            username,
            password
        });

        // 로그인 성공 - 토큰 및 사용자 정보 저장
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('currentUser', result.user.username);
        sessionStorage.setItem('displayName', result.user.displayName);
        sessionStorage.setItem('userId', result.user.id);

        alert(`${result.user.displayName}님 환영합니다! 🎉`);

        // 메인 페이지로 이동
        window.location.href = 'menu.html';
    } catch (error) {
        alert(error.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
    }
});

