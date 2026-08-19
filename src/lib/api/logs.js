
import api, { USE_MOCK } from './client';
import { MOCK_LOGS } from './mock/logs';
import { isResting } from './cycles';

export const PAGE_SIZE = 10;

// 목데이터일 때 쓰는 가짜 저장소. 앱을 새로고침하면 처음 상태로 돌아간다.
let mockLogs = MOCK_LOGS;

export async function getLogs(page = 1) {
  if (USE_MOCK) return mockLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const res = await api.get('/logs/', {params: {page}});
  return res.data.logs;

}

export async function createLog(content) {
  if (USE_MOCK) {
    const wasResting = await isResting();

    const log = {log_id: Date.now(), content, created_at: new Date().toISOString()};
    mockLogs = [log].concat(mockLogs);
    return { ...log, new_cycle_started: wasResting };
  }

  // 서버가 new_cycle_started 를 함께 준다
  const res = await api.post('/logs/', {content});
  return res.data;
}

export async function deleteLog(logId) {
  if (USE_MOCK) {
    mockLogs = mockLogs.filter((log) => log.log_id !== logId);
    return;
  }

  await api.delete(`/logs/${logId}/`)
}