import { Doctor, ScheduleEntry, AppSettings } from './types';

/**
 * API Service untuk Google Apps Script
 * Jika gasScriptUrl dikonfigurasi, data akan disinkronisasi ke Google Spreadsheet
 * Jika tidak, fallback ke localStorage
 */

let gasUrl = '';

export function setGasUrl(url: string) {
  gasUrl = url;
}

export function getGasUrl(): string {
  return gasUrl;
}

export function isConnected(): boolean {
  return gasUrl.trim().length > 0;
}

// GET Doctors
export async function fetchDoctors(): Promise<Doctor[] | null> {
  if (!isConnected()) return null;
  try {
    const res = await fetch(`${gasUrl}?action=getDoctors`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch doctors:', err);
    return null;
  }
}

// POST Doctors
export async function saveDoctorsRemote(doctors: Doctor[]): Promise<boolean> {
  if (!isConnected()) return false;
  try {
    await fetch(gasUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveDoctors', doctors }),
    });
    return true;
  } catch (err) {
    console.error('Failed to save doctors:', err);
    return false;
  }
}

// GET Schedule
export async function fetchSchedule(month: string): Promise<ScheduleEntry[] | null> {
  if (!isConnected()) return null;
  try {
    const res = await fetch(`${gasUrl}?action=getSchedule&month=${month}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch schedule:', err);
    return null;
  }
}

// POST Schedule
export async function saveScheduleRemote(month: string, entries: ScheduleEntry[]): Promise<boolean> {
  if (!isConnected()) return false;
  try {
    await fetch(gasUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveSchedule', month, entries }),
    });
    return true;
  } catch (err) {
    console.error('Failed to save schedule:', err);
    return false;
  }
}

// GET Settings
export async function fetchSettings(): Promise<AppSettings | null> {
  if (!isConnected()) return null;
  try {
    const res = await fetch(`${gasUrl}?action=getSettings`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    return null;
  }
}

// POST Settings
export async function saveSettingsRemote(settings: AppSettings): Promise<boolean> {
  if (!isConnected()) return false;
  try {
    await fetch(gasUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveSettings', settings }),
    });
    return true;
  } catch (err) {
    console.error('Failed to save settings:', err);
    return false;
  }
}
