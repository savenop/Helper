import React, { useState } from 'react';
import { DAYS, PERIODS, TIMETABLE_DATA, SUBJECTS, DAY_FULL_NAMES } from '../data/timetable';
import type { TimetableCell } from '../data/timetable';
import type { CurrentStatus } from '../utils/timetableUtils';
import { Clock, MapPin, User, ChevronRight, Sparkles, Coffee, LayoutGrid, List } from 'lucide-react';

interface MobileTimetableProps {
  searchQuery: string;
  selectedSubjectFilter: string | null;
  onCellClick: (cell: TimetableCell) => void;
  currentStatus: CurrentStatus;
  activeDay: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
  setActiveDay: (day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI') => void;
}

export const MobileTimetable: React.FC<MobileTimetableProps> = ({
  searchQuery,
  selectedSubjectFilter,
  onCellClick,
  currentStatus,
  activeDay,
  setActiveDay,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

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

  const dayCells = TIMETABLE_DATA[activeDay] || {};

  return (
    <div className="w-full space-y-4 no-print">
      
      {/* Mobile Controls: Day Tabs & View Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Day Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {DAYS.map((day) => {
            const isSelected = activeDay === day;
            const isToday = currentStatus.day === day;

            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`relative px-3.5 py-2 text-xs font-black rounded-lg border transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md'
                    : 'bg-white text-black border-neutral-300 dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:border-black dark:hover:border-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{day}</span>
                  {isToday && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white dark:bg-black' : 'bg-black dark:bg-white'}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center self-end sm:self-auto bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg border border-neutral-300 dark:border-neutral-800 text-xs font-bold">
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition cursor-pointer ${
              viewMode === 'timeline'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>

      </div>

      {/* Selected Day Header */}
      <div className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-900 px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-800">
        <div>
          <h2 className="text-sm font-extrabold text-black dark:text-white">
            {DAY_FULL_NAMES[activeDay]} Schedule
          </h2>
          <p className="text-[11px] font-semibold text-neutral-500">
            {PERIODS.length} Scheduled Time Slots (09:10 AM – 04:50 PM)
          </p>
        </div>
        {currentStatus.day === activeDay && (
          <span className="text-[10px] font-extrabold px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full uppercase tracking-wider">
            Today
          </span>
        )}
      </div>

      {/* Timeline Card View */}
      {viewMode === 'timeline' ? (
        <div className="space-y-3">
          {PERIODS.map((period) => {
            const cell = dayCells[period.id];
            const isLunch = period.id === 'LUNCH';
            const isFree = !cell || cell.subjectCode === 'FREE';
            const subject = !isFree && !isLunch ? SUBJECTS[cell.subjectCode] : null;
            const matched = cell ? isMatch(cell) : false;
            const isCurrentActive = currentStatus.day === activeDay && currentStatus.currentPeriod?.id === period.id;

            if (isLunch) {
              return (
                <div
                  key={period.id}
                  className="p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-black dark:text-white">
                        LUNCH BREAK
                      </div>
                      <div className="text-xs font-mono text-neutral-500">
                        {period.timeRange}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-neutral-400">1 Hour</span>
                </div>
              );
            }

            return (
              <div
                key={period.id}
                onClick={() => cell && onCellClick(cell)}
                className={`p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                  isCurrentActive
                    ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 shadow-md ring-2 ring-black dark:ring-white'
                    : matched
                    ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-lg scale-[1.01]'
                    : isFree
                    ? 'border-neutral-200 dark:border-neutral-850 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-400'
                    : 'border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black text-black dark:text-white hover:border-black dark:hover:border-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  
                  {/* Period badge & time */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                        matched
                          ? 'bg-white text-black dark:bg-black dark:text-white border-white dark:border-black'
                          : 'bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white border-neutral-300 dark:border-neutral-700'
                      }`}>
                        {period.label}
                      </span>

                      {isCurrentActive && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black animate-pulse">
                          Active Now
                        </span>
                      )}

                      {subject?.isLab && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black uppercase">
                          LAB
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono font-semibold text-neutral-500 dark:text-neutral-400 pt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{period.timeRange}</span>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${matched ? 'text-white dark:text-black' : 'text-neutral-400'}`} />
                </div>

                {/* Content */}
                {isFree ? (
                  <div className="mt-2 text-xs font-semibold text-neutral-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Free Period — No Class Scheduled</span>
                  </div>
                ) : (
                  <div className="mt-3 space-y-1.5 border-t border-neutral-200 dark:border-neutral-800 pt-2.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className={`text-base font-extrabold tracking-tight ${matched ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>
                        {subject?.name || cell?.subjectCode}
                      </h3>
                      <span className={`text-xs font-black font-mono shrink-0 px-2 py-0.5 rounded border ${
                        matched 
                          ? 'border-white/40 dark:border-black/40' 
                          : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
                      }`}>
                        {cell?.subjectCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium text-neutral-600 dark:text-neutral-400 flex-wrap">
                      {cell?.faculty && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          Faculty: <strong className={matched ? 'text-white dark:text-black' : 'text-black dark:text-white'}>{cell.faculty}</strong>
                        </span>
                      )}
                      {cell?.room && (
                        <span className="flex items-center gap-1 font-mono">
                          <MapPin className="w-3.5 h-3.5" />
                          Room: <strong className={matched ? 'text-white dark:text-black' : 'text-black dark:text-white'}>{cell.room}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Full Scrollable Table View on Mobile */
        <div className="overflow-x-auto border-2 border-black dark:border-white rounded-xl bg-white dark:bg-black">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-black text-white dark:bg-white dark:text-black font-black uppercase border-b border-black dark:border-white">
                <th className="p-2 border-r border-black dark:border-white">Period</th>
                <th className="p-2 border-r border-black dark:border-white">Time</th>
                <th className="p-2 border-r border-black dark:border-white">Code</th>
                <th className="p-2 border-r border-black dark:border-white">Subject</th>
                <th className="p-2">Faculty</th>
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period) => {
                const cell = dayCells[period.id];
                const isFree = !cell || cell.subjectCode === 'FREE';
                const isLunch = period.id === 'LUNCH';
                const sub = SUBJECTS[cell?.subjectCode || ''];

                if (isLunch) {
                  return (
                    <tr key={period.id} className="bg-neutral-100 dark:bg-neutral-900 border-b border-black dark:border-white font-bold">
                      <td colSpan={5} className="p-2 text-center text-neutral-600 dark:text-neutral-300">
                        LUNCH BREAK (01:20 PM – 02:20 PM)
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={period.id}
                    onClick={() => cell && onCellClick(cell)}
                    className="border-b border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer"
                  >
                    <td className="p-2 font-bold border-r border-neutral-300 dark:border-neutral-800">{period.label}</td>
                    <td className="p-2 font-mono text-[11px] border-r border-neutral-300 dark:border-neutral-800">{period.timeRange}</td>
                    <td className="p-2 font-black border-r border-neutral-300 dark:border-neutral-800">{cell?.subjectCode}</td>
                    <td className="p-2 text-left font-semibold border-r border-neutral-300 dark:border-neutral-800 truncate max-w-[150px]">
                      {isFree ? 'FREE' : sub?.name}
                    </td>
                    <td className="p-2 font-medium">{cell?.faculty || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
