export interface PeriodInfo {
  id: string;
  periodNum: number | 'LUNCH';
  label: string;
  timeRange: string;
  startTime: string; // HH:mm format 24hr for time math
  endTime: string;   // HH:mm format 24hr for time math
}

export interface Subject {
  code: string;
  name: string;
  isLab: boolean;
  type: 'Theory' | 'Lab' | 'Soft Skills' | 'Audit';
  facultyInitialDefault?: string;
}

export interface TimetableCell {
  day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
  periodId: string;
  subjectCode: string | 'FREE' | 'LUNCH';
  faculty?: string;
  room?: string;
  isDoublePeriod?: boolean;
  doublePeriodPart?: 1 | 2;
  notes?: string;
}

export const CLASS_METADATA = {
  className: 'B.Tech CSE 2nd Year, CS3B',
  defaultRoom: 'E112',
  academicYear: '2025-2026',
  department: 'Computer Science & Engineering',
  institute: 'KIET Group of Institutions',
};

export const PERIODS: PeriodInfo[] = [
  { id: 'P1', periodNum: 1, label: 'I Period', timeRange: '09:10 AM – 10:00 AM', startTime: '09:10', endTime: '10:00' },
  { id: 'P2', periodNum: 2, label: 'II Period', timeRange: '10:00 AM – 10:50 AM', startTime: '10:00', endTime: '10:50' },
  { id: 'P3', periodNum: 3, label: 'III Period', timeRange: '10:50 AM – 11:40 AM', startTime: '10:50', endTime: '11:40' },
  { id: 'P4', periodNum: 4, label: 'IV Period', timeRange: '11:40 AM – 12:30 PM', startTime: '11:40', endTime: '12:30' },
  { id: 'P5', periodNum: 5, label: 'V Period', timeRange: '12:30 PM – 01:20 PM', startTime: '12:30', endTime: '13:20' },
  { id: 'LUNCH', periodNum: 'LUNCH', label: 'Lunch', timeRange: '01:20 PM – 02:20 PM', startTime: '13:20', endTime: '14:20' },
  { id: 'P6', periodNum: 6, label: 'VI Period', timeRange: '02:20 PM – 03:10 PM', startTime: '14:20', endTime: '15:10' },
  { id: 'P7', periodNum: 7, label: 'VII Period', timeRange: '03:10 PM – 04:00 PM', startTime: '15:10', endTime: '16:00' },
  { id: 'P8', periodNum: 8, label: 'VIII Period', timeRange: '04:00 PM – 04:50 PM', startTime: '16:00', endTime: '16:50' },
];

export const SUBJECTS: Record<string, Subject> = {
  HS111L: {
    code: 'HS111L',
    name: 'Soft Skills Essentials-1',
    isLab: false,
    type: 'Soft Skills'
  },
  HS110L: {
    code: 'HS110L',
    name: 'Aptitude-1',
    isLab: false,
    type: 'Soft Skills'
  },
  IT301L: {
    code: 'IT301L',
    name: 'Database System',
    isLab: false,
    type: 'Theory'
  },
  CS206L: {
    code: 'CS206L',
    name: 'Operating System',
    isLab: false,
    type: 'Theory'
  },
  CS302B: {
    code: 'CS302B',
    name: 'Advance Data Structure',
    isLab: false,
    type: 'Theory'
  },
  CS336B: {
    code: 'CS336B',
    name: 'Object-Oriented Programming Using Java',
    isLab: false,
    type: 'Theory'
  },
  HS109L: {
    code: 'HS109L',
    name: 'Constitution of India',
    isLab: false,
    type: 'Audit'
  },
  CS205B: {
    code: 'CS205B',
    name: 'Artificial Intelligence and its application',
    isLab: false,
    type: 'Theory'
  },
  IT301P: {
    code: 'IT301P',
    name: 'Database System Lab',
    isLab: true,
    type: 'Lab'
  },
  CS206P: {
    code: 'CS206P',
    name: 'Operating System Lab',
    isLab: true,
    type: 'Lab'
  },
  MA105L: {
    code: 'MA105L',
    name: 'Probability and Statistics',
    isLab: false,
    type: 'Theory'
  }
};

export const DAYS: Array<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI'> = [
  'MON', 'TUE', 'WED', 'THU', 'FRI'
];

export const DAY_FULL_NAMES: Record<string, string> = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday'
};

