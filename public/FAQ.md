# ❓ FAQ - Frequently Asked Questions

Jawaban untuk pertanyaan yang sering ditanyakan tentang Google Apps Script sync.

---

## 🚀 Setup & Installation

### Q: Berapa lama waktu setup?
**A:** 5-15 menit tergantung kecepatan Anda mengikuti panduan.
- Super cepat: 5 menit (ikuti DEPLOYMENT-CHECKLIST.md)
- Normal: 10 menit (ikuti QUICK-START.md)
- Pemula: 15 menit (ikuti PANDUAN-VISUAL.md)

### Q: Apakah perlu coding?
**A:** Tidak perlu! Cukup copy-paste script dan edit konfigurasi (ganti username, repo name).

### Q: Apakah gratis?
**A:** Ya, 100% gratis! Google Apps Script dan GitHub keduanya free untuk penggunaan normal.

### Q: Apakah aman?
**A:** Ya, sangat aman. Data Anda tetap di akun Google dan GitHub Anda. Token hanya untuk akses repository Anda.

---

## 🔧 Konfigurasi

### Q: Bagaimana cara dapat GitHub username?
**A:** Username GitHub ada di profile Anda:
1. Login ke GitHub
2. Klik foto profile di pojok kanan atas
3. Username ada di bawah nama Anda
4. Contoh: `drabdi`

### Q: Bagaimana cara dapat repo name?
**A:** Repo name ada di URL repository:
```
https://github.com/username/REPO-NAME
```
Contoh: `jadwal-rotasi-dokter`

### Q: Apakah perlu GitHub token?
**A:** 
- **Repository public:** Tidak perlu (kosongkan)
- **Repository private:** Perlu (buat Personal Access Token)

### Q: Bagaimana cara buat GitHub token?
**A:** 
1. Buka: https://github.com/settings/tokens
2. Klik "Generate new token (classic)"
3. Note: "Google Apps Script"
4. Expiration: "90 days" atau "No expiration"
5. ✅ Centang: `repo`
6. Klik "Generate token"
7. **COPY TOKEN** (hanya muncul sekali!)
8. Paste ke `CONFIG.GITHUB_TOKEN`

### Q: Bagaimana cara dapat Spreadsheet ID?
**A:** 
1. Buka spreadsheet di browser
2. Lihat URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET-ID/edit
   ```
3. Copy bagian antara `/d/` dan `/edit`
4. Contoh: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`
5. **TIPS:** Kosongkan saja jika hanya pakai 1 spreadsheet

### Q: Apa itu DATA_FILE_PATH?
**A:** Path lokasi file `export.json` di repository GitHub.
- Default: `data/export.json`
- Jika file di root: `export.json`
- Jika di folder custom: `backup/data/jadwal.json`

---

## 🔄 Sync Data

### Q: Bagaimana cara sync manual?
**A:** 
1. Buka spreadsheet
2. Menu **📅 Jadwal Rotasi** → **🔄 Sync dari GitHub**
3. Tunggu alert "Sync berhasil!"

### Q: Bagaimana cara sync otomatis?
**A:** 
1. Di Apps Script editor
2. Pilih fungsi: `createHourlyTrigger`
3. Klik Run
4. Data akan sync otomatis setiap jam

### Q: Apakah bisa sync lebih sering dari setiap jam?
**A:** Bisa, tapi Google ada limit quota. Rekomendasi: setiap 1-4 jam.

### Q: Bagaimana cara sync dua arah?
**A:** 
1. Buat GitHub token (lihat jawaban di atas)
2. Edit `CONFIG.GITHUB_TOKEN`
3. Menu **📅 Jadwal Rotasi** → **📤 Sync ke GitHub**
4. ⚠️ Hati-hati: yang terakhir sync akan menimpa data sebelumnya

### Q: Apakah data di spreadsheet akan hilang jika sync dari GitHub?
**A:** Ya, data lama akan di-replace dengan data dari GitHub. Backup dulu jika perlu.

---

## 🐛 Troubleshooting

### Q: Error "404 Not Found"
**A:** Username, repo name, atau path file salah.
**Solusi:**
1. Cek `GITHUB_USERNAME` → harus sama dengan profile GitHub
2. Cek `GITHUB_REPO` → harus sama dengan nama repository
3. Cek `DATA_FILE_PATH` → harus sesuai lokasi file
4. Test: Buka URL ini di browser:
   ```
   https://github.com/USERNAME/REPO/blob/main/data/export.json
   ```

### Q: Error "401 Unauthorized"
**A:** Repository private tapi token belum di-set.
**Solusi:**
1. Buat GitHub token
2. Edit `CONFIG.GITHUB_TOKEN`
3. Paste token: `'ghp_xxxxxxxxxxxx'`
4. Save dan jalankan ulang

