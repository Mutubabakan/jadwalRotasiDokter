import { Doctor, ScheduleData, AppSettings, ScheduleEntry, KetEntry } from './types';

const STORAGE_KEYS = {
  DOCTORS: 'puskesmas_doctors',
  SCHEDULE: 'puskesmas_schedule',
  SETTINGS: 'puskesmas_settings',
};

// Default doctors
export const defaultDoctors: Doctor[] = [
  { id: 'santi', name: 'dr. Santi', color: '#00ffff', isBackup: false },
  { id: 'rakean', name: 'dr. Rakean', color: '#ff00ff', isBackup: false },
  { id: 'afif', name: 'dr. Afif', color: '#39ff14', isBackup: false },
  { id: 'likha', name: 'dr. Likha', color: '#ff6600', isBackup: false },
  { id: 'abdi', name: 'dr. Abdi', color: '#ffff00', isBackup: true },
];

// 2025 Indonesian National Holidays
export const defaultHolidays = [
  { date: '2025-01-01', name: 'Tahun Baru Masehi' },
  { date: '2025-01-27', name: 'Isra Miraj Nabi Muhammad SAW' },
  { date: '2025-01-29', name: 'Cuti Bersama Tahun Baru Imlek' },
  { date: '2025-01-30', name: 'Tahun Baru Imlek' },
  { date: '2025-03-29', name: 'Hari Raya Nyepi' },
  { date: '2025-03-31', name: 'Idul Fitri' },
  { date: '2025-04-01', name: 'Idul Fitri' },
  { date: '2025-04-03', name: 'Cuti Bersama Idul Fitri' },
  { date: '2025-04-04', name: 'Cuti Bersama Idul Fitri' },
  { date: '2025-04-07', name: 'Cuti Bersama Idul Fitri' },
  { date: '2025-04-18', name: 'Wafat Isa Al Masih' },
  { date: '2025-05-01', name: 'Hari Buruh Internasional' },
  { date: '2025-05-12', name: 'Hari Raya Waisak' },
  { date: '2025-05-29', name: 'Kenaikan Isa Al Masih' },
  { date: '2025-06-01', name: 'Hari Lahir Pancasila' },
  { date: '2025-06-06', name: 'Idul Adha' },
  { date: '2025-06-07', name: 'Cuti Bersama Idul Adha' },
  { date: '2025-06-27', name: 'Tahun Baru Islam' },
  { date: '2025-08-17', name: 'Hari Kemerdekaan RI' },
  { date: '2025-09-05', name: 'Maulid Nabi Muhammad SAW' },
  { date: '2025-10-05', name: 'Hari Kesaktian Pancasila' },
  { date: '2025-12-25', name: 'Hari Natal' },
  { date: '2025-12-26', name: 'Cuti Bersama Natal' },
  // 2026
  { date: '2026-01-01', name: 'Tahun Baru Masehi' },
  { date: '2026-02-17', name: 'Tahun Baru Imlek' },
  { date: '2026-03-19', name: 'Hari Raya Nyepi' },
  { date: '2026-03-20', name: 'Idul Fitri' },
  { date: '2026-03-21', name: 'Idul Fitri' },
  { date: '2026-04-03', name: 'Idul Adha' },
  { date: '2026-05-01', name: 'Hari Buruh Internasional' },
  { date: '2026-05-27', name: 'Hari Raya Waisak' },
  { date: '2026-06-01', name: 'Hari Lahir Pancasila' },
  { date: '2026-08-17', name: 'Hari Kemerdekaan RI' },
  { date: '2026-12-25', name: 'Hari Natal' },
];

export const defaultSettings: AppSettings = {
  puskesmasName: 'Puskesmas Babakan',
  nationalHolidays: defaultHolidays,
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

export function isHoliday(date: string, settings: AppSettings): boolean {
  const d = new Date(date);
  const day = d.getDay();
  if (day === 0) return true; // Sunday
  return settings.nationalHolidays.some(h => h.date === date);
}

export function getHolidayName(date: string, settings: AppSettings): string | null {
  const holiday = settings.nationalHolidays.find(h => h.date === date);
  return holiday ? holiday.name : null;
}

export function getKetEntries(entries: ScheduleEntry[], date: string): KetEntry[] {
  const entry = entries.find(e => e.date === date);
  return entry?.ket || [];
}
