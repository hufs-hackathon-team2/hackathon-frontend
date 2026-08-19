// 목데이터에서 탈퇴 화면을 시험해보기 위한 비밀번호
export const MOCK_PASSWORD = 'helply1234';

// GET /settings
export const MOCK_SETTINGS = {
  nickname: '한서연',
  email: 'seoyn95@hufs.ac.kr',
  // 목 모드에서 온보딩 흐름을 확인하려면 false 로 바꾼다
  onboarding_completed: true,
  restart_notification: true,
  activity_notification: true,
};

// 서비스 안내 문구
export const SERVICE_INFO = [
  {
    title: '분석 근거',
    body: '모든 분석은 회원이 PLUS Log, 퀘스트 기록, 휴대폰 건강 정보를 바탕으로만 생성됩니다. 다른 사용자와의 비교나 의료 표준과의 평가는 포함되지 않습니다.',
  },
  {
    title: '의료 자문 아님',
    body: '건강상 우려사항이나 의료적 판단이 필요한 경우 반드시 보건의료 전문가(의사, 간호사 등)와 상담하시기 바랍니다. 헬플리는 보조자립 활동 기록 도구이며 의료 서비스를 제공하지 않습니다.',
  },
  {
    title: '기록과 정확도',
    body: '분석의 정확도는 기록의 완성도에 따라 달라집니다. 더 자세하고 정확한 기록을 남길수록 더 나은 요약을 받을 수 있습니다.',
  },
];
