// 로그인 토큰을 폰에 암호화해서 저장한다
import * as SecureStore from 'expo-secure-store';

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';
const ONBOARDED = 'onboardingCompleted';
const CHARACTER_NAME = 'characterName';

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

// 온보딩을 마쳤는지.
// GET /settings 응답에 onboarding_completed 가 없어서 로그인 응답 값을 여기에 담아둔다.
// 서버가 그 필드를 주기 시작하면 이 세 함수는 지워도 된다.
export async function saveOnboarded(done) {
  await SecureStore.setItemAsync(ONBOARDED, done ? 'true' : 'false');
}

// true / false / null(저장된 적 없음)
export async function getOnboarded() {
  const value = await SecureStore.getItemAsync(ONBOARDED);
  if (value == null) return null;
  return value === 'true';
}

// 온보딩에서 지은 캐릭터 이름.
// GET /characters/me/room 응답에 없어서 지을 때 여기에 담아둔다.
// 서버가 character_name 을 주기 시작하면 이 두 함수는 지워도 된다.
export async function saveCharacterName(name) {
  await SecureStore.setItemAsync(CHARACTER_NAME, name);
}

export async function getSavedCharacterName() {
  return SecureStore.getItemAsync(CHARACTER_NAME);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(ACCESS);
  await SecureStore.deleteItemAsync(REFRESH);
  await SecureStore.deleteItemAsync(ONBOARDED);
  await SecureStore.deleteItemAsync(CHARACTER_NAME);
}
