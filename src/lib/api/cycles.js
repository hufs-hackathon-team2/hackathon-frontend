// CY 03 · CY 04 사이클 분석
import api, { USE_MOCK } from './client';
import { MOCK_ANALYSIS, MOCK_LOG_DATES, MOCK_QUEST_DATES } from './mock/cycles';

// 달력에 점을 찍을 날짜는 아직 서버가 주지 않는다. 요청해둔 상태라 목데이터로 채운다.
function withDates(analysis) {
  return {
    ...analysis,
    logDates: analysis.logDates ?? MOCK_LOG_DATES,
    questDates: analysis.questDates ?? MOCK_QUEST_DATES,
  };
}

// 현재 사이클 분석 조회
// TODO 백엔드에 GET /cycle/analysis/current 요청해둔 상태
export async function getCurrentAnalysis() {
  if (USE_MOCK) return withDates(MOCK_ANALYSIS);

  const res = await api.get('/cycle/analysis/current');
  return withDates(res.data);
}

// 지난 사이클 분석 조회
export async function getAnalysis(cycleCount) {
  if (USE_MOCK) return withDates(MOCK_ANALYSIS);

  const res = await api.get(`/cycle/analysis/${cycleCount}`);
  return withDates(res.data);
}

// 현재 사이클 분석 요청 (3회 초과 시 429)
export async function requestCurrentAnalysis() {
  if (USE_MOCK) return withDates(MOCK_ANALYSIS);

  const res = await api.post('/cycle/analysis/current');
  return withDates(res.data);
}
