import axios from 'axios';
import { getAcessToken } from './token';


//서버 배포 url
export const BASE_URL = "http://localhost:8080"

//data
export const USE_MOCK = true;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getAcessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
