
const now = Date.now();
const HOUR = 60 * 60 * 1000;

export const MOCK_LOGS = [
  { log_id: 1, content: '점심 먹고 30분 산책했다', created_at: new Date(now - 2 * HOUR).toISOString() },
  { log_id: 2, content: '자기 전 스트레칭 10분', created_at: new Date(now - 30 * HOUR).toISOString() },
  { log_id: 3, content: '계단으로 5층까지 올라갔다', created_at: new Date(now - 72 * HOUR).toISOString() },
  { log_id: 4, content: '콜라 대신에 바나나 우유를 마셨다', created_at: new Date(now - 102 * HOUR).toISOString() },
  { log_id: 5, content: '치킨이 먹고 싶어서 피자를 먹었다', created_at: new Date(now - 172 * HOUR).toISOString() },
  { log_id: 6, content: '운동하려 설치다가 다쳐버렸다', created_at: new Date(now - 272 * HOUR).toISOString() },
  { log_id: 7, content: '마라탕탕후루후루', created_at: new Date(now - 372 * HOUR).toISOString() },
  { log_id: 8, content: '새로운 기록', created_at: new Date(now - 472 * HOUR).toISOString() },
  { log_id: 9, content: '오디세이는 용산 아이맥스 7층', created_at: new Date(now - 572 * HOUR).toISOString() },
  { log_id: 10, content: '페이지네이션을 위한 로그', created_at: new Date(now - 672 * HOUR).toISOString() },
  { log_id: 11, content: '야구는 질병이다', created_at: new Date(now - 772 * HOUR).toISOString() },
  { log_id: 12, content: '페이지네이션을 위한 로그2', created_at: new Date(now - 872 * HOUR).toISOString() },
  { log_id: 13, content: '중커톤이 다이어트다', created_at: new Date(now - 972 * HOUR).toISOString() },
  { log_id: 14, content: '모두들 헬플리하세요', created_at: new Date(now - 1072 * HOUR).toISOString() },
];
