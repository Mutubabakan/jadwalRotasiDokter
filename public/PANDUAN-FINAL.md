# 🚀 PANDUAN SETUP - VERSI FINAL (SUPER SIMPLE!)

**TIDAK PERLU GITHUB!**  
**HANYA 1 FILE!**  
**SETUP 3 MENIT!**

---

## 📋 Yang Anda Butuhkan

✅ Akun Google (Gmail)  
✅ 3 menit waktu  

---

## 🎯 CARA SETUP (3 LANGKAH)

### 📌 LANGKAH 1: Buat Spreadsheet (1 menit)

1. Buka **[Google Sheets](https://sheets.google.com)**
2. Klik **"+ Blank"**
3. Beri nama: **"Jadwal Rotasi Dokter"**

---

### 📌 LANGKAH 2: Copy Script (1 menit)

1. Klik menu **Extensions** → **Apps Script**
2. **Hapus semua kode** yang ada (Ctrl+A → Delete)
3. Buka file **[script-webapp.js](script-webapp.js)**
4. **Select All** (Ctrl+A) dan **Copy** (Ctrl+C)
5. **Paste** ke editor Apps Script (Ctrl+V)
6. Klik **💾 Save** (Ctrl+S)
7. Beri nama: **"Jadwal Rotasi Sync"**

---

### 📌 LANGKAH 3: Deploy (1 menit)

1. Di dropdown fungsi, pilih: **`setup`**
2. Klik **▶️ Run**
3. Klik **Review Permissions** → **Allow**
4. Tunggu **"Execution completed"**
5. Klik **Deploy** → **New deployment**
6. Klik icon ⚙️ → Pilih **Web app**
7. Isi:
   - **Execute as:** Me
   - **Who has access:** Anyone
8. Klik **Deploy**
9. **COPY URL** yang muncul!

---

## ✅ SELESAI!

Buka URL yang sudah di-copy di browser. Akan muncul **halaman dashboard** yang cantik! 🎉

---

## 🔄 CARA SYNC DARI APLIKASI WEB

1. Buka aplikasi web Anda
2. Tab **Setting**
3. Paste URL di **"Google Apps Script URL"**
4. Klik **"💾 Simpan URL"**
5. Klik **"🔄 Sync ke Spreadsheet"**
6. **DONE!** ✅

---

## 🎯 FITUR DASHBOARD

Saat buka URL, akan muncul:

✅ **Statistik Data** - jumlah dokter, jadwal, libur, settings  
✅ **API Endpoints** - daftar semua endpoint yang tersedia  
✅ **Preview Data** - lihat data langsung di browser  
✅ **Responsive** - bisa dibuka di HP/tablet  

---

## 📊 CEK DATA DI SPREADSHEET

Setelah sync, buka spreadsheet. Ada 4 sheet:

- ✅ **Dokter** - data 5 dokter
- ✅ **Jadwal** - data jadwal rotasi
- ✅ **LiburNasional** - data hari libur
- ✅ **Settings** - pengaturan aplikasi

---

## 🌐 TEST API DI BROWSER

Buka URL dengan endpoint:

```
Lihat semua data:
https://script.google.com/macros/s/YOUR_URL/exec?action=getAllData

Lihat dokter saja:
https://script.google.com/macros/s/YOUR_URL/exec?action=getDoctors

Lihat jadwal bulan Januari 2025:
https://script.google.com/macros/s/YOUR_URL/exec?action=getSchedule&month=2025-01
```

---

## 🔄 WORKFLOW HARIAN

```
1. Edit jadwal di aplikasi web
2. Tab Setting → Sync ke Spreadsheet
3. DONE! ✅

Total waktu: 10 detik! 🚀
```

---

## 🐛 TROUBLESHOOTING

### Muncul JSON, bukan HTML?
**Solusi:** Pastikan sudah deploy ulang setelah update script

### Error "doGet not found"?
**Solusi:** Pastikan copy **script-webapp.js** (bukan script-sederhana.js)

### Data tidak muncul?
**Solusi:** Refresh spreadsheet (F5)

---

## ✅ CHECKLIST

- [ ] Buat spreadsheet
- [ ] Copy script-webapp.js
- [ ] Jalankan setup()
- [ ] Deploy sebagai Web App
- [ ] Copy URL
- [ ] Buka URL di browser → muncul dashboard!
- [ ] Paste URL di aplikasi web
- [ ] Sync ke spreadsheet

---

## 🎉 SELESAI!

**Setup:** 3 menit  
**Sync:** 10 detik  
**Tidak perlu GitHub!** ✅  
**Dashboard HTML cantik!** ✅  

---

**Next:** Buka URL Web App di browser dan lihat dashboard-nya! 🚀
