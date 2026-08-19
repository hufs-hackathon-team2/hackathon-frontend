// 로그인 토큰을 폰에 암호화해서 저장한다
import * as SecureStore from 'expo-secure-store';

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';

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

export async function clearToken() {
  await SecureStore.deleteItemAsync(ACCESS);
  await SecureStore.deleteItemAsync(REFRESH);
}
