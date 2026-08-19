// 서버가 보내주는 에러 문구를 꺼낸다.
// 실패 원인을 화면에 그대로 보여줘야 무엇이 잘못됐는지 알 수 있다.

// Django 기본 검증 문구는 영어로 온다. 사용자에게 보일 것만 옮긴다.
const TRANSLATED = {
  'This password is too common.': '너무 흔한 비밀번호예요. 다른 걸로 해주세요.',
  'This password is entirely numeric.': '숫자로만 이루어진 비밀번호는 쓸 수 없어요.',
  'The password is too similar to the email.': '비밀번호가 이메일과 너무 비슷해요.',
  'user with this email already exists.': '이미 가입된 이메일이에요.',
};

export function getErrorMessage(error, fallback = '잠시 후 다시 시도해주세요') {
  const data = error?.response?.data;

  // 500 은 HTML 문자열로 온다. 보여줄 게 없다.
  if (!data || typeof data === 'string') return fallback;

  const raw = data.detail ?? data.error ?? firstFieldError(data);

  if (!raw) return error?.message ?? fallback;

  return TRANSLATED[raw] ?? raw;
}

// { "password": ["This password is too common."] } 처럼 필드별로 올 때 첫 문구를 꺼낸다
function firstFieldError(data) {
  for (const value of Object.values(data)) {
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    if (typeof value === 'string') return value;
  }

  return null;
}

// 어느 입력칸에서 난 오류인지. 그 칸 아래에 문구를 띄울 때 쓴다.
export function getErrorField(error) {
  const data = error?.response?.data;

  if (!data || typeof data === 'string') return null;

  return Object.keys(data).find((key) => key === 'email' || key === 'password') ?? null;
}
