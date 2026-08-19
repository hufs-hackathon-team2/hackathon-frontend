// 로그인 토큰을 폰에 암호화해서 저장한다
import * as SecureStore from 'expo-secure-store';

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';
const ONBOARDED = 'onboardingCompleted';

export async function saveToken(accessToken, refreshToken) {
  await SecureStore.setItemAsync(ACCESS, accessToken);
  await SecureStore.setItemAsync(REFRESH, refreshToken);
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH);
}

// 온보딩을 마쳤는지. 로그인 응답의 onboarding_completed 를 여기에 담아둔다.
// SecureStore 는 문자열만 저장할 수 있어서 'true' / 'false' 로 넣는다.
export async function saveOnboarded(done) {
  await SecureStore.setItemAsync(ONBOARDED, done ? 'true' : 'false');
}

export async function getOnboarded() {
  const value = await SecureStore.getItemAsync(ONBOARDED);
  return value === 'true';
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(ACCESS);
  await SecureStore.deleteItemAsync(REFRESH);
  await SecureStore.deleteItemAsync(ONBOARDED);
}
