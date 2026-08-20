// QS 01 · QS 02 · QS 03 퀘스트
import api, { USE_MOCK } from './client';
import { MOCK_ACTIVE_QUESTS, MOCK_RECOMMENDATIONS } from './mock/quests';
import { isResting } from './cycles';
import { getDateFormat } from '../date';

let mockQuests = MOCK_ACTIVE_QUESTS;

// 진행 중인 퀘스트 하나 (서버는 배열로 준다)
export async function getActiveQuest() {
  if (USE_MOCK) return mockQuests[0] ?? null;

  const res = await api.get('/quests/active/');
  return res.data.active_quests[0] ?? null;
}

export async function getRecommendations() {
  if (USE_MOCK) return MOCK_RECOMMENDATIONS;

  const res = await api.get('/quests/recommendations/');
  return res.data;
}

export async function startQuest(content) {
  if (USE_MOCK) {
    const wasResting = await isResting();

    const quest = {
      quest_id: Date.now(),
      quest_content: content,
      started_at: new Date().toISOString().slice(0, 10),
      days_since_start: 1,
      d_day: 6,
      count: 0,
      state: 'ACTIVE',
    };

    mockQuests = [quest];
    return { ...quest, new_cycle_started: wasResting };
  }

  // 서버가 new_cycle_started 를 함께 준다
  const res = await api.post('/quests/', { quest_content: content });
  return res.data;
}

export async function checkQuest(questId) {
  if (USE_MOCK) {
    const quest = mockQuests[0];
    const count = quest.count + 1;

    const state = count >= 3 ? 'DONE' : 'ACTIVE';
    const lastChecked = getDateFormat(new Date());

    mockQuests = state === 'DONE' ? [] : [{ ...quest, count, last_checked: lastChecked }];

    return {
      quest_id: questId,
      state,
      count,
      last_checked: lastChecked,
      quest_content: quest.quest_content,
    };
  }

  const res = await api.post(`/quests/${questId}/check/`);
  return res.data;
}

export async function abandonQuest(questId) {
  if (USE_MOCK) {
    mockQuests = [];
    return { quest_id: questId, state: 'ABANDONED', count: 0 };
  }

  const res = await api.post(`/quests/${questId}/abandon/`);
  return res.data;
}
