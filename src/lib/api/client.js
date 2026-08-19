import axios from 'axios';
import { getAccessToken } from './token';


//서버 배포 url
export const BASE_URL = "https://meotjinsaja.shop"

//data
export const USE_MOCK = true;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
