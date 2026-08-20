// 서버가 지급 점수를 응답에 주지 않아서 규칙을 여기 모아 둔다.
// 규칙이 바뀌면 이 파일만 고치면 된다.
export const SCORE = {
  log: 1,           // PLUS Log 하나
  questCheck: 2,    // 퀘스트를 체크한 날
  questSuccess: 5,  // 퀘스트를 성공한 날 (체크 2 + 성공 보너스 3)
};
