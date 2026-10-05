# ⚡ CHEAT SHEET - Google Apps Script

Referensi cepat untuk setup dan penggunaan sehari-hari.

---

## 🚀 SETUP (5 Menit)

```bash
# 1. Upload data ke GitHub
git add data/export.json
git commit -m "Update data"
git push
```

```javascript
// 2. Di Apps Script editor
// Copy google-apps-script.js
// Edit CONFIG:
GITHUB_USERNAME: 'username-anda'
GITHUB_REPO: 'nama-repo'
DATA_FILE_PATH: 'data/export.json'
```

```
// 3. Jalankan setup
Pilih: setup → Run
```

```
// 4. Sync data
Pilih: syncFromGitHub → Run
```

✅ **Selesai!**

---

## 🔄 SYNC DATA

### Sync Manual
```
Menu → 📅 Jadwal Rotasi → 🔄 Sync dari GitHub
```

### Sync Otomatis
```
Pilih: createHourlyTrigger → Run
```

### Sync Dua Arah
```
1. Isi GITHUB_TOKEN
2. Menu → 📤 Sync ke GitHub
```

---

## 🛠️ FUNGSI PENTING

| Fungsi | Kegunaan | Cara |
|--------|----------|------|
| `setup()` | Buat sheet | Dropdown → Run |
| `syncFromGitHub()` | Pull data | Dropdown → Run |
| `syncToGitHub()` | Push data | Dropdown → Run |
| `testGitHubConnection()` | Test koneksi | Dropdown → Run |
| `createHourlyTrigger()` | Auto sync | Dropdown → Run |
| `validateExportFile()` | Validasi data | Dropdown → Run |
| `showLog()` | Lihat log | Menu → Lihat Log |

---

## 🐛 TROUBLESHOOTING

### Error 404
```
✓ Cek GITHUB_USERNAME
✓ Cek GITHUB_REPO
✓ Cek DATA_FILE_PATH
```

### Error 401
```
✓ Isi GITHUB_TOKEN
✓ Token punya scope: repo
```

### Data Kosong
```
✓ Jalankan testGitHubConnection()
✓ Cek sheet Log
✓ Upload validator.js → validateExportFile()
```

### Menu Tidak Muncul
```
✓ Refresh spreadsheet (F5)
✓ Tunggu beberapa detik
```

---

## 📊 STRUKTUR DATA

### Doctors
```json
{
  "id": "santi",
  "name": "dr. Santi",
  "color": "#1565c0",
  "isBackup": false
}
```

### Schedule
```json
{
  "2025-01": [
    {
      "date": "2025-01-01",
      "k3a": "santi",
      "k3b": "rakean",
      "igd": "afif",
      "k2": "likha",
      "ket": []
    }
  ]
}
```

### Holidays
```json
{
  "2025": [
    {
      "date": "2025-01-01",
      "name": "Tahun Baru"
    }
  ]
}
```

---

## 🔐 GITHUB TOKEN

### Buat Token
```
1. github.com/settings/tokens
2. Generate new token (classic)
3. Note: "Google Apps Script"
4. ✅ Scope: repo
5. Generate → COPY TOKEN
```

### Pakai Token
```javascript
CONFIG = {
  GITHUB_TOKEN: 'ghp_xxxxxxxxxxxx'
}
```

---

## 📁 FILE PENTING

### Wajib
- `google-apps-script.js` → Script utama
- `data/export.json` → Data dari aplikasi

### Dokumentasi
- `DEPLOYMENT-CHECKLIST.md` → Mulai di sini!
- `QUICK-START.md` → Panduan cepat
- `PANDUAN-VISUAL.md` → Panduan detail
- `README-GAS.md` → Dokumentasi lengkap

### Opsional
- `validator.js` → Validasi data
- `data-schema.json` → Schema data
- `CONFIG-CONTOH.js` → Contoh config

---

## 🎯 WORKFLOW HARIAN

