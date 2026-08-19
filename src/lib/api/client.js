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

// 실패한 요청만 남긴다.
// 성공 응답에는 토큰이 들어 있어서 그대로 찍으면 로그에 노출된다.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const method = error.config?.method?.toUpperCase() ?? '?';
    const url = error.config?.url ?? '?';

    if (error.response) {
      console.log(`[API] ${method} ${url} → ${error.response.status}`, error.response.data);
    } else {
      console.log(`[API] ${method} ${url} → 응답 없음`, error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
