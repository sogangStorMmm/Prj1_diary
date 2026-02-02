// api.js
// 백엔드 API와의 통신을 담당하는 파일

const API_BASE_URL = 'https://prj1diary.vercel.app/api';

const api = {
    // 공통 요청 함수
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        // 헤더 설정 (JWT 토큰 포함)
        const token = sessionStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '요청 중 오류가 발생했습니다.');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // GET 요청
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    // POST 요청
    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    // PUT 요청
    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    // DELETE 요청
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};
