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
  
  // Jika tidak ada action, tampilkan dashboard HTML
  if (!action) {
    return showDashboard();
  }
  
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
 * SHOW DASHBOARD
 * Tampilkan halaman HTML dashboard
 */
function showDashboard() {
  var scriptUrl = ScriptApp.getService().getUrl();
  var today = new Date().toLocaleDateString('id-ID');
  
  var html = '<!DOCTYPE html>' +
'<html>' +
'<head>' +
'  <base target="_top">' +
'  <meta charset="UTF-8">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'  <title>Jadwal Rotasi Dokter - Dashboard</title>' +
'  <style>' +
'    * { margin: 0; padding: 0; box-sizing: border-box; }' +
'    body {' +
'      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
'      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' +
'      min-height: 100vh;' +
'      padding: 20px;' +
'    }' +
'    .container { max-width: 800px; margin: 0 auto; }' +
'    .header {' +
'      background: white;' +
'      border-radius: 16px;' +
'      padding: 30px;' +
'      margin-bottom: 20px;' +
'      box-shadow: 0 10px 40px rgba(0,0,0,0.1);' +
'      text-align: center;' +
'    }' +
'    .header h1 { color: #667eea; font-size: 28px; margin-bottom: 10px; }' +
'    .header p { color: #666; font-size: 14px; }' +
'    .card {' +
'      background: white;' +
'      border-radius: 16px;' +
'      padding: 25px;' +
'      margin-bottom: 20px;' +
'      box-shadow: 0 10px 40px rgba(0,0,0,0.1);' +
'    }' +
'    .card h2 { color: #667eea; font-size: 20px; margin-bottom: 15px; }' +
'    .stats {' +
'      display: grid;' +
'      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));' +
'      gap: 15px;' +
'    }' +
'    .stat-box {' +
'      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' +
'      color: white;' +
'      padding: 20px;' +
'      border-radius: 12px;' +
'      text-align: center;' +
'    }' +
'    .stat-box .number { font-size: 32px; font-weight: bold; margin-bottom: 5px; }' +
'    .stat-box .label { font-size: 12px; opacity: 0.9; }' +
'    .endpoint-list { list-style: none; }' +
'    .endpoint-list li {' +
'      background: #f8f9fa;' +
'      padding: 15px;' +
'      margin-bottom: 10px;' +
'      border-radius: 8px;' +
'      border-left: 4px solid #667eea;' +
'    }' +
'    .endpoint-list li strong { color: #667eea; display: block; margin-bottom: 5px; }' +
'    .endpoint-list li code {' +
'      background: white;' +
'      padding: 2px 8px;' +
'      border-radius: 4px;' +
'      font-size: 12px;' +
'      color: #e83e8c;' +
'    }' +
'    .btn {' +
'      display: inline-block;' +
'      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' +
'      color: white;' +
'      padding: 12px 24px;' +
'      border-radius: 8px;' +
'      text-decoration: none;' +
'      font-weight: 600;' +
'      margin: 5px;' +
'      border: none;' +
'      cursor: pointer;' +
'    }' +
'    .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4); }' +
'    .btn-secondary { background: #6c757d; }' +
'    .data-preview {' +
'      background: #f8f9fa;' +
'      padding: 15px;' +
'      border-radius: 8px;' +
'      max-height: 300px;' +
'      overflow-y: auto;' +
'      font-family: "Courier New", monospace;' +
'      font-size: 12px;' +
'      white-space: pre-wrap;' +
'      word-break: break-all;' +
'    }' +
'    .loading { text-align: center; padding: 20px; color: #667eea; }' +
'    .spinner {' +
'      border: 3px solid #f3f3f3;' +
'      border-top: 3px solid #667eea;' +
'      border-radius: 50%;' +
'      width: 40px;' +
'      height: 40px;' +
'      animation: spin 1s linear infinite;' +
'      margin: 0 auto 10px;' +
'    }' +
'    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' +
'    .footer { text-align: center; color: white; margin-top: 30px; font-size: 12px; opacity: 0.8; }' +
'    @media (max-width: 600px) {' +
'      .header h1 { font-size: 22px; }' +
'      .stats { grid-template-columns: 1fr; }' +
'    }' +
'  </style>' +
'</head>' +
'<body>' +
'  <div class="container">' +
'    <div class="header">' +
'      <h1>🏥 Jadwal Rotasi Dokter</h1>' +
'      <p>API Dashboard - Puskesmas Babakan</p>' +
'    </div>' +
'    ' +
'    <div class="card">' +
'      <h2>📊 Statistik Data</h2>' +
'      <div id="stats" class="stats">' +
'        <div class="loading">' +
'          <div class="spinner"></div>' +
'          <div>Memuat data...</div>' +
'        </div>' +
'      </div>' +
'    </div>' +
'    ' +
'    <div class="card">' +
'      <h2>🔗 API Endpoints</h2>' +
'      <ul class="endpoint-list">' +
'        <li>' +
'          <strong>Get Semua Data</strong>' +
'          <code>?action=getAllData</code>' +
'          <br><small>Mengambil semua data (dokter, jadwal, libur, settings)</small>' +
'        </li>' +
'        <li>' +
'          <strong>Get Dokter</strong>' +
'          <code>?action=getDoctors</code>' +
'          <br><small>Mengambil data dokter saja</small>' +
'        </li>' +
'        <li>' +
'          <strong>Get Jadwal</strong>' +
'          <code>?action=getSchedule&month=YYYY-MM</code>' +
'          <br><small>Mengambil jadwal per bulan (contoh: 2025-01)</small>' +
'        </li>' +
'        <li>' +
'          <strong>Get Hari Libur</strong>' +
'          <code>?action=getHolidays&year=YYYY</code>' +
'          <br><small>Mengambil hari libur per tahun (contoh: 2025)</small>' +
'        </li>' +
'        <li>' +
'          <strong>Get Settings</strong>' +
'          <code>?action=getSettings</code>' +
'          <br><small>Mengambil pengaturan aplikasi</small>' +
'        </li>' +
'      </ul>' +
'    </div>' +
'    ' +
'    <div class="card">' +
'      <h2>🔍 Preview Data</h2>' +
'      <div style="margin-bottom: 15px;">' +
'        <button class="btn" onclick="loadData(\'getAllData\')">Lihat Semua Data</button>' +
'        <button class="btn btn-secondary" onclick="loadData(\'getDoctors\')">Lihat Dokter</button>' +
'        <button class="btn btn-secondary" onclick="loadData(\'getSettings\')">Lihat Settings</button>' +
'      </div>' +
'      <div id="dataPreview" class="data-preview">' +
'        Klik tombol di atas untuk melihat data...' +
'      </div>' +
'    </div>' +
'    ' +
'    <div class="card">' +
'      <h2>📖 Cara Penggunaan</h2>' +
'      <p style="line-height: 1.8; color: #666;">' +
'        <strong>1. Dari Aplikasi Web:</strong><br>' +
'        Buka aplikasi web → Tab Setting → Paste URL ini → Klik "Sync ke Spreadsheet"' +
'        <br><br>' +
'        <strong>2. Dari Browser:</strong><br>' +
'        Tambahkan endpoint di URL, contoh:<br>' +
'        <code style="background: #f8f9fa; padding: 5px 10px; border-radius: 4px; display: inline-block; margin: 5px 0;">' +
'          ' + scriptUrl + '?action=getAllData' +
'        </code>' +
'        <br><br>' +
'        <strong>3. Dari Aplikasi Lain:</strong><br>' +
'        Gunakan HTTP GET request ke URL dengan parameter action' +
'      </p>' +
'    </div>' +
'    ' +
'    <div class="footer">' +
'      <p>🏥 Puskesmas Babakan - Jadwal Rotasi Dokter API</p>' +
'      <p>Version 1.0 | Last Updated: ' + today + '</p>' +
'    </div>' +
'  </div>' +
'  ' +
'  <script>' +
'    var SCRIPT_URL = "' + scriptUrl + '";' +
'    ' +
'    window.onload = function() {' +
'      loadStats();' +
'    };' +
'    ' +
'    function loadStats() {' +
'      fetch(SCRIPT_URL + "?action=getAllData")' +
'        .then(function(response) { return response.json(); })' +
'        .then(function(data) {' +
'          var statsHtml = ' +
'            "<div class=\\"stat-box\\">" +' +
'              "<div class=\\"number\\">" + data.doctors.length + "</div>" +' +
'              "<div class=\\"label\\">Dokter</div>" +' +
'            "</div>" +' +
'            "<div class=\\"stat-box\\">" +' +
'              "<div class=\\"number\\">" + Object.keys(data.schedule).length + "</div>" +' +
'              "<div class=\\"label\\">Bulan Jadwal</div>" +' +
'            "</div>" +' +
'            "<div class=\\"stat-box\\">" +' +
'              "<div class=\\"number\\">" + Object.keys(data.holidays).length + "</div>" +' +
'              "<div class=\\"label\\">Tahun Libur</div>" +' +
'            "</div>" +' +
'            "<div class=\\"stat-box\\">" +' +
'              "<div class=\\"number\\">" + Object.keys(data.settings).length + "</div>" +' +
'              "<div class=\\"label\\">Settings</div>" +' +
'            "</div>";' +
'          document.getElementById("stats").innerHTML = statsHtml;' +
'        })' +
'        .catch(function(error) {' +
'          document.getElementById("stats").innerHTML = "<div style=\\"color: red;\\">Error: " + error.message + "</div>";' +
'        });' +
'    }' +
'    ' +
'    function loadData(action) {' +
'      var preview = document.getElementById("dataPreview");' +
'      preview.innerHTML = "<div class=\\"loading\\"><div class=\\"spinner\\"></div><div>Memuat data...</div></div>";' +
'      ' +
'      fetch(SCRIPT_URL + "?action=" + action)' +
'        .then(function(response) { return response.json(); })' +
'        .then(function(data) {' +
'          preview.innerHTML = JSON.stringify(data, null, 2);' +
'        })' +
'        .catch(function(error) {' +
'          preview.innerHTML = "<div style=\\"color: red;\\">Error: " + error.message + "</div>";' +
'        });' +
'    }' +
'  </script>' +
'</body>' +
'</html>';
  
  return HtmlService.createHtmlOutput(html)
    .setTitle('Jadwal Rotasi Dokter - Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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
