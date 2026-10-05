import { useState, useEffect, useRef } from 'react';
import { AppSettings } from '../utils/types';
import { getSettings, saveSettings, getHolidaysByYear, saveHolidaysByYear, exportAllData, importAllData } from '../utils/storage';
import { Save, Trash2, Plus, X, Database, RotateCcw, Info, Download, Upload, Calendar, Copy, Check } from 'lucide-react';

export default function SettingTab() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [gasUrl, setGasUrl] = useState(settings.gasScriptUrl);
  const [saved, setSaved] = useState(false);
  const [holidayYear, setHolidayYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState<{ date: string; name: string }[]>([]);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayName, setNewHolidayName] = useState('');
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [cloneName, setCloneName] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHolidays(getHolidaysByYear(holidayYear));
  }, [holidayYear]);

  const handleSave = () => {
    const updated = { ...settings, gasScriptUrl: gasUrl, puskesmasName: settings.puskesmasName };
    setSettings(updated);
    saveSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddHoliday = () => {
    if (!newHolidayDate || !newHolidayName.trim()) return;
    const updated = [...holidays, { date: newHolidayDate, name: newHolidayName.trim() }].sort((a, b) => a.date.localeCompare(b.date));
    setHolidays(updated);
    saveHolidaysByYear(holidayYear, updated);
    setShowAddHoliday(false);
    setNewHolidayDate('');
    setNewHolidayName('');
  };

  const handleDeleteHoliday = (date: string) => {
    const updated = holidays.filter(h => h.date !== date);
    setHolidays(updated);
    saveHolidaysByYear(holidayYear, updated);
  };

  const handleExportData = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jadwal-rotasi-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    if (!importText.trim()) return;
    const success = importAllData(importText);
    if (success) {
      alert('Data berhasil diimport! Aplikasi akan reload.');
      window.location.reload();
    } else {
      alert('Gagal import data. Format file tidak valid.');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setImportText(text);
    };
    reader.readAsText(file);
  };

  const handleGenerateClone = () => {
    const data = exportAllData();
    // Create a clone package with the new name
    const cloneData = JSON.parse(data);
    if (cloneName.trim()) {
      cloneData.settings.puskesmasName = cloneName.trim();
    }
    cloneData.isClone = true;
    cloneData.cloneDate = new Date().toISOString();
    
    const blob = new Blob([JSON.stringify(cloneData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clone-${(cloneName || settings.puskesmasName).replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowCloneModal(false);
    setCloneName('');
  };

  const handleCopyCloneData = () => {
    const data = exportAllData();
    navigator.clipboard.writeText(data).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [showResetScheduleConfirm, setShowResetScheduleConfirm] = useState(false);
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);
  const [showResetColorConfirm, setShowResetColorConfirm] = useState(false);

  const handleResetData = () => {
    setShowResetScheduleConfirm(true);
  };

  const confirmResetSchedule = () => {
    localStorage.removeItem('puskesmas_schedule');
    setShowResetScheduleConfirm(false);
    alert('Data jadwal berhasil direset. Halaman akan di-reload.');
    window.location.reload();
  };

  const handleResetAll = () => {
    setShowResetAllConfirm(true);
  };

  const confirmResetAll = () => {
    localStorage.clear();
    setShowResetAllConfirm(false);
    alert('Semua data berhasil direset. Halaman akan di-reload.');
    window.location.reload();
  };

  const handleResetColor = () => {
    setShowResetColorConfirm(true);
  };

  const confirmResetColor = () => {
    localStorage.removeItem('puskesmas_doctors');
    setShowResetColorConfirm(false);
    alert('Warna dokter berhasil direset. Halaman akan di-reload.');
    window.location.reload();
  };

  return (
    <div className="p-4 space-y-4 overflow-auto h-full">
      <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Pengaturan
      </h2>

      {/* Puskesmas Name */}
      <div className="glass-card rounded-2xl p-3 space-y-2 holo-border-gradient">
        <h3 className="text-xs font-semibold text-purple-700 flex items-center gap-1.5">
          <Info size={12} /> Nama Puskesmas
        </h3>
        <input
          type="text"
          value={settings.puskesmasName}
          onChange={(e) => setSettings({ ...settings, puskesmasName: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-purple-200 text-sm text-gray-700"
        />
      </div>

      {/* Google Apps Script URL */}
      <div className="glass-card rounded-2xl p-3 space-y-2 holo-border-gradient">
        <h3 className="text-xs font-semibold text-purple-700 flex items-center gap-1.5">
          <Database size={12} /> Google Apps Script URL
        </h3>
        <p className="text-[10px] text-gray-500">
          URL Web App dari Google Apps Script untuk sinkronisasi ke Google Spreadsheet.
        </p>
        <input
          type="url"
          value={gasUrl}
          onChange={(e) => setGasUrl(e.target.value)}
          placeholder="https://script.google.com/macros/s/..."
          className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-purple-200 text-xs text-gray-700"
        />
        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Save size={12} /> Simpan Pengaturan
        </button>
        {saved && (
          <p className="text-[10px] text-green-600 text-center font-medium">✓ Pengaturan tersimpan</p>
        )}
      </div>

      {/* National Holidays per Year */}
      <div className="glass-card rounded-2xl p-3 space-y-2 holo-border-gradient">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-purple-700 flex items-center gap-1.5">
            <Calendar size={12} /> Hari Libur Nasional
          </h3>
          <button
            onClick={() => setShowAddHoliday(true)}
            className="p-1.5 rounded-lg bg-purple-50 border border-purple-200"
          >
            <Plus size={12} className="text-purple-600" />
          </button>
        </div>
        <p className="text-[9px] text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
          ✓ Otomatis sinkron dengan tab jadwal
        </p>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHolidayYear(holidayYear - 1)}
            className="p-1.5 rounded-lg bg-purple-50 border border-purple-200"
          >
            <span className="text-purple-600 text-xs font-bold">◀</span>
          </button>
          <div className="flex-1 text-center">
            <span className="text-sm font-bold text-purple-700">{holidayYear}</span>
          </div>
          <button
            onClick={() => setHolidayYear(holidayYear + 1)}
            className="p-1.5 rounded-lg bg-purple-50 border border-purple-200"
          >
            <span className="text-purple-600 text-xs font-bold">▶</span>
          </button>
        </div>

        <p className="text-[9px] text-gray-400">{holidays.length} hari libur terdaftar</p>

        <div className="max-h-36 overflow-auto space-y-1">
          {holidays.length === 0 ? (
            <p className="text-[10px] text-gray-400 text-center py-2">Belum ada data libur untuk tahun {holidayYear}</p>
          ) : (
            holidays.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex-1">
                  <span className="text-[10px] text-gray-400 font-mono">{h.date}</span>
                  <span className="text-[10px] text-gray-700 ml-2">{h.name}</span>
                </div>
                <button onClick={() => handleDeleteHoliday(h.date)} className="text-gray-400 hover:text-red-500 p-0.5">
                  <X size={10} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Clone App */}
      <div className="glass-card rounded-2xl p-3 space-y-2 holo-border-gradient">
        <h3 className="text-xs font-semibold text-purple-700 flex items-center gap-1.5">
          <Copy size={12} /> Clone / Backup Aplikasi
        </h3>
        <p className="text-[10px] text-gray-500">
          Export data untuk dipindahkan ke angkatan ISIP selanjutnya atau sebagai backup.
        </p>
        <div className="space-y-2">
          <button
            onClick={handleExportData}
            className="w-full py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Download size={12} /> Export Data (JSON)
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="w-full py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Upload size={12} /> Import Data
          </button>
          <button
            onClick={() => setShowCloneModal(true)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Copy size={12} /> Clone untuk Angkatan Baru
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card rounded-2xl p-3 space-y-2 holo-border-gradient">
        <h3 className="text-xs font-semibold text-purple-700">Manajemen Data</h3>
        <div className="space-y-2">
          <button
            onClick={handleResetColor}
            className="w-full py-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={12} /> Reset Warna Dokter
          </button>
          <button
            onClick={handleResetData}
            className="w-full py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={12} /> Reset Data Jadwal
          </button>
          <button
            onClick={handleResetAll}
            className="w-full py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Trash2 size={12} /> Reset Semua Data
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="glass-card rounded-2xl p-3 space-y-1 holo-border-gradient">
        <h3 className="text-xs font-semibold text-purple-700">Info Aplikasi</h3>
        <p className="text-[10px] text-gray-500">Jadwal Rotasi Dokter v1.0</p>
        <p className="text-[10px] text-gray-500">{settings.puskesmasName}</p>
        <p className="text-[10px] text-gray-400 mt-1">
          Data tersimpan di localStorage. Untuk sinkronisasi ke Google Spreadsheet, 
          deploy Google Apps Script dan masukkan URL-nya di atas.
        </p>
      </div>

      {/* Add Holiday Modal */}
      {showAddHoliday && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs holo-border-gradient">
            <h3 className="text-sm font-bold text-purple-700 mb-3">Tambah Hari Libur ({holidayYear})</h3>
            <input
              type="date"
              value={newHolidayDate}
              onChange={(e) => setNewHolidayDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-purple-200 text-sm text-gray-700 mb-2"
            />
            <input
              type="text"
              placeholder="Nama hari libur"
              value={newHolidayName}
              onChange={(e) => setNewHolidayName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-purple-200 text-sm text-gray-700 mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddHoliday}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-sm"
              >
                Tambah
              </button>
              <button
                onClick={() => setShowAddHoliday(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clone Modal */}
      {showCloneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs holo-border-gradient">
            <h3 className="text-sm font-bold text-purple-700 mb-2">Clone untuk Angkatan Baru</h3>
            <p className="text-[10px] text-gray-500 mb-3">
              Download file backup yang bisa diimport di perangkat lain. Dokter, jadwal, dan pengaturan akan ikut ter-clone.
            </p>
            <input
              type="text"
              placeholder="Nama puskesmas baru (opsional)"
              value={cloneName}
              onChange={(e) => setCloneName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-purple-200 text-sm text-gray-700 mb-3"
            />
            <div className="space-y-2">
              <button
                onClick={handleGenerateClone}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download size={12} /> Download Clone
              </button>
              <button
                onClick={handleCopyCloneData}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs flex items-center justify-center gap-1.5"
              >
                {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                {copied ? 'Tersalin!' : 'Copy ke Clipboard'}
              </button>
              <button
                onClick={() => setShowCloneModal(false)}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs holo-border-gradient">
            <h3 className="text-sm font-bold text-purple-700 mb-2">Import Data</h3>
            <p className="text-[10px] text-gray-500 mb-3">
              Pilih file JSON backup atau paste data langsung.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 rounded-xl bg-gray-50 border border-purple-200 text-gray-600 text-xs mb-2"
            >
              📁 Pilih File JSON
            </button>
            <textarea
              placeholder="Atau paste data JSON di sini..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-purple-200 text-xs text-gray-700 h-24 mb-3 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleImportData}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold shadow-sm"
              >
                Import
              </button>
              <button
                onClick={() => { setShowImportModal(false); setImportText(''); }}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Schedule Confirmation Modal */}
      {showResetScheduleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs holo-border-gradient">
            <h3 className="text-sm font-bold text-amber-700 mb-2">Reset Data Jadwal</h3>
            <p className="text-xs text-gray-600 mb-4">
              Hapus semua data jadwal? Data dokter dan pengaturan tetap dipertahankan.
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmResetSchedule}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-sm"
              >
                Ya, Reset
              </button>
              <button
                onClick={() => setShowResetScheduleConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset All Confirmation Modal */}
      {showResetAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs holo-border-gradient">
            <h3 className="text-sm font-bold text-red-600 mb-2">Reset Semua Data</h3>
            <p className="text-xs text-gray-600 mb-4">
              Hapus SEMUA data? Termasuk dokter, jadwal, pengaturan, dan hari libur. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmResetAll}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold shadow-sm"
              >
                Ya, Hapus Semua
              </button>
              <button
                onClick={() => setShowResetAllConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Color Confirmation Modal */}
      {showResetColorConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs holo-border-gradient">
            <h3 className="text-sm font-bold text-purple-700 mb-2">Reset Warna Dokter</h3>
            <p className="text-xs text-gray-600 mb-4">
              Reset warna semua dokter ke default? Data jadwal tetap dipertahankan.
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmResetColor}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-sm"
              >
                Ya, Reset
              </button>
              <button
                onClick={() => setShowResetColorConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
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
