import React from 'react';
import { X, BookOpen, MapPin, User, Calendar, Layers } from 'lucide-react';
import { SUBJECTS, TIMETABLE_DATA, DAYS, PERIODS, DAY_FULL_NAMES, FACULTY_MAP } from '../data/timetable';
import type { TimetableCell } from '../data/timetable';

interface SubjectModalProps {
  subjectCode: string | null;
  cell: TimetableCell | null;
  onClose: () => void;
  onFilterSubject: (code: string) => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  subjectCode,
  cell,
  onClose,
  onFilterSubject,
}) => {
  const code = subjectCode || cell?.subjectCode;
  if (!code || code === 'FREE' || code === 'LUNCH') return null;

  const subject = SUBJECTS[code];
  if (!subject) return null;

  // Gather all occurrences of this subject in the weekly timetable
  const occurrences: Array<{ day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'; periodLabel: string; timeRange: string; faculty?: string; room?: string }> = [];

  DAYS.forEach((day) => {
    PERIODS.forEach((p) => {
      const c = TIMETABLE_DATA[day]?.[p.id];
      if (c && c.subjectCode === code) {
        occurrences.push({
          day,
          periodLabel: p.label,
          timeRange: p.timeRange,
          faculty: c.faculty,
          room: c.room,
        });
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded border border-white dark:border-black bg-white/10 dark:bg-black/10">
                {subject.code}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white text-black dark:bg-black dark:text-white">
                {subject.type}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight pt-1">
              {subject.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/20 dark:border-black/20 hover:bg-white/20 dark:hover:bg-black/20 text-white dark:text-black transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-black dark:text-white">
          
          {/* Faculty & Room Quick Info */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-bold">
                <User className="w-4 h-4 text-black dark:text-white" />
                <span>FACULTY</span>
              </div>
              <div className="font-extrabold text-black dark:text-white text-sm">
                {cell?.faculty || occurrences[0]?.faculty || 'Department Faculty'}
              </div>
              {cell?.faculty && FACULTY_MAP[cell.faculty] && (
                <div className="text-[11px] text-neutral-500 font-medium pt-0.5">
                  {FACULTY_MAP[cell.faculty]}
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-1">
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-bold">
                <MapPin className="w-4 h-4 text-black dark:text-white" />
                <span>CLASSROOM / LAB</span>
              </div>
              <div className="font-extrabold text-black dark:text-white text-sm font-mono">
                {cell?.room || occurrences[0]?.room || 'E112 (Main Lecture Hall)'}
              </div>
              <div className="text-[11px] text-neutral-500 font-medium pt-0.5">
                {subject.isLab ? 'Practical Lab Workstation' : 'Lecture Classroom'}
              </div>
            </div>
          </div>

          {/* Weekly Frequency Counter */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs sm:text-sm font-extrabold">Weekly Class Frequency</span>
            </div>
            <span className="font-black text-sm px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-lg">
              {occurrences.length} Periods / Week
            </span>
          </div>

          {/* All Occurrences in Weekly Timetable */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold tracking-wider uppercase flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Scheduled Days & Times</span>
              </h3>
            </div>

            <div className="space-y-2">
              {occurrences.map((occ, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium hover:border-black dark:hover:border-white transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black w-12 px-2 py-1 rounded bg-black text-white dark:bg-white dark:text-black text-center text-xs">
                      {occ.day}
                    </span>
                    <div>
                      <div className="font-bold text-black dark:text-white">
                        {DAY_FULL_NAMES[occ.day]} • {occ.periodLabel}
                      </div>
                      <div className="text-xs font-mono text-neutral-500">
                        {occ.timeRange}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    {occ.room && <span className="font-mono font-bold block">{occ.room}</span>}
                    {occ.faculty && <span className="text-neutral-500 font-medium">({occ.faculty})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onFilterSubject(code);
              onClose();
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 font-black text-xs sm:text-sm rounded-xl border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Highlight on Timetable Grid</span>
          </button>

          <button
            onClick={onClose}
            className="py-2.5 px-4 font-bold text-xs sm:text-sm rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
