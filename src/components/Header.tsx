import React from 'react';
import { Calendar, MapPin, Moon, Sun, Printer, Search, BookOpen, Layers } from 'lucide-react';
import { CLASS_METADATA } from '../data/timetable';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedSubjectFilter: string | null;
  setSelectedSubjectFilter: (val: string | null) => void;
  onPrint: () => void;
  onOpenDirectory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  selectedSubjectFilter,
  setSelectedSubjectFilter,
  onPrint,
  onOpenDirectory,
}) => {
  return (
    <header className="border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black transition-colors duration-200 sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Title & Metadata */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shrink-0">
              <Calendar className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-black dark:text-white">
                  {CLASS_METADATA.className}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white">
                  <MapPin className="w-3 h-3" />
                  Room: {CLASS_METADATA.defaultRoom}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
                {CLASS_METADATA.department} • {CLASS_METADATA.institute}
              </p>
            </div>
          </div>

          {/* Action Bar & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search subject, code, teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              />
              {(searchQuery || selectedSubjectFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubjectFilter(null);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Subject Directory Button */}
            <button
              onClick={onOpenDirectory}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              title="View Subject Directory"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Subjects</span>
            </button>

            {/* Print Button */}
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              title="Print Clean B&W Timetable"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Active Filter Indicator Tag */}
        {(selectedSubjectFilter || searchQuery) && (
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-800">
            <Layers className="w-3.5 h-3.5" />
            <span>Filtering active for:</span>
            <span className="font-bold text-black dark:text-white underline">
              {selectedSubjectFilter || searchQuery}
            </span>
            <button
              onClick={() => {
                setSelectedSubjectFilter(null);
                setSearchQuery('');
              }}
              className="ml-auto text-xs underline font-bold hover:text-black dark:hover:text-white cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
