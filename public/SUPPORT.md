# 📞 SUPPORT & CONTACT

Informasi kontak dan support untuk Google Apps Script sync.

---

## 🆘 Butuh Bantuan?

### Langkah Pertama
1. **Cek Dokumentasi**
   - Baca FAQ.md untuk pertanyaan umum
   - Baca README-GAS.md untuk troubleshooting
   - Cek sheet Log untuk detail error

2. **Test Koneksi**
   - Jalankan `testGitHubConnection()`
   - Lihat hasilnya

3. **Validasi Data**
   - Upload validator.js
   - Jalankan `validateExportFile()`
   - Cek error/warning

### Jika Masih Ada Masalah
→ Lihat opsi support di bawah

---

## 📚 Self-Help Resources

### Dokumentasi
| File | Untuk Apa |
|------|-----------|
| **DEPLOYMENT-CHECKLIST.md** | Setup awal |
| **QUICK-START.md** | Panduan cepat |
| **PANDUAN-VISUAL.md** | Panduan detail |
| **README-GAS.md** | Dokumentasi lengkap |
| **FAQ.md** | Pertanyaan umum |
| **CHEAT-SHEET.md** | Referensi cepat |
| **CONFIG-CONTOH.js** | Contoh konfigurasi |

### Tools
| File | Fungsi |
|------|--------|
| **validator.js** | Validasi data |
| **data-schema.json** | Schema data |

### Links
| Link | Kegunaan |
|------|----------|
| Sheet Log | Lihat error detail |
| Apps Script Executions | Lihat execution history |
| Apps Script Triggers | Cek status auto sync |

---

## 🐛 Troubleshooting Guide

### Error Umum & Solusi

#### 1. Error 404 - File Not Found
**Penyebab:** Username, repo, atau path salah

**Solusi:**
```
1. Cek GITHUB_USERNAME → harus sama dengan profile GitHub
2. Cek GITHUB_REPO → harus sama dengan nama repository
3. Cek DATA_FILE_PATH → harus sesuai lokasi file
4. Test: Buka URL di browser
   https://github.com/USERNAME/REPO/blob/main/data/export.json
```

#### 2. Error 401 - Unauthorized
**Penyebab:** Repository private tapi token belum di-set

**Solusi:**
```
1. Buat GitHub token:
   - github.com/settings/tokens
   - Generate new token (classic)
   - ✅ Scope: repo
   - Copy token
2. Edit CONFIG.GITHUB_TOKEN
3. Paste token: 'ghp_xxxxxxxxxxxx'
4. Save dan jalankan ulang
```

#### 3. Error 403 - Forbidden
**Penyebab:** Token tidak punya permission

**Solusi:**
```
1. Buat token baru
2. ✅ Centang scope: repo (full control)
3. Paste token baru
```

#### 4. Data Kosong Setelah Sync
**Penyebab:** Format JSON tidak valid

**Solusi:**
```
1. Cek sheet Log untuk detail error
2. Upload validator.js
3. Jalankan validateExportFile()
4. Perbaiki error yang muncul
5. Sync ulang
```

#### 5. Menu Tidak Muncul
**Penyebab:** Script belum di-reload

**Solusi:**
```
1. Refresh spreadsheet (F5)
2. Tunggu beberapa detik
3. Menu akan muncul otomatis
```

#### 6. Trigger Tidak Jalan
**Penyebab:** Trigger disabled atau ada error

**Solusi:**
```
1. Buka Apps Script → Triggers
2. Cek status trigger autoSync
3. Pastikan status: Enabled
4. Cek Executions untuk lihat error
```

---

## 📖 Dokumentasi Berdasarkan Kebutuhan

### "Saya baru pertama kali"
**Baca:** DEPLOYMENT-CHECKLIST.md → PANDUAN-VISUAL.md

### "Saya sudah setup, ingin update"
**Baca:** QUICK-START.md → CHEAT-SHEET.md

### "Ada error"
**Baca:** README-GAS.md (Troubleshooting) → FAQ.md

### "Ingin paham semua"
**Baca:** README-GAS.md → CONFIG-CONTOH.js

### "Ingin validasi data"
**Upload:** validator.js → Run validateExportFile()

---

## 🔍 Debugging Steps

### Step 1: Cek Log
```
1. Buka sheet Log di spreadsheet
2. Lihat kolom status dan message
3. Catat error message
```

### Step 2: Test Koneksi
```
1. Di Apps Script editor
2. Pilih: testGitHubConnection
3. Klik Run
4. Lihat hasilnya
```

### Step 3: Validasi Data
```
1. Upload validator.js
2. Pilih: validateExportFile
3. Klik Run
4. Cek error/warning
```

### Step 4: Baca Dokumentasi
```
1. Buka README-GAS.md
2. Cari section Troubleshooting
3. Cari error message Anda
4. Ikuti solusinya
```

### Step 5: Cek FAQ
```
1. Buka FAQ.md
2. Cari pertanyaan yang mirip
3. Ikuti jawabannya
```

---

## 🎯 Quick Fixes

### Fix Cepat untuk Error Umum

#### Reset Setup
```
1. Hapus semua sheet (kecuali sheet default)
2. Jalankan setup() ulang
3. Jalankan syncFromGitHub()
```

#### Reset Trigger
```
1. Apps Script → Triggers
2. Hapus semua trigger
3. Jalankan createHourlyTrigger()
```

