sessionStorage.clear();
// 아이디 중복 체크
document.getElementById('username').addEventListener('blur', function() {
    const username = this.value.trim();
    const helpText = document.getElementById('usernameHelp');
    
    if (username === '') {
        helpText.textContent = '';
        return;
    }
    
    // localStorage에서 사용자 목록 가져오기
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username]) {
        helpText.textContent = '이미 사용 중인 아이디입니다';
        helpText.style.color = '#ff4444';
    } else {
        helpText.textContent = '사용 가능한 아이디입니다';
        helpText.style.color = '#44ff44';
    }
});

// 비밀번호 확인 체크
document.getElementById('passwordConfirm').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const passwordConfirm = this.value;
    const helpText = document.getElementById('passwordHelp');
    
    if (passwordConfirm === '') {
        helpText.textContent = '';
        return;
    }
    
    if (password === passwordConfirm) {
        helpText.textContent = '비밀번호가 일치합니다';
        helpText.style.color = '#44ff44';
    } else {
        helpText.textContent = '비밀번호가 일치하지 않습니다';
        helpText.style.color = '#ff4444';
    }
});

// 회원가입 폼 제출
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const displayName = document.getElementById('displayName').value.trim();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    
    // 유효성 검사
    if (username === '' || displayName === '' || password === '') {
        alert('모든 항목을 입력해주세요.');
        return;
    }
    
    if (password.length < 4) {
        alert('비밀번호는 최소 4자 이상이어야 합니다.');
        return;
    }
    
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    // localStorage에서 사용자 목록 가져오기
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    // 아이디 중복 확인
    if (users[username]) {
        alert('이미 사용 중인 아이디입니다.');
        return;
    }
    
    // 새 사용자 추가
    users[username] = {
        password: password,
        displayName: displayName,
        createdAt: new Date().toISOString()
    };
    
    // localStorage에 저장
    localStorage.setItem('users', JSON.stringify(users));
    
    alert(`${displayName}님, 회원가입이 완료되었습니다! 🎉`);
    
    // 로그인 페이지로 이동
    window.location.href = 'login.html';
});