### Q: Error "403 Forbidden"
**A:** Token tidak punya permission yang cukup.
**Solusi:**
1. Buat token baru
2. ✅ Centang scope: `repo` (full control)
3. Paste token baru

### Q: Data tidak muncul setelah sync
**A:** Format JSON tidak valid atau struktur tidak sesuai.
**Solusi:**
1. Cek sheet **Log** untuk detail error
2. Upload `validator.js` dan jalankan `validateExportFile()`
3. Pastikan export dari aplikasi web (bukan edit manual)

### Q: Menu "Jadwal Rotasi" tidak muncul
**A:** Script belum di-reload.
**Solusi:**
1. Refresh spreadsheet (F5)
2. Tunggu beberapa detik
3. Menu akan muncul otomatis

### Q: Trigger auto sync tidak jalan
**A:** Trigger disabled atau ada error.
**Solusi:**
1. Buka Apps Script → Triggers
2. Cek status trigger `autoSync`
3. Pastikan status **Enabled**
4. Cek Executions untuk lihat error

### Q: Bagaimana cara lihat error detail?
**A:** 
1. Buka sheet **Log** di spreadsheet
2. Lihat kolom `status` dan `message`
3. Atau buka Apps Script → Executions → Klik execution terakhir

---

## 📊 Data & Format

### Q: Format data seperti apa yang diharapkan?
**A:** JSON dengan struktur:
```json
{
  "doctors": [...],
  "schedule": {...},
  "holidays": {...},
  "settings": {...},
  "exportDate": "...",
  "version": "1.0"
}
```
Lihat `data-schema.json` untuk detail.

### Q: Apakah bisa edit data langsung di spreadsheet?
**A:** Bisa, tapi hati-hati:
- Edit di spreadsheet → Sync ke GitHub (butuh token)
- Edit di GitHub → Sync ke spreadsheet (replace data)
- **Rekomendasi:** Edit di aplikasi web, export, upload ke GitHub

### Q: Apakah data jadwal bisa lebih dari 1 bulan?
**A:** Ya! Struktur `schedule` adalah object dengan key bulan (YYYY-MM). Bisa menyimpan banyak bulan.

### Q: Bagaimana format tanggal?
**A:** ISO 8601: `YYYY-MM-DD`
- Contoh: `2025-01-15`
- Bukan: `15/01/2025` atau `01-15-2025`

### Q: Bagaimana format warna?
**A:** Hex code: `#RRGGBB`
- Contoh: `#1565c0` (biru), `#c2185b` (pink)
- Harus 6 digit setelah `#`

---

## 🔐 Security & Privacy

### Q: Apakah data saya aman?
**A:** Ya! Data tetap di akun Google dan GitHub Anda. Tidak ada pihak ketiga.

### Q: Apakah GitHub token aman?
**A:** Aman jika:
- ✅ Disimpan di Apps Script (tidak di-commit ke repo)
- ✅ Tidak di-share ke orang lain
- ✅ Di-rotate secara berkala
- ❌ JANGAN commit ke repository
- ❌ JANGAN share di chat/email

### Q: Apakah bisa pakai repository private?
**A:** Ya! Cukup isi `GITHUB_TOKEN` dengan Personal Access Token.

### Q: Apakah ada batasan quota?
**A:** Ya, Google Apps Script ada limit:
- 100 API calls per hari (free account)
- 6 menit execution time per script
- Cukup untuk penggunaan normal

---

## 🎯 Usage & Workflow

### Q: Bagaimana workflow yang direkomendasikan?
**A:** 
1. Edit jadwal di aplikasi web
2. Export data (Setting → Export)
3. Upload `export.json` ke GitHub
4. Auto sync ke spreadsheet (setiap jam)
5. Analisis di spreadsheet

### Q: Apakah harus sync manual setiap kali update?
**A:** Tidak! Setup `createHourlyTrigger()` untuk auto sync setiap jam.

### Q: Bagaimana cara backup data?
**A:** 
1. Export dari aplikasi web
2. Upload ke GitHub (commit history = backup)
3. Download spreadsheet sebagai Excel (File → Download)

### Q: Apakah bisa pakai untuk multiple puskesmas?
**A:** Bisa! Buat spreadsheet terpisah untuk masing-masing puskesmas, atau gunakan `SPREADSHEET_ID` untuk sync ke spreadsheet spesifik.

### Q: Apakah bisa sync ke multiple spreadsheet?
**A:** Bisa, tapi perlu modifikasi script. Buat fungsi terpisah untuk masing-masing spreadsheet.

