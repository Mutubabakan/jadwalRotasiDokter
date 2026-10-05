export interface Doctor {
  id: string;
  name: string;
  color: string;
  isBackup: boolean;
}

export interface KetEntry {
  type: 'holiday' | 'doctor';
  label: string; // holiday name or doctor name
  doctorId?: string;
  status?: 'izin' | 'sakit' | 'tugas';
  tugasLabel?: string; // for tugas type
}

export interface ScheduleEntry {
  date: string; // YYYY-MM-DD
  k3a?: string; // doctor id
  k3b?: string; // doctor id
  igd?: string; // doctor id
  k2?: string; // doctor id
  ket: KetEntry[];
}

export interface ScheduleData {
  [yearMonth: string]: ScheduleEntry[]; // key: "YYYY-MM"
}

export interface AppSettings {
  puskesmasName: string;
  nationalHolidays: NationalHoliday[];
}

export interface NationalHoliday {
  date: string; // YYYY-MM-DD
  name: string;
}

export type TabType = 'jadwal' | 'dokter' | 'setting';
