# 🔧 FIX BLANK PAGE - GitHub Pages

Blank page terjadi karena **base path** di Vite tidak cocok dengan GitHub Pages.

---

## ✅ SOLUSI 1: Deploy ke Netlify (PALING MUDAH!)

**Rekomendasi:** Deploy ke Netlify, tidak perlu konfigurasi base path!

### Langkah 1: Buka Netlify
1. Buka: https://app.netlify.com
2. Login dengan GitHub

### Langkah 2: Deploy dari GitHub
1. Klik **"Add new site"** → **"Import an existing project"**
2. Pilih **GitHub**
3. Pilih repository: **jadwalRotasiDokter**
4. Konfigurasi build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Klik **"Deploy site"**

### Langkah 3: Dapat URL
1. Tunggu 1-2 menit
2. Netlify akan kasih URL seperti:
   ```
   https://random-name-12345.netlify.app
   ```
3. URL ini langsung bisa dipakai! ✅

### Langkah 4: Update Apps Script
1. Copy URL Netlify
2. Buka Apps Script editor
3. Edit baris ini di script:
   ```javascript
   var WEB_APP_URL = 'https://random-name-12345.netlify.app/';
   ```
4. Save dan deploy ulang

**SELESAI!** ✅

---

## ✅ SOLUSI 2: Fix GitHub Pages (Lebih Ribet)

### Langkah 1: Edit vite.config.ts
Buka file `vite.config.ts` dan tambahkan `base`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/jadwalRotasiDokter/', // ← TAMBAHKAN INI
})
```

### Langkah 2: Commit dan Push
```bash
git add vite.config.ts
git commit -m "Fix base path for GitHub Pages"
git push
```

### Langkah 3: Tunggu GitHub Pages Build
1. GitHub akan otomatis rebuild
2. Tunggu 1-2 menit
3. Refresh URL GitHub Pages

### Langkah 4: Test
Buka URL GitHub Pages lagi. Jika masih blank, cek console browser (F12) untuk lihat error.

---

## 🎯 REKOMENDASI SAYA

**Gunakan Netlify!** Karena:
- ✅ Tidak perlu konfigurasi base path
- ✅ Deploy otomatis dari GitHub
- ✅ URL langsung bisa dipakai
- ✅ Gratis dan cepat
- ✅ HTTPS otomatis

**GitHub Pages** lebih ribet karena perlu edit konfigurasi Vite.

---

## 📊 PERBANDINGAN

| Fitur | Netlify | GitHub Pages |
|-------|---------|--------------|
| Setup | ⭐ Sangat Mudah | ⭐⭐ Agak Ribet |
| Base Path | ✅ Otomatis | ❌ Perlu Edit Config |
| Deploy Time | 1-2 menit | 1-2 menit |
| URL | `nama.netlify.app` | `username.github.io/repo` |
| HTTPS | ✅ Otomatis | ✅ Otomatis |
| Custom Domain | ✅ Bisa | ✅ Bisa |

---

## 🚀 LANGKAH-DETAILED: NETLIFY

### 1. Buka Netlify
```
https://app.netlify.com
```

### 2. Sign Up / Login
- Klik **"Sign up"** (jika belum punya akun)
- Pilih **"GitHub"** untuk login dengan GitHub

### 3. Import Project
- Klik **"Add new site"**
- Klik **"Import an existing project"**
- Klik **"GitHub"**
- Authorize Netlify untuk akses GitHub

### 4. Pilih Repository
- Cari dan pilih: **jadwalRotasiDokter**
- Klik **"Select"**

### 5. Konfigurasi Build
```
Branch to deploy: main
Build command: npm run build
Publish directory: dist
```

### 6. Deploy
- Klik **"Deploy site"**
- Tunggu 1-2 menit
- Akan muncul URL seperti: `https://fancy-name-123.netlify.app`

### 7. Test URL
- Buka URL tersebut di browser
- Aplikasi web harusnya muncul! ✅

### 8. Update Apps Script
1. Copy URL Netlify
2. Buka Apps Script editor
3. Edit baris:
   ```javascript
   var WEB_APP_URL = 'https://fancy-name-123.netlify.app/';
   ```
4. Save (Ctrl+S)
5. Deploy → Manage deployments → Edit → New version → Deploy
6. Buka URL Apps Script → iframe akan load dari Netlify! ✅

---

## 🐛 TROUBLESHOOTING

### Blank Page di Netlify?
- Cek console browser (F12) untuk error
- Pastikan build berhasil di Netlify dashboard
- Cek tab "Deploys" untuk lihat log build

### Assets tidak ter-load?
- Pastikan `Publish directory` adalah `dist`
- Pastikan `Build command` adalah `npm run build`

### URL Apps Script masih blank?
- Pastikan URL Netlify sudah benar di script
- Pastikan sudah deploy ulang Apps Script
- Clear cache browser (Ctrl+Shift+R)

---

## ✅ CHECKLIST

### Netlify (Recommended)
- [ ] Buka Netlify
- [ ] Login dengan GitHub
- [ ] Import repository
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Deploy
- [ ] Copy URL Netlify
- [ ] Update URL di Apps Script
- [ ] Deploy ulang Apps Script
- [ ] Test URL Apps Script → muncul aplikasi! ✅

### GitHub Pages (Alternative)
- [ ] Edit `vite.config.ts` → tambah `base: '/jadwalRotasiDokter/'`
- [ ] Commit dan push
- [ ] Tunggu GitHub Pages rebuild
- [ ] Test URL
- [ ] Update URL di Apps Script
- [ ] Deploy ulang Apps Script

---

**Rekomendasi:** Gunakan **Netlify** untuk hasil yang lebih mudah dan cepat! 🚀
