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

export default api;
