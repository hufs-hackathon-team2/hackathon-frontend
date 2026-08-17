
import api, { USE_MOCK } from './client';
import { MOCK_LOGS } from './mock/logs';

export const PAGE_SIZE = 10;

export async function getLogs(page = 1) {
  if (USE_MOCK) return MOCK_LOGS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const res = await api.get('/logs', {params: {page}});
  return res.data.logs;

}

export async function createLog(content) {
  if (USE_MOCK) {
    return {log_id: Date.now(), content, created_at: new Date().toISOString()};

  }

  const res = await api.post('/logs', {content});
  return res.data;
}

export async function deleteLog(logId) {
  if (USE_MOCK) return;

  await api.delete(`/logs/${logId}`)
}