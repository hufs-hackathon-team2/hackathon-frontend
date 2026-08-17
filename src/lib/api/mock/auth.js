import api, { USE_MOCK } from '../client';

// Mock 유저
export const MOCK_USER = [
  {
    username: 'test@example.com',
    password: 'password123',
    nickname: '테스터',
  },
];

// 회원가입
export async function signup(username, password, nickname) {
  if (USE_MOCK) {
    const exists = MOCK_USER.some((u) => u.username === username);
    if (exists) {
      throw new Error('이미 등록된 아이디(이메일)입니다.');
    }

    MOCK_USER.push({ username, password, nickname });
    return { success: true, message: '회원가입 성공' };
  }

  const res = await api.post('/auth/signup', { username, password, nickname });
  return res.data;
}

// 로그인
export async function login(username, password) {
  if (USE_MOCK) {
    const user = MOCK_USER.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('아이디 또는 비밀번호를 확인해주세요.');
    }

    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user,
    };
  }


  const res = await api.post('/auth/login', { username, password });
  return res.data;
}