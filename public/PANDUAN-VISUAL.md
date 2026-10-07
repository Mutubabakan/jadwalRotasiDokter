# 📸 Panduan Visual - Setup Google Apps Script

Panduan step-by-step dengan penjelasan detail untuk pemula.

---

## 🎯 Tujuan

Sinkronisasi data antara:
- **GitHub** (repository aplikasi web)
- **Google Spreadsheet** (untuk analisis & backup)

```
┌─────────────────┐         ┌──────────────────┐
│  Aplikasi Web   │         │   Spreadsheet    │
│  (GitHub)       │ ──────► │   (Google)       │
│                 │  Sync   │                  │
│  export.json    │         │  - Dokter        │
│                 │         │  - Jadwal        │
│                 │         │  - Libur         │
└─────────────────┘         └──────────────────┘
```

---

## 📋 Persiapan

### Yang Anda Butuhkan:

✅ **Akun GitHub**
- Repository sudah di-publish
- File `export.json` sudah di-upload

✅ **Akun Google**
- Bisa akses Google Sheets
- Bisa akses Google Drive

✅ **Data dari Aplikasi**
- Buka aplikasi web
- Tab Setting > Export Data
- Download file JSON

---

## 🚀 Langkah 1: Upload Data ke GitHub

### 1.1 Struktur Repository

Pastikan repository Anda memiliki struktur ini:

```
jadwal-rotasi-dokter/
├── src/
├── public/
├── data/                    ← BUAT FOLDER INI
│   └── export.json          ← UPLOAD FILE INI
├── package.json
└── README.md
```

### 1.2 Cara Upload

**Opsi A: Via GitHub Web**
1. Buka repository di browser
2. Klik folder `data/` (atau buat baru)
3. Klik **Add file** → **Upload files**
4. Drag & drop file `export.json`
5. Scroll bawah → **Commit changes**

**Opsi B: Via Git Command**
```bash
# Buat folder data jika belum ada
mkdir data

# Copy file export.json ke folder data
cp ~/Downloads/jadwal-rotasi-backup-2025-01-15.json data/export.json

# Commit dan push
git add data/export.json
git commit -m "Update schedule data"
git push
```

### 1.3 Verifikasi

1. Buka repository di GitHub
2. Klik folder `data/`
3. Klik file `export.json`
4. Pastikan isi file terlihat (JSON valid)

✅ **Langkah 1 selesai!**

---

## 📊 Langkah 2: Buat Google Spreadsheet

### 2.1 Buat Spreadsheet Baru

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **+ Blank** (spreadsheet kosong)
3. Klik judul di pojok kiri atas
4. Ganti nama: **"Jadwal Rotasi - Puskesmas Babakan"**

### 2.2 Verifikasi

