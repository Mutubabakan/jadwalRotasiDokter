/**
 * GOOGLE APPS SCRIPT - Jadwal Rotasi Dokter Puskesmas Babakan
 * 
 * CARA DEPLOY:
 * 1. Buka Google Spreadsheet: https://docs.google.com/spreadsheets/d/1WnqwYPfzKs20Hov-mSp2leLGM1A1i2kEyMmcnKnp65I/edit
 * 2. Klik Extensions > Apps Script
 * 3. Hapus semua kode yang ada, paste kode ini
 * 4. Klik Deploy > New Deployment
 * 5. Pilih type: Web App
 * 6. Set "Execute as": Me
 * 7. Set "Who has access": Anyone
 * 8. Klik Deploy
 * 9. Copy URL yang diberikan
 * 10. Paste URL tersebut di tab Setting aplikasi
 * 
 * STRUKTUR SPREADSHEET:
 * - Sheet 1: "Dokter" - kolom: id, name, color, isBackup
 * - Sheet 2: "Jadwal" - kolom: date, k3a, k3b, igd, k2, ket_json
 * - Sheet 3: "Settings" - kolom: key, value
 * - Sheet 4: "LiburNasional" - kolom: year, date, name
 * 
 * SETUP:
 * Jalankan fungsi setup() sekali untuk membuat sheet otomatis.
 */

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch(action) {
      case 'getDoctors':
        return jsonResponse(getDoctors());
      case 'getSchedule':
        const month = e.parameter.month;
        return jsonResponse(getSchedule(month));
      case 'getSettings':
        return jsonResponse(getSettings());
      case 'getHolidays':
        const year = e.parameter.year;
        return jsonResponse(getHolidays(parseInt(year)));
      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch(err) {
    return jsonResponse({ error: err.toString() }, 500);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
      case 'saveDoctors':
        saveDoctors(data.doctors);
        return jsonResponse({ success: true });
      case 'saveSchedule':
        saveSchedule(data.month, data.entries);
        return jsonResponse({ success: true });
      case 'saveSettings':
        saveSettings(data.settings);
        return jsonResponse({ success: true });
      case 'saveHolidays':
        saveHolidays(data.year, data.holidays);
        return jsonResponse({ success: true });
      default:
        return jsonResponse({ error: 'Invalid action' }, 400);
    }
  } catch(err) {
    return jsonResponse({ error: err.toString() }, 500);
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============ DOCTERS ============
function getDoctors() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Dokter');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const doctors = [];
  for (let i = 1; i < data.length; i++) {
    doctors.push({
      id: data[i][0],
      name: data[i][1],
      color: data[i][2],
      isBackup: data[i][3],
    });
  }
  return doctors;
}

function saveDoctors(doctors) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Dokter');
  if (!sheet) {
    sheet = ss.insertSheet('Dokter');
    sheet.appendRow(['id', 'name', 'color', 'isBackup']);
  }
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).clearContent();
  }
  doctors.forEach(doc => {
    sheet.appendRow([doc.id, doc.name, doc.color, doc.isBackup]);
  });
}

// ============ SCHEDULE ============
function getSchedule(month) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Jadwal');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const entries = [];
  for (let i = 1; i < data.length; i++) {
    const dateStr = String(data[i][0]);
    if (dateStr.startsWith(month)) {
      entries.push({
        date: dateStr,
        k3a: data[i][1] || undefined,
        k3b: data[i][2] || undefined,
        igd: data[i][3] || undefined,
        k2: data[i][4] || undefined,
        ket: data[i][5] ? JSON.parse(data[i][5]) : [],
      });
    }
  }
  return entries;
}

function saveSchedule(month, entries) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Jadwal');
  if (!sheet) {
    sheet = ss.insertSheet('Jadwal');
    sheet.appendRow(['date', 'k3a', 'k3b', 'igd', 'k2', 'ket_json']);
  }
  
  // Remove existing entries for this month
  const data = sheet.getDataRange().getValues();
  const rowsToDelete = [];
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]).startsWith(month)) {
      rowsToDelete.push(i + 1);
    }
  }
  rowsToDelete.forEach(row => sheet.deleteRow(row));
  
  // Add new entries
  entries.forEach(entry => {
    sheet.appendRow([
      entry.date,
      entry.k3a || '',
      entry.k3b || '',
      entry.igd || '',
      entry.k2 || '',
      JSON.stringify(entry.ket || []),
    ]);
  });
}

