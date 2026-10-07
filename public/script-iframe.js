/**
 * ============================================================================
 * SCRIPT FINAL - TAMPILKAN WEB APP DARI GITHUB
 * ============================================================================
 * Script ini menampilkan iframe ke aplikasi web yang sudah di-publish
 */

// ============================================================================
// KONFIGURASI - GANTI URL DENGAN URL GITHUB PAGES ANDA
// ============================================================================
var WEB_APP_URL = 'https://mutubabakan.github.io/jadwalRotasiDokter/';

// ============================================================================
// WEB APP FUNCTIONS
// ============================================================================

function doGet(e) {
  return showWebApp();
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    if (action === 'saveAllData') {
      saveAllData(data.data);
      return jsonResponse({ status: 'success' });
    } else if (action === 'saveDoctors') {
      saveDoctors(data.doctors);
      return jsonResponse({ status: 'success' });
    } else if (action === 'saveSchedule') {
      saveSchedule(data.month, data.entries);
      return jsonResponse({ status: 'success' });
    } else if (action === 'saveSettings') {
      saveSettings(data.settings);
      return jsonResponse({ status: 'success' });
    } else if (action === 'saveHolidays') {
      saveHolidays(data.year, data.holidays);
      return jsonResponse({ status: 'success' });
    } else {
      return jsonResponse({ status: 'error', message: 'Invalid action' }, 400);
    }
  } catch(error) {
    return jsonResponse({ status: 'error', message: error.toString() }, 500);
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// SHOW WEB APP - Tampilkan iframe ke aplikasi web di GitHub
// ============================================================================

function showWebApp() {
  var html = '<!DOCTYPE html>' +
'<html lang="id">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">' +
'  <title>Jadwal Rotasi Dokter - Puskesmas Babakan</title>' +
'  <style>' +
'    * { margin: 0; padding: 0; box-sizing: border-box; }' +
'    html, body { width: 100%; height: 100%; overflow: hidden; }' +
'    body { background: #f0eef5; }' +
'    .container { width: 100%; height: 100%; position: relative; }' +
'    iframe {' +
'      width: 100%;' +
'      height: 100%;' +
'      border: none;' +
'      position: absolute;' +
'      top: 0;' +
'      left: 0;' +
'    }' +
'    .loading {' +
'      position: absolute;' +
'      top: 50%;' +
'      left: 50%;' +
'      transform: translate(-50%, -50%);' +
'      text-align: center;' +
'      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
'      color: #9b59b6;' +
'    }' +
'    .spinner {' +
'      border: 3px solid #f3f3f3;' +
'      border-top: 3px solid #9b59b6;' +
'      border-radius: 50%;' +
'      width: 40px;' +
'      height: 40px;' +
'      animation: spin 1s linear infinite;' +
'      margin: 0 auto 10px;' +
'    }' +
'    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' +
'  </style>' +
'</head>' +
'<body>' +
'  <div class="container">' +
'    <div class="loading" id="loading">' +
'      <div class="spinner"></div>' +
'      <div>Memuat aplikasi...</div>' +
'    </div>' +
'    <iframe ' +
'      src="' + WEB_APP_URL + '" ' +
'      id="webapp-frame" ' +
'      onload="document.getElementById(\'loading\').style.display=\'none\';" ' +
'      allow="clipboard-read; clipboard-write" ' +
'      allowfullscreen>' +
'    </iframe>' +
'  </div>' +
'</body>' +
'</html>';
  
  return HtmlService.createHtmlOutput(html)
    .setTitle('Jadwal Rotasi Dokter - Puskesmas Babakan')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

// ============================================================================
// DATA FUNCTIONS (untuk sync dari aplikasi web)
// ============================================================================

function getAllData() {
  return {
    doctors: getDoctors(),
    schedule: getAllSchedule(),
    settings: getSettings(),
    holidays: getAllHolidays()
  };
}

function getDoctors() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Dokter');
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var doctors = [];
  for (var i = 1; i < data.length; i++) {
    doctors.push({ id: data[i][0], name: data[i][1], color: data[i][2], isBackup: data[i][3] });
  }
  return doctors;
}

function getSchedule(month) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Jadwal');
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var entries = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().indexOf(month) === 0) {
      entries.push({
        date: data[i][0], k3a: data[i][1] || undefined, k3b: data[i][2] || undefined,
        igd: data[i][3] || undefined, k2: data[i][4] || undefined,
        ket: data[i][5] ? JSON.parse(data[i][5]) : []
      });
    }
  }
  return entries;
}

function getAllSchedule() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Jadwal');
  if (!sheet || sheet.getLastRow() <= 1) return {};
  var data = sheet.getDataRange().getValues();
  var schedule = {};
  for (var i = 1; i < data.length; i++) {
    var month = data[i][0].substring(0, 7);
    if (!schedule[month]) schedule[month] = [];
    schedule[month].push({
      date: data[i][0], k3a: data[i][1] || undefined, k3b: data[i][2] || undefined,
      igd: data[i][3] || undefined, k2: data[i][4] || undefined,
      ket: data[i][5] ? JSON.parse(data[i][5]) : []
    });
  }
  return schedule;
}

