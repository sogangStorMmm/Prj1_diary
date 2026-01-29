window.addEventListener('pageshow', function(event) {
    // event.persisted는 브라우저 캐시(뒤로/앞으로가기)를 통해 진입했을 때 true가 됩니다.
    // 또는 Navigation Timing API를 사용하여 뒤로가기인지 확인합니다.
    const isBackNavigation = event.persisted || 
        (window.performance && window.performance.navigation.type === 2);

    if (isBackNavigation) {
        // 뒤로가기로 왔을 때만 실행
        sessionStorage.clear(); // 세션 삭제
        alert('로그인을 다시 해주세요');
    } else {
        // 일반 진입(새로고침, 링크 클릭 등) 시에도 안전을 위해 세션은 비워주되 alert은 띄우지 않음
        sessionStorage.clear();
    }
});

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

