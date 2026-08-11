import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, Coffee, Sparkles } from 'lucide-react';
import { getCurrentTimeStatus } from '../utils/timetableUtils';
import type { CurrentStatus } from '../utils/timetableUtils';
import { SUBJECTS, DAY_FULL_NAMES } from '../data/timetable';

interface LiveBannerProps {
  onSelectDay: (day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI') => void;
  onSelectSubject: (code: string) => void;
}

export const LiveBanner: React.FC<LiveBannerProps> = ({ onSelectDay, onSelectSubject }) => {
  const [status, setStatus] = useState<CurrentStatus>(getCurrentTimeStatus());
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setStatus(getCurrentTimeStatus(now));
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const curSub = status.currentCell && status.currentCell.subjectCode !== 'FREE' && status.currentCell.subjectCode !== 'LUNCH'
    ? SUBJECTS[status.currentCell.subjectCode]
    : null;

  const nextSub = status.nextCell && status.nextCell.subjectCode !== 'FREE' && status.nextCell.subjectCode !== 'LUNCH'
    ? SUBJECTS[status.nextCell.subjectCode]
    : null;

  return (
    <div className="bg-neutral-950 text-white border-y border-neutral-800 py-3.5 px-4 sm:px-6 lg:px-8 mb-6 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Live Indicator Left */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
            <span className="font-extrabold uppercase tracking-wider text-neutral-400">Live Status:</span>
            <span className="font-mono font-bold bg-neutral-900 border border-neutral-700 px-2 py-0.5 rounded text-white">
              {timeStr}
            </span>
            {status.day !== 'WEEKEND' && (
              <button 
                onClick={() => onSelectDay(status.day as 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI')}
                className="font-bold text-white hover:underline text-xs bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700 cursor-pointer"
              >
                Today ({DAY_FULL_NAMES[status.day]})
              </button>
            )}
          </div>
        </div>

        {/* Status Content Center/Right */}
        <div className="flex items-center gap-4 text-xs sm:text-sm flex-wrap">
          {status.isLunch ? (
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-lg text-neutral-200">
              <Coffee className="w-4 h-4 text-white" />
              <span><strong>Lunch Break</strong> (01:20 PM – 02:20 PM) — {status.minutesRemaining}m remaining</span>
            </div>
          ) : curSub ? (
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-lg">
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>
                <strong className="text-neutral-400">{status.currentPeriod?.label}:</strong>{' '}
                <button 
                  onClick={() => onSelectSubject(curSub.code)}
                  className="font-bold hover:underline text-white cursor-pointer"
                >
                  {curSub.name} ({curSub.code})
                </button>
                {status.currentCell?.room && <span className="text-neutral-400 ml-1.5">[{status.currentCell.room}]</span>}
              </span>
              <span className="bg-white text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded ml-1">
                {status.minutesRemaining}m left
              </span>
            </div>
          ) : status.currentCell?.subjectCode === 'FREE' ? (
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-neutral-400">
              <Sparkles className="w-4 h-4" />
              <span>Free Period ({status.currentPeriod?.label})</span>
            </div>
          ) : (
            <div className="text-neutral-400 text-xs font-semibold">
              {status.statusText}
            </div>
          )}

          {/* Up Next Preview */}
          {nextSub && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-400 border-l border-neutral-800 pl-4">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Up next:</span>
              <button 
                onClick={() => onSelectSubject(nextSub.code)}
                className="font-semibold text-neutral-200 hover:text-white hover:underline truncate max-w-[200px] cursor-pointer"
              >
                {nextSub.code} ({status.nextPeriod?.label})
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
