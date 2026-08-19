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
    try {
      const refreshToken = await getRefreshToken();

      // 응답은 refresh 로 오지만 로그아웃 요청은 refresh_token 으로 받는다
      await api.post('/auth/logout/', { refresh_token: refreshToken });
    } catch {
      // 서버 로그아웃이 실패해도 폰에서는 지운다.
      // 안 그러면 토큰이 남아 로그아웃 자체가 불가능해진다.
    }
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
