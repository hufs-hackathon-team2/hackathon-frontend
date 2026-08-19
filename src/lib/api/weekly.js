// WK 01 위클리 카드
import api from './client';

export const getWeeklyData = async () => {
  const response = await api.get('/weekly-card/');
  return response.data;
};