export const TIMETABLE_DATA: Record<string, Record<string, TimetableCell>> = {
  MON: {
    P1: { day: 'MON', periodId: 'P1', subjectCode: 'CS336B', faculty: 'AJ' },
    P2: { day: 'MON', periodId: 'P2', subjectCode: 'MA105L', faculty: 'ANR' },
    P3: { day: 'MON', periodId: 'P3', subjectCode: 'CS205B', faculty: 'GD' },
    P4: { day: 'MON', periodId: 'P4', subjectCode: 'CS302B', faculty: 'MA, RR', isDoublePeriod: true, doublePeriodPart: 1 },
    P5: { day: 'MON', periodId: 'P5', subjectCode: 'CS302B', faculty: 'MA, RR', isDoublePeriod: true, doublePeriodPart: 2 },
    LUNCH: { day: 'MON', periodId: 'LUNCH', subjectCode: 'LUNCH' },
    P6: { day: 'MON', periodId: 'P6', subjectCode: 'CS206L', faculty: 'PKP' },
    P7: { day: 'MON', periodId: 'P7', subjectCode: 'FREE' },
    P8: { day: 'MON', periodId: 'P8', subjectCode: 'FREE' }
  },
  TUE: {
    P1: { day: 'TUE', periodId: 'P1', subjectCode: 'HS111L', faculty: 'SK' },
    P2: { day: 'TUE', periodId: 'P2', subjectCode: 'CS336B', faculty: 'AJ' },
    P3: { day: 'TUE', periodId: 'P3', subjectCode: 'CS302B', faculty: 'MA' },
    P4: { day: 'TUE', periodId: 'P4', subjectCode: 'CS206P', faculty: 'PKP, AS', room: 'E211', isDoublePeriod: true, doublePeriodPart: 1 },
    P5: { day: 'TUE', periodId: 'P5', subjectCode: 'CS206P', faculty: 'PKP, AS', room: 'E211', isDoublePeriod: true, doublePeriodPart: 2 },
    LUNCH: { day: 'TUE', periodId: 'LUNCH', subjectCode: 'LUNCH' },
    P6: { day: 'TUE', periodId: 'P6', subjectCode: 'IT301L', faculty: 'SHI' },
    P7: { day: 'TUE', periodId: 'P7', subjectCode: 'FREE' },
    P8: { day: 'TUE', periodId: 'P8', subjectCode: 'FREE' }
  },
  WED: {
    P1: { day: 'WED', periodId: 'P1', subjectCode: 'CS206L', faculty: 'PKP' },
    P2: { day: 'WED', periodId: 'P2', subjectCode: 'IT301L', faculty: 'SHI' },
    P3: { day: 'WED', periodId: 'P3', subjectCode: 'CS336B', faculty: 'AJ' },
    P4: { day: 'WED', periodId: 'P4', subjectCode: 'CS205B', faculty: 'GD, KK', isDoublePeriod: true, doublePeriodPart: 1 },
    P5: { day: 'WED', periodId: 'P5', subjectCode: 'CS205B', faculty: 'GD, KK', isDoublePeriod: true, doublePeriodPart: 2 },
    LUNCH: { day: 'WED', periodId: 'LUNCH', subjectCode: 'LUNCH' },
    P6: { day: 'WED', periodId: 'P6', subjectCode: 'HS110L', faculty: 'SPS' },
    P7: { day: 'WED', periodId: 'P7', subjectCode: 'HS109L', faculty: 'NS' },
    P8: { day: 'WED', periodId: 'P8', subjectCode: 'FREE' }
  },
  THU: {
    P1: { day: 'THU', periodId: 'P1', subjectCode: 'IT301P', faculty: 'SHI, RAH', room: 'E206', isDoublePeriod: true, doublePeriodPart: 1 },
    P2: { day: 'THU', periodId: 'P2', subjectCode: 'IT301P', faculty: 'SHI, RAH', room: 'E206', isDoublePeriod: true, doublePeriodPart: 2 },
    P3: { day: 'THU', periodId: 'P3', subjectCode: 'CS302B', faculty: 'MA' },
    P4: { day: 'THU', periodId: 'P4', subjectCode: 'CS205B', faculty: 'GD' },
    P5: { day: 'THU', periodId: 'P5', subjectCode: 'IT301L', faculty: 'SHI' },
    LUNCH: { day: 'THU', periodId: 'LUNCH', subjectCode: 'LUNCH' },
    P6: { day: 'THU', periodId: 'P6', subjectCode: 'MA105L', room: 'CS3B' },
    P7: { day: 'THU', periodId: 'P7', subjectCode: 'FREE', notes: 'X' },
    P8: { day: 'THU', periodId: 'P8', subjectCode: 'FREE', notes: 'X' }
  },
  FRI: {
    P1: { day: 'FRI', periodId: 'P1', subjectCode: 'CS205B', faculty: 'GD' },
    P2: { day: 'FRI', periodId: 'P2', subjectCode: 'CS206L', faculty: 'PKP' },
    P3: { day: 'FRI', periodId: 'P3', subjectCode: 'MA105L', faculty: 'ANR' },
    P4: { day: 'FRI', periodId: 'P4', subjectCode: 'CS336B', faculty: 'AJ, ABG', isDoublePeriod: true, doublePeriodPart: 1 },
    P5: { day: 'FRI', periodId: 'P5', subjectCode: 'CS336B', faculty: 'AJ, ABG', isDoublePeriod: true, doublePeriodPart: 2 },
    LUNCH: { day: 'FRI', periodId: 'LUNCH', subjectCode: 'LUNCH' },
    P6: { day: 'FRI', periodId: 'P6', subjectCode: 'CS302B', faculty: 'MA' },
    P7: { day: 'FRI', periodId: 'P7', subjectCode: 'FREE', notes: 'X' },
    P8: { day: 'FRI', periodId: 'P8', subjectCode: 'FREE', notes: 'X' }
  }
};

// Faculty Full Name Lookup Map for extra polish
export const FACULTY_MAP: Record<string, string> = {
  AJ: 'Prof. A. J. (Java OOP)',
  ANR: 'Prof. A. N. R. (Maths)',
  GD: 'Prof. G. D. (AI & Application)',
  MA: 'Prof. M. A. (Data Structures)',
  RR: 'Prof. R. R. (Data Structures)',
  PKP: 'Prof. P. K. P. (Operating Systems)',
  SK: 'Prof. S. K. (Soft Skills)',
  AS: 'Prof. A. S. (OS Lab)',
  SHI: 'Prof. SHI (Database Systems)',
  KK: 'Prof. K. K. (AI & App)',
  SPS: 'Prof. S. P. S. (Aptitude)',
  NS: 'Prof. N. S. (Constitution)',
  RAH: 'Prof. R. A. H. (DB Lab)',
  ABG: 'Prof. A. B. G. (Java OOP)'
};
