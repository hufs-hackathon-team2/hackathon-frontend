// AU 01 회원가입 · AU 02 로그인
import api, { USE_MOCK } from './client';
import { MOCK_USERS } from './mock/auth';

// 회원가입 — 응답에 토큰이 함께 온다
export async function signup(email, password, nickname) {
  if (USE_MOCK) {
    const exists = MOCK_USERS.some((user) => user.email === email);
    if (exists) throw new Error('이미 등록된 이메일입니다.');

    MOCK_USERS.push({ email, password, nickname });

    return {
      user_id: 'USR0000001',
      email,
      nickname,
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
    };
  }

  const res = await api.post('/auth/signup/', { email, password, nickname });
  return res.data;
}

// AU 05 비밀번호 재설정 — 메일로 토큰을 받아 새 비밀번호로 바꾼다
export async function requestPasswordReset(email) {
  if (USE_MOCK) return { detail: '메일을 보냈어요' };

  const res = await api.post('/auth/password-reset/', { email });
  return res.data;
}

export async function confirmPasswordReset(token, newPassword) {
  if (USE_MOCK) return { detail: '비밀번호를 바꿨어요' };

  const res = await api.post('/auth/password-reset/confirm/', {
    token,
    new_password: newPassword,
  });
  return res.data;
}

export async function login(email, password) {
  if (USE_MOCK) {
    const user = MOCK_USERS.find(
      (item) => item.email === email && item.password === password
    );

    if (!user) throw new Error('이메일 또는 비밀번호를 확인해주세요.');

    return {
      user_id: 'USR0000001',
      email,
      onboarding_completed: true,
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
    };
  }

  const res = await api.post('/auth/login/', { email, password });
  return res.data;
}
