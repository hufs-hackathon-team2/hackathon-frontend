// 오늘, 어제, 올해, 작년 날짜 계산 로직

const KST_OFFSET = 9 * 60 * 60 * 1000;
const oneDay = 24 * 60 * 60 * 1000;

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


//오늘 어제
export function getDateDisplay(date, now = new Date()) {
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

export function getTimeDisplay(date) {
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
export function getFullDate(date) {
  const kst = toKst(date);
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');

  return `${year}.${month}.${day}`

}
