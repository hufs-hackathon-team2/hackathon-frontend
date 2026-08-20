export const MOCK_ROOM = {
  total_score: 150,
  current_stage: '3-big',
  character_type: 'cat',
  character_name: '애옹이',
  gauge: { current: 9, max: 10 },
  assets: ['run', 'happy', 'fun', 'walk', 'water', 'yoga', 'salad'],

  is_completed: false,
  started_at: '2026-07-20',
  completed_at: '2026-08-20',
  days_together: 32,
};

// character_id 와 days_together 는 서버가 숫자로 준다
export const MOCK_ARCHIVE = [
  {
    character_id: 3,
    char_type: 'dog',
    character_name: '뽀삐',
    started_at: '2026-07-21',
    completed_at: '2026-08-20',
    days_together: 31,
  },
  {
    character_id: 2,
    char_type: 'cat',
    character_name: '나비',
    started_at: '2026-05-07',
    completed_at: '2026-07-02',
    days_together: 57,
  },
  {
    character_id: 1,
    char_type: 'dog',
    character_name: '초코',
    started_at: '2026-04-10',
    completed_at: '2026-05-14',
    days_together: 35,
  },
];
