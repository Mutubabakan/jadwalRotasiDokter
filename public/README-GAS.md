# Google Apps Script - Jadwal Rotasi Dokter

Script ini untuk sinkronisasi data antara GitHub dan Google Spreadsheet.

## 📋 Fitur

- ✅ **Sync dari GitHub** - Pull data JSON dari repository GitHub ke Spreadsheet
- ✅ **Sync ke GitHub** - Push data dari Spreadsheet kembali ke GitHub (butuh token)
- ✅ **Auto Sync** - Trigger otomatis setiap jam
- ✅ **Setup Otomatis** - Membuat struktur sheet dengan 1 klik
- ✅ **Logging** - Mencatat semua aktivitas sync
- ✅ **Menu Custom** - Menu khusus di spreadsheet untuk kemudahan akses

## 🚀 Cara Setup

### 1. Persiapan di GitHub

Pastikan Anda sudah:
- Publish aplikasi ke GitHub
- Export data dari aplikasi (tab Setting > Export Data)
- Upload file `export.json` ke repository GitHub

**Struktur repository yang direkomendasikan:**
```
jadwal-rotasi-dokter/
├── src/
├── public/
├── data/
│   └── export.json          ← File data yang di-export
├── package.json
└── README.md
```

### 2. Setup Google Spreadsheet

