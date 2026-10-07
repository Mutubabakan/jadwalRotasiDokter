# 🚀 DEPLOY KE GITHUB PAGES - PANDUAN LENGKAP

Blank page sudah diperbaiki! Sekarang ikuti langkah ini:

---

## ✅ YANG SUDAH DIPERBAIKI

1. ✅ **vite.config.js** - Sudah ditambahkan `base: "./"` untuk relative path
2. ✅ **public/.nojekyll** - Sudah dibuat untuk mencegah Jekyll processing
3. ✅ **Build berhasil** - File sudah siap di-deploy

---

## 📋 LANGKAH DEPLOY (5 MENIT)

### Langkah 1: Commit dan Push Perubahan

Buka terminal/command prompt di folder project:

```bash
# Add semua file baru
git add .

# Commit dengan pesan yang jelas
git commit -m "Fix blank page - add base path for GitHub Pages"

# Push ke GitHub
git push
```

### Langkah 2: Tunggu GitHub Build

1. Buka repository di GitHub
2. Klik tab **Actions**
3. Tunggu workflow build selesai (biasanya 1-2 menit)
4. Pastikan statusnya **✅ Success**

### Langkah 3: Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik **Settings** (di menu atas)
3. Klik **Pages** (di sidebar kiri)
4. Di bagian **Build and deployment**:
   - **Source:** Pilih **Deploy from a branch**
   - **Branch:** Pilih **main** (atau branch yang Anda gunakan)
   - **Folder:** Pilih **/ (root)**
5. Klik **Save**

### Langkah 4: Tunggu Deploy

1. GitHub akan otomatis deploy
2. Tunggu 1-2 menit
3. Refresh halaman Settings → Pages
4. Akan muncul URL seperti:
   ```
   https://mutubabakan.github.io/jadwalRotasiDokter/
   ```

### Langkah 5: Test URL

1. Buka URL tersebut di browser
2. Aplikasi web harusnya muncul! ✅
3. Jika masih blank, tekan **Ctrl+Shift+R** untuk hard refresh

---

## 🔗 UPDATE URL DI APPS SCRIPT

Setelah GitHub Pages aktif:

### 1. Copy URL GitHub Pages
```
https://mutubabakan.github.io/jadwalRotasiDokter/
```

### 2. Update Apps Script

Buka Apps Script editor, edit baris ini:

```javascript
var WEB_APP_URL = 'https://mutubabakan.github.io/jadwalRotasiDokter/';
```

### 3. Save dan Deploy Ulang

1. Klik **💾 Save** (Ctrl+S)
2. Klik **Deploy** → **Manage deployments**
3. Klik icon **✏️ Edit** (pensil)
4. Pilih **Version:** New version
5. Klik **Deploy**
6. Buka URL Apps Script → iframe akan load dari GitHub Pages! ✅

---

## 🎯 CHECKLIST

- [ ] Commit dan push perubahan (`git add . && git commit -m "..." && git push`)
- [ ] Tunggu GitHub Actions build selesai
- [ ] Aktifkan GitHub Pages di Settings
- [ ] Tunggu deploy selesai (1-2 menit)
- [ ] Test URL GitHub Pages di browser
- [ ] Copy URL GitHub Pages
- [ ] Update URL di Apps Script
- [ ] Save dan deploy ulang Apps Script
- [ ] Test URL Apps Script → muncul aplikasi! ✅

---

## 🐛 TROUBLESHOOTING

### Masih Blank Page?

**Solusi 1: Hard Refresh**
- Tekan **Ctrl+Shift+R** (Windows/Linux)
- Atau **Cmd+Shift+R** (Mac)

**Solusi 2: Clear Cache**
- Buka DevTools (F12)
- Klik kanan pada tombol refresh
- Pilih **"Empty Cache and Hard Reload"**

**Solusi 3: Cek Console**
- Buka DevTools (F12)
- Klik tab **Console**
- Lihat error message
- Screenshot dan kirim untuk dibantu

**Solusi 4: Cek Network**
- Buka DevTools (F12)
- Klik tab **Network**
- Refresh halaman
- Lihat apakah file JS/CSS ter-load (status 200)
- Jika 404, berarti base path masih salah

### URL GitHub Pages 404?

**Solusi:**
- Pastikan sudah pilih branch yang benar (main)
- Pastikan folder yang dipilih adalah `/ (root)`
- Tunggu beberapa menit, GitHub butuh waktu untuk deploy
- Cek tab Actions untuk lihat status build

### Assets Tidak Ter-load?

**Solusi:**
- Pastikan `vite.config.js` sudah di-push ke GitHub
- Pastikan sudah commit dan push perubahan
- Cek di repository apakah file `vite.config.js` sudah ada
- Rebuild ulang: `npm run build` lalu push folder `dist/`

---

## 📊 ALUR KERJA

```
1. Edit vite.config.js → base: "./"
2. git add . && git commit && git push
3. GitHub Actions build otomatis
4. GitHub Pages deploy dari branch main
5. URL aktif: https://username.github.io/repo/
6. Update URL di Apps Script
7. Deploy ulang Apps Script
8. Buka URL Apps Script → iframe load dari GitHub Pages
9. DONE! ✅
```

---

## 💡 TIPS

### Tip 1: Gunakan Custom Domain (Opsional)
Jika punya domain sendiri, bisa di-setting di GitHub Pages:
- Settings → Pages → Custom domain
- Contoh: `jadwal.puskesmababakan.go.id`

### Tip 2: Enable HTTPS
GitHub Pages otomatis menyediakan HTTPS. Pastikan centang **Enforce HTTPS** di Settings → Pages.

### Tip 3: Preview Sebelum Deploy
Test lokal dulu sebelum push:
```bash
npm run dev
```
Buka `http://localhost:3000` untuk test.

### Tip 4: Cek Build Log
Jika ada error saat build, cek di tab **Actions** untuk lihat log lengkap.

---

## 🎉 SELESAI!

Setelah semua langkah di atas selesai:

✅ Aplikasi web aktif di GitHub Pages  
✅ URL Apps Script menampilkan iframe ke GitHub Pages  
✅ Data tersinkronisasi dengan Google Spreadsheet  
✅ Siap digunakan!  

---

## 📞 BUTUH BANTUAN?

Jika masih ada masalah:

1. **Screenshot error** di console browser (F12)
2. **Screenshot** halaman GitHub Pages yang blank
3. **Cek URL** GitHub Pages sudah benar
4. **Kirim informasi** untuk dibantu troubleshoot

---

**Last Updated:** 2025-01-15  
**Status:** ✅ Ready to Deploy