#### Reset Token
```
1. Buat token baru di GitHub
2. Update CONFIG.GITHUB_TOKEN
3. Save project
4. Test koneksi
```

#### Force Sync
```
1. Jalankan syncFromGitHub()
2. Tunggu hingga selesai
3. Cek sheet Log
```

---

## 📊 Monitoring & Maintenance

### Daily Check
- [ ] Cek sheet Log (ada error?)
- [ ] Verifikasi data terbaru
- [ ] Cek trigger status

### Weekly Maintenance
- [ ] Backup data (download spreadsheet)
- [ ] Review log (cari pattern error)
- [ ] Update dokumentasi jika perlu

### Monthly Tasks
- [ ] Rotate GitHub token
- [ ] Review dan optimize script
- [ ] Archive old data
- [ ] Update holidays

---

## 🆘 Escalation Path

### Level 1: Self-Help
1. Baca dokumentasi
2. Test koneksi
3. Validasi data
4. Cek log

### Level 2: Community
- Google Apps Script Community
- GitHub Community
- Stack Overflow

### Level 3: Internal
- Cek dengan tim IT
- Review konfigurasi
- Test di environment berbeda

---

## 📝 Information to Collect

Saat minta bantuan, siapkan informasi ini:

### 1. Error Message
```
- Dari sheet Log
- Dari Apps Script Executions
- Screenshot jika perlu
```

### 2. Konfigurasi
```
- GITHUB_USERNAME: [username]
- GITHUB_REPO: [repo name]
- DATA_FILE_PATH: [path]
- GITHUB_TOKEN: [ya/tidak] (jangan share token!)
```

### 3. Steps to Reproduce
```
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]
```

### 4. Expected vs Actual
```
Expected: [Yang diharapkan]
Actual: [Yang sebenarnya terjadi]
```

### 5. Environment
```
- Browser: [Chrome/Safari/dll]
- Device: [Desktop/Mobile]
- Apps Script Version: [jika tahu]
```

---

## 📞 Contact Channels

### Internal (Puskesmas Babakan)
- **Email:** [email-it@puskesmababakan.go.id]
- **WhatsApp:** [nomor-it]
- **Meeting:** [jadwal-rutin]

### External (Community)
- **Google Apps Script:** https://groups.google.com/g/google-apps-script-community
- **GitHub:** https://github.community
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/google-apps-script

---

## 🎓 Learning Resources

### Tutorials
- [Google Apps Script Tutorial](https://developers.google.com/apps-script/guides/tutorials)
- [GitHub API Guide](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api)
- [Google Sheets API](https://developers.google.com/sheets/api)

### Videos
- [Apps Script YouTube Channel](https://www.youtube.com/@googleappsscript)
- [GitHub Learning Lab](https://lab.github.com/)

### Documentation
- [Apps Script Reference](https://developers.google.com/apps-script/reference)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Google Sheets Service](https://developers.google.com/apps-script/reference/spreadsheet)

---

## 💡 Tips for Getting Help

### Do's
✅ Baca dokumentasi dulu  
✅ Cek log untuk detail error  
✅ Sertakan error message lengkap  
✅ Jelaskan steps to reproduce  
✅ Screenshot jika perlu  

### Don'ts
❌ Jangan share token/password  
❌ Jangan hanya bilang "error" tanpa detail  
❌ Jangan skip troubleshooting steps  
❌ Jangan panic, ikuti langkah-langkah  

---

## 🔄 Feedback & Suggestions

### Kirim Feedback
- Email ke: [feedback@puskesmababakan.go.id]
- Buat issue di repository GitHub
- Sampaikan di meeting rutin

### Suggest Features
- Buat issue di GitHub
- Label: "enhancement"
- Jelaskan kebutuhan Anda
- Diskusi dengan tim

### Report Bugs
- Buat issue di GitHub
- Label: "bug"
- Sertakan informasi lengkap (lihat section di atas)
- Screenshot jika perlu

---

## 📋 Support Hours

### Internal Support
- **Senin - Jumat:** 08:00 - 16:00
- **Sabtu - Minggu:** On-call untuk emergency
- **Response Time:** < 24 jam (working days)

### Community Support
- **24/7:** Google Groups, Stack Overflow
- **Response Time:** Bervariasi (biasanya < 48 jam)

---

## 🎉 Success Stories

### Case 1: Setup Pertama Kali
**Problem:** User baru pertama kali setup  
**Solution:** Ikuti PANDUAN-VISUAL.md step-by-step  
**Result:** Setup berhasil dalam 15 menit ✅

### Case 2: Error 404
**Problem:** Error 404 saat sync  
**Solution:** Cek dan perbaiki DATA_FILE_PATH  
**Result:** Sync berhasil ✅

### Case 3: Data Tidak Muncul
**Problem:** Data kosong setelah sync  
**Solution:** Validasi data dengan validator.js, perbaiki format  
**Result:** Data muncul dengan benar ✅

---

## 📞 Emergency Contact

### Critical Issues (System Down)
- **WhatsApp:** [nomor-emergency]
- **Email:** [emergency@puskesmababakan.go.id]
- **Response:** < 1 jam

### Non-Critical Issues
- **Email:** [support@puskesmababakan.go.id]
- **Response:** < 24 jam

---

**Last Updated:** 2025-01-15  
**Version:** 1.0  
**Status:** ✅ Active Support

---

**Need help? Start with:** FAQ.md → README-GAS.md (Troubleshooting) → Sheet Log
