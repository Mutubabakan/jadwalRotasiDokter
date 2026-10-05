import { useState, useEffect, useCallback, useRef } from 'react';
import { Doctor, ScheduleEntry, KetEntry } from '../utils/types';
import { getDoctors, getSettings, getMonthSchedule, saveMonthSchedule, isHoliday, getHolidayName } from '../utils/storage';
import { ChevronLeft, ChevronRight, Plus, X, Check } from 'lucide-react';

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function JadwalTab() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showKetModal, setShowKetModal] = useState<{ date: string } | null>(null);
  const [showHolidayModal, setShowHolidayModal] = useState<{ date: string } | null>(null);
  const [holidayName, setHolidayName] = useState('');
  const [showStatusModal, setShowStatusModal] = useState<{ date: string; doctorId: string } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'izin' | 'sakit' | 'tugas'>('izin');
  const [tugasLabel, setTugasLabel] = useState('');
  const [showCellMenu, setShowCellMenu] = useState<{ date: string; field: string } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const settings = getSettings();

  useEffect(() => {
    setDoctors(getDoctors());
  }, []);

  useEffect(() => {
    loadEntries();
  }, [year, month]);

  const loadEntries = () => {
    const data = getMonthSchedule(year, month);
    if (data.length === 0) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const newEntries: ScheduleEntry[] = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        newEntries.push({ date: dateStr, ket: [] });
      }
      setEntries(newEntries);
    } else {
      setEntries(data);
    }
  };

  const persistEntries = useCallback((newEntries: ScheduleEntry[]) => {
    setEntries(newEntries);
    saveMonthSchedule(year, month, newEntries);
  }, [year, month]);

  // Tap-based: select doctor, then tap cell to place
  const handleDoctorSelect = (doctor: Doctor) => {
    if (selectedDoctor?.id === doctor.id) {
      setSelectedDoctor(null);
    } else {
      setSelectedDoctor(doctor);
    }
  };

  const handleCellTap = (date: string, field: string) => {
    const entry = entries.find(e => e.date === date);
    const currentValue = (entry as any)?.[field];

    if (selectedDoctor) {
      // Place selected doctor in cell
      const newEntries = entries.map(e => {
        if (e.date === date) {
          return { ...e, [field]: selectedDoctor.id };
        }
        return e;
      });
      persistEntries(newEntries);
      setSelectedDoctor(null);
    } else if (currentValue) {
      // Show menu to remove or change
      setShowCellMenu({ date, field });
    }
  };

  const handleClearCell = () => {
    if (!showCellMenu) return;
    const { date, field } = showCellMenu;
    const newEntries = entries.map(e => {
      if (e.date === date) {
        return { ...e, [field]: undefined };
      }
      return e;
    });
    persistEntries(newEntries);
    setShowCellMenu(null);
  };

  const handleKetTap = (date: string) => {
    setShowKetModal({ date });
  };

  const handleRemoveKetEntry = (date: string, index: number) => {
    const newEntries = entries.map(e => {
      if (e.date === date) {
        const newKet = [...e.ket];
        newKet.splice(index, 1);
        return { ...e, ket: newKet };
      }
      return e;
    });
    persistEntries(newEntries);
  };

  const handleAddHoliday = () => {
    if (!showHolidayModal || !holidayName.trim()) return;
    const { date } = showHolidayModal;

    const newEntries = entries.map(e => {
      if (e.date === date) {
        return { ...e, ket: [...e.ket, { type: 'holiday' as const, label: holidayName.trim() }] };
      }
      return e;
    });
    persistEntries(newEntries);
    setShowHolidayModal(null);
    setHolidayName('');
  };

  const handleAddDoctorToKet = (doctorId: string) => {
    if (!showKetModal) return;
    setShowStatusModal({ date: showKetModal.date, doctorId });
    setSelectedStatus('izin');
    setTugasLabel('');
    setShowKetModal(null);
  };

  const confirmStatus = () => {
    if (!showStatusModal) return;
    const { date, doctorId } = showStatusModal;
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    const ketEntry: KetEntry = {
      type: 'doctor',
      label: doctor.name,
      doctorId: doctor.id,
      status: selectedStatus,
      tugasLabel: selectedStatus === 'tugas' ? tugasLabel : undefined,
    };

    const newEntries = entries.map(e => {
      if (e.date === date) {
        return { ...e, ket: [...e.ket, ketEntry] };
      }
      return e;
    });
    persistEntries(newEntries);
    setShowStatusModal(null);
  };

  const getDoctorStatus = (date: string, doctorId: string): { status: string; tugasLabel?: string } | null => {
    const entry = entries.find(e => e.date === date);
    if (!entry) return null;
    const ketDoctor = entry.ket.find(k => k.doctorId === doctorId);
    if (ketDoctor) return { status: ketDoctor.status || '', tugasLabel: ketDoctor.tugasLabel };
    return null;
  };

  const getDoctorDisplayColor = (doctorId: string, date: string): string => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return '#fff';
    const status = getDoctorStatus(date, doctorId);
    if (status) {
      if (status.status === 'sakit') return '#ff4444';
      if (status.status === 'izin') return '#ffdd00';
      if (status.status === 'tugas') return '#44ff44';
    }
    return doctor.color;
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDoctorStatusBadge = (date: string, doctorId: string) => {
    const status = getDoctorStatus(date, doctorId);
    if (!status) return null;
    const colors: Record<string, string> = {
      sakit: 'bg-red-500/40 text-red-200',
      izin: 'bg-yellow-500/40 text-yellow-200',
      tugas: 'bg-green-500/40 text-green-200',
    };
    const labels: Record<string, string> = {
      sakit: 'S',
      izin: 'I',
      tugas: 'T',
    };
    return (
      <span className={`text-[7px] px-0.5 rounded font-bold ${colors[status.status]}`} title={status.status === 'tugas' ? status.tugasLabel : status.status}>
        {labels[status.status]}
      </span>
    );
  };

  const renderDoctorCell = (date: string, field: string, doctorId?: string) => {
    const doctor = doctorId ? doctors.find(d => d.id === doctorId) : null;
    return (
      <td
        className={`schedule-cell border border-holo-border/50 px-0.5 py-1 text-center cursor-pointer relative ${
          selectedDoctor ? 'hover:bg-purple-900/20' : ''
        }`}
        onClick={() => handleCellTap(date, field)}
      >
        {doctor ? (
          <div className="flex flex-col items-center gap-0.5">
            <span
              className="font-bold text-[10px] leading-tight"
              style={{
                color: getDoctorDisplayColor(doctorId!, date),
                textShadow: `0 0 4px ${getDoctorDisplayColor(doctorId!, date)}60`,
              }}
            >
              {doctor.name.replace('dr. ', '')}
            </span>
            {getDoctorStatusBadge(date, doctorId!)}
          </div>
        ) : selectedDoctor ? (
          <span className="text-[8px] text-purple-500/50">tap</span>
        ) : null}
      </td>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Month Selector */}
      <div className="flex items-center justify-between px-3 py-2 mx-2 mt-2 rounded-lg bg-gradient-to-r from-purple-900/30 via-holo-card to-pink-900/30 border border-purple-700/30">
        <button onClick={prevMonth} className="p-2 rounded-lg bg-purple-900/40 active:bg-purple-700/60 transition-colors">
          <ChevronLeft size={18} className="text-purple-300" />
        </button>
        <div className="text-center">
          <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            {MONTHS_ID[month]} {year}
          </div>
        </div>
        <button onClick={nextMonth} className="p-2 rounded-lg bg-purple-900/40 active:bg-purple-700/60 transition-colors">
          <ChevronRight size={18} className="text-purple-300" />
        </button>
      </div>

      {/* Selected Doctor Indicator */}
      {selectedDoctor && (
        <div className="mx-2 mt-1 px-3 py-1.5 rounded-lg flex items-center justify-between"
          style={{ background: `${selectedDoctor.color}15`, border: `1px solid ${selectedDoctor.color}40` }}>
          <span className="text-[10px]" style={{ color: selectedDoctor.color }}>
            ✦ {selectedDoctor.name} dipilih — tap sel untuk menempatkan
          </span>
          <button onClick={() => setSelectedDoctor(null)} className="p-0.5">
            <X size={12} style={{ color: selectedDoctor.color }} />
          </button>
        </div>
      )}

      {/* Doctor Chips - Selectable */}
      <div className="px-2 py-2">
        <div className="flex flex-wrap gap-1.5">
          {doctors.map(doctor => (
            <div
              key={doctor.id}
              onClick={() => handleDoctorSelect(doctor)}
              className={`doctor-chip px-2.5 py-1.5 rounded-full text-[11px] font-semibold border-2 transition-all ${
                selectedDoctor?.id === doctor.id ? 'scale-110 ring-2 ring-white/30' : ''
              }`}
              style={{
                borderColor: selectedDoctor?.id === doctor.id ? '#fff' : doctor.color,
                color: doctor.color,
                boxShadow: selectedDoctor?.id === doctor.id
                  ? `0 0 15px ${doctor.color}80, inset 0 0 10px ${doctor.color}30`
                  : `0 0 8px ${doctor.color}30`,
                background: selectedDoctor?.id === doctor.id ? `${doctor.color}25` : `${doctor.color}10`,
              }}
            >
              {doctor.name}
              {doctor.isBackup && <span className="text-[8px] ml-1 opacity-60">(CDT)</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Table */}
      <div ref={tableRef} className="flex-1 overflow-auto px-1 pb-2">
        <table className="w-full text-[10px] border-collapse table-fixed">
          <thead>
            <tr className="sticky top-0 z-10">
              <th className="bg-holo-card/95 backdrop-blur-sm px-0.5 py-1.5 text-purple-300 border border-holo-border/50 w-[18%]">
                <div className="text-[9px]">Hari</div>
                <div className="text-[8px] text-purple-400/70">Tgl</div>
              </th>
              <th className="bg-holo-card/95 backdrop-blur-sm px-0.5 py-1.5 text-cyan-300 border border-holo-border/50 w-[15%]">
                <div className="text-[9px] font-bold">K3a</div>
              </th>
              <th className="bg-holo-card/95 backdrop-blur-sm px-0.5 py-1.5 text-cyan-300 border border-holo-border/50 w-[15%]">
                <div className="text-[9px] font-bold">K3b</div>
              </th>
              <th className="bg-holo-card/95 backdrop-blur-sm px-0.5 py-1.5 text-pink-300 border border-holo-border/50 w-[15%]">
                <div className="text-[9px] font-bold">IGD</div>
              </th>
              <th className="bg-holo-card/95 backdrop-blur-sm px-0.5 py-1.5 text-green-300 border border-holo-border/50 w-[15%]">
                <div className="text-[9px] font-bold">K2</div>
              </th>
              <th className="bg-holo-card/95 backdrop-blur-sm px-0.5 py-1.5 text-yellow-300 border border-holo-border/50 w-[22%]">
                <div className="text-[9px] font-bold">Ket</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const dateObj = new Date(entry.date + 'T00:00:00');
              const dayName = DAYS_ID[dateObj.getDay()];
              const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
              const holiday = isHoliday(entry.date, settings);
              const natHolidayName = getHolidayName(entry.date, settings);
              const manualHolidays = entry.ket.filter(k => k.type === 'holiday');
              const isHolidayRow = holiday || manualHolidays.length > 0;

              return (
                <tr key={entry.date} className={isHolidayRow ? 'holiday-row' : 'hover:bg-white/[0.02]'}>
                  {/* Date Column */}
                  <td className={`border border-holo-border/50 px-0.5 py-1 text-center ${isHolidayRow ? 'bg-red-900/10' : ''}`}>
                    <div className={`font-bold text-[10px] ${isHolidayRow ? 'text-red-400' : 'text-gray-300'}`}>
                      {dayName}
                    </div>
                    <div className={`text-[9px] ${isHolidayRow ? 'text-red-300/80' : 'text-gray-500'}`}>
                      {dateStr}
                    </div>
                    {natHolidayName && (
                      <div className="text-[7px] text-red-400/80 truncate leading-tight mt-0.5">{natHolidayName}</div>
                    )}
                  </td>

                  {/* K3a, K3b, IGD, K2 */}
                  {renderDoctorCell(entry.date, 'k3a', entry.k3a)}
                  {renderDoctorCell(entry.date, 'k3b', entry.k3b)}
                  {renderDoctorCell(entry.date, 'igd', entry.igd)}
                  {renderDoctorCell(entry.date, 'k2', entry.k2)}

                  {/* Ket Column */}
                  <td
                    className="schedule-cell border border-holo-border/50 px-0.5 py-1 cursor-pointer"
                    onClick={() => handleKetTap(entry.date)}
                  >
                    <div className="flex flex-col gap-0.5">
                      {entry.ket.map((k, idx) => (
                        <div key={idx} className="flex items-center gap-0.5">
                          {k.type === 'holiday' ? (
                            <span className="text-[8px] text-red-400 truncate flex-1">
                              🔴 {k.label}
                            </span>
                          ) : (
                            <span
                              className="text-[8px] font-semibold truncate flex-1"
                              style={{
                                color: k.status === 'sakit' ? '#ff4444' : k.status === 'izin' ? '#ffdd00' : '#44ff44'
                              }}
                            >
                              {k.label.replace('dr. ', '')}
                              <span className="text-[7px] opacity-70">
                                {k.status === 'tugas' ? ` (${k.tugasLabel || 'Tugas'})` : ` (${k.status})`}
                              </span>
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveKetEntry(entry.date, idx); }}
                            className="text-gray-600 hover:text-red-400 shrink-0"
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                      <div className="text-[7px] text-purple-500/50 text-center">
                        {entry.ket.length === 0 && '+ tap'}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cell Menu Modal */}
      {showCellMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCellMenu(null)}>
          <div className="glass-card rounded-xl p-4 w-full max-w-xs" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-purple-300 mb-3">Opsi Sel</h3>
            <div className="space-y-2">
              <button
                onClick={handleClearCell}
                className="w-full py-2 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300 text-xs font-semibold"
              >
                Hapus Dokter
              </button>
              <button
                onClick={() => setShowCellMenu(null)}
                className="w-full py-2 rounded-lg bg-gray-700 text-gray-300 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ket Modal */}
      {showKetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowKetModal(null)}>
          <div className="glass-card rounded-xl p-4 w-full max-w-xs max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-yellow-300 mb-3">Keterangan</h3>
            
            <div className="space-y-2 mb-3">
              <p className="text-[10px] text-gray-400">Tambah hari libur:</p>
              <button
                onClick={() => { setShowHolidayModal({ date: showKetModal.date }); setShowKetModal(null); }}
                className="w-full py-2 rounded-lg bg-red-900/20 border border-red-700/40 text-red-300 text-xs flex items-center justify-center gap-1"
              >
                <Plus size={12} /> Hari Libur
              </button>
            </div>

            <div className="border-t border-holo-border/50 pt-2">
              <p className="text-[10px] text-gray-400 mb-2">Tambah status dokter:</p>
              <div className="space-y-1">
                {doctors.map(doctor => (
                  <button
                    key={doctor.id}
                    onClick={() => handleAddDoctorToKet(doctor.id)}
                    className="w-full py-1.5 px-2 rounded-lg text-left text-xs flex items-center gap-2 transition-colors hover:bg-white/5"
                    style={{ color: doctor.color }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: doctor.color }} />
                    {doctor.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowKetModal(null)}
              className="w-full mt-3 py-2 rounded-lg bg-gray-700 text-gray-300 text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-card rounded-xl p-4 w-full max-w-xs">
            <h3 className="text-sm font-bold text-purple-300 mb-3">Status Dokter</h3>
            <p className="text-xs text-gray-300 mb-3">
              {doctors.find(d => d.id === showStatusModal.doctorId)?.name}
            </p>
            <div className="space-y-2 mb-4">
              {(['izin', 'sakit', 'tugas'] as const).map(status => (
                <label key={status} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedStatus === status ? 'bg-white/5' : ''
                }`}>
                  <input
                    type="radio"
                    name="status"
                    checked={selectedStatus === status}
                    onChange={() => setSelectedStatus(status)}
                    className="accent-purple-500"
                  />
                  <span className="text-xs font-semibold capitalize" style={{
                    color: status === 'sakit' ? '#ff4444' : status === 'izin' ? '#ffdd00' : '#44ff44'
                  }}>
                    {status === 'sakit' ? '🤒 Sakit' : status === 'izin' ? '📋 Izin' : '🏥 Tugas Luar'}
                  </span>
                </label>
              ))}
            </div>
            {selectedStatus === 'tugas' && (
              <input
                type="text"
                placeholder="Jenis tugas (P3K, CKG, Penyuluhan...)"
                value={tugasLabel}
                onChange={(e) => setTugasLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-holo-dark border border-green-700/50 text-xs text-white mb-3"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={confirmStatus}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold flex items-center justify-center gap-1"
              >
                <Check size={12} /> Simpan
              </button>
              <button
                onClick={() => setShowStatusModal(null)}
                className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Holiday Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-card rounded-xl p-4 w-full max-w-xs">
            <h3 className="text-sm font-bold text-red-300 mb-3">Tambah Hari Libur</h3>
            <input
              type="text"
              placeholder="Nama hari libur..."
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-holo-dark border border-red-700/50 text-xs text-white mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddHoliday}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-semibold"
              >
                Simpan
              </button>
              <button
                onClick={() => { setShowHolidayModal(null); setHolidayName(''); }}
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
