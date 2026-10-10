import { useEffect, useMemo, useRef, useState } from 'react';
import { Printer, X, Upload, Trash2, Download, FileText } from 'lucide-react';
import {
  getSettings,
  getPrintProfile,
  savePrintProfile,
  getKopImage,
  saveKopImage,
  clearKopImage,
} from '../utils/storage';
import type { PrintProfile, KopImage } from '../utils/types';
import {
  MONTHS_ID,
  buildRows,
  generatePdf,
  generateDocx,
  makeFileName,
  type PrintDocData,
} from '../utils/printExport';

interface Props {
  onClose: () => void;
  /** dipanggil setelah profil cetak tersimpan, agar state induk tidak usang */
  onProfileSaved?: (p: PrintProfile) => void;
}

const todayIso = () => {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
};

/** Perkecil gambar kop (maks 1400 px lebar) dan jadikan JPEG berlatar putih. */
function loadKopFile(file: File): Promise<KopImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File harus berupa gambar (JPG atau PNG).'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gambar tidak bisa dibuka.'));
      img.onload = () => {
        const scale = Math.min(1, 1400 / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Browser tidak mendukung pemrosesan gambar.'));
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.9), width: w, height: h });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function PrintScheduleModal({ onClose, onProfileSaved }: Props) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [tanggal, setTanggal] = useState(todayIso());
  const [format, setFormat] = useState<'pdf' | 'docx'>('pdf');
  const [profile, setProfile] = useState<PrintProfile>(() => getPrintProfile());
  const [kopImage, setKopImage] = useState<KopImage | null>(() => getKopImage());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Simpan profil otomatis (nama kepala, NIP, lokasi, kop) agar tidak perlu mengetik ulang
  useEffect(() => {
    const t = setTimeout(() => {
      if (JSON.stringify(profile) === JSON.stringify(getPrintProfile())) return;
      savePrintProfile(profile);
      onProfileSaved?.(profile);
    }, 600);
    return () => clearTimeout(t);
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  // Bersihkan URL unduhan saat modal ditutup / hasil baru dibuat
  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const years = useMemo(() => {
    const y = new Date().getFullYear();
    return [y - 2, y - 1, y, y + 1, y + 2];
  }, []);

  const filled = useMemo(() => buildRows(year, month).filled, [year, month]);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const set = <K extends keyof PrintProfile>(k: K, v: PrintProfile[K]) => {
    setProfile(p => ({ ...p, [k]: v }));
    setResult(null);
  };

  const handleKopFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    try {
      const img = await loadKopFile(file);
      saveKopImage(img);
      setKopImage(img);
      set('kopMode', 'gambar');
    } catch (err) {
      setError((err as Error).message || 'Gagal memproses gambar kop.');
    }
  };

  const handleRemoveKop = () => {
    clearKopImage();
    setKopImage(null);
    if (profile.kopMode === 'gambar') set('kopMode', 'tanpa');
  };

  const handleGenerate = async () => {
    setError('');
    setResult(null);

    if (profile.kopMode === 'gambar' && !kopImage) {
      setError('Gambar kop belum diunggah di perangkat ini. Unggah gambar atau pilih "Teks" / "Tanpa kop".');
      return;
    }
    if (profile.kopMode === 'teks' && !profile.kopTeks.trim()) {
      setError('Teks kop masih kosong. Isi teks kop atau pilih "Tanpa kop".');
      return;
    }

    setBusy(true);
    try {
      // pastikan profil terbaru sudah tersimpan
      if (JSON.stringify(profile) !== JSON.stringify(getPrintProfile())) {
        savePrintProfile(profile);
        onProfileSaved?.(profile);
      }
      const { rows, showLegend } = buildRows(year, month);
      const data: PrintDocData = {
        puskesmasName: getSettings().puskesmasName || 'Puskesmas Babakan',
        year,
        month,
        rows,
        showLegend,
        lokasi: profile.lokasi,
        tanggalDibuat: tanggal || todayIso(),
        namaKepala: profile.namaKepala,
        nipKepala: profile.nipKepala,
        kopMode: profile.kopMode,
        kopImage,
        kopTeks: profile.kopTeks,
      };
      const blob = format === 'pdf' ? await generatePdf(data) : await generateDocx(data);
      const name = makeFileName(year, month, format);
      const url = URL.createObjectURL(blob);
      setResult({ url, name });

      // coba unduh otomatis; tautan manual tetap ditampilkan sebagai cadangan
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError('Gagal membuat dokumen: ' + ((err as Error).message || String(err)));
    } finally {
      setBusy(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 rounded-xl bg-gray-50 border border-purple-200 text-sm text-gray-700';
  const labelCls = 'block text-[10px] font-semibold text-gray-600 mb-1';
  const segCls = (active: boolean) =>
    `flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors ${
      active ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-gray-200 text-gray-500'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-3">
      <div className="glass-card rounded-2xl p-4 w-full max-w-sm holo-border-gradient max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-purple-700 flex items-center gap-1.5">
            <Printer size={14} /> Cetak Jadwal
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400" aria-label="Tutup">
            <X size={16} />
          </button>
        </div>

        {/* Periode */}
        <div className="grid grid-cols-2 gap-2 mb-1">
          <div>
            <label className={labelCls}>Bulan</label>
            <select
              value={month}
              onChange={e => { setMonth(Number(e.target.value)); setResult(null); }}
              className={inputCls}
            >
              {MONTHS_ID.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Tahun</label>
            <select
              value={year}
              onChange={e => { setYear(Number(e.target.value)); setResult(null); }}
              className={inputCls}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <p className={`text-[10px] mb-3 ${filled === 0 ? 'text-amber-600' : 'text-gray-400'}`}>
          {filled === 0
            ? `Belum ada dokter yang dijadwalkan pada ${MONTHS_ID[month]} ${year}. Tabel akan tercetak kosong.`
            : `${MONTHS_ID[month]} ${year}: ${filled} dari ${daysInMonth} hari sudah terisi.`}
        </p>

        {/* Lokasi & tanggal */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className={labelCls}>Lokasi pembuatan</label>
            <input
              type="text"
              value={profile.lokasi}
              onChange={e => set('lokasi', e.target.value)}
              placeholder="Mataram"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Tanggal dibuat</label>
            <input
              type="date"
              value={tanggal}
              onChange={e => { setTanggal(e.target.value); setResult(null); }}
              className={inputCls}
            />
          </div>
        </div>

        {/* Kepala puskesmas */}
        <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-2.5 mb-3 space-y-2">
          <p className="text-[10px] font-semibold text-purple-700">Kepala Puskesmas (tersimpan, tidak perlu diisi ulang)</p>
          <div>
            <label className={labelCls}>Nama beserta gelar</label>
            <input
              type="text"
              value={profile.namaKepala}
              onChange={e => set('namaKepala', e.target.value)}
              placeholder="Nama lengkap dan gelar"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>NIP</label>
            <input
              type="text"
              inputMode="numeric"
              value={profile.nipKepala}
              onChange={e => set('nipKepala', e.target.value)}
              placeholder="Nomor NIP"
              className={inputCls}
            />
          </div>
        </div>

        {/* Kop */}
        <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-2.5 mb-3 space-y-2">
          <p className="text-[10px] font-semibold text-purple-700">Kop surat</p>
          <div className="flex gap-1.5">
            <button className={segCls(profile.kopMode === 'gambar')} onClick={() => set('kopMode', 'gambar')}>Gambar</button>
            <button className={segCls(profile.kopMode === 'teks')} onClick={() => set('kopMode', 'teks')}>Teks</button>
            <button className={segCls(profile.kopMode === 'tanpa')} onClick={() => set('kopMode', 'tanpa')}>Tanpa kop</button>
          </div>

          {profile.kopMode === 'gambar' && (
            <div className="space-y-2">
              {kopImage ? (
                <div className="rounded-lg bg-white border border-gray-200 p-1.5">
                  <img src={kopImage.dataUrl} alt="Pratinjau kop" className="w-full max-h-20 object-contain" />
                </div>
              ) : (
                <p className="text-[10px] text-amber-600">Belum ada gambar kop di perangkat ini.</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 py-2 rounded-xl bg-white border border-purple-200 text-purple-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Upload size={12} /> {kopImage ? 'Ganti gambar' : 'Unggah gambar kop'}
                </button>
                {kopImage && (
                  <button
                    onClick={handleRemoveKop}
                    className="px-3 py-2 rounded-xl bg-white border border-red-200 text-red-600 text-xs"
                    aria-label="Hapus gambar kop"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleKopFile} className="hidden" />
              <p className="text-[9px] text-gray-400">
                Gambar kop disimpan di perangkat ini saja. Di perangkat lain, unggah sekali lagi.
              </p>
            </div>
          )}

          {profile.kopMode === 'teks' && (
            <div className="space-y-1">
              <textarea
                value={profile.kopTeks}
                onChange={e => set('kopTeks', e.target.value)}
                rows={4}
                placeholder={'Satu baris per baris kop, contoh:\nPEMERINTAH KOTA ...\nDINAS KESEHATAN\nUPTD PUSKESMAS ...\nAlamat dan telepon'}
                className={inputCls + ' resize-none'}
              />
              <p className="text-[9px] text-gray-400">
                Baris terakhir dicetak lebih kecil (cocok untuk alamat), baris di atasnya tebal.
              </p>
            </div>
          )}
        </div>

        {/* Format */}
        <div className="mb-3">
          <label className={labelCls}>Format file</label>
          <div className="flex gap-1.5">
            <button className={segCls(format === 'pdf')} onClick={() => { setFormat('pdf'); setResult(null); }}>
              PDF
            </button>
            <button className={segCls(format === 'docx')} onClick={() => { setFormat('docx'); setResult(null); }}>
              Word (DOCX)
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-600">{error}</div>
        )}

        {result && (
          <div className="mb-3 p-2.5 rounded-xl bg-green-50 border border-green-200 text-[11px] text-green-700 space-y-1">
            <p className="font-semibold flex items-center gap-1"><FileText size={12} /> {result.name} sudah dibuat.</p>
            <p>
              Jika unduhan tidak mulai otomatis:{' '}
              <a href={result.url} download={result.name} className="underline font-semibold">klik untuk mengunduh</a>
              {' atau '}
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="underline font-semibold">buka di tab baru</a>.
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            disabled={busy}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            <Download size={12} /> {busy ? 'Membuat dokumen...' : `Buat ${format === 'pdf' ? 'PDF' : 'DOCX'}`}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
