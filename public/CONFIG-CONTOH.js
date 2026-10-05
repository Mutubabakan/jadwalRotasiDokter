/**
 * ============================================================================
 * CONTOH KONFIGURASI - GOOGLE APPS SCRIPT
 * ============================================================================
 * 
 * File ini adalah contoh konfigurasi yang bisa Anda copy dan edit.
 * Jangan copy file ini langsung, tapi edit file google-apps-script.js
 * 
 * CARA PAKAI:
 * 1. Buka file google-apps-script.js
 * 2. Cari bagian CONFIG (sekitar baris 30)
 * 3. Edit sesuai data Anda
 * 4. Save project
 */

// ============================================================================
// CONTOH 1: Repository Public (Tanpa Token)
// ============================================================================
const CONFIG_PUBLIC = {
  // GitHub Repository
  GITHUB_USERNAME: 'drabdi',                    // Username GitHub Anda
  GITHUB_REPO: 'jadwal-rotasi-dokter',          // Nama repository
  GITHUB_BRANCH: 'main',                        // Branch (main atau master)
  GITHUB_TOKEN: '',                             // Kosongkan untuk repo public
  
  // Path file data di GitHub
  DATA_FILE_PATH: 'data/export.json',           // Path file JSON
  
  // Spreadsheet ID (kosongkan untuk spreadsheet aktif)
  SPREADSHEET_ID: '',
  
  // Sheet Names (tidak perlu diubah)
  SHEETS: {
    DOKTER: 'Dokter',
    JADWAL: 'Jadwal',
    LIBUR: 'LiburNasional',
    SETTINGS: 'Settings',
    LOG: 'Log'
  }
};

// ============================================================================
// CONTOH 2: Repository Private (Dengan Token)
// ============================================================================
const CONFIG_PRIVATE = {
  // GitHub Repository
  GITHUB_USERNAME: 'drabdi',
  GITHUB_REPO: 'jadwal-rotasi-dokter',
  GITHUB_BRANCH: 'main',
  GITHUB_TOKEN: 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // ← ISI TOKEN ANDA
  
  // Path file data di GitHub
  DATA_FILE_PATH: 'data/export.json',
  
  // Spreadsheet ID (kosongkan untuk spreadsheet aktif)
  SPREADSHEET_ID: '',
  
  // Sheet Names
  SHEETS: {
    DOKTER: 'Dokter',
    JADWAL: 'Jadwal',
    LIBUR: 'LiburNasional',
    SETTINGS: 'Settings',
    LOG: 'Log'
  }
};

// ============================================================================
// CONTOH 3: Multiple Spreadsheet (Dengan ID Spesifik)
// ============================================================================
const CONFIG_MULTI_SHEET = {
  // GitHub Repository
  GITHUB_USERNAME: 'drabdi',
  GITHUB_REPO: 'jadwal-rotasi-dokter',
  GITHUB_BRANCH: 'main',
  GITHUB_TOKEN: '',
  
  // Path file data di GitHub
  DATA_FILE_PATH: 'data/export.json',
  
  // Spreadsheet ID (WAJIB ISI untuk multi-sheet)
  // Cara dapat ID:
  // 1. Buka spreadsheet di browser
  // 2. Lihat URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
  // 3. Copy bagian SPREADSHEET_ID
  SPREADSHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  
  // Sheet Names
  SHEETS: {
    DOKTER: 'Dokter',
    JADWAL: 'Jadwal',
    LIBUR: 'LiburNasional',
    SETTINGS: 'Settings',
    LOG: 'Log'
  }
};

// ============================================================================
// CONTOH 4: Custom Path dan Branch
// ============================================================================
const CONFIG_CUSTOM = {
  // GitHub Repository
  GITHUB_USERNAME: 'drabdi',
  GITHUB_REPO: 'jadwal-rotasi-dokter',
  GITHUB_BRANCH: 'production',                // Branch custom
  GITHUB_TOKEN: '',
  
  // Path file data di GitHub (folder custom)
  DATA_FILE_PATH: 'backup/data/jadwal-export.json',  // Path custom
  
  // Spreadsheet ID
  SPREADSHEET_ID: '',
  
  // Sheet Names (bisa di-custom)
  SHEETS: {
    DOKTER: 'Data_Dokter',
    JADWAL: 'Data_Jadwal',
    LIBUR: 'Data_Libur',
    SETTINGS: 'Data_Settings',
    LOG: 'Activity_Log'
  }
};

// ============================================================================
// CARA MENDAPATKAN GITHUB TOKEN
// ============================================================================
/*
1. Login ke GitHub
2. Buka: https://github.com/settings/tokens
3. Klik "Generate new token" → "Generate new token (classic)"
4. Isi form:
   - Note: "Google Apps Script - Jadwal Rotasi"
   - Expiration: "90 days" atau "No expiration"
   - Select scopes: ✅ repo (Full control of private repositories)
5. Klik "Generate token"
6. COPY TOKEN (ghp_xxxxxxxxxxxx)
7. Paste ke CONFIG.GITHUB_TOKEN

⚠️ PENTING:
- Token hanya muncul SEKALI saat di-generate
- Jika hilang, harus generate ulang
- JAGA KERAHASIAAN TOKEN
- Jangan commit token ke repository
*/

// ============================================================================
// CARA MENDAPATKAN SPREADSHEET ID
// ============================================================================
/*
1. Buka Google Spreadsheet di browser
2. Lihat URL di address bar:
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
3. Copy bagian antara /d/ dan /edit
   Contoh: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
4. Paste ke CONFIG.SPREADSHEET_ID

💡 TIPS:
- Kosongkan SPREADSHEET_ID jika hanya pakai 1 spreadsheet
- Isi SPREADSHEET_ID jika ingin sync ke spreadsheet spesifik
*/

// ============================================================================
// STRUKTUR FILE DI GITHUB
// ============================================================================
/*
Repository Anda harus memiliki struktur seperti ini:

jadwal-rotasi-dokter/
├── src/                          ← Source code aplikasi
│   ├── components/
│   ├── utils/
│   └── App.tsx
├── public/                       ← File public
│   ├── google-apps-script.js    ← Script ini
│   └── README-GAS.md
├── data/                         ← Folder data (BUAT INI)
│   └── export.json              ← File hasil export dari aplikasi
├── package.json
└── README.md

CARA UPLOAD DATA:
1. Di aplikasi web: Setting > Export Data > Download
2. Rename file menjadi: export.json
3. Upload ke folder data/ di repository
4. Commit dan push:
   git add data/export.json
   git commit -m "Update schedule data"
   git push
*/

// ============================================================================
// VERIFIKASI KONFIGURASI
// ============================================================================
/*
Setelah edit CONFIG, jalankan fungsi ini untuk test:

1. Buka Apps Script editor
2. Pilih fungsi: testGitHubConnection
3. Klik Run
4. Lihat hasilnya:
   ✅ "Koneksi berhasil!" → Config benar
   ❌ "Koneksi gagal!" → Cek error message

ERROR UMUM:
- 404 Not Found → Username/repo/path salah
- 401 Unauthorized → Butuh token untuk repo private
- 403 Forbidden → Token tidak punya permission
*/

// ============================================================================
// NEXT STEPS
// ============================================================================
/*
Setelah config benar:

1. Jalankan setup()
   → Membuat sheet di spreadsheet

2. Jalankan syncFromGitHub()
   → Pull data dari GitHub

3. Verifikasi data di sheet
   → Cek sheet Dokter, Jadwal, dll

4. (Opsional) Jalankan createHourlyTrigger()
   → Setup auto sync setiap jam

5. Selesai! ✅
*/
