/**
 * ============================================================================
 * GOOGLE APPS SCRIPT - JADWAL ROTASI DOKTER PUSKESMAS BABAKAN
 * ============================================================================
 * 
 * Script ini untuk sinkronisasi data antara GitHub dan Google Spreadsheet
 * 
 * CARA SETUP:
 * 1. Buka Google Spreadsheet baru
 * 2. Extensions > Apps Script
 * 3. Hapus semua kode, paste script ini
 * 4. Ganti CONFIG di bawah dengan data Anda
 * 5. Jalankan fungsi setup() sekali untuk membuat sheet
 * 6. Jalankan syncFromGitHub() untuk pull data dari GitHub
 * 7. (Opsional) Buat trigger untuk auto-sync setiap jam
 * 
 * STRUKTUR SHEET:
 * - Dokter: Data dokter (id, name, color, isBackup)
 * - Jadwal: Jadwal rotasi per bulan (date, k3a, k3b, igd, k2, ket)
 * - LiburNasional: Hari libur per tahun (year, date, name)
 * - Settings: Pengaturan aplikasi (key, value)
 * - Log: Log aktivitas sync (timestamp, action, status, message)
 */

// ============================================================================
// KONFIGURASI - GANTI DENGAN DATA ANDA
// ============================================================================
const CONFIG = {
  // GitHub Repository
  GITHUB_USERNAME: 'username-anda',           // Ganti dengan username GitHub Anda
  GITHUB_REPO: 'jadwal-rotasi-dokter',        // Ganti dengan nama repository
  GITHUB_BRANCH: 'main',                      // Branch yang digunakan
  GITHUB_TOKEN: '',                           // Personal Access Token (opsional, untuk private repo)
  
  // Path file data di GitHub (biasanya di folder public atau root)
  DATA_FILE_PATH: 'data/export.json',         // Path file JSON yang di-export dari aplikasi
  
  // Spreadsheet ID (kosongkan untuk menggunakan spreadsheet aktif)
  SPREADSHEET_ID: '',                         // Kosongkan untuk menggunakan spreadsheet aktif
  
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
// FUNGSI UTAMA - JANGAN DIUBAH
// ============================================================================

/**
 * Setup awal - Jalankan sekali untuk membuat struktur sheet
 */
function setup() {
  const ss = getSpreadsheet();
  
  // Buat sheet Dokter
  let dokterSheet = ss.getSheetByName(CONFIG.SHEETS.DOKTER);
  if (!dokterSheet) {
    dokterSheet = ss.insertSheet(CONFIG.SHEETS.DOKTER);
    dokterSheet.appendRow(['id', 'name', 'color', 'isBackup']);
    dokterSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Buat sheet Jadwal
  let jadwalSheet = ss.getSheetByName(CONFIG.SHEETS.JADWAL);
  if (!jadwalSheet) {
    jadwalSheet = ss.insertSheet(CONFIG.SHEETS.JADWAL);
    jadwalSheet.appendRow(['date', 'k3a', 'k3b', 'igd', 'k2', 'ket_json']);
    jadwalSheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Buat sheet LiburNasional
  let liburSheet = ss.getSheetByName(CONFIG.SHEETS.LIBUR);
  if (!liburSheet) {
    liburSheet = ss.insertSheet(CONFIG.SHEETS.LIBUR);
    liburSheet.appendRow(['year', 'date', 'name']);
    liburSheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Buat sheet Settings
  let settingsSheet = ss.getSheetByName(CONFIG.SHEETS.SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(CONFIG.SHEETS.SETTINGS);
    settingsSheet.appendRow(['key', 'value']);
    settingsSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Buat sheet Log
  let logSheet = ss.getSheetByName(CONFIG.SHEETS.LOG);
  if (!logSheet) {
    logSheet = ss.insertSheet(CONFIG.SHEETS.LOG);
    logSheet.appendRow(['timestamp', 'action', 'status', 'message']);
    logSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  log('SETUP', 'SUCCESS', 'Setup selesai. Sheet berhasil dibuat.');
  SpreadsheetApp.getUi().alert('Setup selesai!\n\nSheet yang dibuat:\n- Dokter\n- Jadwal\n- LiburNasional\n- Settings\n- Log\n\nSelanjutnya jalankan syncFromGitHub() untuk pull data.');
}

/**
 * Sync data dari GitHub ke Spreadsheet
 */
function syncFromGitHub() {
  try {
    log('SYNC_START', 'INFO', 'Memulai sync dari GitHub...');
    
    // Fetch data dari GitHub
    const data = fetchFromGitHub();
    
    if (!data) {
      log('SYNC_FAIL', 'ERROR', 'Gagal fetch data dari GitHub');
      throw new Error('Data dari GitHub kosong atau tidak valid');
    }
    
    // Import data ke sheet
    importData(data);
    
    log('SYNC_SUCCESS', 'SUCCESS', 'Sync dari GitHub berhasil');
    SpreadsheetApp.getUi().alert('Sync berhasil!\n\nData dari GitHub telah diimport ke spreadsheet.');
    
  } catch (error) {
    log('SYNC_FAIL', 'ERROR', error.toString());
    SpreadsheetApp.getUi().alert('Sync gagal!\n\nError: ' + error.message);
  }
}

/**
 * Sync data dari Spreadsheet ke GitHub (via GitHub API)
 */
function syncToGitHub() {
  try {
    log('SYNC_START', 'INFO', 'Memulai sync ke GitHub...');
    
    // Export data dari sheet
    const data = exportData();
    
    // Push ke GitHub
    pushToGitHub(data);
    
    log('SYNC_SUCCESS', 'SUCCESS', 'Sync ke GitHub berhasil');
    SpreadsheetApp.getUi().alert('Sync berhasil!\n\nData telah diupdate di GitHub.');
    
  } catch (error) {
    log('SYNC_FAIL', 'ERROR', error.toString());
    SpreadsheetApp.getUi().alert('Sync gagal!\n\nError: ' + error.message);
  }
}

/**
 * Auto sync - Jalankan dengan trigger
 */
function autoSync() {
  try {
    log('AUTO_SYNC', 'INFO', 'Auto sync dimulai');
    const data = fetchFromGitHub();
    if (data) {
      importData(data);
      log('AUTO_SYNC', 'SUCCESS', 'Auto sync berhasil');
    }
  } catch (error) {
    log('AUTO_SYNC', 'ERROR', error.toString());
  }
}

// ============================================================================
// FUNGSI GITHUB API
// ============================================================================

/**
 * Fetch data dari GitHub
 */
function fetchFromGitHub() {
  const url = `https://api.github.com/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.DATA_FILE_PATH}?ref=${CONFIG.GITHUB_BRANCH}`;
  
  const options = {
    method: 'get',
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Google-Apps-Script'
    }
  };
  
  // Tambahkan token jika ada (untuk private repo)
  if (CONFIG.GITHUB_TOKEN) {
    options.headers['Authorization'] = `token ${CONFIG.GITHUB_TOKEN}`;
  }
  
  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());
  
  // Decode base64 content
  const content = Utilities.base64Decode(json.content);
  const text = Utilities.newBlob(content).getDataAsString();
  
  return JSON.parse(text);
}

/**
 * Push data ke GitHub
 */
function pushToGitHub(data) {
  if (!CONFIG.GITHUB_TOKEN) {
    throw new Error('GitHub Token diperlukan untuk push. Silakan set CONFIG.GITHUB_TOKEN');
  }
  
  const url = `https://api.github.com/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.DATA_FILE_PATH}`;
  
  // Get current file SHA (untuk update)
  let sha = null;
  try {
    const getUrl = `https://api.github.com/repos/${CONFIG.GITHUB_USERNAME}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.DATA_FILE_PATH}?ref=${CONFIG.GITHUB_BRANCH}`;
    const getResponse = UrlFetchApp.fetch(getUrl, {
      headers: {
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    sha = JSON.parse(getResponse.getContentText()).sha;
  } catch (e) {
    // File belum ada, tidak perlu SHA
  }
  
  const content = Utilities.base64Encode(JSON.stringify(data, null, 2));
  
  const payload = {
    message: `Auto sync dari Spreadsheet - ${new Date().toISOString()}`,
    content: content,
    branch: CONFIG.GITHUB_BRANCH
  };
  
  if (sha) {
    payload.sha = sha;
  }
  
  const options = {
    method: 'put',
    headers: {
      'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, options);
}

// ============================================================================
// FUNGSI IMPORT/EXPORT DATA
// ============================================================================

/**
 * Import data JSON ke spreadsheet
 */
function importData(data) {
  const ss = getSpreadsheet();
  
  // Import Doctors
  if (data.doctors && data.doctors.length > 0) {
    const dokterSheet = ss.getSheetByName(CONFIG.SHEETS.DOKTER);
    dokterSheet.getRange(2, 1, dokterSheet.getLastRow() - 1, 4).clearContent();
    
    const doctorData = data.doctors.map(d => [d.id, d.name, d.color, d.isBackup]);
    dokterSheet.getRange(2, 1, doctorData.length, 4).setValues(doctorData);
    
    log('IMPORT', 'INFO', `${data.doctors.length} dokter diimport`);
  }
  
  // Import Schedule
  if (data.schedule) {
    const jadwalSheet = ss.getSheetByName(CONFIG.SHEETS.JADWAL);
    jadwalSheet.getRange(2, 1, Math.max(jadwalSheet.getLastRow() - 1, 1), 6).clearContent();
    
    const scheduleData = [];
    Object.keys(data.schedule).forEach(month => {
      data.schedule[month].forEach(entry => {
        scheduleData.push([
          entry.date,
          entry.k3a || '',
          entry.k3b || '',
          entry.igd || '',
          entry.k2 || '',
          JSON.stringify(entry.ket || [])
        ]);
      });
    });
    
    if (scheduleData.length > 0) {
      jadwalSheet.getRange(2, 1, scheduleData.length, 6).setValues(scheduleData);
      log('IMPORT', 'INFO', `${scheduleData.length} jadwal diimport`);
    }
  }
  
  // Import Holidays
  if (data.holidays) {
    const liburSheet = ss.getSheetByName(CONFIG.SHEETS.LIBUR);
    liburSheet.getRange(2, 1, Math.max(liburSheet.getLastRow() - 1, 1), 3).clearContent();
    
    const holidayData = [];
    Object.keys(data.holidays).forEach(year => {
      data.holidays[year].forEach(h => {
        holidayData.push([parseInt(year), h.date, h.name]);
      });
    });
    
    if (holidayData.length > 0) {
      liburSheet.getRange(2, 1, holidayData.length, 3).setValues(holidayData);
      log('IMPORT', 'INFO', `${holidayData.length} hari libur diimport`);
    }
  }
  
  // Import Settings
  if (data.settings) {
    const settingsSheet = ss.getSheetByName(CONFIG.SHEETS.SETTINGS);
    settingsSheet.getRange(2, 1, Math.max(settingsSheet.getLastRow() - 1, 1), 2).clearContent();
    
    const settingsData = Object.entries(data.settings).map(([key, value]) => [key, value]);
    if (settingsData.length > 0) {
      settingsSheet.getRange(2, 1, settingsData.length, 2).setValues(settingsData);
      log('IMPORT', 'INFO', `${settingsData.length} settings diimport`);
    }
  }
}

/**
 * Export data dari spreadsheet ke JSON
 */
function exportData() {
  const ss = getSpreadsheet();
  const data = {
    doctors: [],
    schedule: {},
    holidays: {},
    settings: {},
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  // Export Doctors
  const dokterSheet = ss.getSheetByName(CONFIG.SHEETS.DOKTER);
  if (dokterSheet && dokterSheet.getLastRow() > 1) {
    const dokterData = dokterSheet.getDataRange().getValues();
    for (let i = 1; i < dokterData.length; i++) {
      data.doctors.push({
        id: dokterData[i][0],
        name: dokterData[i][1],
        color: dokterData[i][2],
        isBackup: dokterData[i][3]
      });
    }
  }
  
  // Export Schedule
  const jadwalSheet = ss.getSheetByName(CONFIG.SHEETS.JADWAL);
  if (jadwalSheet && jadwalSheet.getLastRow() > 1) {
    const jadwalData = jadwalSheet.getDataRange().getValues();
    for (let i = 1; i < jadwalData.length; i++) {
      const date = jadwalData[i][0];
      const month = date.substring(0, 7); // YYYY-MM
      
      if (!data.schedule[month]) {
        data.schedule[month] = [];
      }
      
      data.schedule[month].push({
        date: date,
        k3a: jadwalData[i][1] || undefined,
        k3b: jadwalData[i][2] || undefined,
        igd: jadwalData[i][3] || undefined,
        k2: jadwalData[i][4] || undefined,
        ket: jadwalData[i][5] ? JSON.parse(jadwalData[i][5]) : []
      });
    }
  }
  
  // Export Holidays
  const liburSheet = ss.getSheetByName(CONFIG.SHEETS.LIBUR);
  if (liburSheet && liburSheet.getLastRow() > 1) {
    const liburData = liburSheet.getDataRange().getValues();
    for (let i = 1; i < liburData.length; i++) {
      const year = liburData[i][0].toString();
      
      if (!data.holidays[year]) {
        data.holidays[year] = [];
      }
      
      data.holidays[year].push({
        date: liburData[i][1],
        name: liburData[i][2]
      });
    }
  }
  
  // Export Settings
  const settingsSheet = ss.getSheetByName(CONFIG.SHEETS.SETTINGS);
  if (settingsSheet && settingsSheet.getLastRow() > 1) {
    const settingsData = settingsSheet.getDataRange().getValues();
    for (let i = 1; i < settingsData.length; i++) {
      data.settings[settingsData[i][0]] = settingsData[i][1];
    }
  }
  
  return data;
}

// ============================================================================
// FUNGSI MENU
// ============================================================================

/**
 * Buat menu custom di spreadsheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📅 Jadwal Rotasi')
    .addItem('🔄 Sync dari GitHub', 'syncFromGitHub')
    .addItem('📤 Sync ke GitHub', 'syncToGitHub')
    .addSeparator()
    .addItem('⚙️ Setup Awal', 'setup')
    .addItem('📊 Lihat Log', 'showLog')
    .addToUi();
}

/**
 * Tampilkan log aktivitas
 */
function showLog() {
  const ss = getSpreadsheet();
  const logSheet = ss.getSheetByName(CONFIG.SHEETS.LOG);
  
  if (!logSheet || logSheet.getLastRow() <= 1) {
    SpreadsheetApp.getUi().alert('Belum ada log aktivitas.');
    return;
  }
  
  ss.setActiveSheet(logSheet);
}

// ============================================================================
// FUNGSI HELPER
// ============================================================================

/**
 * Get spreadsheet
 */
function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID) {
    return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Log aktivitas
 */
function log(action, status, message) {
  const ss = getSpreadsheet();
  let logSheet = ss.getSheetByName(CONFIG.SHEETS.LOG);
  
  if (!logSheet) {
    logSheet = ss.insertSheet(CONFIG.SHEETS.LOG);
    logSheet.appendRow(['timestamp', 'action', 'status', 'message']);
    logSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  logSheet.appendRow([new Date().toISOString(), action, status, message]);
  
  // Auto-sort by timestamp (newest first)
  if (logSheet.getLastRow() > 1) {
    logSheet.getRange(2, 1, logSheet.getLastRow() - 1, 4)
      .sort({column: 1, ascending: false});
  }
}

// ============================================================================
// FUNGSI TRIGGER - AUTO SYNC
// ============================================================================

/**
 * Buat trigger untuk auto sync setiap jam
 */
function createHourlyTrigger() {
  // Hapus trigger lama
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'autoSync') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Buat trigger baru
  ScriptApp.newTrigger('autoSync')
    .timeBased()
    .everyHours(1)
    .create();
  
  SpreadsheetApp.getUi().alert('Trigger auto sync berhasil dibuat!\n\nData akan di-sync dari GitHub setiap 1 jam.');
}

/**
 * Hapus semua trigger
 */
function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
  
  SpreadsheetApp.getUi().alert('Semua trigger berhasil dihapus.');
}

// ============================================================================
// FUNGSI TEST
// ============================================================================

/**
 * Test koneksi ke GitHub
 */
function testGitHubConnection() {
  try {
    const data = fetchFromGitHub();
    SpreadsheetApp.getUi().alert('✅ Koneksi berhasil!\n\nData ditemukan:\n- Doctors: ' + (data.doctors ? data.doctors.length : 0) + '\n- Schedule months: ' + (data.schedule ? Object.keys(data.schedule).length : 0) + '\n- Holiday years: ' + (data.holidays ? Object.keys(data.holidays).length : 0));
  } catch (error) {
    SpreadsheetApp.getUi().alert('❌ Koneksi gagal!\n\nError: ' + error.message + '\n\nPastikan:\n1. Username dan repo name benar\n2. File path benar\n3. Repository public atau token sudah di-set');
  }
}

/**
 * Test export data
 */
function testExport() {
  const data = exportData();
  const json = JSON.stringify(data, null, 2);
  
  // Simpan ke file sementara untuk preview
  const blob = Utilities.newBlob(json, 'application/json', 'test-export.json');
  DriveApp.createFile(blob);
  
  SpreadsheetApp.getUi().alert('✅ Export berhasil!\n\nFile test-export.json telah disimpan ke Google Drive.\n\nPreview:\n' + json.substring(0, 500) + '...');
}
