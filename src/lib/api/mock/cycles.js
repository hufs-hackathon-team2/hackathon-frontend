// GET /cycle/analysis/{cycle_count}

export const MOCK_ANALYSIS = {
  cycle_id: 45,
  cycle_count: 3,
  active_days: 12,
  started_at: '2026-08-13',
  rest_started_at: null,
  closed_at: null,
  rest_days: 0,

  activity_analysis: [
    '아침 시간대 활동이 집중되어 있습니다',
    '산책과 스트레칭 비중이 높습니다',
    '주말보다 평일 활동이 활발합니다',
  ],

  personalized_analysis: [
    '평일 저녁 루틴을 유지하는 편이 좋아 보입니다',
    '주말 활동 빈도를 늘려보는 걸 추천합니다',
    '산책 시간을 조금씩 늘려가도 좋을 것 같습니다',
  ],

  top_plus_logs: [
    { activity_name: '산책', count: 10 },
    { activity_name: '런닝', count: 7 },
    { activity_name: '스트레칭', count: 6 },
    { activity_name: '단백질 섭취', count: 4 },
    { activity_name: '제로음료 섭취', count: 3 },
  ],

  completed_quests: ['물 하루 8잔 마시기', '저녁 산책 10분', '아침 스트레칭'],
};

// 달력 점을 찍을 날짜 (요청해둔 필드. 오면 응답에 포함될 예정)
export const MOCK_LOG_DATES = [
  '2026-08-13', '2026-08-14', '2026-08-16',
  '2026-08-17', '2026-08-18', '2026-08-22',
  '2026-08-23', '2026-08-24',
];

export const MOCK_QUEST_DATES = [
  '2026-08-14', '2026-08-15', '2026-08-16',
  '2026-08-17', '2026-08-18', '2026-08-19',
  '2026-08-23', '2026-08-24',
];

