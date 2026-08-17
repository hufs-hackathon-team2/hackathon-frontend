// CY 03 · CY 04 사이클 분석
import api, { USE_MOCK } from './client';
import {
  MOCK_ANALYSIS,
  MOCK_PREVIOUS_ANALYSIS,
  MOCK_HISTORY,
  MOCK_LOG_DATES,
  MOCK_QUEST_DATES,
  MOCK_PREV_LOG_DATES,
  MOCK_PREV_QUEST_DATES,
} from './mock/cycles';

// 달력에 점을 찍을 날짜는 아직 서버가 주지 않는다. 요청해둔 상태라 목데이터로 채운다.
function withDates(analysis, logDates, questDates) {
  return {
    ...analysis,
    logDates: analysis.logDates ?? logDates,
    questDates: analysis.questDates ?? questDates,
  };
}

// 현재 사이클 분석 조회
// TODO 백엔드에 GET /cycle/analysis/current 요청해둔 상태
export async function getCurrentAnalysis() {
  if (USE_MOCK) return withDates(MOCK_ANALYSIS, MOCK_LOG_DATES, MOCK_QUEST_DATES);

  const res = await api.get('/cycle/analysis/current');
  return withDates(res.data, [], []);
}

// 지난 사이클 분석 조회
export async function getAnalysis(cycleCount) {
  if (USE_MOCK) return withDates(MOCK_PREVIOUS_ANALYSIS, MOCK_PREV_LOG_DATES, MOCK_PREV_QUEST_DATES);

  const res = await api.get(`/cycle/analysis/${cycleCount}`);
  return withDates(res.data, [], []);
}

// 가장 최근에 끝난 사이클 조회
// TODO 현재 사이클 번호를 알 방법이 없어 current 를 먼저 부른다. GET /cycles 가 생기면 한 번으로 줄인다.
export async function getPreviousAnalysis() {
  if (USE_MOCK) return withDates(MOCK_PREVIOUS_ANALYSIS, MOCK_PREV_LOG_DATES, MOCK_PREV_QUEST_DATES);

  const current = await api.get('/cycle/analysis/current');
  return getAnalysis(current.data.cycle_count - 1);
}

// 현재 사이클 분석 요청 (3회 초과 시 429)
export async function requestCurrentAnalysis() {
  if (USE_MOCK) return withDates(MOCK_ANALYSIS, MOCK_LOG_DATES, MOCK_QUEST_DATES);

  const res = await api.post('/cycle/analysis/current');
  return withDates(res.data, [], []);
}

// 지난 사이클 목록 (S32)
export async function getCycleHistory() {
  if (USE_MOCK) return MOCK_HISTORY;

  const res = await api.get('/cycle/history');
  return res.data.cycles;
}
