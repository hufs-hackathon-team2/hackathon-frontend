// GET /weekly-card
export const MOCK_WEEKLY = {
  is_generated: true,
  week_start: '2026-08-10',
  week_end: '2026-08-16',
  weekly_summary: '이번 주는 산책과 수분 섭취를 꾸준히 이어갔어요.',
  plus_log_count: 5,
  success_quest_count: 2,
  active_days: 4,
  rest_NT_content: '주말에는 조금 쉬어가도 괜찮아요.',
  next_week_recommendations: [
    {
      recommendation_id: 1,
      quest_content: '물 하루 8잔 마시기',
      reason: '지난주에도 잘 하셨어요',
    },
    {
      recommendation_id: 2,
      quest_content: '저녁 산책 10분',
      reason: '꾸준히 하면 몸이 달라져요',
    },
  ],
};
