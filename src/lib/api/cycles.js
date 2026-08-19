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

// 달력에 점을 찍을 날짜.
// 서버가 GET 은 log_dates, POST 는 logDates 로 준다. 둘 다 받아 화면에는 한 이름으로 넘긴다.
function withDates(analysis, logDates, questDates) {
  const log = analysis.logDates ?? analysis.log_dates ?? logDates;
  const quest = analysis.questDates ?? analysis.quest_dates ?? questDates;

  return {
    ...analysis,
    logDates: log,
    questDates: quest,

    // 서버가 active_days 를 null 로 준다. 날짜 배열에서 직접 센다.
    // 서버가 값을 채우기 시작하면 그쪽이 우선이라 이 코드는 그대로 둬도 된다.
    active_days: analysis.active_days ?? new Set([...log, ...quest]).size,
  };
}

// 현재 사이클 분석 조회
// TODO 백엔드에 GET /cycle/analysis/current 요청해둔 상태
export async function getCurrentAnalysis() {
  if (USE_MOCK) return withDates(MOCK_ANALYSIS, MOCK_LOG_DATES, MOCK_QUEST_DATES);

  const res = await api.get('/cycle/analysis/current/');
  return withDates(res.data, [], []);
}

// 지난 사이클 분석 조회
export async function getAnalysis(cycleCount) {
  if (USE_MOCK) return withDates(MOCK_PREVIOUS_ANALYSIS, MOCK_PREV_LOG_DATES, MOCK_PREV_QUEST_DATES);

  const res = await api.get(`/cycle/analysis/${cycleCount}/`);
  return withDates(res.data, [], []);
}

// 가장 최근에 끝난 사이클 조회
// TODO 현재 사이클 번호를 알 방법이 없어 current 를 먼저 부른다. GET /cycles 가 생기면 한 번으로 줄인다.
export async function getPreviousAnalysis() {
  if (USE_MOCK) return withDates(MOCK_PREVIOUS_ANALYSIS, MOCK_PREV_LOG_DATES, MOCK_PREV_QUEST_DATES);

  const current = await api.get('/cycle/analysis/current/');

  // 첫 사이클이면 완료된 이전 사이클이 없다. 0 번을 요청하면 404 가 난다.
  if (current.data.cycle_count <= 1) return null;

  return getAnalysis(current.data.cycle_count - 1);
}

// 현재 사이클 분석 요청 (3회 초과 시 429)
// 분석에 5초 안팎이 걸린다. 기본 10초로는 아슬아슬해서 이 요청만 15초로 늘린다.
export async function requestCurrentAnalysis() {
  if (USE_MOCK) return withDates(MOCK_ANALYSIS, MOCK_LOG_DATES, MOCK_QUEST_DATES);

  const res = await api.post('/cycle/analysis/current/', null, { timeout: 15000 });
  return withDates(res.data, [], []);
}

// 지난 사이클 목록 (S32)
export async function getCycleHistory() {
  if (USE_MOCK) return MOCK_HISTORY;

  const res = await api.get('/cycle/history/');
  return res.data.cycles ?? [];
}

//휴식기
export async function isResting() {
  const analysis = await getCurrentAnalysis();
  return analysis.rest_started_at !== null;
}

