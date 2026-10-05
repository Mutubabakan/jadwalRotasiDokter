/**
 * ============================================================================
 * SCRIPT WEB APP - JADWAL ROTASI DOKTER
 * ============================================================================
 * 
 * Script ini bisa diakses via URL sebagai web app
 * Bisa menerima data dari aplikasi web via GET/POST
 */

// ============================================================================
// WEB APP FUNCTIONS
// ============================================================================

/**
 * HANDLE GET REQUEST
 * Dipanggil saat URL dibuka di browser
 */
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch(action) {
      case 'getDoctors':
        return jsonResponse(getDoctors());
      
      case 'getSchedule':
        const month = e.parameter.month; // format: YYYY-MM
        return jsonResponse(getSchedule(month));
      
      case 'getSettings':
        return jsonResponse(getSettings());
      
      case 'getHolidays':
        const year = e.parameter.year;
        return jsonResponse(getHolidays(year));
      
      case 'getAllData':
        return jsonResponse(getAllData());
      
      default:
        return jsonResponse({
          status: 'success',
          message: 'Jadwal Rotasi Dokter API',
          endpoints: [
            'getDoctors',
            'getSchedule?month=YYYY-MM',
            'getSettings',
            'getHolidays?year=YYYY',
            'getAllData'
          ]
        });
    }
  } catch(error) {
    return jsonResponse({ status: 'error', message: error.toString() }, 500);
  }
}

/**
 * HANDLE POST REQUEST
 * Dipanggil saat ada data yang di-POST ke URL
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch(action) {
      case 'saveDoctors':
        saveDoctors(data.doctors);
        return jsonResponse({ status: 'success', message: 'Doctors saved' });
      
      case 'saveSchedule':
        saveSchedule(data.month, data.entries);
        return jsonResponse({ status: 'success', message: 'Schedule saved' });
      
      case 'saveSettings':
        saveSettings(data.settings);
        return jsonResponse({ status: 'success', message: 'Settings saved' });
      
      case 'saveHolidays':
        saveHolidays(data.year, data.holidays);
        return jsonResponse({ status: 'success', message: 'Holidays saved' });
      
      case 'saveAllData':
        saveAllData(data.data);
        return jsonResponse({ status: 'success', message: 'All data saved' });
      
      default:
        return jsonResponse({ status: 'error', message: 'Invalid action' }, 400);
    }
  } catch(error) {
    return jsonResponse({ status: 'error', message: error.toString() }, 500);
  }
}

/**
 * Helper: JSON Response
 */
function jsonResponse(data, code) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// DATA FUNCTIONS
// ============================================================================

/**
 * GET ALL DATA
 */
function getAllData() {
  return {
    doctors: getDoctors(),
    schedule: getAllSchedule(),
    settings: getSettings(),
    holidays: getAllHolidays()
  };
}

/**
 * GET DOCTORS
 */
function getDoctors() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Dokter');
  
  if (!sheet || sheet.getLastRow() <= 1) return [];
  
  const data = sheet.getDataRange().getValues();
  const doctors = [];
  
  for (let i = 1; i < data.length; i++) {
    doctors.push({
      id: data[i][0],
      name: data[i][1],
      color: data[i][2],
      isBackup: data[i][3]
    });
  }
  
  return doctors;
}

/**
 * GET SCHEDULE BY MONTH
 */
function getSchedule(month) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Jadwal');
  
  if (!sheet || sheet.getLastRow() <= 1) return [];
  
  const data = sheet.getDataRange().getValues();
  const entries = [];
  
  for (let i = 1; i < data.length; i++) {
    const date = data[i][0];
    if (date && date.toString().startsWith(month)) {
      entries.push({
        date: date,
        k3a: data[i][1] || undefined,
        k3b: data[i][2] || undefined,
        igd: data[i][3] || undefined,
        k2: data[i][4] || undefined,
        ket: data[i][5] ? JSON.parse(data[i][5]) : []
      });
    }
  }
  
  return entries;
}

/**
 * GET ALL SCHEDULE
 */
