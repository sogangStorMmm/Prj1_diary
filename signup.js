sessionStorage.clear();
// 아이디 중복 체크
document.getElementById('username').addEventListener('blur', async function () {
    const username = this.value.trim();
    const helpText = document.getElementById('usernameHelp');

    if (username === '') {
        helpText.textContent = '';
        return;
    }

    // 백엔드는 별도의 중복체크 API가 없으므로 생략하거나, 
    // 나중에 필요하면 auth.js에 추가할 수 있습니다.
    helpText.textContent = '중복 체크는 회원가입 시 확인됩니다.';
    helpText.style.color = '#888';
});

// 비밀번호 확인 체크
document.getElementById('passwordConfirm').addEventListener('input', function () {
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
document.getElementById('signupForm').addEventListener('submit', async function (e) {
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

    try {
        // 백엔드 API 호출
        const result = await api.post('/auth/signup', {
            username,
            displayName,
            password
        });

        alert(`${result.user.displayName}님, 회원가입이 완료되었습니다! 🎉`);

        // 로그인 페이지로 이동
        window.location.href = 'login.html';
    } catch (error) {
        alert(error.message || '회원가입 중 오류가 발생했습니다.');
    }
});