// ============ SETTINGS ============
function getSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Settings');
  if (!sheet) return { puskesmasName: 'Puskesmas Babakan' };
  
  const data = sheet.getDataRange().getValues();
  const settings = {};
  for (let i = 1; i < data.length; i++) {
    settings[data[i][0]] = data[i][1];
  }
  return settings;
}

function saveSettings(settings) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Settings');
  if (!sheet) {
    sheet = ss.insertSheet('Settings');
    sheet.appendRow(['key', 'value']);
  }
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).clearContent();
  }
  Object.entries(settings).forEach(([key, value]) => {
    sheet.appendRow([key, typeof value === 'object' ? JSON.stringify(value) : value]);
  });
}

// ============ HOLIDAYS ============
function getHolidays(year) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('LiburNasional');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const holidays = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == year) {
      holidays.push({ date: data[i][1], name: data[i][2] });
    }
  }
  return holidays;
}

function saveHolidays(year, holidays) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('LiburNasional');
  if (!sheet) {
    sheet = ss.insertSheet('LiburNasional');
    sheet.appendRow(['year', 'date', 'name']);
  }
  
  // Remove existing holidays for this year
  const data = sheet.getDataRange().getValues();
  const rowsToDelete = [];
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] == year) {
      rowsToDelete.push(i + 1);
    }
  }
  rowsToDelete.forEach(row => sheet.deleteRow(row));
  
  // Add new holidays
  holidays.forEach(h => {
    sheet.appendRow([year, h.date, h.name]);
  });
}

// ============ SETUP ============
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Dokter sheet
  let dokterSheet = ss.getSheetByName('Dokter');
  if (!dokterSheet) {
    dokterSheet = ss.insertSheet('Dokter');
    dokterSheet.appendRow(['id', 'name', 'color', 'isBackup']);
    dokterSheet.appendRow(['santi', 'dr. Santi', '#00bcd4', false]);
    dokterSheet.appendRow(['rakean', 'dr. Rakean', '#e91e63', false]);
    dokterSheet.appendRow(['afif', 'dr. Afif', '#4caf50', false]);
    dokterSheet.appendRow(['likha', 'dr. Likha', '#ff9800', false]);
    dokterSheet.appendRow(['abdi', 'dr. Abdi', '#9c27b0', true]);
  }
  
  // Jadwal sheet
  let jadwalSheet = ss.getSheetByName('Jadwal');
  if (!jadwalSheet) {
    jadwalSheet = ss.insertSheet('Jadwal');
    jadwalSheet.appendRow(['date', 'k3a', 'k3b', 'igd', 'k2', 'ket_json']);
  }
  
  // Settings sheet
  let settingsSheet = ss.getSheetByName('Settings');
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet('Settings');
    settingsSheet.appendRow(['key', 'value']);
    settingsSheet.appendRow(['puskesmasName', 'Puskesmas Babakan']);
  }
  
  // LiburNasional sheet
  let liburSheet = ss.getSheetByName('LiburNasional');
  if (!liburSheet) {
    liburSheet = ss.insertSheet('LiburNasional');
    liburSheet.appendRow(['year', 'date', 'name']);
    // 2025 holidays
    const h2025 = [
      ['2025-01-01', 'Tahun Baru Masehi'],
      ['2025-01-27', 'Isra Miraj Nabi Muhammad SAW'],
      ['2025-01-29', 'Tahun Baru Imlek'],
      ['2025-03-29', 'Hari Raya Nyepi'],
      ['2025-03-31', 'Idul Fitri'],
      ['2025-04-01', 'Idul Fitri'],
      ['2025-04-18', 'Wafat Isa Al Masih'],
      ['2025-05-01', 'Hari Buruh Internasional'],
      ['2025-05-12', 'Hari Raya Waisak'],
      ['2025-05-29', 'Kenaikan Isa Al Masih'],
      ['2025-06-01', 'Hari Lahir Pancasila'],
      ['2025-06-07', 'Idul Adha'],
      ['2025-06-27', 'Tahun Baru Islam'],
      ['2025-09-05', 'Maulid Nabi Muhammad SAW'],
      ['2025-12-25', 'Hari Natal'],
    ];
    h2025.forEach(h => liburSheet.appendRow([2025, h[0], h[1]]));
  }
  
  SpreadsheetApp.getUi().alert('Setup selesai! Sheet: Dokter, Jadwal, Settings, LiburNasional');
}
