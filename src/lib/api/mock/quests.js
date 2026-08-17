export const MOCK_ACTIVE_QUESTS = [
  {
    quest_id: 12,
    quest_content: '자기 전 10분 스트레칭하기',
    started_at: '2026-08-16',
    days_since_start: 2,
    d_day: 5,
    count: 1,
    state: 'ACTIVE',
  },
];

export const MOCK_RECOMMENDATIONS = {
  has_recommendations: true,
  week_start: '2026-08-17',
  recommended_quests: [
    { recommendation_id: 1, quest_content: '아침에 일어나서 물 한 잔 마시기', reason: '지난주에도 잘 하셨어요' },
    { recommendation_id: 2, quest_content: '하루에 30분 산책하기', reason: '꾸준히 하면 몸이 달라져요' },
    { recommendation_id: 3, quest_content: '자기 전 10분 스트레칭하기', reason: '짧아도 매일이면 충분해요' },
  ],
  plus_log_count: 5,
  required_log_count: 2,
};
