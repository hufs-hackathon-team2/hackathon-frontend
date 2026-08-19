// WK 01 위클리 카드
import api, { USE_MOCK } from './client';
import { MOCK_WEEKLY } from './mock/weekly';

export async function getWeeklyData() {
  if (USE_MOCK) return MOCK_WEEKLY;

  const res = await api.get('/weekly-card/');
  return res.data;
}
