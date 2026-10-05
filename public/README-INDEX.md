# 📚 Dokumentasi Google Apps Script

Kumpulan file dokumentasi dan script untuk sinkronisasi data antara GitHub dan Google Spreadsheet.

---

## 📁 Daftar File

### 📄 File Utama

| File | Deskripsi | Status |
|------|-----------|--------|
| **google-apps-script.js** | Script utama untuk sync data | ✅ Wajib |
| **README-GAS.md** | Dokumentasi lengkap | 📖 Referensi |
| **QUICK-START.md** | Panduan cepat 5 menit | 🚀 Mulai di sini |
| **PANDUAN-VISUAL.md** | Panduan step-by-step detail | 👁️ Untuk pemula |
| **CONFIG-CONTOH.js** | Contoh konfigurasi | 💡 Referensi |
| **data-schema.json** | Schema validasi data | 🔍 Validasi |
| **validator.js** | Script validasi data | ✅ Opsional |

---

## 🎯 Alur Kerja

```
┌─────────────────────────────────────────────────────────────────┐
│                        WORKFLOW                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Aplikasi Web (GitHub)                                       │
│     └─> Export data → export.json                              │
│                                                                  │
│  2. Upload ke GitHub                                            │
│     └─> data/export.json                                       │
│                                                                  │
│  3. Google Apps Script                                          │
│     ├─> google-apps-script.js (sync dari GitHub)              │
│     ├─> validator.js (validasi data - opsional)               │
│     └─> Push ke Google Spreadsheet                            │
│                                                                  │
│  4. Google Spreadsheet                                          │
│     ├─> Sheet: Dokter                                          │
│     ├─> Sheet: Jadwal                                          │
│     ├─> Sheet: LiburNasional                                   │
│     ├─> Sheet: Settings                                        │
│     └─> Sheet: Log                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (5 Menit)

### Untuk Pemula → Baca **PANDUAN-VISUAL.md**

Panduan lengkap dengan penjelasan detail setiap langkah.

### Untuk yang Sudah Familiar → Baca **QUICK-START.md**

Panduan cepat 5 menit untuk setup.

---

## 📖 Dokumentasi Lengkap

### **README-GAS.md**

Dokumentasi lengkap mencakup:
- ✅ Fitur lengkap script
- ✅ Cara setup detail
- ✅ Cara penggunaan
- ✅ Troubleshooting
- ✅ Struktur data
- ✅ Workflow rekomendasi
- ✅ Tips & tricks

**Baca jika:** Ingin memahami semua fitur dan cara kerja script.

---

## 💡 Contoh Konfigurasi

### **CONFIG-CONTOH.js**

Berisi contoh konfigurasi untuk berbagai skenario:
- Repository public (tanpa token)
- Repository private (dengan token)
- Multiple spreadsheet (dengan ID)
- Custom path dan branch

**Baca jika:** Bingung cara mengisi CONFIG atau butuh contoh.

---

## 🔍 Validasi Data

### **data-schema.json**

JSON Schema untuk validasi struktur data export.json:
- Struktur data yang diharapkan
- Tipe data setiap field
- Format yang valid
- Contoh data

**Gunakan jika:** Ingin validasi format data secara otomatis.

### **validator.js**

Script Apps Script untuk validasi data:
- Validasi struktur data
- Cek error dan warning
- Tampilkan summary
- Integrasi dengan spreadsheet

**Gunakan jika:** Ingin validasi data sebelum sync.

---

## 📋 Checklist Setup

Gunakan checklist ini untuk memastikan setup berhasil:

### Persiapan
- [ ] Akun GitHub dengan repository yang sudah di-publish
- [ ] File `export.json` sudah di-export dari aplikasi
- [ ] File `export.json` sudah di-upload ke GitHub
- [ ] Akun Google (Gmail)

### Setup Spreadsheet
- [ ] Buat Google Spreadsheet baru
- [ ] Buka Extensions > Apps Script
- [ ] Copy script `google-apps-script.js`
- [ ] Edit CONFIG (username, repo, path)
- [ ] Save project

### Setup Script
- [ ] Jalankan fungsi `setup()`
- [ ] Autorisasi permissions
- [ ] Verifikasi 5 sheet terbuat
- [ ] Jalankan `testGitHubConnection()`
- [ ] Jalankan `syncFromGitHub()`
- [ ] Verifikasi data di sheet

### Opsional
- [ ] Jalankan `createHourlyTrigger()` untuk auto sync
- [ ] Setup GitHub token untuk sync dua arah
- [ ] Upload `validator.js` untuk validasi data

---

## 🎓 Panduan Berdasarkan Kebutuhan

### "Saya baru pertama kali setup"
→ Baca **PANDUAN-VISUAL.md** (lengkap dengan penjelasan detail)

### "Saya sudah familiar, ingin cepat"
→ Baca **QUICK-START.md** (5 menit setup)

### "Saya ingin paham semua fitur"
→ Baca **README-GAS.md** (dokumentasi lengkap)

### "Saya bingung cara isi CONFIG"
→ Lihat **CONFIG-CONTOH.js** (contoh berbagai skenario)

### "Saya ingin validasi data dulu"
→ Upload **validator.js** dan jalankan `validateExportFile()`

### "Saya ingin tahu struktur data"
→ Lihat **data-schema.json** (schema lengkap)

---

## 🐛 Troubleshooting

### Error Umum

| Error | Solusi | File Referensi |
|-------|--------|----------------|
| 404 Not Found | Cek username/repo/path | README-GAS.md |
| 401 Unauthorized | Isi GITHUB_TOKEN | CONFIG-CONTOH.js |
| Data kosong | Jalankan testGitHubConnection | PANDUAN-VISUAL.md |
| Format invalid | Gunakan validator.js | validator.js |

### Langkah Debugging

1. **Cek Log**
   - Buka sheet **Log** di spreadsheet
   - Lihat error message detail

2. **Test Koneksi**
   - Jalankan `testGitHubConnection()`
   - Lihat hasilnya

3. **Validasi Data**
   - Upload `validator.js`
   - Jalankan `validateExportFile()`
   - Cek error/warning

4. **Baca Dokumentasi**
   - **README-GAS.md** → Troubleshooting section
   - **PANDUAN-VISUAL.md** → Troubleshooting section

---

## 📞 Fungsi-Fungsi Penting

### Fungsi Utama

| Fungsi | File | Kegunaan |
|--------|------|----------|
| `setup()` | google-apps-script.js | Buat sheet pertama kali |
| `syncFromGitHub()` | google-apps-script.js | Pull data dari GitHub |
| `syncToGitHub()` | google-apps-script.js | Push data ke GitHub |
| `autoSync()` | google-apps-script.js | Sync otomatis (trigger) |

### Fungsi Utilitas

| Fungsi | File | Kegunaan |
|--------|------|----------|
| `testGitHubConnection()` | google-apps-script.js | Test koneksi |
| `createHourlyTrigger()` | google-apps-script.js | Setup auto sync |
| `validateExportFile()` | validator.js | Validasi data |
| `showLog()` | google-apps-script.js | Lihat log |

---

## 🔄 Update Data

### Cara Update Rutin

1. **Edit di Aplikasi Web**
   - Buka aplikasi
   - Edit jadwal, dokter, dll
   - Export data

2. **Upload ke GitHub**
   ```bash
   git add data/export.json
   git commit -m "Update schedule"
   git push
   ```

3. **Sync ke Spreadsheet**
   - Menu **📅 Jadwal Rotasi** → **🔄 Sync dari GitHub**
   - Atau tunggu auto sync (jika sudah setup trigger)

---

## 💾 Backup

### Backup Otomatis
- Setup trigger `createHourlyTrigger()`
- Data akan sync otomatis setiap jam

### Backup Manual
1. Export dari aplikasi web
2. Upload ke GitHub
3. Sync ke spreadsheet
4. Download spreadsheet sebagai Excel (File → Download)

---

## 🔐 Security

### GitHub Token
- **JANGAN** commit token ke repository
- Simpan di tempat aman
- Regenerate jika bocor
- Gunakan scope minimal (`repo` saja)

### Data Sensitif
- Data jadwal dokter tidak terlalu sensitif
- Tapi tetap jaga kerahasiaan token
- Gunakan repository private jika perlu

---

## 📊 Monitoring

### Cek Kesehatan Sync

1. **Sheet Log**
   - Buka sheet **Log**
   - Lihat riwayat sync terakhir
   - Cek error jika ada

2. **Triggers**
   - Buka Apps Script → Triggers
   - Cek status trigger auto sync
   - Pastikan tidak ada error

3. **Data Validation**
   - Jalankan `validateExportFile()` secara berkala
   - Pastikan data tetap valid

---

## 🎯 Best Practices

### 1. Backup Rutin
- Export data dari aplikasi setiap minggu
- Upload ke GitHub
- Sync ke spreadsheet

### 2. Validasi Data
- Gunakan validator.js sebelum sync besar
- Cek error/warning
- Perbaiki jika ada masalah

### 3. Auto Sync
- Setup trigger untuk sync otomatis
- Cek log secara berkala
- Handle error dengan cepat

### 4. Dokumentasi
- Catat perubahan penting
- Update README jika ada perubahan
- Share knowledge ke tim

---

## 📚 Resource Tambahan

### GitHub
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [GitHub Personal Access Tokens](https://github.com/settings/tokens)

### Google Apps Script
- [Apps Script Documentation](https://developers.google.com/apps-script)
- [Apps Script GitHub Integration](https://developers.google.com/apps-script/guides/libraries)

### Google Sheets
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Apps Script Sheets Service](https://developers.google.com/apps-script/reference/spreadsheet)

---

## 🆘 Support

### Butuh Bantuan?

1. **Cek Dokumentasi**
   - Baca file dokumentasi yang sesuai
   - Cari di troubleshooting section

2. **Cek Log**
   - Buka sheet **Log**
   - Lihat error message detail

3. **Test Koneksi**
   - Jalankan `testGitHubConnection()`
   - Lihat hasilnya

4. **Validasi Data**
   - Upload `validator.js`
   - Jalankan `validateExportFile()`

###常见问题

**Q: Data tidak muncul setelah sync?**
A: Cek sheet Log untuk error, pastikan format JSON valid

**Q: Error 404?**
A: Cek username, repo name, dan path file di CONFIG

**Q: Error 401?**
A: Repository private? Isi GITHUB_TOKEN dengan Personal Access Token

**Q: Trigger tidak jalan?**
A: Cek menu Triggers di Apps Script, pastikan status Enabled

---

## 📝 Changelog

### Version 1.0 (2025-01)
- ✅ Initial release
- ✅ Sync dari GitHub
- ✅ Sync ke GitHub (dengan token)
- ✅ Auto sync dengan trigger
- ✅ Validasi data
- ✅ Logging aktivitas
- ✅ Menu custom di spreadsheet

---

## 📄 License

Script ini bagian dari proyek **Jadwal Rotasi Dokter Puskesmas Babakan**.

---

## 👨‍💻 Author

Dibuat untuk **Puskesmas Babakan** oleh **dr. Abdi**

---

**Selamat menggunakan! 🎉**

Jika ada pertanyaan atau masalah, silakan cek dokumentasi atau lihat sheet Log untuk detail error.
