# ⚡ DEPLOYMENT CHECKLIST

Checklist singkat untuk deployment Google Apps Script.

---

## ✅ Pre-Deployment

### GitHub
- [ ] Repository sudah di-publish
- [ ] File `data/export.json` sudah di-upload
- [ ] File dapat diakses di URL: `https://github.com/USERNAME/REPO/blob/main/data/export.json`

### Google
- [ ] Akun Google aktif
- [ ] Bisa akses Google Sheets
- [ ] Bisa akses Google Drive

---

## 🚀 Deployment Steps

### 1. Buat Spreadsheet (1 menit)
```
✓ Buka sheets.google.com
✓ Klik "+ Blank"
✓ Rename: "Jadwal Rotasi - Puskesmas Babakan"
```

### 2. Setup Apps Script (2 menit)
```
✓ Extensions → Apps Script
✓ Hapus kode default
✓ Copy isi google-apps-script.js
✓ Paste ke editor
```

### 3. Edit Config (1 menit)
```javascript
const CONFIG = {
  GITHUB_USERNAME: 'username-anda',      // ← GANTI
  GITHUB_REPO: 'nama-repo-anda',         // ← GANTI
  GITHUB_BRANCH: 'main',
  GITHUB_TOKEN: '',                      // Isi jika private
  DATA_FILE_PATH: 'data/export.json',
  // ...
};
```

### 4. Save & Autorisasi (1 menit)
```
✓ Save project (Ctrl+S)
✓ Nama: "Jadwal Rotasi Sync"
✓ Pilih fungsi: setup
✓ Klik Run
✓ Review permissions → Allow
```

### 5. Sync Data (1 menit)
```
✓ Pilih fungsi: syncFromGitHub
✓ Klik Run
✓ Tunggu "Sync berhasil!"
✓ Cek data di sheet
```

### 6. Setup Auto Sync (Opsional - 30 detik)
```
✓ Pilih fungsi: createHourlyTrigger
✓ Klik Run
✓ Auto sync setiap jam aktif
```

---

## 🎯 Total Time: 5-7 Menit

---

## ✅ Post-Deployment Verification

### Cek Sheet
- [ ] Sheet **Dokter** ada data (5 dokter)
- [ ] Sheet **Jadwal** ada data
- [ ] Sheet **LiburNasional** ada data
- [ ] Sheet **Settings** ada data
- [ ] Sheet **Log** mencatat aktivitas

### Cek Menu
- [ ] Menu **📅 Jadwal Rotasi** muncul di spreadsheet
- [ ] Bisa klik **🔄 Sync dari GitHub**
- [ ] Sync berjalan tanpa error

### Cek Auto Sync (Jika di-setup)
- [ ] Buka Apps Script → Triggers
- [ ] Trigger `autoSync` status **Enabled**
- [ ] Tunggu 1 jam, cek log sync otomatis

---

## 🐛 Quick Troubleshooting

### Error saat setup?
→ Cek autorisasi permissions, klik "Advanced" → "Go to app"

### Error 404?
→ Cek CONFIG: username, repo, path

### Error 401?
→ Repository private? Isi GITHUB_TOKEN

### Data tidak muncul?
→ Jalankan `testGitHubConnection()` dulu

---

## 📞 Quick Commands

### Test Koneksi
```
Pilih fungsi: testGitHubConnection → Run
```

### Sync Manual
```
Pilih fungsi: syncFromGitHub → Run
```

### Lihat Log
```
Menu: 📅 Jadwal Rotasi → 📊 Lihat Log
```

### Setup Auto Sync
```
Pilih fungsi: createHourlyTrigger → Run
```

---

## 📚 Dokumentasi Lengkap

- **QUICK-START.md** → Panduan cepat
- **PANDUAN-VISUAL.md** → Panduan detail
- **README-GAS.md** → Dokumentasi lengkap
- **CONFIG-CONTOH.js** → Contoh config

---

## ✅ Done!

Spreadsheet Anda sudah tersinkronisasi dengan GitHub! 🎉

**Next:**
1. Edit jadwal di aplikasi web
2. Export & upload ke GitHub
3. Auto sync ke spreadsheet
4. Analisis di spreadsheet

---

**Butuh bantuan?** Cek sheet **Log** atau baca **README-GAS.md**
