# 🚀 Quick Start Guide - Google Apps Script

Panduan cepat setup sinkronisasi GitHub ↔ Google Spreadsheet

## ⚡ 5 Menit Setup

### 1️⃣ Upload Data ke GitHub

```bash
# Di repository GitHub Anda
# Buat folder data/ jika belum ada
# Upload file export.json dari aplikasi
git add data/export.json
git commit -m "Add schedule data"
git push
```

### 2️⃣ Buat Spreadsheet

1. Buka [sheets.google.com](https://sheets.google.com)
2. Buat spreadsheet baru
3. Beri nama: **"Jadwal Rotasi - Puskesmas Babakan"**

### 3️⃣ Copy Script

1. Menu **Extensions** → **Apps Script**
2. Hapus semua kode default
3. Copy isi file `google-apps-script.js`
4. Paste ke editor

### 4️⃣ Konfigurasi

Edit bagian `CONFIG` (baris ~30):

```javascript
const CONFIG = {
  GITHUB_USERNAME: 'username-github-anda',  // ← GANTI
  GITHUB_REPO: 'jadwal-rotasi-dokter',       // ← GANTI
  GITHUB_BRANCH: 'main',
  GITHUB_TOKEN: '',                          // Isi jika repo private
  DATA_FILE_PATH: 'data/export.json',
  // ...
};
```

### 5️⃣ Jalankan Setup

1. Pilih fungsi: **`setup`**
2. Klik **Run** (▶️)
3. Klik **Review Permissions** → **Allow**
4. Tunggu alert "Setup selesai!"

### 6️⃣ Sync Data

1. Pilih fungsi: **`syncFromGitHub`**
2. Klik **Run**
3. Tunggu alert "Sync berhasil!"
4. Cek sheet **Dokter**, **Jadwal**, dll

✅ **Selesai!** Data dari GitHub sudah ada di spreadsheet.

---

## 🔄 Cara Sync

### Sync Manual (Setiap Kali Update)

**Opsi 1: Via Menu**
1. Buka spreadsheet
2. Klik menu **📅 Jadwal Rotasi**
3. Pilih **🔄 Sync dari GitHub**

**Opsi 2: Via Script Editor**
1. Buka Apps Script editor
2. Pilih fungsi: **`syncFromGitHub`**
3. Klik **Run**

### Sync Otomatis (Recommended)

1. Di Apps Script editor
2. Pilih fungsi: **`createHourlyTrigger`**
3. Klik **Run**
4. ✅ Data akan sync otomatis setiap jam

---

## 📤 Sync Dua Arah (Opsional)

Jika ingin edit di spreadsheet dan push balik ke GitHub:

### 1. Buat GitHub Token

1. Buka [github.com/settings/tokens](https://github.com/settings/tokens)
2. **Generate new token (classic)**
3. Name: "Google Apps Script"
4. ✅ Centang: **repo** (full control)
5. **Generate token**
6. **COPY TOKEN** (hanya muncul sekali!)

### 2. Update Config

```javascript
const CONFIG = {
  // ...
  GITHUB_TOKEN: 'ghp_xxxxxxxxxxxxxxxxxxxx', // ← Paste token
  // ...
};
```

### 3. Sync ke GitHub

1. Edit data di spreadsheet
2. Menu **📅 Jadwal Rotasi** → **📤 Sync ke GitHub**
3. ✅ Data ter-push ke GitHub

---

## 🎯 Workflow Harian

```
┌─────────────────────────────────────────────────────────┐
│  1. Edit jadwal di aplikasi web/mobile                 │
│  2. Export data (Setting > Export Data)                │
│  3. Upload export.json ke GitHub                       │
│  4. Auto sync ke spreadsheet (setiap jam)              │
│  5. Analisis/print di spreadsheet                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting Cepat

| Masalah | Solusi |
|---------|--------|
| **Error 404** | Cek username, repo name, dan path file |
| **Error 401** | Repository private? Isi `GITHUB_TOKEN` |
| **Data kosong** | Jalankan `testGitHubConnection` dulu |
| **Sync gagal** | Cek sheet **Log** untuk detail error |
| **Trigger tidak jalan** | Cek menu **Triggers** di sidebar Apps Script |

---

## 📞 Fungsi Penting

| Fungsi | Kegunaan |
|--------|----------|
| `setup()` | Buat sheet pertama kali |
| `syncFromGitHub()` | Pull data dari GitHub |
| `syncToGitHub()` | Push data ke GitHub |
| `autoSync()` | Sync otomatis (dipanggil trigger) |
| `createHourlyTrigger()` | Setup auto sync setiap jam |
| `testGitHubConnection()` | Test koneksi ke GitHub |
| `showLog()` | Lihat log aktivitas |

---

## ✅ Checklist Setup

- [ ] Upload `export.json` ke GitHub
- [ ] Buat Google Spreadsheet baru
- [ ] Copy script ke Apps Script editor
- [ ] Edit `CONFIG` (username, repo, path)
- [ ] Jalankan `setup()`
- [ ] Jalankan `syncFromGitHub()`
- [ ] Verifikasi data di sheet
- [ ] (Opsional) Setup `createHourlyTrigger()`

---

## 📚 Dokumentasi Lengkap

Lihat file **README-GAS.md** untuk dokumentasi lengkap termasuk:
- Penjelasan detail setiap fungsi
- Struktur data lengkap
- Troubleshooting advanced
- Best practices
- Security tips

---

**Butuh bantuan?** Cek sheet **Log** di spreadsheet untuk detail error.

🎉 **Selamat! Spreadsheet Anda sudah tersinkronisasi dengan GitHub!**
