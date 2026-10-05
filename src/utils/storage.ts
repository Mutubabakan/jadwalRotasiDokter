import { Doctor, ScheduleData, AppSettings, ScheduleEntry, KetEntry } from './types';

const STORAGE_KEYS = {
  DOCTORS: 'puskesmas_doctors',
  SCHEDULE: 'puskesmas_schedule',
  SETTINGS: 'puskesmas_settings',
  HOLIDAYS: 'puskesmas_holidays',
};

export const defaultDoctors: Doctor[] = [
  { id: 'santi', name: 'dr. Santi', color: '#0097a7', isBackup: false },
  { id: 'rakean', name: 'dr. Rakean', color: '#c2185b', isBackup: false },
  { id: 'afif', name: 'dr. Afif', color: '#388e3c', isBackup: false },
  { id: 'likha', name: 'dr. Likha', color: '#f57c00', isBackup: false },
  { id: 'abdi', name: 'dr. Abdi', color: '#7b1fa2', isBackup: true },
];

// Indonesian National Holidays by year
export const defaultHolidaysByYear: Record<number, { date: string; name: string }[]> = {
  2025: [
    { date: '2025-01-01', name: 'Tahun Baru Masehi' },
    { date: '2025-01-27', name: 'Isra Miraj Nabi Muhammad SAW' },
    { date: '2025-01-29', name: 'Tahun Baru Imlek' },
    { date: '2025-03-29', name: 'Hari Raya Nyepi' },
    { date: '2025-03-31', name: 'Idul Fitri' },
    { date: '2025-04-01', name: 'Idul Fitri' },
    { date: '2025-04-18', name: 'Wafat Isa Al Masih' },
    { date: '2025-05-01', name: 'Hari Buruh Internasional' },
    { date: '2025-05-12', name: 'Hari Raya Waisak' },
    { date: '2025-05-29', name: 'Kenaikan Isa Al Masih' },
    { date: '2025-06-01', name: 'Hari Lahir Pancasila' },
    { date: '2025-06-07', name: 'Idul Adha' },
    { date: '2025-06-27', name: 'Tahun Baru Islam' },
    { date: '2025-09-05', name: 'Maulid Nabi Muhammad SAW' },
    { date: '2025-12-25', name: 'Hari Natal' },
  ],
  2026: [
    { date: '2026-01-01', name: 'Tahun Baru Masehi' },
    { date: '2026-01-16', name: 'Isra Miraj Nabi Muhammad SAW' },
    { date: '2026-02-17', name: 'Tahun Baru Imlek' },
    { date: '2026-03-19', name: 'Hari Raya Nyepi' },
    { date: '2026-03-20', name: 'Idul Fitri' },
    { date: '2026-03-21', name: 'Idul Fitri' },
    { date: '2026-04-03', name: 'Wafat Isa Al Masih' },
    { date: '2026-05-01', name: 'Hari Buruh Internasional' },
    { date: '2026-05-27', name: 'Hari Raya Waisak' },
    { date: '2026-05-14', name: 'Kenaikan Isa Al Masih' },
    { date: '2026-06-01', name: 'Hari Lahir Pancasila' },
    { date: '2026-05-27', name: 'Idul Adha' },
    { date: '2026-06-17', name: 'Tahun Baru Islam' },
    { date: '2026-08-17', name: 'Hari Kemerdekaan RI' },
    { date: '2026-09-24', name: 'Maulid Nabi Muhammad SAW' },
    { date: '2026-12-25', name: 'Hari Natal' },
  ],
};

export const defaultSettings: AppSettings = {
  puskesmasName: 'Puskesmas Babakan',
  nationalHolidays: [],
  gasScriptUrl: '',
};

// Storage functions
export function getDoctors(): Doctor[] {
  const stored = localStorage.getItem(STORAGE_KEYS.DOCTORS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(defaultDoctors));
  return defaultDoctors;
}

export function saveDoctors(doctors: Doctor[]): void {
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
}

export function getSchedule(): ScheduleData {
  const stored = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
  if (stored) return JSON.parse(stored);
  return {};
}

export function saveSchedule(schedule: ScheduleData): void {
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
}

export function getSettings(): AppSettings {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  return defaultSettings;
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Holidays by year
export function getHolidaysByYear(year: number): { date: string; name: string }[] {
  const stored = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
  if (stored) {
    const all: Record<string, { date: string; name: string }[]> = JSON.parse(stored);
    if (all[year]) return all[year];
  }
  // Return default if exists
  if (defaultHolidaysByYear[year]) return defaultHolidaysByYear[year];
  return [];
}

export function saveHolidaysByYear(year: number, holidays: { date: string; name: string }[]): void {
  const stored = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
  let all: Record<string, { date: string; name: string }[]> = {};
  if (stored) all = JSON.parse(stored);
  all[year] = holidays;
  localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(all));
}

export function getAllHolidays(): { date: string; name: string }[] {
  const stored = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
  if (stored) {
    const all: Record<string, { date: string; name: string }[]> = JSON.parse(stored);
    return Object.values(all).flat().sort((a, b) => a.date.localeCompare(b.date));
  }
  // Return all defaults
  return Object.values(defaultHolidaysByYear).flat().sort((a, b) => a.date.localeCompare(b.date));
}

export function getMonthSchedule(year: number, month: number): ScheduleEntry[] {
  const schedule = getSchedule();
  const key = `${year}-${String(month + 1).padStart(2, '0')}`;
  return schedule[key] || [];
}

export function saveMonthSchedule(year: number, month: number, entries: ScheduleEntry[]): void {
  const schedule = getSchedule();
  const key = `${year}-${String(month + 1).padStart(2, '0')}`;
  schedule[key] = entries;
  saveSchedule(schedule);
}

export function getDoctorById(doctors: Doctor[], id: string): Doctor | undefined {
  return doctors.find(d => d.id === id);
}

export function isHoliday(date: string): boolean {
  const d = new Date(date);
  const day = d.getDay();
  if (day === 0) return true; // Sunday
  const year = d.getFullYear();
  const holidays = getHolidaysByYear(year);
  return holidays.some(h => h.date === date);
}

export function getHolidayName(date: string): string | null {
  const d = new Date(date);
  const year = d.getFullYear();
  const holidays = getHolidaysByYear(year);
  const holiday = holidays.find(h => h.date === date);
  return holiday ? holiday.name : null;
}

// Clone/Export/Import
export function exportAllData(): string {
  const data = {
    doctors: getDoctors(),
    schedule: getSchedule(),
    settings: getSettings(),
    holidays: JSON.parse(localStorage.getItem(STORAGE_KEYS.HOLIDAYS) || '{}'),
    exportDate: new Date().toISOString(),
    version: '1.0',
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (data.doctors) localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(data.doctors));
    if (data.schedule) localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(data.schedule));
    if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    if (data.holidays) localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(data.holidays));
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}
