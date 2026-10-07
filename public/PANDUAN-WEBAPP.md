# 🚀 PANDUAN SETUP GOOGLE APPS SCRIPT - VERSI WEB APP

Panduan lengkap untuk setup sinkronisasi data dari aplikasi web ke Google Spreadsheet.

---

## 📋 Yang Anda Butuhkan

✅ Aplikasi web sudah jalan (sudah di-publish)  
✅ Akun Google (Gmail)  
✅ 5 menit waktu  

---

## 🎯 CARA SETUP (5 LANGKAH MUDAH)

### 📌 LANGKAH 1: Buat Spreadsheet (1 menit)

1. Buka **[Google Sheets](https://sheets.google.com)**
2. Klik tombol **"+ Blank"** (spreadsheet kosong)
3. Beri nama: **"Jadwal Rotasi Dokter"**
4. Selesai! ✅

---

### 📌 LANGKAH 2: Copy Script (1 menit)

1. Di spreadsheet, klik menu **Extensions** → **Apps Script**
2. Akan terbuka tab baru dengan editor
3. **Hapus semua kode** yang ada di editor (Ctrl+A → Delete)
4. Buka file **[script-webapp.js](script-webapp.js)** dari repository Anda
5. **Select All** (Ctrl+A) dan **Copy** (Ctrl+C)
6. Kembali ke editor Apps Script, **Paste** (Ctrl+V)
7. Klik icon **💾 Save** (atau Ctrl+S)
8. Beri nama project: **"Jadwal Rotasi Sync"**

---

### 📌 LANGKAH 3: Jalankan Setup (1 menit)

1. Di dropdown fungsi (atas editor), pilih: **`setup`**
2. Klik tombol **▶️ Run**
3. Akan muncul popup minta izin:
   - Klik **Review Permissions**
   - Pilih akun Google Anda
   - Klik **Advanced**
   - Klik **Go to Jadwal Rotasi Sync (unsafe)**
   - Klik **Allow**
4. Tunggu hingga muncul: **"Execution completed"**
5. Kembali ke spreadsheet
6. Akan muncul alert: **"✅ Setup selesai!"**
7. Klik **OK**

**SELESAI!** Spreadsheet Anda sudah siap! 🎉

---

### 📌 LANGKAH 4: Deploy Web App (1 menit)

1. Di Apps Script editor, klik **Deploy** → **New deployment**
2. Klik icon ⚙️ (gear) di sebelah "Select type"
3. Pilih **Web app**
4. Isi konfigurasi:
   - **Description:** Jadwal Rotasi API
   - **Execute as:** Me (email Anda)
   - **Who has access:** Anyone
5. Klik **Deploy**
6. Akan muncul popup dengan **Web app URL**
7. **COPY URL INI!** (contoh: `https://script.google.com/macros/s/AKfycbx.../exec`)
8. Klik **Done**

**PENTING:** Simpan URL ini! Anda akan membutuhkannya di langkah berikutnya.

---

### 📌 LANGKAH 5: Koneksi ke Aplikasi Web (1 menit)

1. Buka aplikasi web Anda
2. Buka tab **Setting**
3. Scroll ke bagian **Google Apps Script URL**
4. **Paste URL** yang sudah di-copy di langkah 4
5. Klik **💾 Simpan URL**
6. Klik **🔄 Sync ke Spreadsheet**
7. Tunggu hingga muncul: **"✅ Data berhasil dikirim ke spreadsheet!"**

**SELESAI!** 🎊 Data dari aplikasi web sudah masuk ke Google Spreadsheet!

---

## 🔄 CARA SYNC DATA (SETIAP KALI MAU UPDATE)

**Hanya 10 detik!**

```
1. Di aplikasi web:
   Tab Setting → Klik "🔄 Sync ke Spreadsheet"

2. Tunggu hingga muncul: "✅ Data berhasil dikirim!"

3. DONE! ✅
```

**Total waktu:** 10 detik! 🚀

---

## 📊 CEK DATA DI SPREADSHEET

Setelah sync, buka spreadsheet Anda. Akan ada 4 sheet:

### 1. Sheet "Dokter"
Berisi data dokter:
- id
- name
- color
- isBackup

### 2. Sheet "Jadwal"
Berisi data jadwal:
- date
- k3a, k3b, igd, k2
- ket_json

### 3. Sheet "LiburNasional"
Berisi data hari libur:
- year
- date
- name

### 4. Sheet "Settings"
Berisi pengaturan:
- key
- value

---

## 🌐 AKSES DATA VIA URL

Anda bisa akses data langsung via URL:

### Get Semua Data
```
https://script.google.com/macros/s/YOUR_URL/exec?action=getAllData
```

### Get Dokter
```
https://script.google.com/macros/s/YOUR_URL/exec?action=getDoctors
```

### Get Jadwal Bulan Tertentu
```
https://script.google.com/macros/s/YOUR_URL/exec?action=getSchedule&month=2025-01
```

### Get Hari Libur Tahun Tertentu
```
https://script.google.com/macros/s/YOUR_URL/exec?action=getHolidays&year=2025
```

---

## 🐛 TROUBLESHOOTING

### Error: "Script function not found: doGet"
**Solusi:** 
- Pastikan sudah copy **script-webapp.js** (bukan script-sederhana.js)
- Pastikan sudah save dan deploy ulang

### Error: "Authorization required"
**Solusi:** 
- Klik "Review Permissions" → "Allow"
- Pastikan "Who has access" = "Anyone"

### Error: "Exception: You do not have permission to call fetch"
**Solusi:** 
- Ini error di aplikasi web, bukan di GAS
- Pastikan URL GAS sudah benar
- Pastikan GAS sudah di-deploy sebagai Web App

### Data tidak muncul di spreadsheet
**Solusi:** 
- Cek console browser (F12) untuk lihat error
- Pastikan URL GAS sudah di-save di aplikasi web
- Coba sync ulang

### Sync berhasil tapi data tidak muncul
**Solusi:** 
- Refresh spreadsheet (F5)
- Cek sheet Log (jika ada)
- Jalankan fungsi `showAllData()` di Apps Script

---

## 💡 TIPS

### Tip 1: Bookmark URL GAS
Bookmark URL Apps Script editor untuk akses cepat:
```
https://script.google.com/home/projects/YOUR_PROJECT_ID
```

### Tip 2: Simpan URL Web App
Simpan URL Web App di tempat aman (notes, email, dll). Anda akan membutuhkannya untuk sync.

### Tip 3: Test URL di Browser
Buka URL GAS di browser untuk test:
```
https://script.google.com/macros/s/YOUR_URL/exec
```
Harusnya muncul JSON dengan info endpoints.

### Tip 4: Cek Execution Log
Di Apps Script editor, klik **Executions** (sidebar kiri) untuk lihat log sync.

---

## 🎯 WORKFLOW HARIAN

```
┌─────────────────────────────────────────┐
│  1. Edit jadwal di aplikasi web        │
│  2. Tab Setting → Sync ke Spreadsheet  │
│  3. Tunggu "✅ Berhasil!"              │
│  4. DONE! ✅                           │
└─────────────────────────────────────────┘

Total waktu: 10 detik! 🚀
```

---

## 📞 QUICK REFERENCE

### Fungsi-Fungsi di Apps Script

| Fungsi | Kegunaan | Cara Jalankan |
|--------|----------|---------------|
| `setup()` | Buat sheet pertama kali | Dropdown → Run |
| `showAllData()` | Lihat semua data | Dropdown → Run |
| `clearAllData()` | Hapus semua data | Menu → Hapus Semua Data |
| `testWebApp()` | Lihat URL Web App | Dropdown → Run |

### Menu Spreadsheet

| Menu | Kegunaan |
|------|----------|
| ⚙️ Setup Awal | Jalankan setup ulang |
| 📊 Lihat Semua Data | Lihat data saat ini |
| 🗑️ Hapus Semua Data | Reset semua data |

### Endpoints Web App

| Endpoint | Kegunaan |
|----------|----------|
| `?action=getAllData` | Get semua data |
| `?action=getDoctors` | Get data dokter |
| `?action=getSchedule&month=YYYY-MM` | Get jadwal per bulan |
| `?action=getHolidays&year=YYYY` | Get hari libur per tahun |
| `?action=getSettings` | Get pengaturan |

---

## ✅ CHECKLIST SETUP

- [ ] Buat spreadsheet baru
- [ ] Buka Apps Script editor
- [ ] Copy script-webapp.js
- [ ] Paste ke editor
- [ ] Save project
- [ ] Jalankan fungsi `setup()`
- [ ] Autorisasi permissions
- [ ] Deploy sebagai Web App
- [ ] Copy URL Web App
- [ ] Paste URL di aplikasi web (tab Setting)
- [ ] Klik "Sync ke Spreadsheet"
- [ ] Verifikasi data di spreadsheet

---

## 🎉 SELESAI!

Anda sekarang punya sistem sinkronisasi yang super simple!

**Workflow:**
1. Edit di aplikasi web
2. Klik "Sync ke Spreadsheet"
3. DONE! ✅

**Total waktu:** 10 detik per sync! 🚀

---

## 🆘 BUTUH BANTUAN?

### Masalah Umum

**Q: Lupa URL Web App?**  
A: Buka Apps Script editor → Deploy → Manage deployments → Copy URL

**Q: Mau reset semua?**  
A: Menu → 🗑️ Hapus Semua Data → YES

**Q: Mau lihat data?**  
A: Menu → 📊 Lihat Semua Data

**Q: Sync error?**  
A: Cek console browser (F12) dan Execution log di Apps Script

---

**Last Updated:** 2025-01-15  
**Version:** 1.0 (Web App Version)  
**Setup Time:** 5 menit  
**Sync Time:** 10 detik
