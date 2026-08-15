
import api, { USE_MOCK } from './client';
import { MOCK_LOGS } from './mock/logs';

export async function getLogs(page = 1) {
  if (USE_MOCK) return MOCK_LOGS;

  const res = await api.get('/logs', {params: {page}});
  return res.data.logs;
    
}

export async function createLog(content) {
  if (USE_MOCK) {
    return {log_id: Date.now(), content, created_at: new Date().toISOString()};

  }

  const res = await api.post('/logs', {content});
  return res.date;
}

export async function deleteLog(logID) {
  if (USE_MOCK) return;

  await api.delete(`/logs/${logId}`)
}