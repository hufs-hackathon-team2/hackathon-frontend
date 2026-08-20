// 서버가 보내주는 에러 문구를 꺼낸다.
// 실패 원인을 화면에 그대로 보여줘야 무엇이 잘못됐는지 알 수 있다.

const HANGUL = /[가-힣]/;

// Django 기본 검증 문구는 영어로 온다. 사용자에게 보일 것만 옮긴다.
const TRANSLATED = {
  'This password is too common.': '너무 흔한 비밀번호예요. 다른 걸로 해주세요.',
  'This password is entirely numeric.': '숫자로만 이루어진 비밀번호는 쓸 수 없어요.',
  'The password is too similar to the email.': '비밀번호가 이메일과 너무 비슷해요.',
  'user with this email already exists.': '이미 가입된 이메일이에요.',
  'Enter a valid email address.': '올바른 이메일 형식이 아니에요.',
  'This field is required.': '빠짐없이 입력해주세요.',
  'This field may not be blank.': '빠짐없이 입력해주세요.',
  'Authentication credentials were not provided.': '로그인이 필요해요.',
  'Not found.': '찾을 수 없어요.',
  'No Cycle matches the given query.': '해당 사이클을 찾을 수 없어요.',
  'No Quest matches the given query.': '해당 퀘스트를 찾을 수 없어요.',
};

// 숫자가 섞여 있어 표로 못 잡는 문구들
const TRANSLATED_PREFIX = [
  ['This password is too short.', '비밀번호가 너무 짧아요.'],
  ['Ensure this field has no more than', '입력할 수 있는 길이를 넘었어요.'],
  ['Ensure this field has at least', '너무 짧아요.'],
];

function translate(raw) {
  if (TRANSLATED[raw]) return TRANSLATED[raw];

  const prefix = TRANSLATED_PREFIX.find(([start]) => raw.startsWith(start));
  if (prefix) return prefix[1];

  // 옮기지 못한 영어는 사용자에게 보여주지 않는다
  return HANGUL.test(raw) ? raw : null;
}

export function getErrorMessage(error, fallback = '잠시 후 다시 시도해주세요') {
  const data = error?.response?.data;

  // 500 은 HTML 문자열로 온다. 보여줄 게 없다.
  if (!data || typeof data === 'string') return fallback;

  const raw = data.detail ?? data.error ?? firstFieldError(data);

  if (!raw) return fallback;

  return translate(raw) ?? fallback;
}

// 서버가 대표 문구 말고 이유를 따로 더 보내줄 때가 있다.
// 필드 이름을 가리지 않고, 대표 문구에 없는 내용만 모아서 돌려준다.
export function getErrorDetails(error) {
  const data = error?.response?.data;

  if (!data || typeof data !== 'object') return null;

  // 대표 문구로 이미 쓰인 값은 빼야 같은 말이 두 번 나오지 않는다
  const main = data.detail ?? data.error ?? firstFieldError(data);
  const parts = [];

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'detail' || key === 'error') return;

    const list = Array.isArray(value) ? value : [value];

    list.forEach((item) => {
      if (typeof item !== 'string' || !item.trim() || item === main) return;

      const text = translate(item.trim());
      if (text && !parts.includes(text)) parts.push(text);
    });
  });

  return parts.length ? parts.join('\n') : null;
}

// { "password": ["...", "..."] } 처럼 필드별로 올 때 보여줄 문구를 고른다.
// 영어와 한국어가 같이 오면 한국어를 먼저 쓴다.
function firstFieldError(data) {
  for (const value of Object.values(data)) {
    if (Array.isArray(value)) {
      const korean = value.find((item) => typeof item === 'string' && HANGUL.test(item));
      if (korean) return korean;

      const first = value.find((item) => typeof item === 'string' && item.trim());
      if (first) return first;
    }

    if (typeof value === 'string' && value.trim()) return value;
  }

  return null;
}

// 어느 입력칸에서 난 오류인지. 그 칸 아래에 문구를 띄울 때 쓴다.
export function getErrorField(error) {
  const data = error?.response?.data;

  if (!data || typeof data === 'string') return null;

  return Object.keys(data).find((key) => key === 'email' || key === 'password') ?? null;
}
