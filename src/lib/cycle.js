// 달력에 찍을 표시를 만든다 (CY 02)
import { getDateFormat } from "./date";

//점찍기

export function getActivityDots(logDates, questDates, colors) {
  const marks = {};

  const all = [...new Set([...logDates, ...questDates])];

  all.forEach((date) => {
    const hasLog = logDates.includes(date);
    const hasQuest = questDates.includes(date);

    let dotColor;
    if (hasLog && hasQuest) {
      dotColor = colors.both;
    } else if (hasQuest) {
      dotColor = colors.quest;
    } else {
      dotColor = colors.log;
    }

    marks[date] = { marked: true, dotColor: dotColor };
  });

  // 오늘은 동그란 배경으로 강조 (점이 있으면 점도 그대로 유지)
  const today = getDateFormat(new Date());
  marks[today] = {
    ...marks[today],
    selected: true,
    selectedColor: colors.today,
    selectedTextColor: colors.todayText,
  };

  return marks;
}
