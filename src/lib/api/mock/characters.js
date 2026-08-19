export const MOCK_ROOM = {
  total_score: 150,
  current_stage: '3-big',
  character_type: 'cat',
  character_name: '애옹이',
  gauge: { current: 9, max: 10 },
  assets: ['run', 'happy', 'fun', 'walk', 'water', 'yoga', 'salad'],

  // 45칸을 다 채웠는지. true 면 홈이 완성 팝업을 띄운다.
  // 팝업을 보려면 이 값을 true 로 바꾸고 started_at 을 확인한다.
  is_completed: false,
  started_at: '2026-07-20',
  completed_at: '2026-08-20',
};

// GET /characters/archive — 다 키워서 보관한 캐릭터
export const MOCK_ARCHIVE = [
  {
    character_id: 'CHR0000003',
    char_type: 'DOG',
    character_name: '뽀삐',
    completed_at: '2026-08-20',
  },
  {
    character_id: 'CHR0000002',
    char_type: 'CAT',
    character_name: '나비',
    completed_at: '2026-07-02',
  },
  {
    character_id: 'CHR0000001',
    char_type: 'DOG',
    character_name: '초코',
    completed_at: '2026-05-14',
  },
];
