# 🔧 CARA UPDATE SCRIPT (PERBAIKI ERROR)

Error "SyntaxError: Invalid left-hand side expression" sudah diperbaiki!

---

## 🚀 LANGKAH UPDATE (2 MENIT)

### 📌 Langkah 1: Copy Script Baru

1. Buka file **[script-webapp.js](script-webapp.js)** yang sudah di-update
2. **Select All** (Ctrl+A) dan **Copy** (Ctrl+C)

### 📌 Langkah 2: Paste di Apps Script

1. Buka Apps Script editor
2. **Hapus semua kode** yang lama (Ctrl+A → Delete)
3. **Paste** script baru (Ctrl+V)
4. Klik **💾 Save** (Ctrl+S)

### 📌 Langkah 3: Deploy Ulang

1. Klik **Deploy** → **Manage deployments**
2. Klik icon **✏️ Edit** (pensil) di sebelah deployment
3. Pilih **Version:** New version
4. Klik **Deploy**
5. **COPY URL** yang sama

### 📌 Langkah 4: Test

Buka URL di browser. Sekarang akan muncul **dashboard HTML** yang cantik! 🎉

---

## ✅ SELESAI!

**Error sudah diperbaiki!** 

Dashboard HTML akan muncul saat buka URL.

---

## 🎯 YANG DIPERBAIKI

### ❌ Sebelum (Error)
```javascript
const html = `
  <!DOCTYPE html>
  ...
  ${scriptUrl}
  ...
`;
```
**Error:** Template literal tidak didukung Google Apps Script

### ✅ Sesudah (Fixed)
```javascript
var html = '<!DOCTYPE html>' +
  '...' +
  scriptUrl +
  '...';
```
**Success:** String concatenation biasa, compatible dengan GAS

---

## 🔄 WORKFLOW SETELAH UPDATE

```
1. Edit jadwal di aplikasi web
2. Tab Setting → Sync ke Spreadsheet
3. DONE! ✅
```

---

## 🐛 JIKA MASIH ERROR

### Error lain muncul?
- Pastikan sudah **hapus semua kode lama**
- Pastikan sudah **deploy ulang** (bukan cuma save)
- Cek **Execution log** di Apps Script untuk detail error

### Dashboard tidak muncul?
- Refresh browser (Ctrl+F5)
- Clear cache browser
- Coba buka di incognito mode

---

## 📞 BUTUH BANTUAN?

Screenshot error message dan kirim untuk dibantu troubleshoot.

---

**Update time:** 2 menit  
**Status:** ✅ Fixed!
