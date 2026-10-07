/**
 * ============================================================================
 * SCRIPT FINAL - JADWAL ROTASI DOKTER
 * Data di-load langsung dari server (tidak perlu fetch)
 * ============================================================================
 */

function doGet(e) {
  var action = e.parameter.action;
  
  if (!action) {
    return showWebApp();
  }
  
  try {
    if (action === 'getDoctors') {
      return jsonResponse(getDoctors());
    } else if (action === 'getSchedule') {
      var month = e.parameter.month;
      return jsonResponse(getSchedule(month));
    } else if (action === 'getSettings') {
      return jsonResponse(getSettings());
    } else if (action === 'getHolidays') {
      var year = e.parameter.year;
      return jsonResponse(getHolidays(year));
    } else if (action === 'getAllData') {
      return jsonResponse(getAllData());
    } else {
      return jsonResponse({ status: 'success', message: 'API Ready' });
    }
  } catch(error) {
    return jsonResponse({ status: 'error', message: error.toString() }, 500);
  }
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
// SHOW WEB APP - Data di-inject langsung ke HTML
// ============================================================================

function showWebApp() {
  // Load data langsung dari spreadsheet
  var doctors = getDoctors();
  var settings = getSettings();
  var allHolidays = getAllHolidays();
  
  // Ambil jadwal bulan ini
  var now = new Date();
  var currentMonth = now.getMonth();
  var currentYear = now.getFullYear();
  var monthKey = currentYear + '-' + String(currentMonth + 1).padStart(2, '0');
  var schedule = getSchedule(monthKey);
  
  var html = '<!DOCTYPE html>' +
'<html lang="id">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'  <title>Jadwal Rotasi Dokter</title>' +
'  <style>' +
'    * { margin: 0; padding: 0; box-sizing: border-box; }' +
'    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f0eef5; height: 100vh; overflow: hidden; }' +
'    .app { display: flex; flex-direction: column; height: 100vh; }' +
'    .header { background: white; padding: 12px; text-align: center; border-bottom: 1px solid #d8d0e8; }' +
'    .header h1 { font-size: 16px; color: #9b59b6; }' +
'    .header p { font-size: 10px; color: #999; }' +
'    .tabs { display: flex; background: white; border-bottom: 1px solid #d8d0e8; }' +
'    .tab { flex: 1; padding: 12px; text-align: center; font-size: 11px; font-weight: 600; color: #999; cursor: pointer; }' +
'    .tab.active { color: #9b59b6; border-bottom: 2px solid #e91e8c; background: rgba(155,89,182,0.05); }' +
'    .content { flex: 1; overflow: auto; padding: 12px; }' +
'    .card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }' +
'    .card h3 { font-size: 13px; color: #9b59b6; margin-bottom: 10px; }' +
'    .doctor-item { display: flex; align-items: center; gap: 12px; padding: 10px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px; }' +
'    .doctor-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }' +
'    .doctor-name { font-size: 13px; font-weight: 600; }' +
'    .doctor-role { font-size: 10px; color: #999; }' +
'    .month-selector { display: flex; align-items: center; justify-content: space-between; padding: 10px; background: white; border-radius: 8px; margin-bottom: 12px; }' +
'    .month-selector button { background: #f0eef5; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 16px; }' +
'    .month-selector span { font-size: 14px; font-weight: bold; color: #9b59b6; }' +
'    table { width: 100%; border-collapse: collapse; font-size: 10px; }' +
'    th { background: rgba(155,89,182,0.1); padding: 8px 4px; text-align: center; font-weight: 600; color: #9b59b6; border: 1px solid #d8d0e8; }' +
'    td { padding: 6px 4px; text-align: center; border: 1px solid #d8d0e8; }' +
'    tr.holiday { background: rgba(244,67,54,0.08); }' +
'    .empty { text-align: center; padding: 20px; color: #999; }' +
'    .hidden { display: none; }' +
'  </style>' +
'</head>' +
'<body>' +
'  <div class="app">' +
'    <div class="header">' +
'      <h1>🏥 ' + (settings.puskesmasName || 'Puskesmas Babakan') + '</h1>' +
'      <p>JADWAL ROTASI DOKTER</p>' +
'    </div>' +
'    <div class="tabs">' +
'      <div class="tab active" onclick="showTab(\'jadwal\', this)">📅 Jadwal</div>' +
'      <div class="tab" onclick="showTab(\'dokter\', this)">👨‍⚕️ Dokter</div>' +
'      <div class="tab" onclick="showTab(\'setting\', this)">⚙️ Setting</div>' +
'    </div>' +
'    <div class="content">' +
'      <div id="tab-jadwal" class="tab-content">' +
'        <div class="month-selector">' +
'          <button onclick="prevMonth()">◀</button>' +
'          <span id="month-label">-</span>' +
'          <button onclick="nextMonth()">▶</button>' +
'        </div>' +
'        <div class="card">' +
'          <table>' +
'            <thead><tr><th>Tanggal</th><th>K3a</th><th>K3b</th><th>IGD</th><th>K2</th></tr></thead>' +
'            <tbody id="schedule-body"></tbody>' +
'          </table>' +
'        </div>' +
'      </div>' +
'      <div id="tab-dokter" class="tab-content hidden">' +
'        <div class="card">' +
'          <h3>Daftar Dokter</h3>' +
'          <div id="doctor-list"></div>' +
'        </div>' +
'      </div>' +
'      <div id="tab-setting" class="tab-content hidden">' +
'        <div class="card">' +
'          <h3>Informasi</h3>' +
'          <p style="font-size: 11px; color: #666; line-height: 1.6;">' +
'            <strong>Aplikasi:</strong> Jadwal Rotasi Dokter<br>' +
'            <strong>Versi:</strong> 1.0<br>' +
'            <strong>Puskesmas:</strong> ' + (settings.puskesmasName || 'Babakan') + '<br>' +
'            <strong>Database:</strong> Google Spreadsheet' +
'          </p>' +
'        </div>' +
'      </div>' +
'    </div>' +
'  </div>' +
'  <script>' +
'    var doctors = ' + JSON.stringify(doctors) + ';' +
'    var schedule = ' + JSON.stringify(schedule) + ';' +
'    var currentMonth = ' + currentMonth + ';' +
'    var currentYear = ' + currentYear + ';' +
'    var monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];' +
'    var dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];' +
'    ' +
'    window.onload = function() { renderAll(); };' +
'    ' +
'    function showTab(name, el) {' +
'      document.querySelectorAll(".tab-content").forEach(function(e) { e.classList.add("hidden"); });' +
'      document.querySelectorAll(".tab").forEach(function(e) { e.classList.remove("active"); });' +
'      document.getElementById("tab-" + name).classList.remove("hidden");' +
'      el.classList.add("active");' +
'    }' +
'    ' +
'    function renderAll() {' +
'      renderDoctors();' +
'      renderSchedule();' +
'    }' +
'    ' +
'    function renderDoctors() {' +
'      var list = document.getElementById("doctor-list");' +
'      if (doctors.length === 0) {' +
'        list.innerHTML = "<div class=\\"empty\\">Belum ada data dokter</div>";' +
'      } else {' +
'        list.innerHTML = doctors.map(function(d) {' +
'          var initial = d.name.replace("dr. ", "").charAt(0).toUpperCase();' +
'          return "<div class=\\"doctor-item\\">" +' +
'            "<div class=\\"doctor-avatar\\" style=\\"background: " + d.color + "20; border: 2px solid " + d.color + "; color: " + d.color + ";\\">" + initial + "</div>" +' +
'            "<div><div class=\\"doctor-name\\" style=\\"color: " + d.color + ";\\">" + d.name + "</div><div class=\\"doctor-role\\">" + (d.isBackup ? "Dokter Cadangan" : "Dokter Tetap") + "</div></div>" +' +
'          "</div>";' +
'        }).join("");' +
'      }' +
'    }' +
'    ' +
'    function renderSchedule() {' +
'      document.getElementById("month-label").textContent = monthNames[currentMonth] + " " + currentYear;' +
'      var tbody = document.getElementById("schedule-body");' +
'      if (schedule.length === 0) {' +
'        tbody.innerHTML = "<tr><td colspan=\\"5\\" class=\\"empty\\">Belum ada jadwal untuk bulan ini</td></tr>";' +
'      } else {' +
'        tbody.innerHTML = schedule.map(function(e) {' +
'          var date = new Date(e.date);' +
'          var isHoliday = date.getDay() === 0;' +
'          var getDoc = function(id) { if (!id) return "-"; var d = doctors.find(function(x) { return x.id === id; }); return d ? d.name.replace("dr. ", "") : id; };' +
'          return "<tr" + (isHoliday ? " class=\\"holiday\\"" : "") + ">" +' +
'            "<td><strong>" + dayNames[date.getDay()] + "</strong><br>" + String(date.getDate()).padStart(2, "0") + "/" + String(date.getMonth() + 1).padStart(2, "0") + "</td>" +' +
'            "<td>" + getDoc(e.k3a) + "</td><td>" + getDoc(e.k3b) + "</td><td>" + getDoc(e.igd) + "</td><td>" + getDoc(e.k2) + "</td>" +' +
'          "</tr>";' +
'        }).join("");' +
'      }' +
'    }' +
'    ' +
'    function prevMonth() {' +
'      currentMonth--;' +
'      if (currentMonth < 0) { currentMonth = 11; currentYear--; }' +
'      alert("Navigasi bulan akan tersedia setelah sync data bulan tersebut dari aplikasi web");' +
'    }' +
'    ' +
'    function nextMonth() {' +
'      currentMonth++;' +
'      if (currentMonth > 11) { currentMonth = 0; currentYear++; }' +
'      alert("Navigasi bulan akan tersedia setelah sync data bulan tersebut dari aplikasi web");' +
'    }' +
'  </script>' +
'</body>' +
'</html>';
  
  return HtmlService.createHtmlOutput(html)
    .setTitle('Jadwal Rotasi Dokter')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================================================
// DATA FUNCTIONS
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
  
  SpreadsheetApp.getUi().alert('✅ Setup selesai!\n\nSheet yang dibuat:\n- Dokter\n- Jadwal\n- LiburNasional\n- Settings');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('📅 Jadwal Rotasi')
    .addItem('⚙️ Setup', 'setup')
    .addToUi();
}
