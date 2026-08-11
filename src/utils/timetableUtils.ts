import { DAYS, PERIODS, TIMETABLE_DATA, SUBJECTS } from '../data/timetable';
import type { TimetableCell, PeriodInfo } from '../data/timetable';

export interface CurrentStatus {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'WEEKEND';
  currentPeriod: PeriodInfo | null;
  currentCell: TimetableCell | null;
  nextPeriod: PeriodInfo | null;
  nextCell: TimetableCell | null;
  isLunch: boolean;
  statusText: string;
  minutesRemaining?: number;
}

export function getCurrentTimeStatus(customDate?: Date): CurrentStatus {
  const now = customDate || new Date();
  const dayIndex = now.getDay(); // 0 = Sun, 1 = Mon, ... 5 = Fri, 6 = Sat
  
  const dayMap: Record<number, 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'WEEKEND'> = {
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THU',
    5: 'FRI',
  };

  const day = dayMap[dayIndex] || 'WEEKEND';

  if (day === 'WEEKEND') {
    return {
      day: 'WEEKEND',
      currentPeriod: null,
      currentCell: null,
      nextPeriod: null,
      nextCell: null,
      isLunch: false,
      statusText: 'Weekend Break — No scheduled classes today'
    };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let currentPeriodIndex = -1;
  for (let i = 0; i < PERIODS.length; i++) {
    const p = PERIODS[i];
    const [startH, startM] = p.startTime.split(':').map(Number);
    const [endH, endM] = p.endTime.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;

    if (currentMinutes >= startMins && currentMinutes < endMins) {
      currentPeriodIndex = i;
      break;
    }
  }

  if (currentPeriodIndex !== -1) {
    const curPeriod = PERIODS[currentPeriodIndex];
    const curCell = TIMETABLE_DATA[day]?.[curPeriod.id] || null;
    const [endH, endM] = curPeriod.endTime.split(':').map(Number);
    const minsLeft = (endH * 60 + endM) - currentMinutes;

    const nextP = PERIODS[currentPeriodIndex + 1] || null;
    const nextC = nextP ? TIMETABLE_DATA[day]?.[nextP.id] || null : null;

    return {
      day,
      currentPeriod: curPeriod,
      currentCell: curCell,
      nextPeriod: nextP,
      nextCell: nextC,
      isLunch: curPeriod.id === 'LUNCH',
      statusText: curPeriod.id === 'LUNCH' 
        ? `Lunch Time — ${minsLeft}m remaining` 
        : curCell?.subjectCode === 'FREE' 
          ? `Free Period (${curPeriod.label}) — ${minsLeft}m remaining`
          : `Active: ${SUBJECTS[curCell?.subjectCode || '']?.name || curCell?.subjectCode} (${curPeriod.label}) — ${minsLeft}m left`,
      minutesRemaining: minsLeft
    };
  }

  // Check if before classes start
  const [firstStartH, firstStartM] = PERIODS[0].startTime.split(':').map(Number);
  const firstMins = firstStartH * 60 + firstStartM;
  if (currentMinutes < firstMins) {
    const p1 = PERIODS[0];
    return {
      day,
      currentPeriod: null,
      currentCell: null,
      nextPeriod: p1,
      nextCell: TIMETABLE_DATA[day]?.[p1.id] || null,
      isLunch: false,
      statusText: `Classes start at 09:10 AM today`
    };
  }

  // Classes finished for the day
  return {
    day,
    currentPeriod: null,
    currentCell: null,
    nextPeriod: null,
    nextCell: null,
    isLunch: false,
    statusText: `Classes finished for ${day}`
  };
}

export function getSubjectStats() {
  const stats: Record<string, { totalPeriods: number; isLab: boolean; name: string }> = {};

  Object.keys(SUBJECTS).forEach((code) => {
    stats[code] = {
      totalPeriods: 0,
      isLab: SUBJECTS[code].isLab,
      name: SUBJECTS[code].name
    };
  });

  DAYS.forEach((day) => {
    PERIODS.forEach((period) => {
      const cell = TIMETABLE_DATA[day]?.[period.id];
      if (cell && cell.subjectCode !== 'FREE' && cell.subjectCode !== 'LUNCH') {
        if (stats[cell.subjectCode]) {
          stats[cell.subjectCode].totalPeriods += 1;
        }
      }
    });
  });

  return stats;
}
