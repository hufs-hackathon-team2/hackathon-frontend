import api, { USE_MOCK } from '../client';

// 가짜 유저 데이터
const MOCK_USER = [
  {
  email: 'test@example.com',
  password: 'password123',
},
  {email: 'hacker@example.com',
  password: 'password'
  }
];

// 로그인 API
export async function login(email, password) {
  if (USE_MOCK) {
    if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
      throw new Error('이메일 또는 비밀번호를 확인해주세요');
    }
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
  }

  const res = await api.post('/auth/login', { email, password });
  return res.data;
}