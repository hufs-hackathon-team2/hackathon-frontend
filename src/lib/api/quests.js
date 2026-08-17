// QS 01 · QS 02 · QS 03 퀘스트
import api, { USE_MOCK } from './client';
import { MOCK_ACTIVE_QUESTS, MOCK_RECOMMENDATIONS } from './mock/quests';

// 진행 중인 퀘스트 하나 (서버는 배열로 준다)
export async function getActiveQuest() {
  if (USE_MOCK) return MOCK_ACTIVE_QUESTS[0] ?? null;

  const res = await api.get('/quests/active');
  return res.data.active_quests[0] ?? null;
}

export async function getRecommendations() {
  if (USE_MOCK) return MOCK_RECOMMENDATIONS;

  const res = await api.get('/quests/recommendations');
  return res.data;
}

export async function startQuest(content) {
  if (USE_MOCK) {
    return {
      quest_id: Date.now(),
      quest_content: content,
      started_at: new Date().toISOString().slice(0, 10),
      count: 0,
      state: 'ACTIVE',
    };
  }

  const res = await api.post('/quests', { quest_content: content });
  return res.data;
}

export async function checkQuest(questId) {
  if (USE_MOCK) return { quest_id: questId, count: 1, state: 'ACTIVE', is_success: false, growth_points_awarded: 1 };

  const res = await api.post(`/quests/${questId}/check`);
  return res.data;
}

export async function abandonQuest(questId) {
  if (USE_MOCK) return { quest_id: questId, state: 'ABANDONED', count: 0 };

  const res = await api.post(`/quests/${questId}/abandon`);
  return res.data;
}
