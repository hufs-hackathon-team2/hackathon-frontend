// 오늘, 어제, 올해, 작년 날짜 계산 로직

const KST_OFFSET = 9 * 60 * 60 * 1000;
const oneDay = 24 * 60 * 60 * 1000;

// 서버가 날짜를 null 이나 undefined 로 줄 때를 막는다.
// new Date(undefined) 는 Invalid Date 지만 new Date(null) 은 1970 년이 되므로
// 값을 Date 로 바꾸기 전에 걸러야 한다.
export const EMPTY_DATE = '—';

export function toDate(value) {
  if (value == null || value === '') return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function toKst(date){
  return new Date(date.getTime() + KST_OFFSET);
}

export function getStartOfDay(date) {
  const kst = toKst(date);
  const year = kst.getUTCFullYear();
  const month = kst.getUTCMonth();
  const day = kst.getUTCDate();
  
  return Date.UTC( year, month, day);
}


//며칠 차이인지
export function getDateDifference(date1, date2) {
  return Math.round((getStartOfDay(date2)-getStartOfDay(date1)) / oneDay);
}

export function getDurationDays(start, end) {
  const from = toDate(start);
  const to = toDate(end);
  if (!from || !to) return null;

  return getDateDifference(from, to) + 1;
}


//오늘 어제
export function getDateDisplay(value, now = new Date()) {
  const date = toDate(value);
  if (!date) return EMPTY_DATE;

  const diff = getDateDifference(date, now);
  const kst = toKst(date);
  const year = kst.getUTCFullYear();
  const month = kst.getUTCMonth() + 1;
  const day = kst.getUTCDate();
  const week = kst.getUTCDay();

  if (diff === 0) {
    return '오늘';
  }
  if (diff === 1) {
    return '어제';
  }

  return  `${year}년 ${month}월 ${day}일 (${['일','월','화','수','목','금','토'][week]})`;
}



//오전 오후

export function getTimeDisplay(value) {
  const date = toDate(value);
  if (!date) return EMPTY_DATE;

  const kst = toKst(date);
  const hours = kst.getUTCHours();
  const minutes = kst.getUTCMinutes();

  const period = hours < 12 ? '오전' : '오후';

  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  const displayMinutes = String(minutes).padStart(2,'0');

  return `${period} ${displayHours}:${displayMinutes}`;
}

//달력

export function getDateFormat(date) {
  const kst = toKst(date);
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`

}

//달력 점
export function getFullDate(value) {
  const date = toDate(value);
  if (!date) return EMPTY_DATE;

  const kst = toKst(date);
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');

  return `${year}.${month}.${day}`

}

//이번 주 월요일부터 7일치 날짜
export function getWeekDates(now = new Date()) {
  const kst = toKst(now);
  const weekday = kst.getUTCDay();
  const back = weekday === 0 ? 6 : weekday - 1;

  const dates = [];

  for (let i = 0; i < 7; i++) {
    dates.push(getDateFormat(new Date(now.getTime() + (i - back) * oneDay)));
  }

  return dates;
}
