import api, { USE_MOCK } from '../client';

// 가짜 유저 데이터
const MOCK_USER = [
  {
  username: 'test@example.com',
  password: 'password123',
},
  {username: 'hacker@example.com',
  password: 'password'
  }
];

// 로그인 API
export async function login(username, password) {
  if (USE_MOCK) {
    if (username !== MOCK_USER.username || password !== MOCK_USER.password) {
      throw new Error('이메일 또는 비밀번호를 확인해주세요');
    }
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  }

  const res = await api.post('/auth/login', { username, password });
  return res.data;
}