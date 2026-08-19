


export const MOCK_ANALYSIS = {
  cycle_id: 45,
  cycle_count: 3,
  active_days: 12,
  started_at: '2026-08-13',
  rest_started_at: null,
  closed_at: null,
  rest_days: 0,


  completed_quests: [
    '물 하루 8잔 마시기', '저녁 산책 10분', '아침 스트레칭', '계단으로 오르기',
    '자기 전 휴대폰 안 보기', '점심 후 10분 걷기', '채소 한 접시 더 먹기', '물 마시고 시작하기',
    '일찍 잠자리에 들기', '엘리베이터 대신 계단', '아침에 창문 열고 환기', '군것질 대신 과일',
    '출근길 한 정거장 걷기', '자기 전 스트레칭 5분', '커피 대신 물 한 잔', '하루 한 번 심호흡',
  ],


  activity_analysis: [],
  personalized_analysis: [],
  top_plus_logs: [],

  analysis_request_count: 0,
};


export const MOCK_ANALYSIS_DONE = {
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
    { asset: 'walk', plus_log_count: 10, plus_log_content: '산책' },
    { asset: 'run', plus_log_count: 7, plus_log_content: '런닝' },
    { asset: 'yoga', plus_log_count: 6, plus_log_content: '스트레칭' },
    { asset: 'meat', plus_log_count: 4, plus_log_content: '단백질 섭취' },
    { asset: 'bottle', plus_log_count: 3, plus_log_content: '제로음료 섭취' },
  ],

  completed_quests: [
    "물 하루 8잔 마시기", "저녁 산책 10분", "아침 스트레칭", "계단으로 오르기",
    "자기 전 휴대폰 안 보기", "점심 후 10분 걷기", "채소 한 접시 더 먹기", "물 마시고 시작하기",
    "일찍 잠자리에 들기", "엘리베이터 대신 계단", "아침에 창문 열고 환기", "군것질 대신 과일",
    "출근길 한 정거장 걷기", "자기 전 스트레칭 5분", "커피 대신 물 한 잔", "하루 한 번 심호흡",
  ],

  analysis_request_count: 1,
};


export const MOCK_PREVIOUS_ANALYSIS = {
  cycle_id: 44,
  cycle_count: 2,
  active_days: 14,
  started_at: '2026-06-02',
  rest_started_at: '2026-06-10',
  closed_at: '2026-06-16',
  rest_days: 7,

  activity_analysis: [
    '저녁 시간대 기록이 많았습니다',
    '수분 섭취를 꾸준히 이어갔습니다',
    '주말에는 활동이 줄어드는 편이었습니다',
  ],

  personalized_analysis: [
    '아침 루틴을 하나 더 만들어보면 좋겠습니다',
    '주말에도 가벼운 산책을 시도해보세요',
    '기록이 끊기기 전 알림을 활용해보세요',
  ],

  top_plus_logs: [
    { asset: 'water', plus_log_count: 9, plus_log_content: '수분 섭취' },
    { asset: 'walk', plus_log_count: 7, plus_log_content: '산책' },
    { asset: 'yoga', plus_log_count: 5, plus_log_content: '스트레칭' },
  ],

  completed_quests: [
    "물 하루 8잔 마시기", "저녁 산책 10분", "아침 스트레칭", "계단으로 오르기",
    "자기 전 휴대폰 안 보기", "점심 후 10분 걷기", "채소 한 접시 더 먹기", "물 마시고 시작하기",
    "일찍 잠자리에 들기", "엘리베이터 대신 계단", "아침에 창문 열고 환기", "군것질 대신 과일",
    "출근길 한 정거장 걷기", "자기 전 스트레칭 5분", "커피 대신 물 한 잔", "하루 한 번 심호흡",
  ],
};


export const MOCK_HISTORY = [
  { cycle_id: 44, cycle_count: 2, started_at: '2026-06-02', closed_at: '2026-06-16' },
  { cycle_id: 43, cycle_count: 1, started_at: '2026-04-13', closed_at: '2026-05-04' },
];


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

export const MOCK_PREV_LOG_DATES = [
  '2026-06-02', '2026-06-03', '2026-06-04',
  '2026-06-05', '2026-06-07', '2026-06-08',
  '2026-06-09',
];

export const MOCK_PREV_QUEST_DATES = [
  '2026-06-04', '2026-06-05', '2026-06-06',
  '2026-06-07', '2026-06-08', '2026-06-09',
];

