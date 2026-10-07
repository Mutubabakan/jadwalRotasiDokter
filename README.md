# 🏥 Jadwal Rotasi Dokter - Puskesmas Babakan

Aplikasi web mobile untuk mengelola jadwal rotasi dokter di Puskesmas Babakan dengan tampilan hologram light theme.

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![Status](https://img.shields.io/badge/status-active-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Fitur Utama

### 📅 Manajemen Jadwal
- **Drag & Drop** - Seret nama dokter ke kolom jadwal (K3a, K3b, IGD, K2)
- **Tap to Select** - Tap dokter, lalu tap kolom tujuan (mobile-friendly)
- **Auto Schedule** - Generate jadwal otomatis dengan rotasi mingguan
- **Auto Update** - Lanjutkan rotasi dari bulan sebelumnya
- **Clear All** - Bersihkan semua jadwal dalam 1 klik

### 👨‍⚕️ Manajemen Dokter
- 5 dokter default (dr. Santi, dr. Rakean, dr. Afif, dr. Likha, dr. Abdi)
- **Color Picker** - Pilih warna dari palette standar, neon, atau custom
- **Edit & Delete** - Kelola data dokter dengan mudah
- **Backup Doctor** - Tandai dokter cadangan

### 🎨 Tampilan
- **Hologram Light Theme** - Tema terang dengan aksen ungu-pink
- **Mobile Responsive** - Dioptimalkan untuk mobile webview
- **Status Indicators** - Warna background sel berdasarkan status (Sakit/Izin/Tugas)
- **Holiday Highlight** - Baris hari libur otomatis berwarna merah

### 📊 Pengaturan
- **Hari Libur Nasional** - Kelola hari libur per tahun (auto-sync ke jadwal)
- **Export/Import** - Backup dan restore data dalam format JSON
- **Clone App** - Duplikasi data untuk puskesmas/angkatan lain
- **Reset Data** - Hapus data jadwal, warna, atau semua data

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/username/jadwal-rotasi-dokter.git
cd jadwal-rotasi-dokter
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy
Upload folder `dist/` ke hosting Anda (Netlify, Vercel, GitHub Pages, dll)

---

## 📱 Google Apps Script Integration

Untuk sinkronisasi data dengan Google Spreadsheet:

### Quick Setup (5 menit)
1. Baca **[DEPLOYMENT-CHECKLIST.md](public/DEPLOYMENT-CHECKLIST.md)**
2. Upload `data/export.json` ke repository
3. Copy `google-apps-script.js` ke Apps Script editor
4. Edit CONFIG (username, repo, path)
5. Jalankan `setup()` dan `syncFromGitHub()`

### Dokumentasi Lengkap
- 📖 **[README-GAS.md](public/README-GAS.md)** - Dokumentasi lengkap
- ⚡ **[QUICK-START.md](public/QUICK-START.md)** - Panduan cepat
- 👁️ **[PANDUAN-VISUAL.md](public/PANDUAN-VISUAL.md)** - Panduan detail
- ❓ **[FAQ.md](public/FAQ.md)** - Pertanyaan umum
- ⚡ **[CHEAT-SHEET.md](public/CHEAT-SHEET.md)** - Referensi cepat

### File GAS yang Tersedia
| File | Fungsi |
|------|--------|
| `google-apps-script.js` | Script utama sync data |
| `validator.js` | Validasi struktur data |
| `data-schema.json` | Schema JSON |
| `CONFIG-CONTOH.js` | Contoh konfigurasi |

---

## 🎯 Cara Penggunaan

### Edit Jadwal
1. **Drag & Drop** (Desktop): Seret dokter ke kolom K3a/K3b/IGD/K2
2. **Tap to Select** (Mobile): Tap dokter → Tap kolom tujuan
3. **Auto Schedule**: Klik menu floating → Auto Jadwal
4. **Update dari Bulan Lalu**: Klik menu floating → Update dari Bulan Lalu

### Kelola Status Dokter
1. Tap kolom **Ket** pada tanggal tertentu
2. Pilih dokter yang akan diberi status
3. Pilih status: Sakit (🔴), Izin (🟡), atau Tugas (🟢)
4. Background sel akan berubah warna sesuai status

### Kelola Hari Libur
1. Buka tab **Setting**
2. Scroll ke **Hari Libur Nasional**
3. Pilih tahun dengan tombol ◀ ▶
4. Tambah/edit/hapus hari libur
5. Hari libur otomatis muncul di jadwal (baris merah)

### Export/Import Data
1. Buka tab **Setting**
2. Klik **Export Data (JSON)**
3. Pilih metode: Copy ke Clipboard / Download / Buka di Tab Baru
4. Untuk import: Klik **Import Data** → Paste atau upload file

---

## 🎨 Color Palette

### Dokter Default
| Dokter | Warna | Hex Code |
|--------|-------|----------|
| dr. Santi | Biru Tua | `#1565c0` |
| dr. Rakean | Pink | `#c2185b` |
| dr. Afif | Hijau | `#388e3c` |
| dr. Likha | Orange | `#f57c00` |
| dr. Abdi | Ungu | `#7b1fa2` |

### Status Indicators
| Status | Warna Background | Keterangan |
|--------|------------------|------------|
| Sehat | Putih | Default |
| Sakit | Merah Muda | `bg-red-100/80` |
| Izin | Kuning | `bg-amber-100/80` |
| Tugas | Hijau | `bg-green-100/80` |

### Color Picker
- **Standar**: 15 warna populer
- **Neon**: 20 warna neon dengan efek glow
- **Custom**: 180 warna honeycomb + hex input

---

## 📂 Struktur Proyek

```
jadwal-rotasi-dokter/
├── src/
│   ├── components/
│   │   ├── JadwalTab.tsx          # Tab jadwal dengan drag & drop
│   │   ├── DokterTab.tsx          # Tab manajemen dokter
│   │   ├── SettingTab.tsx         # Tab pengaturan
│   │   └── ColorPickerModal.tsx   # Modal pilih warna
│   ├── utils/
│   │   ├── storage.ts             # LocalStorage management
│   │   └── types.ts               # TypeScript types
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── public/
│   ├── google-apps-script.js      # Script GAS utama
│   ├── validator.js               # Script validasi
│   ├── data-schema.json           # JSON schema
│   ├── README-GAS.md              # Dokumentasi GAS
│   ├── QUICK-START.md             # Panduan cepat
│   ├── PANDUAN-VISUAL.md          # Panduan detail
│   ├── FAQ.md                     # FAQ
│   ├── CHEAT-SHEET.md             # Cheat sheet
│   └── ... (14 files dokumentasi)
├── package.json
├── tsconfig.json
└── README.md                      # File ini
```

---

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **File Saver** - File download
- **LocalStorage** - Data persistence

---

## 📊 Fitur Detail

### Auto Schedule
- Mengisi jadwal otomatis berdasarkan referensi
- Rotasi mingguan: K3a → K3b → IGD → K2
- Skip hari Minggu dan hari libur
- Hanya berlaku untuk halaman bulan yang dibuka

### Auto Update dari Bulan Lalu
- Melanjutkan rotasi dari tanggal terakhir bulan sebelumnya
- Tidak menyalin kolom Ket (keterangan)
- Menghitung offset minggu secara otomatis

### Color Picker
- **Standar**: 15 warna material design
- **Neon**: 20 warna neon dengan glow effect
- **Custom**: 180 warna honeycomb + color picker + hex input
- Preview warna real-time
- Tersedia saat edit dokter dan tambah dokter baru

### Export Data
- **Copy ke Clipboard** - Paling reliable untuk mobile
- **Download File** - Menggunakan file-saver library
- **Buka di Tab Baru** - Fallback untuk webview restriktif

### Clone App
- Export data dengan nama puskesmas custom
- Download file JSON untuk import di perangkat lain
- Copy ke clipboard untuk transfer cepat

---

## 🔧 Konfigurasi

### LocalStorage Keys
```javascript
'puskesmas_doctors'    // Data dokter
'puskesmas_schedule'   // Data jadwal
'puskesmas_settings'   // Pengaturan
'puskesmas_holidays'   // Hari libur per tahun
```

### Default Settings
```javascript
{
  puskesmasName: 'Puskesmas Babakan',
  nationalHolidays: []
}
```

---

## 📱 Mobile WebView

Aplikasi dioptimalkan untuk mobile webview dengan:
- Touch-friendly interactions
- Responsive layout
- No horizontal scroll
- Optimized font sizes
- Tap targets yang cukup besar

### Meta Tags
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
```

---

## 🐛 Troubleshooting

### Export Data Tidak Bekerja
**Solusi:** Gunakan opsi "Copy ke Clipboard" yang paling reliable di mobile webview

### Drag & Drop Tidak Bekerja di Mobile
**Solusi:** Gunakan fitur "Tap to Select" - tap dokter, lalu tap kolom tujuan

### Hari Libur Tidak Muncul di Jadwal
**Solusi:** Pastikan sudah menambah hari libur di tab Setting untuk tahun yang sesuai

### Warna Dokter Tidak Berubah
**Solusi:** Tap avatar dokter atau tombol "Ubah Warna" saat edit dokter

---

## 📚 Dokumentasi

### Untuk Pengguna
- [DEPLOYMENT-CHECKLIST.md](public/DEPLOYMENT-CHECKLIST.md) - Setup GAS
- [QUICK-START.md](public/QUICK-START.md) - Panduan cepat
- [FAQ.md](public/FAQ.md) - Pertanyaan umum

### Untuk Developer
- [README-GAS.md](public/README-GAS.md) - Dokumentasi lengkap GAS
- [data-schema.json](public/data-schema.json) - Schema data
- [CONFIG-CONTOH.js](public/CONFIG-CONTOH.js) - Contoh konfigurasi

### Referensi Cepat
- [CHEAT-SHEET.md](public/CHEAT-SHEET.md) - Cheat sheet
- [PACKAGE-INDEX.md](public/PACKAGE-INDEX.md) - Index semua file

---

## 🤝 Contributing

Contributions welcome! Silakan:
1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📝 License

MIT License - Lihat file [LICENSE](LICENSE) untuk detail

---

## 👨‍💻 Author

**dr. Abdi**  
Puskesmas Babakan

---

## 🙏 Acknowledgments

- Tim Puskesmas Babakan
- Kontributor open source
- Community Google Apps Script

---

## 📞 Support

Untuk bantuan:
1. Baca [FAQ.md](public/FAQ.md)
2. Cek [SUPPORT.md](public/SUPPORT.md)
3. Lihat sheet **Log** di spreadsheet (untuk error GAS)

---

## 🔄 Changelog

### v1.0.0 (2025-01-15)
- ✅ Initial release
- ✅ Drag & drop jadwal
- ✅ Auto schedule & update
- ✅ Color picker (standar, neon, custom)
- ✅ Hari libur nasional per tahun
- ✅ Export/Import data
- ✅ Clone app untuk puskesmas lain
- ✅ Google Apps Script integration
- ✅ 14 files dokumentasi lengkap

---

## 🎉 Screenshots

_Coming soon..._

---

**Made with ❤️ for Puskesmas Babakan**
