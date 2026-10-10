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

export interface PrintProfile {
  lokasi: string; // contoh: Mataram
  namaKepala: string;
  nipKepala: string;
  kopMode: 'gambar' | 'teks' | 'tanpa';
  kopTeks: string; // satu baris per baris kop
}

/** Gambar kop disimpan HANYA di perangkat ini (tidak ikut sync ke spreadsheet). */
export interface KopImage {
  dataUrl: string;
  width: number;
  height: number;
}

export interface AppSettings {
  puskesmasName: string;
  nationalHolidays: NationalHoliday[];
  gasScriptUrl?: string;
  cetak?: PrintProfile;
}

export interface NationalHoliday {
  date: string; // YYYY-MM-DD
  name: string;
}

export type TabType = 'jadwal' | 'dokter' | 'setting';