function getAllSchedule() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Jadwal');
  
  if (!sheet || sheet.getLastRow() <= 1) return {};
  
  const data = sheet.getDataRange().getValues();
  const schedule = {};
  
  for (let i = 1; i < data.length; i++) {
    const date = data[i][0];
    const month = date.substring(0, 7);
    
    if (!schedule[month]) {
      schedule[month] = [];
    }
    
    schedule[month].push({
      date: date,
      k3a: data[i][1] || undefined,
      k3b: data[i][2] || undefined,
      igd: data[i][3] || undefined,
      k2: data[i][4] || undefined,
      ket: data[i][5] ? JSON.parse(data[i][5]) : []
    });
  }
  
  return schedule;
}

/**
 * GET SETTINGS
 */
function getSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Settings');
  
  if (!sheet || sheet.getLastRow() <= 1) return {};
  
  const data = sheet.getDataRange().getValues();
  const settings = {};
  
  for (let i = 1; i < data.length; i++) {
    settings[data[i][0]] = data[i][1];
  }
  
  return settings;
}

/**
 * GET HOLIDAYS BY YEAR
 */
function getHolidays(year) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('LiburNasional');
  
  if (!sheet || sheet.getLastRow() <= 1) return [];
  
  const data = sheet.getDataRange().getValues();
  const holidays = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == year) {
      holidays.push({
        date: data[i][1],
        name: data[i][2]
      });
    }
  }
  
  return holidays;
}

/**
 * GET ALL HOLIDAYS
 */
function getAllHolidays() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('LiburNasional');
  
  if (!sheet || sheet.getLastRow() <= 1) return {};
  
  const data = sheet.getDataRange().getValues();
  const holidays = {};
  
  for (let i = 1; i < data.length; i++) {
    const year = data[i][0].toString();
    
    if (!holidays[year]) {
      holidays[year] = [];
    }
    
    holidays[year].push({
      date: data[i][1],
      name: data[i][2]
    });
  }
  
  return holidays;
}

// ============================================================================
// SAVE FUNCTIONS
// ============================================================================

/**
 * SAVE DOCTORS
 */
function saveDoctors(doctors) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Dokter');
  
  if (!sheet) {
    sheet = ss.insertSheet('Dokter');
    sheet.appendRow(['id', 'name', 'color', 'isBackup']);
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Clear existing data
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).clearContent();
  }
  
  // Write new data
  const data = doctors.map(d => [d.id, d.name, d.color, d.isBackup]);
  sheet.getRange(2, 1, data.length, 4).setValues(data);
}

/**
 * SAVE SCHEDULE
 */
function saveSchedule(month, entries) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Jadwal');
  
  if (!sheet) {
    sheet = ss.insertSheet('Jadwal');
    sheet.appendRow(['date', 'k3a', 'k3b', 'igd', 'k2', 'ket_json']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Remove existing entries for this month
  const data = sheet.getDataRange().getValues();
  const rowsToDelete = [];
  
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] && data[i][0].toString().startsWith(month)) {
      rowsToDelete.push(i + 1);
    }
  }
  
  rowsToDelete.forEach(row => sheet.deleteRow(row));
  
  // Add new entries
  const newData = entries.map(entry => [
    entry.date,
    entry.k3a || '',
    entry.k3b || '',
    entry.igd || '',
    entry.k2 || '',
    JSON.stringify(entry.ket || [])
  ]);
  
  if (newData.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newData.length, 6).setValues(newData);
  }
}

/**
 * SAVE SETTINGS
 */
function saveSettings(settings) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Settings');
  
  if (!sheet) {
    sheet = ss.insertSheet('Settings');
    sheet.appendRow(['key', 'value']);
    sheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Clear existing data
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).clearContent();
  }
  
  // Write new data
  const data = Object.entries(settings).map(([key, value]) => [key, value]);
  sheet.getRange(2, 1, data.length, 2).setValues(data);
}

/**
 * SAVE HOLIDAYS
 */
