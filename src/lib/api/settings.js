// ST 01 설정 조회 · ST 02 알림 설정 · AU 04 로그아웃 · AU 06 회원 탈퇴
import api, { USE_MOCK } from './client';
import { MOCK_SETTINGS, MOCK_PASSWORD } from './mock/settings';
import { getRefreshToken, clearToken } from './token';

// 목데이터일 때 쓰는 가짜 저장소. 앱을 새로고침하면 처음 상태로 돌아간다.
let mockSettings = MOCK_SETTINGS;

export async function getSettings() {
  if (USE_MOCK) return mockSettings;

  const res = await api.get('/settings/');
  return res.data;
}

// key 는 restart_notification 또는 activity_notification
export async function updateNotification(key, enabled) {
  if (USE_MOCK) {
    mockSettings = { ...mockSettings, [key]: enabled };
    return mockSettings;
  }

  const res = await api.patch('/settings/notifications/', { [key]: enabled });
  return res.data;
}

export async function logout() {
  if (!USE_MOCK) {
    const refreshToken = await getRefreshToken();
    await api.post('/auth/logout/', { refresh_token: refreshToken });
  }

  await clearToken();
}

export async function withdraw(password) {
  if (USE_MOCK) {
    if (password !== MOCK_PASSWORD) throw new Error('비밀번호가 일치하지 않습니다');
  } else {
    await api.delete('/users/me/', { data: { password } });
  }

  await clearToken();
}