function getSettings() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Settings');
  if (!sheet || sheet.getLastRow() <= 1) return {};
  var data = sheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < data.length; i++) {
    settings[data[i][0]] = data[i][1];
  }
  return settings;
}

function getHolidays(year) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('LiburNasional');
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var holidays = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == year) {
      holidays.push({ date: data[i][1], name: data[i][2] });
    }
  }
  return holidays;
}

function getAllHolidays() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('LiburNasional');
  if (!sheet || sheet.getLastRow() <= 1) return {};
  var data = sheet.getDataRange().getValues();
  var holidays = {};
  for (var i = 1; i < data.length; i++) {
    var year = data[i][0].toString();
    if (!holidays[year]) holidays[year] = [];
    holidays[year].push({ date: data[i][1], name: data[i][2] });
  }
  return holidays;
}

// ============================================================================
// SAVE FUNCTIONS
// ============================================================================

function saveDoctors(doctors) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Dokter');
  if (!sheet) {
    sheet = ss.insertSheet('Dokter');
    sheet.appendRow(['id', 'name', 'color', 'isBackup']);
  }
  if (sheet.getLastRow() > 1) sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).clearContent();
  var data = doctors.map(function(d) { return [d.id, d.name, d.color, d.isBackup]; });
  sheet.getRange(2, 1, data.length, 4).setValues(data);
}

function saveSchedule(month, entries) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Jadwal');
  if (!sheet) {
    sheet = ss.insertSheet('Jadwal');
    sheet.appendRow(['date', 'k3a', 'k3b', 'igd', 'k2', 'ket_json']);
  }
  var data = sheet.getDataRange().getValues();
  var rowsToDelete = [];
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][0] && data[i][0].toString().indexOf(month) === 0) rowsToDelete.push(i + 1);
  }
  rowsToDelete.forEach(function(row) { sheet.deleteRow(row); });
  var newData = entries.map(function(e) {
    return [e.date, e.k3a || '', e.k3b || '', e.igd || '', e.k2 || '', JSON.stringify(e.ket || [])];
  });
  if (newData.length > 0) sheet.getRange(sheet.getLastRow() + 1, 1, newData.length, 6).setValues(newData);
}

function saveSettings(settings) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Settings');
  if (!sheet) {
    sheet = ss.insertSheet('Settings');
    sheet.appendRow(['key', 'value']);
  }
  if (sheet.getLastRow() > 1) sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).clearContent();
  var data = Object.keys(settings).map(function(k) { return [k, settings[k]]; });
  sheet.getRange(2, 1, data.length, 2).setValues(data);
}

function saveHolidays(year, holidays) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('LiburNasional');
  if (!sheet) {
    sheet = ss.insertSheet('LiburNasional');
    sheet.appendRow(['year', 'date', 'name']);
  }
  var data = sheet.getDataRange().getValues();
  var rowsToDelete = [];
  for (var i = data.length - 1; i >= 1; i--) {
    if (data[i][0] == year) rowsToDelete.push(i + 1);
  }
  rowsToDelete.forEach(function(row) { sheet.deleteRow(row); });
  var newData = holidays.map(function(h) { return [year, h.date, h.name]; });
  if (newData.length > 0) sheet.getRange(sheet.getLastRow() + 1, 1, newData.length, 3).setValues(newData);
}

function saveAllData(data) {
  if (data.doctors) saveDoctors(data.doctors);
  if (data.settings) saveSettings(data.settings);
  if (data.schedule) {
    Object.keys(data.schedule).forEach(function(month) {
      saveSchedule(month, data.schedule[month]);
    });
  }
  if (data.holidays) {
    Object.keys(data.holidays).forEach(function(year) {
      saveHolidays(year, data.holidays[year]);
    });
  }
}

// ============================================================================
// SETUP
// ============================================================================

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss.getSheetByName('Dokter')) {
    var sheet = ss.insertSheet('Dokter');
    sheet.appendRow(['id', 'name', 'color', 'isBackup']);
  }
  
  if (!ss.getSheetByName('Jadwal')) {
    var sheet = ss.insertSheet('Jadwal');
    sheet.appendRow(['date', 'k3a', 'k3b', 'igd', 'k2', 'ket_json']);
  }
  
  if (!ss.getSheetByName('LiburNasional')) {
    var sheet = ss.insertSheet('LiburNasional');
    sheet.appendRow(['year', 'date', 'name']);
  }
  
  if (!ss.getSheetByName('Settings')) {
    var sheet = ss.insertSheet('Settings');
    sheet.appendRow(['key', 'value']);
  }
  
  SpreadsheetApp.getUi().alert('✅ Setup selesai!\n\nWeb App URL:\n' + WEB_APP_URL);
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('📅 Jadwal Rotasi')
    .addItem('⚙️ Setup', 'setup')
    .addToUi();
}