function saveHolidays(year, holidays) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('LiburNasional');
  
  if (!sheet) {
    sheet = ss.insertSheet('LiburNasional');
    sheet.appendRow(['year', 'date', 'name']);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
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
  const newData = holidays.map(h => [year, h.date, h.name]);
  if (newData.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newData.length, 3).setValues(newData);
  }
}

/**
 * SAVE ALL DATA
 */
function saveAllData(data) {
  if (data.doctors) saveDoctors(data.doctors);
  if (data.settings) saveSettings(data.settings);
  
  if (data.schedule) {
    Object.keys(data.schedule).forEach(month => {
      saveSchedule(month, data.schedule[month]);
    });
  }
  
  if (data.holidays) {
    Object.keys(data.holidays).forEach(year => {
      saveHolidays(year, data.holidays[year]);
    });
  }
}

// ============================================================================
// SETUP & UTILITY FUNCTIONS
// ============================================================================

/**
 * SETUP - Jalankan sekali di awal
 */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Buat sheet Dokter
  let dokterSheet = ss.getSheetByName('Dokter');
  if (!dokterSheet) {
    dokterSheet = ss.insertSheet('Dokter');
    dokterSheet.appendRow(['id', 'name', 'color', 'isBackup']);
    dokterSheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Buat sheet Jadwal
  let jadwalSheet = ss.getSheetByName('Jadwal');
  if (!jadwalSheet) {
    jadwalSheet = ss.insertSheet('Jadwal');
    jadwalSheet.appendRow(['date', 'k3a', 'k3b', 'igd', 'k2', 'ket_json']);
    jadwalSheet.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Buat sheet LiburNasional
  let liburSheet = ss.getSheetByName('LiburNasional');
  if (!liburSheet) {
    liburSheet = ss.insertSheet('LiburNasional');
    liburSheet.appendRow(['year', 'date', 'name']);
    liburSheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Buat sheet Settings
  let settingsSheet = ss.getSheetByName('Settings');
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet('Settings');
    settingsSheet.appendRow(['key', 'value']);
    settingsSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  SpreadsheetApp.getUi().alert('✅ Setup selesai!\n\nSheet yang dibuat:\n- Dokter\n- Jadwal\n- LiburNasional\n- Settings\n\nWeb app URL sudah bisa digunakan!');
}

/**
 * MENU - Buat menu custom di spreadsheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📅 Jadwal Rotasi')
    .addItem('⚙️ Setup Awal', 'setup')
    .addItem('📊 Lihat Semua Data', 'showAllData')
    .addSeparator()
    .addItem('🗑️ Hapus Semua Data', 'clearAllData')
    .addToUi();
}

/**
 * SHOW ALL DATA
 */
function showAllData() {
  const data = getAllData();
  const json = JSON.stringify(data, null, 2);
  
  SpreadsheetApp.getUi().alert(
    '📊 Data Saat Ini:\n\n' +
    'Dokter: ' + data.doctors.length + '\n' +
    'Jadwal: ' + Object.keys(data.schedule).length + ' bulan\n' +
    'Libur: ' + Object.keys(data.holidays).length + ' tahun\n\n' +
    'Preview:\n' + json.substring(0, 300) + '...'
  );
}

/**
 * CLEAR ALL DATA
 */
function clearAllData() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '⚠️ Peringatan',
    'Hapus semua data di sheet?\n\nTindakan ini tidak bisa dibatalkan!',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  ['Dokter', 'Jadwal', 'LiburNasional', 'Settings'].forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    if (sheet && sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
    }
  });
  
  ui.alert('✅ Semua data berhasil dihapus!');
}

/**
 * TEST WEB APP
 */
function testWebApp() {
  const url = ScriptApp.getService().getUrl();
  SpreadsheetApp.getUi().alert(
    '🌐 Web App URL:\n\n' + url + '\n\n' +
    'Endpoints:\n' +
    '- ' + url + '?action=getDoctors\n' +
    '- ' + url + '?action=getSchedule&month=2025-01\n' +
    '- ' + url + '?action=getAllData'
  );
}
