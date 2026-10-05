# Changelog

Semua perubahan signifikan pada proyek ini akan didokumentasikan di file ini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.0.0/),
dan proyek ini mengikuti [Semantic Versioning](https://semver.org/lang/id/).

---

## [1.0.0] - 2025-01-15

### ✨ Added (Fitur Baru)

#### Aplikasi Web
- **Tab Jadwal**
  - Drag & drop dokter ke kolom jadwal (K3a, K3b, IGD, K2)
  - Tap to select untuk mobile
  - Navigasi bulan dengan prev/next
  - Highlight hari libur (Minggu & nasional) dengan warna merah
  - Status dokter dengan warna background sel (Sakit/Izin/Tugas)
  - Auto Schedule dengan rotasi mingguan
  - Auto Update dari bulan sebelumnya
  - Clear All untuk bersihkan jadwal

- **Tab Dokter**
  - 5 dokter default (Santi, Rakean, Afif, Likha, Abdi)
  - Color picker dengan 3 mode:
    - Standar (15 warna)
    - Neon (20 warna dengan glow)
    - Custom (180 warna honeycomb + hex input)
  - Edit nama dan warna dokter
  - Tambah/hapus dokter
  - Tandai dokter cadangan

- **Tab Setting**
  - Pengaturan nama puskesmas
  - Hari libur nasional per tahun (auto-sync ke jadwal)
  - Export data (3 metode: clipboard, download, tab baru)
  - Import data dari JSON
  - Clone app untuk puskesmas/angkatan lain
  - Reset data (jadwal, warna, atau semua)
  - Info aplikasi

- **UI/UX**
  - Hologram light theme (ungu-pink)
  - Mobile responsive
  - Floating action button dengan menu
  - Modal konfirmasi untuk semua aksi destruktif
  - Animasi dan transisi smooth

#### Google Apps Script Integration
- **Script Utama** (`google-apps-script.js`)
  - Sync dari GitHub ke Spreadsheet
  - Sync dari Spreadsheet ke GitHub (dengan token)
  - Auto sync dengan trigger (setiap jam)
  - Setup otomatis (5 sheet: Dokter, Jadwal, LiburNasional, Settings, Log)
  - Menu custom di spreadsheet
  - Logging aktivitas
  - Test koneksi

- **Validator** (`validator.js`)
  - Validasi struktur JSON
  - Cek error dan warning
  - Summary data
  - Integrasi dengan sheet Validation

- **Dokumentasi** (14 files)
  - README-GAS.md (dokumentasi lengkap)
  - QUICK-START.md (panduan 5 menit)
  - PANDUAN-VISUAL.md (panduan detail)
  - DEPLOYMENT-CHECKLIST.md (checklist deployment)
  - FAQ.md (pertanyaan umum)
  - CHEAT-SHEET.md (referensi cepat)
  - SUPPORT.md (info support)
  - CONFIG-CONTOH.js (contoh konfigurasi)
  - data-schema.json (schema JSON)
  - SUMMARY.md (ringkasan package)
  - PACKAGE-INDEX.md (index semua file)
  - README-INDEX.md (index dokumentasi)
  - LINKS-RESOURCES.md (link penting)

#### Repository
- README.md dengan dokumentasi lengkap
- LICENSE (MIT)
- .gitignore
- CHANGELOG.md (file ini)

### 🔧 Technical Details

#### Dependencies
```json
{
  "react": "^18.x",
  "typescript": "^5.x",
  "vite": "^6.x",
  "tailwindcss": "^4.x",
  "lucide-react": "^0.x",
  "file-saver": "^2.x"
}
```

#### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Mobile webview (Android, iOS)

#### Storage
- LocalStorage untuk data persistence
- Keys: `puskesmas_doctors`, `puskesmas_schedule`, `puskesmas_settings`, `puskesmas_holidays`

### 📊 Statistics
- **Total Files:** 30+ files
- **Code Lines:** ~3000 lines (app) + ~2000 lines (GAS)
- **Documentation:** 14 files, ~75 KB
- **Features:** 20+ major features
- **Setup Time:** 5-15 menit

### 🎯 Features Highlights
- ✅ Drag & drop + tap to select
- ✅ Auto schedule dengan rotasi mingguan
- ✅ Color picker 3 mode (standar, neon, custom)
- ✅ Hari libur nasional per tahun
- ✅ Export/Import dengan 3 metode
- ✅ Clone app untuk puskesmas lain
- ✅ Google Apps Script integration
- ✅ 14 files dokumentasi lengkap
- ✅ Mobile-first design
- ✅ Hologram light theme

---

## [Unreleased]

### Planned Features
- [ ] Real-time sync dengan WebSocket
- [ ] Multiple puskesmas support dalam 1 app
- [ ] Export ke PDF untuk print
- [ ] Notifikasi WhatsApp untuk perubahan jadwal
- [ ] Integrasi Google Calendar
- [ ] Backup otomatis ke Google Drive
- [ ] Version history untuk jadwal
- [ ] Template jadwal untuk quick setup
- [ ] Analytics dashboard
- [ ] Multi-language support (ID/EN)

### Known Issues
- Export download mungkin tidak bekerja di beberapa webview restriktif (gunakan clipboard)
- Drag & drop tidak bekerja di mobile (gunakan tap to select)

---

## Version History

### Versioning Scheme
- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features (backward compatible)
- **Patch** (0.0.X): Bug fixes (backward compatible)

### Release Schedule
- **Major:** Setiap 6-12 bulan
- **Minor:** Setiap 1-3 bulan
- **Patch:** As needed (bug fixes)

---

## Contributing

Untuk kontribusi:
1. Fork repository
2. Buat branch fitur
3. Commit perubahan
4. Push dan buat Pull Request
5. Update CHANGELOG.md

---

**Last Updated:** 2025-01-15  
**Current Version:** 1.0.0  
**Next Release:** TBD

---

[1.0.0]: https://github.com/username/jadwal-rotasi-dokter/releases/tag/v1.0.0
