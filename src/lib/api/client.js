import axios from 'axios';
import { getAccessToken } from './token';


//서버 배포 url
export const BASE_URL = "https://meotjinsaja.shop"

//data
export const USE_MOCK = false;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 토큰을 붙이면 안 되는 주소.
// 만료된 토큰이 폰에 남아 있으면 로그인 요청까지 401 로 막혀서 빠져나올 수 없다.
const NO_AUTH = ['/auth/login/', '/auth/signup/'];

api.interceptors.request.use(async (config) => {
  if (NO_AUTH.some((path) => config.url?.startsWith(path))) {
    return config;
  }

  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 로그에 남으면 안 되는 값. 로그인 응답의 토큰이 대표적이다.
const SECRET_KEYS = ['access', 'refresh', 'access_token', 'refresh_token', 'token', 'password'];

function hideSecret(data) {
  if (!data || typeof data !== 'object') return data;

  const copy = Array.isArray(data) ? [...data] : { ...data };

  SECRET_KEYS.forEach((key) => {
    if (copy[key] != null) copy[key] = '***';
  });

  return copy;
}

api.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toUpperCase() ?? '?';
    const url = response.config?.url ?? '?';

    // 성공 응답에만 진짜 토큰이 들어 있다.
    console.log(`[API] ${method} ${url} → ${response.status}`, hideSecret(response.data));

    return response;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase() ?? '?';
    const url = error.config?.url ?? '?';

    // 실패하면 서버가 토큰을 주지 않으므로 에러 내용은 그대로 남긴다.
    if (error.response) {
      console.log(`[API] ${method} ${url} → ${error.response.status}`, error.response.data);
    } else {
      console.log(`[API] ${method} ${url} → 응답 없음`, error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
