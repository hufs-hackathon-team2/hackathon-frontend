
import api, { USE_MOCK } from './client';
import {
  MOCK_ANALYSIS,
  MOCK_ANALYSIS_DONE,
  MOCK_PREVIOUS_ANALYSIS,
  MOCK_HISTORY,
  MOCK_LOG_DATES,
  MOCK_QUEST_DATES,
  MOCK_PREV_LOG_DATES,
  MOCK_PREV_QUEST_DATES,
} from './mock/cycles';



function withDates(analysis, logDates, questDates) {
  const log = analysis.logDates ?? analysis.log_dates ?? logDates;
  const quest = analysis.questDates ?? analysis.quest_dates ?? questDates;

  return {
    ...analysis,
    logDates: log,
    questDates: quest,



    active_days: analysis.active_days ?? new Set([...log, ...quest]).size,
  };
}


let mockAnalysis = MOCK_ANALYSIS;


export async function getCurrentAnalysis() {
  if (USE_MOCK) return withDates(mockAnalysis, MOCK_LOG_DATES, MOCK_QUEST_DATES);

  const res = await api.get('/cycle/analysis/current/');
  return withDates(res.data, [], []);
}


export async function getAnalysis(cycleCount) {
  if (USE_MOCK) return withDates(MOCK_PREVIOUS_ANALYSIS, MOCK_PREV_LOG_DATES, MOCK_PREV_QUEST_DATES);

  const res = await api.get(`/cycle/analysis/${cycleCount}/`);
  return withDates(res.data, [], []);
}



export async function getPreviousAnalysis() {
  if (USE_MOCK) return withDates(MOCK_PREVIOUS_ANALYSIS, MOCK_PREV_LOG_DATES, MOCK_PREV_QUEST_DATES);

  const current = await api.get('/cycle/analysis/current/');


  if (current.data.cycle_count <= 1) return null;

  return getAnalysis(current.data.cycle_count - 1);
}



export async function requestCurrentAnalysis() {
  if (USE_MOCK) {
    mockAnalysis = MOCK_ANALYSIS_DONE;
    return withDates(mockAnalysis, MOCK_LOG_DATES, MOCK_QUEST_DATES);
  }

  const res = await api.post('/cycle/analysis/current/', null, { timeout: 15000 });
  return withDates(res.data, [], []);
}


export async function getCycleHistory() {
  if (USE_MOCK) return MOCK_HISTORY;

  const res = await api.get('/cycle/history/');
  return res.data.cycles ?? [];
}


export async function isResting() {
  const analysis = await getCurrentAnalysis();
  return analysis.rest_started_at !== null;
}

