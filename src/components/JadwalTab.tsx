import { useState, useEffect, useCallback } from 'react';
import { Doctor, ScheduleEntry, KetEntry } from '../utils/types';
import { getDoctors, getMonthSchedule, saveMonthSchedule, isHoliday, getHolidayName } from '../utils/storage';
import { ChevronLeft, ChevronRight, Plus, X, Check, MoreVertical, Wand2, Copy, Trash2 } from 'lucide-react';

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
  const [showActionMenu, setShowActionMenu] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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

  // === PLACEMENT LOGIC ===
  const placeDoctor = (date: string, field: string, doctorId: string) => {
    const newEntries = entries.map(e => {
      if (e.date === date) {
        return { ...e, [field]: doctorId };
      }
      return e;
    });
    persistEntries(newEntries);
  };

  // === HTML5 DRAG & DROP (Desktop) ===
  const handleDragStart = (e: React.DragEvent, doctor: Doctor) => {
    e.dataTransfer.setData('text/plain', doctor.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drop-target');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drop-target');
  };

  const handleDrop = (e: React.DragEvent, date: string, field: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-target');
    
    const doctorId = e.dataTransfer.getData('text/plain');
    if (doctorId) {
      if (field === 'ket') {
        setShowStatusModal({ date, doctorId });
        setSelectedStatus('izin');
        setTugasLabel('');
      } else {
        placeDoctor(date, field, doctorId);
      }
    }
  };

  // === TAP-BASED PLACEMENT (Mobile fallback) ===
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
      placeDoctor(date, field, selectedDoctor.id);
      setSelectedDoctor(null);
    } else if (currentValue) {
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



  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // === AUTO JADWAL ===
  const handleAutoJadwal = () => {
    // Cari hari pertama yang sudah diisi manual sebagai referensi
    const firstFilledEntry = entries.find(e => e.k3a || e.k3b || e.igd || e.k2);
    if (!firstFilledEntry) {
      alert('Isi minimal satu hari terlebih dahulu sebagai referensi rotasi.');
      return;
    }

    const fields = ['k3a', 'k3b', 'igd', 'k2'];
    const activeDoctors = doctors.filter(d => !d.isBackup);
    
    // Tentukan posisi awal dokter dari hari referensi
    const referenceDate = new Date(firstFilledEntry.date + 'T00:00:00');
    const referenceWeek = Math.floor((referenceDate.getDate() - 1) / 7);
    
    // Buat mapping dokter ke posisi awal
    const doctorPositions: { [doctorId: string]: number } = {};
    
    // Cek posisi dokter di hari referensi
    fields.forEach((field, posIdx) => {
      const doctorId = (firstFilledEntry as any)[field];
      if (doctorId) {
        doctorPositions[doctorId] = posIdx;
      }
    });
    
    // Isi dokter yang belum ada posisi dengan rotasi
    let nextPos = 0;
    activeDoctors.forEach(doctor => {
      if (!(doctor.id in doctorPositions)) {
        while (fields[nextPos] && Object.values(doctorPositions).includes(nextPos)) {
          nextPos++;
        }
        if (nextPos < fields.length) {
          doctorPositions[doctor.id] = nextPos;
          nextPos++;
        }
      }
    });

    // Generate jadwal untuk semua hari
    const newEntries = entries.map(entry => {
      const dateObj = new Date(entry.date + 'T00:00:00');
      const dayOfWeek = dateObj.getDay();
      
      // Skip Minggu dan hari libur
      if (dayOfWeek === 0 || isHoliday(entry.date)) {
        return entry;
      }

      // Hitung minggu ke berapa (dari hari referensi)
      const daysDiff = Math.floor((dateObj.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
      const weekOffset = Math.floor(daysDiff / 7);
      
      // Buat entry baru dengan rotasi
      const newEntry = { ...entry, ket: [...entry.ket] };
      
      // Clear fields dulu (kecuali yang sudah diisi manual di hari referensi)
      if (entry.date !== firstFilledEntry.date) {
        fields.forEach(field => {
          (newEntry as any)[field] = undefined;
        });
      }
      
      // Isi dengan rotasi
      activeDoctors.forEach(doctor => {
        if (doctor.id in doctorPositions) {
          const basePos = doctorPositions[doctor.id];
          const rotatedPos = (basePos + weekOffset) % fields.length;
          const field = fields[rotatedPos];
          
          // Hanya isi jika field belum terisi
          if (!(newEntry as any)[field]) {
            (newEntry as any)[field] = doctor.id;
          }
        }
      });
      
      return newEntry;
    });

    persistEntries(newEntries);
    setShowActionMenu(false);
    alert('Jadwal otomatis berhasil dibuat!');
  };

  // === AUTO UPDATE DARI BULAN SEBELUMNYA ===
  const handleAutoUpdatePrevMonth = () => {
    const prevMonthDate = new Date(year, month - 1, 1);
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth();
    const prevEntries = getMonthSchedule(prevYear, prevMonth);
    
    if (prevEntries.length === 0) {
      alert('Tidak ada data jadwal di bulan sebelumnya.');
      return;
    }

    // Copy jadwal dari bulan sebelumnya, sesuaikan tanggal
    const newEntries = entries.map(entry => {
      const dateObj = new Date(entry.date + 'T00:00:00');
      const day = dateObj.getDate();
      
      // Cari entry yang sama di bulan sebelumnya (tanggal sama)
      const prevDateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const prevEntry = prevEntries.find(e => e.date === prevDateStr);
      
      if (prevEntry) {
        // Copy data dari bulan sebelumnya
        return {
          ...entry,
          k3a: prevEntry.k3a,
          k3b: prevEntry.k3b,
          igd: prevEntry.igd,
          k2: prevEntry.k2,
          ket: [...prevEntry.ket],
        };
      }
      
      return entry;
    });

    persistEntries(newEntries);
    setShowActionMenu(false);
    alert('Jadwal berhasil diupdate dari bulan sebelumnya!');
  };

  // === BERSIHKAN LAYAR ===
  const handleClearAll = () => {
    if (!confirm('Hapus semua nama dokter di halaman ini?')) {
      return;
    }

    const newEntries = entries.map(entry => ({
      ...entry,
      k3a: undefined,
      k3b: undefined,
      igd: undefined,
      k2: undefined,
    }));

    persistEntries(newEntries);
    setShowActionMenu(false);
  };

  const getDoctorStatusBadge = (date: string, doctorId: string) => {
    const status = getDoctorStatus(date, doctorId);
    if (!status) return null;
    const colors: Record<string, string> = {
      sakit: 'bg-red-100 text-red-800 border-red-300',
      izin: 'bg-amber-100 text-amber-800 border-amber-300',
      tugas: 'bg-green-100 text-green-800 border-green-300',
    };
    const labels: Record<string, string> = {
      sakit: 'S',
      izin: 'I',
      tugas: 'T',
    };
    return (
      <span className={`text-[7px] px-0.5 rounded border font-bold ${colors[status.status]}`} title={status.status === 'tugas' ? status.tugasLabel : status.status}>
        {labels[status.status]}
      </span>
    );
  };

  const renderDoctorCell = (date: string, field: string, doctorId?: string) => {
    const doctor = doctorId ? doctors.find(d => d.id === doctorId) : null;
    const status = doctorId ? getDoctorStatus(date, doctorId) : null;
    
    // Determine cell background based on status
    let cellBgClass = 'bg-white/60';
    if (status) {
      if (status.status === 'sakit') cellBgClass = 'bg-red-100/80';
      else if (status.status === 'izin') cellBgClass = 'bg-amber-100/80';
      else if (status.status === 'tugas') cellBgClass = 'bg-green-100/80';
    }
    
    return (
      <td
        className={`schedule-cell border border-purple-200/60 px-0.5 py-1.5 text-center cursor-pointer relative ${cellBgClass} hover:bg-purple-50/50 transition-colors`}
        onClick={() => handleCellTap(date, field)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, date, field)}
      >
        {doctor ? (
          <div
            className="flex flex-col items-center gap-0.5"
            draggable
            onDragStart={(e) => handleDragStart(e, doctor)}
          >
            <span
              className="font-bold text-[10px] leading-tight px-1 py-0.5 rounded"
              style={{
                color: doctor.color,
              }}
            >
              {doctor.name.replace('dr. ', '')}
            </span>
            {getDoctorStatusBadge(date, doctorId!)}
          </div>
        ) : selectedDoctor ? (
          <span className="text-[8px] text-purple-500 font-medium">tap</span>
        ) : null}
      </td>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Month Selector */}
      <div className="flex items-center justify-between px-3 py-2 mx-2 mt-2 rounded-xl bg-white/80 backdrop-blur border border-purple-200/50 shadow-sm">
        <button onClick={prevMonth} className="p-2 rounded-lg bg-purple-100/60 active:bg-purple-200 transition-colors">
          <ChevronLeft size={18} className="text-purple-600" />
        </button>
        <div className="text-center">
          <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            {MONTHS_ID[month]} {year}
          </div>
        </div>
        <button onClick={nextMonth} className="p-2 rounded-lg bg-purple-100/60 active:bg-purple-200 transition-colors">
          <ChevronRight size={18} className="text-purple-600" />
        </button>
      </div>

      {/* Selected Doctor Indicator */}
      {selectedDoctor && (
        <div className="mx-2 mt-1 px-3 py-1.5 rounded-lg flex items-center justify-between bg-white/80 border"
          style={{ borderColor: selectedDoctor.color + '60' }}>
          <span className="text-[10px] font-medium" style={{ color: selectedDoctor.color }}>
            ✦ {selectedDoctor.name} dipilih — tap sel untuk menempatkan
          </span>
          <button onClick={() => setSelectedDoctor(null)} className="p-0.5">
            <X size={12} style={{ color: selectedDoctor.color }} />
          </button>
        </div>
      )}

      {/* Doctor Chips - Draggable + Selectable */}
      <div className="px-2 py-2">
        <div className="flex flex-wrap gap-1.5">
          {doctors.map(doctor => (
            <div
              key={doctor.id}
              draggable
              onDragStart={(e) => handleDragStart(e, doctor)}
              onClick={() => handleDoctorSelect(doctor)}
              className={`doctor-chip px-2.5 py-1.5 rounded-full text-[11px] font-bold border-2 ${
                selectedDoctor?.id === doctor.id ? 'selected' : ''
              }`}
              style={{
                borderColor: selectedDoctor?.id === doctor.id ? '#9b59b6' : doctor.color,
                color: doctor.color,
                boxShadow: selectedDoctor?.id === doctor.id
                  ? `0 0 12px ${doctor.color}50, 0 2px 8px rgba(155,89,182,0.2)`
                  : `0 1px 4px ${doctor.color}30`,
                background: selectedDoctor?.id === doctor.id ? `${doctor.color}20` : 'white',
              }}
            >
              {doctor.name}
              {doctor.isBackup && <span className="text-[8px] ml-1 opacity-70">(CDT)</span>}
            </div>
          ))}
        </div>
        <p className="text-[9px] text-gray-500 mt-1 px-1">
          💡 Desktop: Drag dokter ke tabel. Mobile: Tap dokter, lalu tap sel tujuan.
        </p>
      </div>

      {/* Schedule Table */}
      <div className="flex-1 overflow-auto px-1 pb-2">
        <table className="w-full text-[10px] border-collapse table-fixed">
          <thead>
            <tr className="sticky top-0 z-10">
              <th className="bg-white/95 backdrop-blur-sm px-0.5 py-1.5 text-purple-700 border border-purple-200/60 w-[18%]">
                <div className="text-[9px]">Hari</div>
                <div className="text-[8px] text-purple-400">Tgl</div>
              </th>
              <th className="bg-white/95 backdrop-blur-sm px-0.5 py-1.5 text-cyan-700 border border-purple-200/60 w-[15%]">
                <div className="text-[9px] font-bold">K3a</div>
              </th>
              <th className="bg-white/95 backdrop-blur-sm px-0.5 py-1.5 text-cyan-700 border border-purple-200/60 w-[15%]">
                <div className="text-[9px] font-bold">K3b</div>
              </th>
              <th className="bg-white/95 backdrop-blur-sm px-0.5 py-1.5 text-pink-700 border border-purple-200/60 w-[14%]">
                <div className="text-[9px] font-bold">IGD</div>
              </th>
              <th className="bg-white/95 backdrop-blur-sm px-0.5 py-1.5 text-green-700 border border-purple-200/60 w-[14%]">
                <div className="text-[9px] font-bold">K2</div>
              </th>
              <th className="bg-white/95 backdrop-blur-sm px-0.5 py-1.5 text-amber-700 border border-purple-200/60 w-[24%]">
                <div className="text-[9px] font-bold">Ket</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const dateObj = new Date(entry.date + 'T00:00:00');
              const dayName = DAYS_ID[dateObj.getDay()];
              const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
              const holiday = isHoliday(entry.date);
              const natHolidayName = getHolidayName(entry.date);
              const manualHolidays = entry.ket.filter(k => k.type === 'holiday');
              const isHolidayRow = holiday || manualHolidays.length > 0;

              return (
                <tr key={entry.date} className={isHolidayRow ? 'holiday-row' : ''}>
                  <td className={`border border-purple-200/60 px-0.5 py-1 text-center ${isHolidayRow ? 'bg-red-50/80' : 'bg-white/60'}`}>
                    <div className={`font-bold text-[10px] ${isHolidayRow ? 'text-red-600' : 'text-gray-700'}`}>
                      {dayName}
                    </div>
                    <div className={`text-[9px] ${isHolidayRow ? 'text-red-500' : 'text-gray-400'}`}>
                      {dateStr}
                    </div>
                    {natHolidayName && (
                      <div className="text-[7px] text-red-500 truncate leading-tight mt-0.5">{natHolidayName}</div>
                    )}
                  </td>

                  {renderDoctorCell(entry.date, 'k3a', entry.k3a)}
                  {renderDoctorCell(entry.date, 'k3b', entry.k3b)}
                  {renderDoctorCell(entry.date, 'igd', entry.igd)}
                  {renderDoctorCell(entry.date, 'k2', entry.k2)}

                  {/* Ket Column */}
                  <td
                    className={`schedule-cell border border-purple-200/60 px-0.5 py-1 cursor-pointer ${
                      isHolidayRow ? 'bg-red-50/50' : 'bg-white/60'
                    } hover:bg-purple-50/50 transition-colors`}
                    onClick={() => handleKetTap(entry.date)}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, entry.date, 'ket')}
                  >
                    <div className="flex flex-col gap-0.5">
                      {entry.ket.map((k, idx) => (
                        <div key={idx} className="flex items-center gap-0.5">
                          {k.type === 'holiday' ? (
                            <span className="text-[8px] text-red-600 truncate flex-1">
                              🔴 {k.label}
                            </span>
                          ) : (
                            <span
                              className="text-[8px] font-semibold truncate flex-1"
                              style={{
                                color: k.status === 'sakit' ? '#c62828' : k.status === 'izin' ? '#f57f17' : '#2e7d32'
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
                            className="text-gray-400 hover:text-red-500 shrink-0"
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ))}
                      <div className="text-[7px] text-purple-400/60 text-center">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4" onClick={() => setShowCellMenu(null)}>
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs holo-border-gradient" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-purple-700 mb-3">Opsi Sel</h3>
            <div className="space-y-2">
              <button
                onClick={handleClearCell}
                className="w-full py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold"
              >
                Hapus Dokter dari Sel
              </button>
              <button
                onClick={() => setShowCellMenu(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ket Modal */}
      {showKetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4" onClick={() => setShowKetModal(null)}>
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs max-h-[80vh] overflow-auto holo-border-gradient" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-amber-700 mb-3">Keterangan</h3>
            
            <div className="space-y-2 mb-3">
              <p className="text-[10px] text-gray-500">Tambah hari libur:</p>
              <button
                onClick={() => { setShowHolidayModal({ date: showKetModal.date }); setShowKetModal(null); }}
                className="w-full py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center justify-center gap-1 font-medium"
              >
                <Plus size={12} /> Hari Libur
              </button>
            </div>

            <div className="border-t border-purple-100 pt-2">
              <p className="text-[10px] text-gray-500 mb-2">Tambah status dokter:</p>
              <div className="space-y-1">
                {doctors.map(doctor => (
                  <button
                    key={doctor.id}
                    onClick={() => handleAddDoctorToKet(doctor.id)}
                    className="w-full py-2 px-3 rounded-xl text-left text-xs flex items-center gap-2 transition-colors hover:bg-purple-50 border border-transparent hover:border-purple-200"
                    style={{ color: doctor.color }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: doctor.color }} />
                    {doctor.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowKetModal(null)}
              className="w-full mt-3 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs holo-border-gradient">
            <h3 className="text-sm font-bold text-purple-700 mb-3">Status Dokter</h3>
            <p className="text-xs text-gray-600 mb-3">
              {doctors.find(d => d.id === showStatusModal.doctorId)?.name}
            </p>
            <div className="space-y-2 mb-4">
              {(['izin', 'sakit', 'tugas'] as const).map(status => (
                <label key={status} className={`flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-colors border ${
                  selectedStatus === status ? 'bg-purple-50 border-purple-200' : 'border-transparent hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="status"
                    checked={selectedStatus === status}
                    onChange={() => setSelectedStatus(status)}
                    className="accent-purple-500"
                  />
                  <span className="text-xs font-semibold capitalize" style={{
                    color: status === 'sakit' ? '#c62828' : status === 'izin' ? '#f57f17' : '#2e7d32'
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
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-green-200 text-xs text-gray-700 mb-3"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={confirmStatus}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm"
              >
                <Check size={12} /> Simpan
              </button>
              <button
                onClick={() => setShowStatusModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Holiday Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
          <div className="glass-card rounded-2xl p-4 w-full max-w-xs holo-border-gradient">
            <h3 className="text-sm font-bold text-red-600 mb-3">Tambah Hari Libur</h3>
            <input
              type="text"
              placeholder="Nama hari libur..."
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-red-200 text-xs text-gray-700 mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddHoliday}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold shadow-sm"
              >
                Simpan
              </button>
              <button
                onClick={() => { setShowHolidayModal(null); setHolidayName(''); }}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-40">
        {showActionMenu && (
          <div className="mb-2 glass-card rounded-2xl p-2 shadow-lg holo-border-gradient min-w-[200px]">
            <button
              onClick={handleAutoJadwal}
              className="w-full py-2.5 px-3 rounded-xl text-left text-xs flex items-center gap-2 hover:bg-purple-50 transition-colors"
            >
              <Wand2 size={14} className="text-purple-600" />
              <span className="text-gray-700 font-medium">Auto Jadwal</span>
            </button>
            <button
              onClick={handleAutoUpdatePrevMonth}
              className="w-full py-2.5 px-3 rounded-xl text-left text-xs flex items-center gap-2 hover:bg-purple-50 transition-colors"
            >
              <Copy size={14} className="text-blue-600" />
              <span className="text-gray-700 font-medium">Update dari Bulan Lalu</span>
            </button>
            <button
              onClick={handleClearAll}
              className="w-full py-2.5 px-3 rounded-xl text-left text-xs flex items-center gap-2 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} className="text-red-600" />
              <span className="text-gray-700 font-medium">Bersihkan Layar</span>
            </button>
          </div>
        )}
        <button
          onClick={() => setShowActionMenu(!showActionMenu)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        >
          <MoreVertical size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}
