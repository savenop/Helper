import React from 'react';
import { SUBJECTS } from '../data/timetable';
import { getSubjectStats } from '../utils/timetableUtils';
import { BookOpen, X, ChevronRight } from 'lucide-react';

interface SubjectDirectoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubject: (code: string) => void;
  selectedSubjectFilter: string | null;
}

export const SubjectDirectory: React.FC<SubjectDirectoryProps> = ({
  isOpen,
  onClose,
  onSelectSubject,
  selectedSubjectFilter,
}) => {
  if (!isOpen) return null;

  const stats = getSubjectStats();
  const subjectList = Object.values(SUBJECTS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200 no-print">
      
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-black border-2 border-black dark:border-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 dark:bg-black/10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Subject Registry Directory</h2>
              <p className="text-xs text-neutral-300 dark:text-neutral-700">
                11 Official Subjects • B.Tech CSE 2nd Year (CS3B)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/20 dark:border-black/20 hover:bg-white/20 dark:hover:bg-black/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 gap-2.5">
            {subjectList.map((sub) => {
              const count = stats[sub.code]?.totalPeriods || 0;
              const isSelected = selectedSubjectFilter === sub.code;

              return (
                <div
                  key={sub.code}
                  onClick={() => {
                    onSelectSubject(sub.code);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-md'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-black dark:text-white hover:border-black dark:hover:border-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`font-mono font-black text-xs sm:text-sm px-2.5 py-1 rounded border shrink-0 ${
                      isSelected
                        ? 'bg-white text-black dark:bg-black dark:text-white border-white dark:border-black'
                        : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
                    }`}>
                      {sub.code}
                    </span>

                    <div className="min-w-0">
                      <div className="font-extrabold text-sm sm:text-base truncate">
                        {sub.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs opacity-75 font-medium mt-0.5">
                        <span>{sub.type}</span>
                        <span>•</span>
                        <span>{count} periods/week</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sub.isLab && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                        isSelected
                          ? 'bg-white text-black border-white dark:bg-black dark:text-white dark:border-black'
                          : 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                      }`}>
                        LAB
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black dark:border-white bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between text-xs text-neutral-500">
          <span>Click any subject to filter the timetable matrix</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