---

## 📚 Dokumentasi

### Q: File dokumentasi mana yang harus saya baca?
**A:** Tergantung kebutuhan:
- **Baru mulai:** `DEPLOYMENT-CHECKLIST.md`
- **Sudah familiar:** `QUICK-START.md`
- **Pemula:** `PANDUAN-VISUAL.md`
- **Ingin paham semua:** `README-GAS.md`

### Q: Apakah ada video tutorial?
**A:** Belum ada, tapi dokumentasi sudah sangat detail dengan step-by-step.

### Q: Bagaimana cara update dokumentasi?
**A:** Edit file markdown di repository, commit dan push. Dokumentasi akan terupdate otomatis.

---

## 🛠️ Advanced

### Q: Apakah bisa custom script?
**A:** Ya! Script ini open source. Bisa dimodifikasi sesuai kebutuhan.

### Q: Bagaimana cara tambah fitur baru?
**A:** 
1. Edit `google-apps-script.js`
2. Tambah fungsi baru
3. Test di Apps Script editor
4. Commit dan push

### Q: Apakah bisa integrasi dengan aplikasi lain?
**A:** Bisa! Modifikasi script untuk integrasi dengan:
- Google Calendar
- WhatsApp (via API)
- Email notifications
- Dan lain-lain

### Q: Bagaimana cara optimize performance?
**A:** 
1. Kurangi frekuensi sync (jangan setiap menit)
2. Gunakan batch operations
3. Cache data jika perlu
4. Lihat Apps Script best practices

---

## 🆘 Support

### Q: Bagaimana cara minta bantuan?
**A:** 
1. Cek sheet **Log** untuk detail error
2. Baca dokumentasi (terutama Troubleshooting)
3. Jalankan `testGitHubConnection()`
4. Upload `validator.js` dan validasi data

### Q: Apakah ada community support?
**A:** 
- Google Apps Script Community: https://groups.google.com/g/google-apps-script-community
- GitHub Community: https://github.community
- Stack Overflow: https://stackoverflow.com/questions/tagged/google-apps-script

### Q: Bagaimana cara report bug?
**A:** 
1. Cek sheet **Log** untuk error detail
2. Buat issue di repository GitHub
3. Sertakan: error message, langkah reproduce, screenshot

### Q: Apakah ada SLA atau guarantee?
**A:** Tidak ada SLA formal. Ini adalah proyek internal untuk Puskesmas Babakan. Use at your own risk.

---

## 💡 Tips & Tricks

### Q: Tips untuk penggunaan optimal?
**A:** 
1. ✅ Setup auto sync (jangan manual)
2. ✅ Backup data secara berkala
3. ✅ Cek log secara rutin
4. ✅ Validasi data sebelum sync besar
5. ✅ Gunakan repository private untuk data sensitif

### Q: Bagaimana cara monitoring kesehatan sync?
**A:** 
1. Cek sheet **Log** → lihat aktivitas terakhir
2. Apps Script → Triggers → cek status
3. Apps Script → Executions → lihat error

### Q: Apakah ada best practices?
**A:** 
1. Backup sebelum sync besar
2. Test koneksi sebelum sync
3. Validasi data dengan validator
4. Monitor log secara berkala
5. Rotate token secara rutin

---

## 📝 Miscellaneous

### Q: Apakah script ini open source?
**A:** Ya! Boleh dimodifikasi dan di-share.

### Q: Apakah ada versi berbayar?
**A:** Tidak, ini 100% free dan open source.

### Q: Bagaimana cara contribute?
**A:** 
1. Fork repository
2. Modifikasi script/dokumentasi
3. Pull request
4. Review dan merge

### Q: Apakah ada roadmap?
**A:** 
- ✅ v1.0: Basic sync (done)
- 🔜 v1.1: Enhanced validation
- 🔜 v1.2: Multiple spreadsheet support
- 🔜 v2.0: Real-time sync

### Q: Bagaimana cara update ke versi baru?
**A:** 
1. Pull update dari repository
2. Copy script baru ke Apps Script
3. Save project
4. Test dengan `testGitHubConnection()`

---

## 🎉 Masih Ada Pertanyaan?

Jika pertanyaan Anda belum terjawab:

1. **Baca dokumentasi lengkap:** `README-GAS.md`
2. **Cek troubleshooting:** Section Troubleshooting di `README-GAS.md`
3. **Lihat contoh:** `CONFIG-CONTOH.js`
4. **Cek log:** Sheet **Log** di spreadsheet
5. **Test koneksi:** Jalankan `testGitHubConnection()`

---

**Last Updated:** 2025-01-15  
**Version:** 1.0  
**Status:** ✅ Complete
