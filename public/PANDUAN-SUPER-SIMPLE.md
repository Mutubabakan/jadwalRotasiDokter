# 🚀 PANDUAN SUPER SIMPLE - 3 MENIT SETUP

Panduan paling sederhana untuk sinkronisasi data aplikasi ke Google Spreadsheet.

**TIDAK PERLU GITHUB!** Cukup copy-paste, langsung jalan! ✅

---

## 📋 Yang Anda Butuhkan

✅ Aplikasi web sudah jalan (sudah di-publish)  
✅ Akun Google (Gmail)  
✅ 3 menit waktu  

---

## 🎯 CARA PAKAI (3 LANGKAH MUDAH)

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
4. Buka file **[script-sederhana.js](script-sederhana.js)** dari repository Anda
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

**SELESAI!** 🎉 Spreadsheet Anda sudah siap!

---

## 🔄 CARA SYNC DATA (SETIAP KALI MAU UPDATE)

### Metode 1: Via Menu (Paling Mudah)

1. Buka spreadsheet
2. Klik menu **📅 Jadwal Rotasi** (muncul di menu bar)
3. Klik **🔄 Sync dari Aplikasi**
4. Akan muncul popup:
   - Buka aplikasi web Anda
   - Tab **Setting** → **Export Data** → **Copy to Clipboard**
   - Kembali ke popup, **Paste** data (Ctrl+V)
   - Klik **OK**
5. Tunggu alert **"✅ Sync berhasil!"**
6. **DONE!** ✅

### Metode 2: Via Script Editor

1. Buka Apps Script editor
2. Pilih fungsi: **`pasteData`**
3. Klik **▶️ Run**
4. Paste data JSON dari aplikasi
5. Klik **OK**
6. **DONE!** ✅

---

## 📤 CARA EXPORT DARI SPREADSHEET

Jika mau backup atau sync balik ke aplikasi:

### Metode 1: Via Menu
1. Menu **📅 Jadwal Rotasi** → **📤 Export ke File**
2. File akan tersimpan di Google Drive
3. Download atau copy isinya

### Metode 2: Via Script Editor
1. Pilih fungsi: **`exportToClipboard`**
2. Klik **▶️ Run**
3. File tersimpan di Google Drive

---

## 🗑️ HAPUS SEMUA DATA

Jika mau reset:

1. Menu **📅 Jadwal Rotasi** → **🗑️ Hapus Semua Data**
2. Klik **YES**
3. Semua data terhapus

---

## ✅ CHECKLIST SETUP

- [ ] Buat spreadsheet baru
- [ ] Buka Apps Script editor
- [ ] Copy script-sederhana.js
- [ ] Paste ke editor
- [ ] Save project
- [ ] Jalankan fungsi `setup()`
- [ ] Autorisasi permissions
- [ ] Verifikasi 4 sheet terbuat (Dokter, Jadwal, LiburNasional, Settings)

---

## 🎯 WORKFLOW HARIAN

```
1. Edit jadwal di aplikasi web
2. Tab Setting → Export Data → Copy to Clipboard
3. Buka spreadsheet
4. Menu → 🔄 Sync dari Aplikasi
5. Paste data → OK
6. DONE! ✅
```

**Total waktu:** 30 detik! 🚀

---

## 🐛 TROUBLESHOOTING

### Error: "Authorization required"
**Solusi:** Klik "Review Permissions" → "Allow"

### Error: "Script function not found"
**Solusi:** Pastikan sudah copy semua script dan save

### Data tidak muncul setelah sync
**Solusi:** 
1. Cek apakah sudah paste data dengan benar
2. Cek format JSON valid
3. Lihat sheet Dokter, Jadwal, dll

### Menu "Jadwal Rotasi" tidak muncul
**Solusi:** Refresh spreadsheet (F5)

---

## 📊 STRUKTUR SHEET

Setelah setup, akan ada 4 sheet:

### 1. Sheet "Dokter"
| id | name | color | isBackup |
|----|------|-------|----------|
| santi | dr. Santi | #1565c0 | false |

### 2. Sheet "Jadwal"
| date | k3a | k3b | igd | k2 | ket_json |
|------|-----|-----|-----|-----|----------|
| 2025-01-01 | santi | rakean | afif | likha | [] |

### 3. Sheet "LiburNasional"
| year | date | name |
|------|------|------|
| 2025 | 2025-01-01 | Tahun Baru |

### 4. Sheet "Settings"
| key | value |
|-----|-------|
| puskesmasName | Puskesmas Babakan |

---

## 💡 TIPS

### Tip 1: Bookmark Apps Script
Bookmark URL editor untuk akses cepat:
```
https://script.google.com/home/projects/YOUR_PROJECT_ID
```

### Tip 2: Gunakan Menu Custom
Setelah setup, gunakan menu **📅 Jadwal Rotasi** di spreadsheet, lebih mudah daripada buka editor.

### Tip 3: Export Rutin
Lakukan export dari spreadsheet secara berkala untuk backup.

---

## 🆘 BUTUH BANTUAN?

### Masalah Umum

**Q: Lupa cara sync?**  
A: Menu → 🔄 Sync dari Aplikasi → Paste → OK

**Q: Data tidak muncul?**  
A: Pastikan sudah export dari aplikasi dan paste dengan benar

**Q: Mau reset semua?**  
A: Menu → 🗑️ Hapus Semua Data → YES

**Q: Mau backup?**  
A: Menu → 📤 Export ke File

---

## 🎉 SELESAI!

Anda sekarang punya sistem sinkronisasi yang super simple!

**Workflow:**
1. Edit di aplikasi web
2. Export → Copy
3. Paste di spreadsheet
4. DONE! ✅

**Total waktu:** 30 detik per sync! 🚀

---

## 📞 QUICK REFERENCE

### Fungsi-Fungsi

| Fungsi | Kegunaan | Cara Jalankan |
|--------|----------|---------------|
| `setup()` | Buat sheet pertama kali | Dropdown → Run |
| `pasteData()` | Sync dari aplikasi | Menu → Sync dari Aplikasi |
| `exportToClipboard()` | Export ke file | Menu → Export ke File |
| `clearAllData()` | Hapus semua data | Menu → Hapus Semua Data |

### Menu Spreadsheet

| Menu | Kegunaan |
|------|----------|
| 🔄 Sync dari Aplikasi | Pull data dari aplikasi |
| 📤 Export ke File | Push data ke Google Drive |
| ⚙️ Setup Awal | Jalankan setup ulang |
| 🗑️ Hapus Semua Data | Reset semua data |

---

**Selamat! Sistem Anda sudah siap digunakan! 🎊**

**Next:** Coba sync data pertama kali dan lihat hasilnya di spreadsheet!

---

**Last Updated:** 2025-01-15  
**Version:** 1.0 (Simple Version)  
**Setup Time:** 3 menit  
**Sync Time:** 30 detik