```
1. Edit jadwal di aplikasi web
2. Export data (Setting → Export)
3. Upload ke GitHub (data/export.json)
4. Auto sync (setiap jam)
5. Analisis di spreadsheet
```

---

## ✅ CHECKLIST

### Setup Awal
- [ ] Upload export.json ke GitHub
- [ ] Buat spreadsheet
- [ ] Copy script ke Apps Script
- [ ] Edit CONFIG
- [ ] Run: setup()
- [ ] Run: syncFromGitHub()
- [ ] Verifikasi data

### Daily Use
- [ ] Edit di aplikasi web
- [ ] Export data
- [ ] Upload ke GitHub
- [ ] Sync (auto/manual)
- [ ] Cek sheet Log

### Maintenance
- [ ] Backup data (mingguan)
- [ ] Cek log (harian)
- [ ] Rotate token (bulanan)
- [ ] Update dokumentasi

---

## 📞 QUICK COMMANDS

### Test Koneksi
```
Run: testGitHubConnection
```

### Sync Manual
```
Run: syncFromGitHub
```

### Setup Auto Sync
```
Run: createHourlyTrigger
```

### Validasi Data
```
Run: validateExportFile
```

### Lihat Log
```
Menu → 📊 Lihat Log
```

---

## 🔗 LINKS

### GitHub
- Tokens: github.com/settings/tokens
- API Docs: docs.github.com/en/rest

### Google
- Sheets: sheets.google.com
- Apps Script: script.google.com
- Docs: developers.google.com/apps-script

### Dokumentasi
- Checklist: DEPLOYMENT-CHECKLIST.md
- Quick Start: QUICK-START.md
- Full Docs: README-GAS.md
- FAQ: FAQ.md

---

## 💡 TIPS

### Do's
✅ Setup auto sync  
✅ Backup data rutin  
✅ Cek log berkala  
✅ Validasi data sebelum sync  
✅ Gunakan repo private  

### Don'ts
❌ Commit token ke repo  
❌ Share token ke orang lain  
❌ Edit manual di spreadsheet (kecuali perlu)  
❌ Sync terlalu sering (limit quota)  
❌ Lupa backup  

---

## 📊 MONITORING

### Cek Kesehatan
```
1. Sheet Log → Lihat aktivitas
2. Apps Script → Triggers → Cek status
3. Apps Script → Executions → Lihat error
```

### Metrics
- Sync success rate
- Error count
- Data consistency
- Trigger performance

---

## 🎓 LEARNING PATH

### Level 1: Basic (30 min)
- Baca DEPLOYMENT-CHECKLIST.md
- Setup script
- Sync manual

### Level 2: Intermediate (1 hr)
- Baca PANDUAN-VISUAL.md
- Setup auto sync
- Pelajari struktur data

### Level 3: Advanced (2 hr)
- Baca README-GAS.md
- Setup sync dua arah
- Custom script

### Level 4: Expert
- Modifikasi script
- Tambah fitur
- Optimize performance

---

## 🆘 EMERGENCY

### Sync Gagal
```
1. Cek sheet Log
2. Run: testGitHubConnection
3. Baca README-GAS.md (Troubleshooting)
```

### Data Hilang
```
1. Cek GitHub (commit history)
2. Download backup dari spreadsheet
3. Re-upload ke GitHub
4. Sync ulang
```

### Token Expired
```
1. Buat token baru
2. Update CONFIG.GITHUB_TOKEN
3. Save project
4. Test koneksi
```

---

## 📝 NOTES

### Versi
- Current: 1.0
- Release: 2025-01-15

### Author
- dr. Abdi
- Puskesmas Babakan

### Support
- Docs: README-GAS.md
- Log: Sheet Log
- FAQ: FAQ.md

---

## 🎉 DONE!

**Quick Reference:**
- Setup: DEPLOYMENT-CHECKLIST.md
- Sync: Menu → 🔄 Sync dari GitHub
- Help: README-GAS.md atau FAQ.md

---

**Print this page untuk referensi cepat!** 📄