1. **Buat Spreadsheet Baru**
   - Buka [Google Sheets](https://sheets.google.com)
   - Klik "+ Blank" untuk membuat spreadsheet baru
   - Beri nama: "Jadwal Rotasi Dokter - Puskesmas Babakan"

2. **Buka Apps Script Editor**
   - Klik menu **Extensions** > **Apps Script**
   - Akan terbuka tab baru dengan editor GAS

3. **Copy Script**
   - Hapus semua kode default di editor
   - Copy seluruh isi file `google-apps-script.js`
   - Paste ke editor

4. **Konfigurasi**
   - Edit bagian `CONFIG` di awal script:
   ```javascript
   const CONFIG = {
     GITHUB_USERNAME: 'username-github-anda',      // Ganti!
     GITHUB_REPO: 'nama-repository-anda',          // Ganti!
     GITHUB_BRANCH: 'main',                        // Sesuaikan
     GITHUB_TOKEN: '',                             // Isi jika repo private
     DATA_FILE_PATH: 'data/export.json',           // Path file di GitHub
     SPREADSHEET_ID: '',                           // Kosongkan
     // ...
   };
   ```

5. **Simpan Project**
   - Klik icon disket (Save) atau Ctrl+S
   - Beri nama project: "Jadwal Rotasi Sync"

### 3. Jalankan Setup Awal

1. **Pilih Fungsi**
   - Di dropdown fungsi, pilih `setup`
   - Klik tombol **Run** (▶️)

2. **Autorisasi**
   - Akan muncul popup minta izin akses
   - Klik **Review Permissions**
   - Pilih akun Google Anda
   - Klik **Advanced** > **Go to Jadwal Rotasi Sync (unsafe)**
   - Klik **Allow**

3. **Verifikasi**
   - Tunggu hingga muncul alert "Setup selesai!"
   - Kembali ke spreadsheet, akan terlihat 5 sheet baru:
     - Dokter
     - Jadwal
     - LiburNasional
     - Settings
     - Log

### 4. Sync Data dari GitHub

1. **Test Koneksi (Opsional)**
   - Di dropdown fungsi, pilih `testGitHubConnection`
   - Klik **Run**
   - Jika berhasil, akan muncul info jumlah data

2. **Sync Data**
   - Di dropdown fungsi, pilih `syncFromGitHub`
   - Klik **Run**
   - Tunggu hingga muncul alert "Sync berhasil!"
   - Data dari GitHub akan terisi di sheet

3. **Verifikasi**
   - Buka sheet **Dokter** - harus ada 5 dokter
   - Buka sheet **Jadwal** - harus ada data jadwal
   - Buka sheet **LiburNasional** - harus ada hari libur

### 5. Setup Auto Sync (Opsional)

Untuk sync otomatis setiap jam:

1. **Buat Trigger**
   - Di dropdown fungsi, pilih `createHourlyTrigger`
   - Klik **Run**
   - Akan muncul alert "Trigger berhasil dibuat!"

2. **Verifikasi Trigger**
   - Klik icon jam (Triggers) di sidebar kiri
   - Akan terlihat trigger `autoSync` yang berjalan setiap jam

## 📖 Cara Penggunaan

### Menggunakan Menu Custom

Setelah setup, akan muncul menu **📅 Jadwal Rotasi** di spreadsheet:

- **🔄 Sync dari GitHub** - Pull data dari GitHub
- **📤 Sync ke GitHub** - Push data ke GitHub (butuh token)
- **⚙️ Setup Awal** - Jalankan setup ulang
- **📊 Lihat Log** - Lihat log aktivitas

### Sync Manual

1. Buka spreadsheet
2. Klik menu **📅 Jadwal Rotasi**
3. Pilih **🔄 Sync dari GitHub**
4. Tunggu hingga selesai

### Sync ke GitHub (Dua Arah)

**⚠️ Perhatian:** Push ke GitHub memerlukan Personal Access Token

1. **Buat GitHub Token**
   - Buka [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - Klik **Generate new token (classic)**
   - Beri nama: "Google Apps Script"
   - Centang scope: `repo` (full control)
   - Klik **Generate token**
   - **Copy token** (hanya muncul sekali!)

2. **Update Config**
   - Buka Apps Script editor
   - Edit `CONFIG.GITHUB_TOKEN`:
   ```javascript
   GITHUB_TOKEN: 'ghp_xxxxxxxxxxxxxxxxxxxx', // Paste token Anda
   ```
   - Save project

3. **Sync ke GitHub**
   - Klik menu **📅 Jadwal Rotasi** > **📤 Sync ke GitHub**
   - Data akan di-push ke repository

## 🔧 Troubleshooting

### Error: "File not found"
- Pastikan `DATA_FILE_PATH` benar
- Cek file sudah di-commit ke GitHub
- Cek branch name (`main` atau `master`)

### Error: "404 Not Found"
- Username atau repo name salah
- Repository masih private (butuh token)
- Path file salah

### Error: "401 Unauthorized"
- Repository private tapi token belum di-set
- Token tidak valid atau expired
- Token tidak punya scope `repo`

### Data tidak muncul setelah sync
- Cek sheet **Log** untuk melihat error
- Pastikan format JSON valid
- Cek struktur data sesuai dengan yang diharapkan

### Trigger tidak berjalan
- Buka **Triggers** di sidebar Apps Script
- Pastikan trigger status **Enabled**
- Cek quota Google (max 20 trigger per user)

## 📊 Struktur Data

### Sheet Dokter
| id | name | color | isBackup |
|----|------|-------|----------|
| santi | dr. Santi | #1565c0 | false |

### Sheet Jadwal
| date | k3a | k3b | igd | k2 | ket_json |
|------|-----|-----|-----|----|----------|
| 2025-01-01 | santi | rakean | afif | likha | [] |

### Sheet LiburNasional
| year | date | name |
|------|------|------|
| 2025 | 2025-01-01 | Tahun Baru Masehi |

### Sheet Settings
| key | value |
|-----|-------|
| puskesmasName | Puskesmas Babakan |

### Sheet Log
| timestamp | action | status | message |
|-----------|--------|--------|---------|
| 2025-01-01T10:00:00Z | SYNC_SUCCESS | SUCCESS | Sync dari GitHub berhasil |

## 🔄 Workflow Rekomendasi

### Untuk Admin Jadwal:

1. **Edit di Aplikasi Web**
   - Buka aplikasi web di browser/mobile
   - Edit jadwal, tambah dokter, dll
   - Export data (Setting > Export Data)

2. **Upload ke GitHub**
   - Commit file `export.json` ke repository
   - Push ke branch `main`

3. **Sync ke Spreadsheet**
   - Buka Google Spreadsheet
   - Menu **📅 Jadwal Rotasi** > **🔄 Sync dari GitHub**
   - Data akan terupdate otomatis

4. **Analisis di Spreadsheet**
   - Gunakan spreadsheet untuk analisis
   - Buat chart, pivot table, dll
   - Print untuk arsip

### Untuk Backup Otomatis:

1. Setup trigger `autoSync` setiap jam
2. Data akan selalu up-to-date
3. Tidak perlu sync manual

## 📝 Catatan Penting

- **Backup Rutin:** Selalu export data dari aplikasi sebelum edit besar
- **Conflict:** Jika edit di spreadsheet dan GitHub, yang terakhir sync akan menimpa
- **Token Security:** Jangan share GitHub token, simpan dengan aman
- **Quota:** Google Apps Script ada limit (100 API calls/hour untuk free account)
- **File Size:** Untuk data sangat besar (>1MB), pertimbangkan split per bulan

## 🆘 Support

Jika ada masalah:
1. Cek sheet **Log** untuk detail error
2. Test koneksi dengan `testGitHubConnection`
3. Pastikan semua konfigurasi sudah benar
4. Cek dokumentasi GitHub API jika ada error 4xx

## 📄 License

Script ini bagian dari proyek Jadwal Rotasi Dokter Puskesmas Babakan.
