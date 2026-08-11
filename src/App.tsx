import React, { useState, useEffect } from 'react';
import { 
  Clock,
  Coffee,
  Cpu,
  Terminal,
  Database,
  Server,
  Network,
  BrainCircuit,
  LineChart,
  MessageSquare,
  Lightbulb,
  Scale,
  Utensils
} from 'lucide-react';

interface ScheduleSlot {
  name: string;
  time?: string;
  startTime: string; // 24hr format HH:mm e.g. "09:10"
  endTime: string;   // 24hr format HH:mm e.g. "10:00"
  room?: string;
  isLab?: boolean;
  isFree?: boolean;
  isLunch?: boolean;
  colSpan?: number;
}

interface DaySchedule {
  dayCode: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
  dayName: string;
  preLunch: ScheduleSlot[];
  postLunch: ScheduleSlot[];
  mobilePreLunch: ScheduleSlot[];
  mobilePostLunch: ScheduleSlot[];
}

export function App() {
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0);
  const [now, setNow] = useState<Date>(new Date());

  // Ensure dark mode is strictly active
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Set active day to current day if Mon-Fri, and update clock every 10s
  useEffect(() => {
    const d = new Date();
    setNow(d);
    const day = d.getDay();
    if (day >= 1 && day <= 5) {
      setActiveDayIdx(day - 1);
    }

    const timer = setInterval(() => {
      setNow(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Helper to check if a specific day and time slot is currently ongoing
  const isSlotActive = (dayCode: string, startTime: string, endTime: string): boolean => {
    const dayIndexMap: Record<number, string> = {
      1: 'MON',
      2: 'TUE',
      3: 'WED',
      4: 'THU',
      5: 'FRI',
    };

    const currentDayCode = dayIndexMap[now.getDay()];
    if (currentDayCode !== dayCode) return false;

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    const currentMins = now.getHours() * 60 + now.getMinutes();

    return currentMins >= startMins && currentMins < endMins;
  };

  // Touch Swipe state for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const periodHeaders = [
    { period: 'I Period', time: '09:10 – 10:00' },
    { period: 'II Period', time: '10:00 – 10:50' },
    { period: 'III Period', time: '10:50 – 11:40' },
    { period: 'IV Period', time: '11:40 – 12:30' },
    { period: 'V Period', time: '12:30 – 01:20' },
    { period: 'Lunch', time: '01:20 – 02:20', isLunch: true },
    { period: 'VI Period', time: '02:20 – 03:10' },
    { period: 'VII Period', time: '03:10 – 04:00' },
    { period: 'VIII Period', time: '04:00 – 04:50' },
  ];

  const scheduleData: DaySchedule[] = [
    {
      dayCode: 'MON',
      dayName: 'Monday',
      preLunch: [
        { name: 'OOP Java', startTime: '09:10', endTime: '10:00' },
        { name: 'Probability & Statistics', startTime: '10:00', endTime: '10:50' },
        { name: 'AI & Application', startTime: '10:50', endTime: '11:40' },
        { name: 'Advance Data Structure', startTime: '11:40', endTime: '13:20', colSpan: 2 },
      ],
      postLunch: [
        { name: 'Operating System', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, startTime: '16:00', endTime: '16:50' },
      ],
      mobilePreLunch: [
        { name: 'OOP Java', time: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
        { name: 'Probability & Statistics', time: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
        { name: 'AI & Application', time: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
        { name: 'Advance Data Structure', time: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
        { name: 'Advance Data Structure', time: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
      ],
      mobilePostLunch: [
        { name: 'Operating System', time: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, time: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, time: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
      ],
    },
    {
      dayCode: 'TUE',
      dayName: 'Tuesday',
      preLunch: [
        { name: 'Soft Skills Essentials-1', startTime: '09:10', endTime: '10:00' },
        { name: 'OOP Java', startTime: '10:00', endTime: '10:50' },
        { name: 'Advance Data Structure', startTime: '10:50', endTime: '11:40' },
        { name: 'Operating System Lab', room: 'E211', isLab: true, startTime: '11:40', endTime: '13:20', colSpan: 2 },
      ],
      postLunch: [
        { name: 'Database System', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, startTime: '16:00', endTime: '16:50' },
      ],
      mobilePreLunch: [
        { name: 'Soft Skills Essentials-1', time: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
        { name: 'OOP Java', time: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
        { name: 'Advance Data Structure', time: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
        { name: 'Operating System Lab', room: 'E211', isLab: true, time: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
        { name: 'Operating System Lab', room: 'E211', isLab: true, time: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
      ],
      mobilePostLunch: [
        { name: 'Database System', time: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, time: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, time: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
      ],
    },
    {
      dayCode: 'WED',
      dayName: 'Wednesday',
      preLunch: [
        { name: 'Operating System', startTime: '09:10', endTime: '10:00' },
        { name: 'Database System', startTime: '10:00', endTime: '10:50' },
        { name: 'OOP Java', startTime: '10:50', endTime: '11:40' },
        { name: 'AI & Application', startTime: '11:40', endTime: '13:20', colSpan: 2 },
      ],
      postLunch: [
        { name: 'Aptitude-1', startTime: '14:20', endTime: '15:10' },
        { name: 'Constitution of India', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, startTime: '16:00', endTime: '16:50' },
      ],
      mobilePreLunch: [
        { name: 'Operating System', time: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
        { name: 'Database System', time: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
        { name: 'OOP Java', time: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
        { name: 'AI & Application', time: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
        { name: 'AI & Application', time: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
      ],
      mobilePostLunch: [
        { name: 'Aptitude-1', time: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
        { name: 'Constitution of India', time: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, time: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
      ],
    },
    {
      dayCode: 'THU',
      dayName: 'Thursday',
      preLunch: [
        { name: 'Database System Lab', room: 'E206', isLab: true, startTime: '09:10', endTime: '10:50', colSpan: 2 },
        { name: 'Advance Data Structure', startTime: '10:50', endTime: '11:40' },
        { name: 'AI & Application', startTime: '11:40', endTime: '12:30' },
        { name: 'Database System', startTime: '12:30', endTime: '13:20' },
      ],
      postLunch: [
        { name: 'Probability & Statistics', room: 'CS3B', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, startTime: '16:00', endTime: '16:50' },
      ],
      mobilePreLunch: [
        { name: 'Database System Lab', room: 'E206', isLab: true, time: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
        { name: 'Database System Lab', room: 'E206', isLab: true, time: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
        { name: 'Advance Data Structure', time: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
        { name: 'AI & Application', time: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
        { name: 'Database System', time: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
      ],
      mobilePostLunch: [
        { name: 'Probability & Statistics', room: 'CS3B', time: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, time: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, time: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
      ],
    },
    {
      dayCode: 'FRI',
      dayName: 'Friday',
      preLunch: [
        { name: 'AI & Application', startTime: '09:10', endTime: '10:00' },
        { name: 'Operating System', startTime: '10:00', endTime: '10:50' },
        { name: 'Probability & Statistics', startTime: '10:50', endTime: '11:40' },
        { name: 'OOP Java', startTime: '11:40', endTime: '13:20', colSpan: 2 },
      ],
      postLunch: [
        { name: 'Advance Data Structure', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, startTime: '16:00', endTime: '16:50' },
      ],
      mobilePreLunch: [
        { name: 'AI & Application', time: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
        { name: 'Operating System', time: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
        { name: 'Probability & Statistics', time: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
        { name: 'OOP Java', time: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
        { name: 'OOP Java', time: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
      ],
      mobilePostLunch: [
        { name: 'Advance Data Structure', time: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
        { name: 'FREE', isFree: true, time: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
        { name: 'FREE', isFree: true, time: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
      ],
    },
  ];

  // Helper to render SVG inside a rounded black box for mobile view
  const renderSubjectIconBox = (name: string) => {
    const iconClass = "w-4 h-4 sm:w-4.5 sm:h-4.5 text-white stroke-[2]";

    let Icon = Coffee;
    if (name.includes('OOP Java')) Icon = Coffee;
    else if (name.includes('Operating System Lab')) Icon = Terminal;
    else if (name.includes('Operating System')) Icon = Cpu;
    else if (name.includes('Database System Lab')) Icon = Server;
    else if (name.includes('Database System')) Icon = Database;
    else if (name.includes('Advance Data Structure')) Icon = Network;
    else if (name.includes('AI & Application')) Icon = BrainCircuit;
    else if (name.includes('Probability')) Icon = LineChart;
    else if (name.includes('Soft Skills')) Icon = MessageSquare;
    else if (name.includes('Aptitude')) Icon = Lightbulb;
    else if (name.includes('Constitution')) Icon = Scale;
    else if (name.includes('LUNCH')) Icon = Utensils;

    return (
      <div className="p-1.5 sm:p-2 rounded-lg bg-neutral-900 border border-neutral-800 shadow-md shadow-black/60 shrink-0 flex items-center justify-center">
        <Icon className={iconClass} />
      </div>
    );
  };

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveDayIdx((prev) => (prev < scheduleData.length - 1 ? prev + 1 : 0));
    } else if (isRightSwipe) {
      setActiveDayIdx((prev) => (prev > 0 ? prev - 1 : scheduleData.length - 1));
    }
  };

  const currentDaySchedule = scheduleData[activeDayIdx];

  // Mobile list excludes FREE slots completely as requested
  const mobileVerticalList: ScheduleSlot[] = [
    ...currentDaySchedule.mobilePreLunch.filter((slot) => !slot.isFree),
    { name: 'LUNCH BREAK', isLunch: true, time: '01:20 PM – 02:20 PM', startTime: '13:20', endTime: '14:20' },
    ...currentDaySchedule.mobilePostLunch.filter((slot) => !slot.isFree),
  ];

  return (
    <div className="bg-black text-white font-sans select-none min-h-screen w-full">
      
      {/* ================= DESKTOP VIEW (md and up) ================= */}
      <div className="hidden md:flex flex-col h-screen w-screen overflow-hidden p-3 sm:p-4 bg-black">
        
        {/* Desktop Header */}
        <header className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 shrink-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white">
              B.Tech CSE 2nd Year (CS3B)
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-neutral-400">
              Classroom: <span className="font-extrabold text-white">E112</span> • Timetable
            </p>
          </div>
        </header>

        {/* Desktop Grid */}
        <main className="flex-1 w-full border border-neutral-800 rounded overflow-hidden flex flex-col min-h-0 bg-black">
          <table className="w-full h-full border-collapse text-center table-fixed">
            <thead>
              <tr className="bg-black text-white border-b border-neutral-800 font-bold text-xs sm:text-sm">
                <th className="w-[7%] border-r border-neutral-800 py-2 bg-black uppercase tracking-wider text-neutral-300">
                  DAY
                </th>
                
                {periodHeaders.map((header, idx) => (
                  <th
                    key={idx}
                    className={`border-r border-neutral-800 py-1.5 px-1 bg-black ${
                      header.isLunch ? 'w-[6%] font-extrabold text-white' : ''
                    }`}
                  >
                    <div className="font-extrabold truncate text-white">{header.period}</div>
                    <div className="text-[10px] sm:text-xs font-normal font-mono text-neutral-400">
                      {header.time}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800 font-medium text-xs sm:text-sm bg-black">
              {scheduleData.map((dayRow, dayIdx) => (
                <tr key={dayRow.dayCode} className="h-[19%] border-b border-neutral-800 bg-black">
                  
                  {/* Day Header Column */}
                  <td className="font-black text-sm sm:text-base border-r border-neutral-800 bg-black text-white uppercase tracking-wider">
                    {dayRow.dayCode}
                  </td>

                  {/* Pre-Lunch Slots (P1 to P5) */}
                  {dayRow.preLunch.map((slot, slotIdx) => {
                    const active = isSlotActive(dayRow.dayCode, slot.startTime, slot.endTime);

                    return (
                      <td
                        key={`pre-${slotIdx}`}
                        colSpan={slot.colSpan || 1}
                        className={`p-1.5 align-middle bg-black text-white font-bold transition-all ${
                          active
                            ? 'border-2 border-emerald-400 font-extrabold shadow-sm shadow-emerald-500/20'
                            : 'border-r border-neutral-800'
                        }`}
                      >
                        {!slot.isFree && (
                          <div className="flex flex-col items-center justify-center h-full space-y-1">
                            <span className="leading-tight text-center font-extrabold sm:text-base text-xs text-white">
                              {slot.name}
                            </span>
                            {slot.room && (
                              <span className="text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 shadow-xs">
                                {slot.room}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Lunch Column (Merged Vertically across all 5 rows) */}
                  {dayIdx === 0 && (
                    <td
                      rowSpan={5}
                      className="border-r border-neutral-800 bg-black text-neutral-300 font-black text-base sm:text-lg align-middle"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4 font-black tracking-widest text-neutral-300">
                        <span>L</span>
                        <span>U</span>
                        <span>N</span>
                        <span>C</span>
                        <span>H</span>
                      </div>
                    </td>
                  )}

                  {/* Post-Lunch Slots (P6 to P8) */}
                  {dayRow.postLunch.map((slot, slotIdx) => {
                    const active = isSlotActive(dayRow.dayCode, slot.startTime, slot.endTime);

                    return (
                      <td
                        key={`post-${slotIdx}`}
                        colSpan={slot.colSpan || 1}
                        className={`p-1.5 align-middle bg-black text-white font-bold transition-all ${
                          active
                            ? 'border-2 border-emerald-400 font-extrabold shadow-sm shadow-emerald-500/20'
                            : 'border-r border-neutral-800'
                        }`}
                      >
                        {!slot.isFree && (
                          <div className="flex flex-col items-center justify-center h-full space-y-1">
                            <span className="leading-tight text-center font-extrabold sm:text-base text-xs text-white">
                              {slot.name}
                            </span>
                            {slot.room && (
                              <span className="text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 shadow-xs">
                                {slot.room}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}

                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>


      {/* ================= MOBILE VIEW (screen width < md) ================= */}
      <div 
        className="flex md:hidden flex-col min-h-screen w-full bg-black text-white p-4 space-y-4 pb-8"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        
        {/* Mobile Heading */}
        <div className="border-b border-neutral-800 pb-2.5">
          <h1 className="text-xl font-black uppercase tracking-tight text-white">
            B.Tech CSE (CS3B)
          </h1>
          <p className="text-xs font-semibold text-neutral-400">
            Classroom: <span className="text-white font-extrabold">E112</span>
          </p>
        </div>

        {/* Clean Borderless Day Selector Tabs with Smooth Gliding Underline */}
        <div className="pb-2 pt-1">
          <div className="grid grid-cols-5 relative">
            {scheduleData.map((d, idx) => {
              const isSelected = idx === activeDayIdx;

              return (
                <button
                  key={d.dayCode}
                  onClick={() => setActiveDayIdx(idx)}
                  className={`relative py-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors duration-200 cursor-pointer text-center ${
                    isSelected ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  <span>{d.dayCode}</span>
                </button>
              );
            })}

            {/* Smooth Gliding Active Underline Indicator */}
            <span 
              className="absolute bottom-0 h-0.5 bg-white rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-sm shadow-white/60"
              style={{
                left: `calc(${activeDayIdx * 20}% + 10%)`,
                transform: 'translateX(-50%)',
                width: '32px'
              }}
            />
          </div>
        </div>

        {/* Vertically Aligned Subjects List (FREE Slots Omitted) */}
        <div key={activeDayIdx} className="flex-1 space-y-2.5 pt-0.5 animate-seamless-mist">
          {mobileVerticalList.map((item, idx) => {
            const active = isSlotActive(currentDaySchedule.dayCode, item.startTime, item.endTime);

            if (item.isLunch) {
              return (
                <div
                  key={`mobile-lunch-${idx}`}
                  className={`p-3.5 rounded-xl text-center font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                    active
                      ? 'border-2 border-emerald-400 bg-neutral-950 text-emerald-300'
                      : 'border border-neutral-800 bg-neutral-950 text-neutral-400'
                  }`}
                >
                  {renderSubjectIconBox('LUNCH')}
                  <div className="flex flex-col items-center">
                    <span>L U N C H &nbsp; B R E A K</span>
                    {item.time && (
                      <div className="flex items-center gap-1 text-[9.5px] font-semibold text-neutral-400 tracking-tight mt-0.5">
                        <Clock className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                        <span>{item.time}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`mobile-item-${idx}`}
                className={`p-3.5 rounded-xl bg-black text-white transition-all ${
                  active
                    ? 'border-2 border-emerald-400 shadow-sm shadow-emerald-500/10'
                    : 'border border-neutral-800 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  
                  {/* Rounded Black Box SVG Icon + Subject Name & Minimal Time */}
                  <div className="flex items-center gap-3 min-w-0">
                    {renderSubjectIconBox(item.name)}
                    <div className="min-w-0">
                      <span className="font-extrabold text-base leading-tight text-white block truncate">
                        {item.name}
                      </span>
                      {item.time && (
                        <div className="flex items-center gap-1 text-[9.5px] font-semibold text-neutral-400 tracking-tight mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                          <span>{item.time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.room && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-white shrink-0">
                      {item.room}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Touch Hint */}
        <div className="text-center text-[11px] font-medium text-neutral-600 pt-2">
          Swipe left/right or tap day tabs above to switch day
        </div>

      </div>

    </div>
  );
}

export default App;
