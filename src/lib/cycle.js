
import { getDateFormat } from "./date";



const oneDay = 24 * 60 * 60 * 1000;

function addBand(marks, start, end, color) {
  let current = start;

  while (getDateFormat(current) <= getDateFormat(end)) {
    const key = getDateFormat(current);

    marks[key] = {
      color: color,
      textColor: '#FFFFFF',
      startingDay: key === getDateFormat(start),
      endingDay: key === getDateFormat(end),
    };

    current = new Date(current.getTime() + oneDay);
  }
}

export function getCycleMarks(cycle, color) {
  const marks = {};
  const end = cycle.endDate ?? new Date();

  addBand(marks, cycle.startDate, end, color);

  return marks;
}


export function getRestMarks(cycle, logDates, color) {
  const marks = {};
  if (logDates.length === 0) return marks;

  const sorted = [...logDates].sort();
  const lastLog = new Date(sorted[sorted.length - 1]);

  const start = new Date(lastLog.getTime() + oneDay);
  const end = cycle.endDate ?? new Date();
  

  if (getDateFormat(start) <= getDateFormat(end)) {
    addBand(marks, start, end, color);
  }

  return marks;
}

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

  return marks;
}

export function mergeMarks(...list) {
  const result = {};

  list.forEach((marks) => {
    Object.keys(marks).forEach((key) => {
      result[key] = { ...result[key], ...marks[key] };
    });
  });

  return result;
}