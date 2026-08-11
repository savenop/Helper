import React from 'react';
import { DAYS, PERIODS, TIMETABLE_DATA, SUBJECTS } from '../data/timetable';
import type { TimetableCell } from '../data/timetable';
import type { CurrentStatus } from '../utils/timetableUtils';
import { Info } from 'lucide-react';

interface DesktopTimetableProps {
  searchQuery: string;
  selectedSubjectFilter: string | null;
  onSelectSubject: (code: string) => void;
  onCellClick: (cell: TimetableCell) => void;
  currentStatus: CurrentStatus;
}

export const DesktopTimetable: React.FC<DesktopTimetableProps> = ({
  searchQuery,
  selectedSubjectFilter,
  onCellClick,
  currentStatus,
}) => {
  const activeCode = selectedSubjectFilter || (searchQuery.trim().length > 0 ? searchQuery.trim().toUpperCase() : null);

  const isMatch = (cell: TimetableCell): boolean => {
    if (!cell || cell.subjectCode === 'FREE' || cell.subjectCode === 'LUNCH') return false;
    if (!activeCode) return false;

    const sub = SUBJECTS[cell.subjectCode];
    const q = activeCode.toLowerCase();
    
    return Boolean(
      cell.subjectCode.toLowerCase().includes(q) ||
      (sub && sub.name.toLowerCase().includes(q)) ||
      (cell.faculty && cell.faculty.toLowerCase().includes(q)) ||
      (cell.room && cell.room.toLowerCase().includes(q))
    );
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[1080px] bg-white dark:bg-black border-2 border-black dark:border-white rounded-xl shadow-xl overflow-hidden timetable-grid transition-colors">
        
        <table className="w-full border-collapse text-center select-none">
          <thead>
            {/* Main Header Row 1: Periods & Lunch */}
            <tr className="border-b-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black">
              <th className="p-3 w-28 border-r-2 border-black dark:border-white font-extrabold text-sm uppercase tracking-wider">
                TIME <br /> DAY
              </th>
              
              {PERIODS.map((period) => {
                if (period.id === 'LUNCH') {
                  return (
                    <th
                      key={period.id}
                      className="p-3 w-20 border-r-2 border-black dark:border-white font-black text-sm uppercase tracking-widest bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black"
                    >
                      Lunch
                    </th>
                  );
                }

                return (
                  <th
                    key={period.id}
                    className="p-2 border-r-2 border-black dark:border-white font-black text-sm uppercase tracking-wider"
                  >
                    <div>{period.label}</div>
                    <div className="text-[11px] font-mono font-normal tracking-normal opacity-90 mt-0.5">
                      {period.timeRange}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {DAYS.map((day, dayIndex) => {
              const isToday = currentStatus.day === day;

              return (
                <tr
                  key={day}
                  className={`border-b border-black dark:border-white transition-colors ${
                    isToday ? 'bg-neutral-50/50 dark:bg-neutral-900/30' : ''
                  }`}
                >
                  {/* Day Label Header Column */}
                  <td className="p-3 font-black text-lg border-r-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white relative">
                    <div className="flex flex-col items-center justify-center">
                      <span>{day}</span>
                      {isToday && (
                        <span className="mt-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black rounded-full">
                          Today
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Period Cells */}
                  {PERIODS.map((period) => {
                    const cell = TIMETABLE_DATA[day]?.[period.id];
                    const isLunch = period.id === 'LUNCH';
                    const isCurrentActive = isToday && currentStatus.currentPeriod?.id === period.id;

                    if (isLunch) {
                      // Show LUNCH cell
                      return dayIndex === 0 ? (
                        <td
                          key={period.id}
                          rowSpan={5}
                          className="border-r-2 border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-black text-lg p-2 align-middle"
                        >
                          <div className="flex flex-col items-center justify-center space-y-3 font-extrabold tracking-widest text-neutral-800 dark:text-neutral-200">
                            <span>L</span>
                            <span>U</span>
                            <span>N</span>
                            <span>C</span>
                            <span>H</span>
                          </div>
                        </td>
                      ) : null;
                    }

                    const isFree = !cell || cell.subjectCode === 'FREE';
                    const subject = !isFree ? SUBJECTS[cell.subjectCode] : null;
                    const cellMatched = cell ? isMatch(cell) : false;

                    return (
                      <td
                        key={period.id}
                        onClick={() => cell && onCellClick(cell)}
                        className={`p-2.5 border-r border-black dark:border-white align-middle transition-all duration-150 relative cursor-pointer group ${
                          isCurrentActive
                            ? 'ring-4 ring-black dark:ring-white ring-inset bg-neutral-200 dark:bg-neutral-800 font-bold'
                            : cellMatched
                            ? 'bg-black text-white dark:bg-white dark:text-black scale-[1.02] z-10 font-bold shadow-lg'
                            : isFree
                            ? 'bg-neutral-50 dark:bg-neutral-950 text-neutral-400 dark:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                            : 'bg-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white'
                        }`}
                      >
                        {isFree ? (
                          <div className="flex flex-col items-center justify-center min-h-[76px] py-1 text-xs">
                            <span className="font-mono text-neutral-400 dark:text-neutral-600 font-bold">
                              {cell?.notes === 'X' ? '✕' : 'FREE'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col justify-between items-center min-h-[76px] py-1 gap-1">
                            {/* Subject Code */}
                            <div className="flex items-center gap-1 flex-wrap justify-center">
                              <span
                                className={`font-black text-sm sm:text-base tracking-tight ${
                                  cellMatched ? 'underline decoration-2' : ''
                                }`}
                              >
                                {cell.subjectCode}
                              </span>
                              {subject?.isLab && (
                                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border uppercase tracking-wider ${
                                  cellMatched 
                                    ? 'bg-white text-black border-white dark:bg-black dark:text-white dark:border-black'
                                    : 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                                }`}>
                                  LAB
                                </span>
                              )}
                            </div>

                            {/* Faculty Initial */}
                            {cell.faculty && (
                              <div className={`text-xs font-semibold ${
                                cellMatched ? 'text-neutral-200 dark:text-neutral-800' : 'text-neutral-700 dark:text-neutral-300'
                              }`}>
                                ({cell.faculty})
                              </div>
                            )}

                            {/* Room Number */}
                            {cell.room && (
                              <div className={`text-[11px] font-mono font-extrabold px-1.5 py-0.5 rounded border ${
                                cellMatched
                                  ? 'bg-white/20 border-white/40 dark:bg-black/20 dark:border-black/40'
                                  : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-black dark:text-white'
                              }`}>
                                {cell.room}
                              </div>
                            )}

                            {/* Double Period Indicator badge */}
                            {cell.isDoublePeriod && (
                              <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 tracking-tighter">
                                {cell.doublePeriodPart === 1 ? 'Part 1/2 ▸' : '◂ Part 2/2'}
                              </span>
                            )}

                            {/* Active Period Live Badge */}
                            {isCurrentActive && (
                              <span className="absolute top-1 right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white"></span>
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Desktop Legend & Info Footer */}
        <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border-t-2 border-black dark:border-white flex flex-col md:flex-row md:items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-black dark:text-white uppercase tracking-wider">Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 border border-black dark:border-white bg-white dark:bg-black inline-block rounded-sm"></span>
              <span>Theory Period</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-black dark:bg-white text-white dark:text-black inline-flex items-center justify-center text-[8px] font-bold rounded-sm">LAB</span>
              <span>Practical Lab (Double Period)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 border border-black dark:border-white ring-2 ring-black dark:ring-white inline-block rounded-sm"></span>
              <span>Active Current Period</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-neutral-200 dark:bg-neutral-800 inline-block rounded-sm"></span>
              <span>Free Period / Lunch</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-500 font-medium">
            <Info className="w-3.5 h-3.5" />
            <span>Click any period cell to view detailed subject specs & full schedule</span>
          </div>
        </div>

      </div>
    </div>
  );
};
