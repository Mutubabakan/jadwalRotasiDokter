# 🔗 Links & Resources

Kumpulan link penting untuk setup dan troubleshooting.

---

## 🌐 Links Utama

### GitHub
- [GitHub Dashboard](https://github.com)
- [GitHub Settings](https://github.com/settings)
- [Personal Access Tokens](https://github.com/settings/tokens)
- [GitHub API Documentation](https://docs.github.com/en/rest)

### Google
- [Google Sheets](https://sheets.google.com)
- [Google Drive](https://drive.google.com)
- [Google Apps Script](https://script.google.com)
- [Apps Script Documentation](https://developers.google.com/apps-script)

---

## 📚 Dokumentasi

### File Dokumentasi (Urutan Baca)

1. **DEPLOYMENT-CHECKLIST.md** → Checklist deployment cepat
2. **QUICK-START.md** → Panduan 5 menit
3. **PANDUAN-VISUAL.md** → Panduan detail untuk pemula
4. **README-GAS.md** → Dokumentasi lengkap
5. **README-INDEX.md** → Index semua file
6. **CONFIG-CONTOH.js** → Contoh konfigurasi
7. **data-schema.json** → Schema data
8. **validator.js** → Script validasi

---

## 🛠️ Tools

### JSON
- [JSON Validator](https://jsonlint.com)
- [JSON Formatter](https://jsonformatter.org)
- [JSON to Excel](https://www.convertcsv.com/json-to-csv.htm)

### GitHub
- [GitHub Markdown Editor](https://jbt.github.io/markdown-editor)
- [GitHub Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet)

### Google Apps Script
- [Apps Script Reference](https://developers.google.com/apps-script/reference)
- [Apps Script Samples](https://developers.google.com/apps-script/samples)

---

## 📖 Panduan Berdasarkan Kebutuhan

### "Saya baru mulai"
1. Baca **DEPLOYMENT-CHECKLIST.md**
2. Ikuti langkah-langkahnya
3. Jika bingung, baca **PANDUAN-VISUAL.md**

### "Saya sudah setup, ingin update"
1. Edit di aplikasi web
2. Export data
3. Upload ke GitHub
4. Sync ke spreadsheet (manual atau auto)

### "Ada error"
1. Cek sheet **Log** di spreadsheet
2. Baca section Troubleshooting di **README-GAS.md**
3. Jalankan `testGitHubConnection()`
4. Upload **validator.js** dan validasi data

### "Ingin paham semua fitur"
1. Baca **README-GAS.md** (lengkap)
2. Lihat **CONFIG-CONTOH.js** (contoh)
3. Pelajari **data-schema.json** (struktur data)

---

## 🎯 Quick Actions

### Setup Awal
```
1. Buat spreadsheet
2. Extensions → Apps Script
3. Copy google-apps-script.js
4. Edit CONFIG
5. Run: setup()
6. Run: syncFromGitHub()
```

### Sync Manual
```
Menu → 📅 Jadwal Rotasi → 🔄 Sync dari GitHub
```

### Setup Auto Sync
```
Run: createHourlyTrigger()
```

### Test Koneksi
```
Run: testGitHubConnection()
```

### Validasi Data
```
Upload: validator.js
Run: validateExportFile()
```

---

## 📞 Support Resources

### Troubleshooting
- Sheet **Log** → Detail error
- **README-GAS.md** → Section Troubleshooting
- **PANDUAN-VISUAL.md** → Section Troubleshooting

### Community
- [Google Apps Script Community](https://groups.google.com/g/google-apps-script-community)
- [GitHub Community](https://github.community)
- [Stack Overflow: google-apps-script](https://stackoverflow.com/questions/tagged/google-apps-script)

---

## 🔐 Security

### GitHub Token
- [Create Token](https://github.com/settings/tokens/new)
- Scopes yang diperlukan: `repo`
- **JANGAN** commit token ke repository
- Simpan di tempat aman

### Best Practices
- Gunakan repository private untuk data sensitif
- Rotate token secara berkala
- Jangan share token di chat/email
- Gunakan environment variables jika possible

---

## 📊 Monitoring

### Cek Kesehatan
1. Sheet **Log** → Lihat aktivitas terakhir
2. Apps Script → Triggers → Cek status
3. Apps Script → Executions → Lihat error

### Metrics
- Jumlah sync per hari
- Error rate
- Data consistency
- Trigger performance

---

## 🎓 Learning Resources

### Google Apps Script
- [Official Documentation](https://developers.google.com/apps-script)
- [Apps Script Tutorial](https://developers.google.com/apps-script/guides/tutorials)
- [Apps Script Videos](https://www.youtube.com/results?search_query=google+apps+script+tutorial)

### GitHub API
- [REST API Documentation](https://docs.github.com/en/rest)
- [Authentication](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api#authentication)
- [Rate Limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)

### Google Sheets
- [Sheets API](https://developers.google.com/sheets/api)
- [Apps Script Sheets Service](https://developers.google.com/apps-script/reference/spreadsheet)

---

## 📝 Templates

### Commit Message
```
Update schedule data - [DATE]

- Exported from aplikasi web
- Synced to Google Spreadsheet
- [Optional: Notes about changes]
```

### Issue Template
```
**Description**
[Describe the issue]

**Steps to Reproduce**
1. [First step]
2. [Second step]
3. [And so on...]

**Expected Behavior**
[What you expected to happen]

**Actual Behavior**
[What actually happened]

**Screenshots/Logs**
[If applicable]

**Environment**
- Browser: [e.g. Chrome, Safari]
- Device: [e.g. Desktop, Mobile]
- Apps Script Version: [if known]
```

---

## 🔄 Workflow

### Daily Workflow
```
1. Edit jadwal di aplikasi web
2. Export data (Setting → Export)
3. Upload ke GitHub (data/export.json)
4. Auto sync ke spreadsheet (setiap jam)
5. Analisis di spreadsheet
```

### Weekly Workflow
```
1. Review log di spreadsheet
2. Backup data (download spreadsheet)
3. Validasi data (validator.js)
4. Update dokumentasi jika perlu
```

### Monthly Workflow
```
1. Rotate GitHub token (jika perlu)
2. Review dan optimize script
3. Archive old data
4. Update holidays untuk bulan depan
```

---

## 📦 File Structure

```
repository/
├── src/                          # Source code aplikasi
├── public/                       # File public
│   ├── google-apps-script.js    # Script utama
│   ├── validator.js             # Script validasi
│   ├── data-schema.json         # Schema data
│   ├── README-GAS.md            # Dokumentasi lengkap
│   ├── QUICK-START.md           # Panduan cepat
│   ├── PANDUAN-VISUAL.md        # Panduan detail
│   ├── CONFIG-CONTOH.js         # Contoh config
│   ├── DEPLOYMENT-CHECKLIST.md  # Checklist deployment
│   ├── README-INDEX.md          # Index dokumentasi
│   └── LINKS-RESOURCES.md       # File ini
├── data/                         # Folder data
│   └── export.json              # File data (upload dari aplikasi)
├── package.json
└── README.md
```

---

## ✅ Quick Reference

### Fungsi Penting
| Fungsi | Kegunaan | Cara Jalankan |
|--------|----------|---------------|
| `setup()` | Buat sheet | Dropdown → Run |
| `syncFromGitHub()` | Pull data | Dropdown → Run |
| `syncToGitHub()` | Push data | Dropdown → Run |
| `testGitHubConnection()` | Test koneksi | Dropdown → Run |
| `createHourlyTrigger()` | Auto sync | Dropdown → Run |
| `validateExportFile()` | Validasi data | Dropdown → Run |

### Menu Spreadsheet
| Menu | Kegunaan |
|------|----------|
| 🔄 Sync dari GitHub | Pull data manual |
| 📤 Sync ke GitHub | Push data (butuh token) |
| ⚙️ Setup Awal | Jalankan setup |
| 📊 Lihat Log | Lihat aktivitas |

---

## 🎉 Selesai!

Anda sekarang punya semua resource yang dibutuhkan!

**Mulai dari:** **DEPLOYMENT-CHECKLIST.md**

**Butuh bantuan?** Cek **README-GAS.md** atau sheet **Log**

---

**Last Updated:** 2025-01-15
**Version:** 1.0
