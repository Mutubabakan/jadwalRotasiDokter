import {
  exportAllData,
  getSettings,
  hasLocalSchedule,
  applyCloudData,
  CHANGE_EVENT,
} from './storage';

/**
 * URL Web App Google Apps Script (Deploy > Web app, akses: "Anyone").
 * Bisa ditimpa per perangkat lewat tab Setting; kosongkan di sana untuk memakai URL ini.
 */
export const DEFAULT_GAS_URL =
  'https://script.google.com/macros/s/AKfycbzK_AhCIHHwoYNZUBnuFRVYuz1d7QdOTsUzBfYqhAU-8vSZLE8oAaG2IICr83fETMQ0sg/exec';

const INIT_FLAG = 'puskesmas_cloud_initialized';

export type CloudStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';
type Listener = (status: CloudStatus, message?: string) => void;

const listeners = new Set<Listener>();
let current: { status: CloudStatus; message?: string } = { status: 'idle' };
let applying = false; // true saat menulis data dari cloud (jangan push balik)
let cloudReady = false; // true jika sinkron awal sesi ini berhasil
let timer: ReturnType<typeof setTimeout> | undefined;

function setStatus(status: CloudStatus, message?: string) {
  current = { status, message };
  listeners.forEach(fn => fn(status, message));
}

export function onCloudStatus(fn: Listener): () => void {
  listeners.add(fn);
  fn(current.status, current.message);
  return () => {
    listeners.delete(fn);
  };
}

export function getGasUrl(): string {
  return (getSettings().gasScriptUrl || '').trim() || DEFAULT_GAS_URL;
}

const HINT =
  "Pastikan deployment GAS: 'Execute as: Me' dan 'Who has access: Anyone', dan sudah di-deploy sebagai New version.";

async function fetchJson(url: string, init?: RequestInit): Promise<any> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal, redirect: 'follow' });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Respons dari Google Apps Script bukan JSON. ' + HINT);
    }
  } catch (e) {
    const msg = (e as Error).message || String(e);
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Load failed')) {
      throw new Error('Tidak bisa terhubung ke Google Apps Script. ' + HINT);
    }
    if ((e as Error).name === 'AbortError') throw new Error('Koneksi ke Google Apps Script timeout.');
    throw e;
  } finally {
    clearTimeout(t);
  }
}

function buildPayload() {
  const all = JSON.parse(exportAllData());
  delete all.exportDate;
  delete all.version;
  if (all.settings) {
    // URL GAS disimpan per perangkat, tidak ikut ke spreadsheet
    const { gasScriptUrl: _ignored, ...rest } = all.settings;
    all.settings = rest;
  }
  return all;
}

export async function fetchCloud(): Promise<any> {
  const url = getGasUrl();
  const sep = url.includes('?') ? '&' : '?';
  const json = await fetchJson(`${url}${sep}action=getAllData&_=${Date.now()}`);
  if (!json || json.status !== 'success') {
    throw new Error((json && json.message) || 'Gagal membaca data dari spreadsheet.');
  }
  return json.data || {};
}

export async function pushToCloud(): Promise<void> {
  setStatus('saving');
  try {
    // text/plain = "simple request" -> tidak butuh preflight CORS (GAS tidak mendukung OPTIONS)
    const json = await fetchJson(getGasUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'saveAllData', data: buildPayload() }),
    });
    if (!json || json.status !== 'success') {
      throw new Error((json && json.message) || 'Gagal menyimpan ke spreadsheet.');
    }
    setStatus('saved');
  } catch (e) {
    setStatus('error', (e as Error).message);
    throw e;
  }
}

/** Ambil dari cloud dan timpa data lokal (dipakai tombol "Muat dari Spreadsheet"). */
export async function pullFromCloud(): Promise<void> {
  setStatus('loading');
  try {
    const cloud = await fetchCloud();
    applying = true;
    try {
      applyCloudData(cloud);
    } finally {
      applying = false;
    }
    cloudReady = true;
    localStorage.setItem(INIT_FLAG, '1');
    setStatus('saved');
  } catch (e) {
    setStatus('error', (e as Error).message);
    throw e;
  }
}

function hasAnySchedule(s: unknown): boolean {
  return !!s && typeof s === 'object' && Object.values(s as object).some(v => Array.isArray(v) && v.length > 0);
}

/**
 * Sinkron awal saat aplikasi dibuka:
 * - Pertama kali di perangkat ini & ada jadwal lokal -> kirim lokal ke cloud (lokal menang, supaya data lama tidak hilang)
 * - Selain itu, jika cloud berisi data -> pakai data cloud
 * - Cloud kosong & ada jadwal lokal -> kirim lokal ke cloud
 */
export async function initialSync(): Promise<void> {
  setStatus('loading');
  try {
    const cloud = await fetchCloud();
    const initialized = localStorage.getItem(INIT_FLAG) === '1';
    const localHas = hasLocalSchedule();
    const cloudHas = hasAnySchedule(cloud.schedule) || (Array.isArray(cloud.doctors) && cloud.doctors.length > 0);

    if (!initialized && localHas) {
      await pushToCloud();
    } else if (cloudHas) {
      applying = true;
      try {
        applyCloudData(cloud);
      } finally {
        applying = false;
      }
      setStatus('saved');
    } else if (localHas) {
      await pushToCloud();
    } else {
      setStatus('saved');
    }
    cloudReady = true;
    localStorage.setItem(INIT_FLAG, '1');
  } catch (e) {
    setStatus('error', (e as Error).message);
  }
}

function flush() {
  if (timer) {
    clearTimeout(timer);
    timer = undefined;
    pushToCloud().catch(() => {});
  }
}

/** Simpan otomatis ke spreadsheet setiap ada perubahan data (debounce). */
export function startAutoPush(): () => void {
  const onChange = () => {
    if (applying || !cloudReady) return;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      pushToCloud().catch(() => {});
    }, 800);
  };
  const onHide = () => {
    if (document.visibilityState === 'hidden') flush();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  document.addEventListener('visibilitychange', onHide);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    document.removeEventListener('visibilitychange', onHide);
  };
}
