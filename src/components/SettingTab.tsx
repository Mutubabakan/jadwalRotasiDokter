import { useState, useEffect } from 'react';
import { AppSettings, NationalHoliday } from '../utils/types';
import { getSettings, saveSettings, getDoctors, saveDoctors, defaultDoctors } from '../utils/storage';
import { Save, Trash2, Plus, X, Database, RotateCcw, Info } from 'lucide-react';

export default function SettingTab() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [gasUrl, setGasUrl] = useState(settings.gasScriptUrl);
  const [saved, setSaved] = useState(false);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayName, setNewHolidayName] = useState('');

  const handleSave = () => {
    const updated = { ...settings, gasScriptUrl: gasUrl };
    setSettings(updated);
    saveSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddHoliday = () => {
    if (!newHolidayDate || !newHolidayName.trim()) return;
    const updated = {
      ...settings,
      nationalHolidays: [...settings.nationalHolidays, { date: newHolidayDate, name: newHolidayName.trim() }].sort((a, b) => a.date.localeCompare(b.date)),
    };
    setSettings(updated);
    saveSettings(updated);
    setShowAddHoliday(false);
    setNewHolidayDate('');
    setNewHolidayName('');
  };

  const handleDeleteHoliday = (date: string) => {
    const updated = {
      ...settings,
      nationalHolidays: settings.nationalHolidays.filter(h => h.date !== date),
    };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleResetData = () => {
    if (confirm('Reset semua data jadwal? Data dokter dan pengaturan tetap dipertahankan.')) {
      localStorage.removeItem('puskesmas_schedule');
      alert('Data jadwal berhasil direset.');
    }
  };

  const handleResetAll = () => {
    if (confirm('Reset SEMUA data? Termasuk dokter, jadwal, dan pengaturan.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
        Pengaturan
      </h2>

      {/* Puskesmas Name */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <h3 className="text-xs font-semibold text-purple-300 flex items-center gap-1">
          <Info size={12} /> Informasi Puskesmas
        </h3>
        <input
          type="text"
          value={settings.puskesmasName}
          onChange={(e) => setSettings({ ...settings, puskesmasName: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-holo-dark border border-purple-700/50 text-sm text-white"
        />
      </div>

      {/* Google Apps Script URL */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <h3 className="text-xs font-semibold text-purple-300 flex items-center gap-1">
          <Database size={12} /> Google Apps Script URL
        </h3>
        <p className="text-[10px] text-gray-400">
          Masukkan URL Web App dari Google Apps Script untuk sinkronisasi data ke Google Spreadsheet.
        </p>
        <input
          type="url"
          value={gasUrl}
          onChange={(e) => setGasUrl(e.target.value)}
          placeholder="https://script.google.com/macros/s/..."
          className="w-full px-3 py-2 rounded-lg bg-holo-dark border border-purple-700/50 text-xs text-white"
        />
        <button
          onClick={handleSave}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
        >
          <Save size={12} /> Simpan Pengaturan
        </button>
        {saved && (
          <p className="text-[10px] text-green-400 text-center">✓ Pengaturan tersimpan</p>
        )}
      </div>

      {/* National Holidays */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-purple-300">Hari Libur Nasional</h3>
          <button
            onClick={() => setShowAddHoliday(true)}
            className="p-1.5 rounded-lg bg-purple-900/40"
          >
            <Plus size={12} className="text-purple-400" />
          </button>
        </div>
        <div className="max-h-40 overflow-auto space-y-1">
          {settings.nationalHolidays.map((h, idx) => (
            <div key={idx} className="flex items-center justify-between py-1 px-2 rounded bg-holo-dark/50">
              <div>
                <span className="text-[10px] text-gray-400">{h.date}</span>
                <span className="text-[10px] text-gray-300 ml-2">{h.name}</span>
              </div>
              <button onClick={() => handleDeleteHoliday(h.date)} className="text-red-400/60 hover:text-red-400">
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card rounded-xl p-3 space-y-2">
        <h3 className="text-xs font-semibold text-purple-300">Manajemen Data</h3>
        <div className="space-y-2">
          <button
            onClick={handleResetData}
            className="w-full py-2 rounded-lg bg-yellow-900/30 border border-yellow-700/50 text-yellow-300 text-xs font-semibold flex items-center justify-center gap-1"
          >
            <RotateCcw size={12} /> Reset Data Jadwal
          </button>
          <button
            onClick={handleResetAll}
            className="w-full py-2 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300 text-xs font-semibold flex items-center justify-center gap-1"
          >
            <Trash2 size={12} /> Reset Semua Data
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="glass-card rounded-xl p-3 space-y-1">
        <h3 className="text-xs font-semibold text-purple-300">Info Aplikasi</h3>
        <p className="text-[10px] text-gray-400">Jadwal Rotasi Dokter v1.0</p>
        <p className="text-[10px] text-gray-400">Puskesmas Babakan</p>
        <p className="text-[10px] text-gray-500 mt-1">
          Data tersimpan di localStorage. Untuk sinkronisasi ke Google Spreadsheet, 
          deploy Google Apps Script dan masukkan URL-nya di atas.
        </p>
      </div>

      {/* Add Holiday Modal */}
      {showAddHoliday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-card rounded-xl p-4 w-full max-w-xs">
            <h3 className="text-sm font-bold text-purple-300 mb-3">Tambah Hari Libur</h3>
            <input
              type="date"
              value={newHolidayDate}
              onChange={(e) => setNewHolidayDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-holo-dark border border-purple-700/50 text-sm text-white mb-2"
            />
            <input
              type="text"
              placeholder="Nama hari libur"
              value={newHolidayName}
              onChange={(e) => setNewHolidayName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-holo-dark border border-purple-700/50 text-sm text-white mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddHoliday}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold"
              >
                Tambah
              </button>
              <button
                onClick={() => setShowAddHoliday(false)}
                className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