Anda sekarang punya spreadsheet kosong dengan URL seperti:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
```

✅ **Langkah 2 selesai!**

---

## 💻 Langkah 3: Setup Google Apps Script

### 3.1 Buka Apps Script Editor

1. Di spreadsheet, klik menu **Extensions**
2. Pilih **Apps Script**
3. Tab baru akan terbuka dengan editor GAS

### 3.2 Copy Script

1. Di editor GAS, hapus semua kode default:
   ```javascript
   function myFunction() {
     
   }
   ```

2. Buka file `google-apps-script.js` dari repository Anda

3. **Select All** (Ctrl+A) dan **Copy** (Ctrl+C)

4. Kembali ke editor GAS, **Paste** (Ctrl+V)

### 3.3 Edit Konfigurasi

Scroll ke atas, cari bagian `CONFIG`:

```javascript
const CONFIG = {
  GITHUB_USERNAME: 'username-anda',           // ← GANTI
  GITHUB_REPO: 'jadwal-rotasi-dokter',        // ← GANTI
  GITHUB_BRANCH: 'main',
  GITHUB_TOKEN: '',
  DATA_FILE_PATH: 'data/export.json',
  SPREADSHEET_ID: '',
  // ...
};
```

**Edit 3 hal:**

1. **GITHUB_USERNAME**
   - Ganti dengan username GitHub Anda
   - Contoh: `'drabdi'`

2. **GITHUB_REPO**
   - Ganti dengan nama repository Anda
   - Contoh: `'jadwal-rotasi-dokter'`

3. **DATA_FILE_PATH**
   - Pastikan path sesuai dengan lokasi file di GitHub
   - Default: `'data/export.json'`

### 3.4 Save Project

1. Klik icon **disket** (💾) di toolbar
2. Atau tekan **Ctrl+S**
3. Beri nama project: **"Jadwal Rotasi Sync"**
4. Klik **OK**

✅ **Langkah 3 selesai!**

---

## ⚙️ Langkah 4: Jalankan Setup

### 4.1 Autorisasi Pertama Kali

1. Di dropdown fungsi (atas editor), pilih: **`setup`**
2. Klik tombol **Run** (▶️) atau tekan **Ctrl+Enter**
3. Akan muncul popup **"Authorization required"**
4. Klik **Review permissions**

### 4.2 Grant Permissions

1. Pilih akun Google Anda
2. Akan muncul warning **"Google hasn't verified this app"**
3. Klik **Advanced**
4. Klik **Go to Jadwal Rotasi Sync (unsafe)**
5. Klik **Allow**

### 4.3 Tunggu Selesai

1. Lihat bagian **Execution log** di bawah editor
2. Tunggu hingga muncul: **"Execution completed"**
3. Kembali ke spreadsheet
4. Akan muncul alert: **"Setup selesai!"**
5. Klik **OK**

### 4.4 Verifikasi Sheet

Di spreadsheet, Anda akan melihat 5 sheet baru di bottom:

- ✅ **Dokter**
- ✅ **Jadwal**
- ✅ **LiburNasional**
- ✅ **Settings**
- ✅ **Log**

✅ **Langkah 4 selesai!**

---

## 🔄 Langkah 5: Sync Data dari GitHub

### 5.1 Test Koneksi (Opsional)

1. Di Apps Script editor
2. Dropdown fungsi: **`testGitHubConnection`**
3. Klik **Run**
4. Tunggu hasil:
   - ✅ **"Koneksi berhasil!"** → Lanjut ke 5.2
   - ❌ **"Koneksi gagal!"** → Lihat troubleshooting

### 5.2 Sync Data

1. Di Apps Script editor
2. Dropdown fungsi: **`syncFromGitHub`**
3. Klik **Run**
4. Tunggu hingga muncul: **"Execution completed"**
5. Kembali ke spreadsheet
6. Akan muncul alert: **"Sync berhasil!"**
7. Klik **OK**

### 5.3 Verifikasi Data

Buka sheet **Dokter**:

| id | name | color | isBackup |
|----|------|-------|----------|
| santi | dr. Santi | #1565c0 | false |
| rakean | dr. Rakean | #c2185b | false |
| ... | ... | ... | ... |

✅ Seharusnya ada 5 dokter!

Buka sheet **Jadwal**:

| date | k3a | k3b | igd | k2 | ket_json |
|------|-----|-----|-----|-----|----------|
| 2025-01-01 | santi | rakean | afif | likha | [] |
| ... | ... | ... | ... | ... | ... |

✅ Seharusnya ada data jadwal!

✅ **Langkah 5 selesai!**

---

## 🎉 Selesai!

Data dari GitHub sudah ada di spreadsheet Anda!

### Cara Sync Selanjutnya

**Setiap kali update data di GitHub:**

1. Buka spreadsheet
2. Klik menu **📅 Jadwal Rotasi** (muncul di menu bar)
3. Klik **🔄 Sync dari GitHub**
4. Tunggu alert **"Sync berhasil!"**

**Atau setup auto sync:**

1. Di Apps Script editor
2. Dropdown: **`createHourlyTrigger`**
3. Klik **Run**
4. Data akan sync otomatis setiap jam!

---

## 🐛 Troubleshooting

### Error: "404 Not Found"

**Penyebab:** Username, repo, atau path salah

**Solusi:**
1. Cek `GITHUB_USERNAME` → harus sama dengan profile GitHub
2. Cek `GITHUB_REPO` → harus sama dengan nama repository
3. Cek `DATA_FILE_PATH` → harus sesuai lokasi file di repo
4. Test: Buka URL ini di browser:
   ```
   https://github.com/USERNAME/REPO/blob/main/data/export.json
   ```
   Ganti USERNAME dan REPO dengan data Anda. Jika file terlihat, path benar.

### Error: "401 Unauthorized"

**Penyebab:** Repository private tapi token belum di-set

**Solusi:**
1. Buat GitHub token (lihat panduan di CONFIG-CONTOH.js)
2. Edit `CONFIG.GITHUB_TOKEN` di script
3. Paste token: `'ghp_xxxxxxxxxxxx'`
4. Save dan jalankan ulang `syncFromGitHub`

### Error: "File not found"

**Penyebab:** File `export.json` belum ada di GitHub

**Solusi:**
1. Export data dari aplikasi web
2. Upload ke folder `data/` di repository
3. Commit dan push
4. Jalankan ulang sync

### Data Kosong Setelah Sync

**Penyebab:** Format JSON tidak sesuai

**Solusi:**
1. Cek sheet **Log** untuk detail error
2. Pastikan export dari aplikasi web (bukan edit manual)
3. Test dengan `testGitHubConnection`

### Menu "Jadwal Rotasi" Tidak Muncul

**Penyebab:** Script belum di-reload

**Solusi:**
1. Refresh spreadsheet (F5)
2. Tunggu beberapa detik
3. Menu akan muncul otomatis

---

## 📞 Fungsi-Fungsi Penting

| Fungsi | Cara Jalankan | Kegunaan |
|--------|---------------|----------|
| `setup` | Dropdown → Run | Buat sheet pertama kali |
| `syncFromGitHub` | Dropdown → Run | Pull data dari GitHub |
| `syncToGitHub` | Dropdown → Run | Push data ke GitHub |
| `testGitHubConnection` | Dropdown → Run | Test koneksi |
| `createHourlyTrigger` | Dropdown → Run | Setup auto sync |
| `showLog` | Menu → Lihat Log | Lihat log aktivitas |

---

## 🎓 Tips & Tricks

### Tip 1: Bookmark Apps Script

Bookmark URL Apps Script editor untuk akses cepat:
```
https://script.google.com/home/projects/YOUR_PROJECT_ID
```

### Tip 2: Gunakan Menu Custom

Setelah setup, gunakan menu **📅 Jadwal Rotasi** di spreadsheet untuk sync, lebih mudah daripada buka editor.

### Tip 3: Cek Log Rutin

Buka sheet **Log** untuk melihat riwayat sync dan error.

### Tip 4: Backup Manual

Sebelum sync besar, export spreadsheet:
- File → Download → Microsoft Excel (.xlsx)

### Tip 5: Auto Sync

Setup trigger `createHourlyTrigger` untuk sync otomatis, tidak perlu manual.

---

## 📚 Dokumentasi Lengkap

- **README-GAS.md** → Dokumentasi lengkap
- **QUICK-START.md** → Panduan cepat
- **CONFIG-CONTOH.js** → Contoh konfigurasi

---

## ✅ Checklist Setup

- [ ] Upload `export.json` ke GitHub
- [ ] Buat Google Spreadsheet baru
- [ ] Buka Apps Script editor
- [ ] Copy script `google-apps-script.js`
- [ ] Edit `CONFIG` (username, repo, path)
- [ ] Save project
- [ ] Jalankan `setup()`
- [ ] Autorisasi permissions
- [ ] Jalankan `syncFromGitHub()`
- [ ] Verifikasi data di sheet
- [ ] (Opsional) Setup auto sync

---

**Butuh bantuan?** Cek sheet **Log** atau baca README-GAS.md untuk troubleshooting detail.

🎉 **Selamat! Spreadsheet Anda sudah tersinkronisasi dengan GitHub!**
