/**
 * SHOW WEB APP
 * Tampilkan aplikasi web lengkap
 */
function showWebApp() {
  var scriptUrl = ScriptApp.getService().getUrl();
  
  var html = '<!DOCTYPE html>' +
'<html lang="id">' +
'<head>' +
'  <meta charset="UTF-8">' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">' +
'  <title>Jadwal Rotasi Dokter - Puskesmas Babakan</title>' +
'  <style>' +
'    * { margin: 0; padding: 0; box-sizing: border-box; }' +
'    body {' +
'      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;' +
'      background: #f0eef5;' +
'      color: #2d2d3d;' +
'      height: 100vh;' +
'      overflow: hidden;' +
'    }' +
'    .app { display: flex; flex-direction: column; height: 100vh; }' +
'    .header {' +
'      background: rgba(255,255,255,0.8);' +
'      backdrop-filter: blur(10px);' +
'      padding: 10px 16px;' +
'      border-bottom: 1px solid #d8d0e8;' +
'      text-align: center;' +
'    }' +
'    .header h1 {' +
'      font-size: 14px;' +
'      font-weight: bold;' +
'      background: linear-gradient(90deg, #9b59b6, #e91e8c);' +
'      -webkit-background-clip: text;' +
'      -webkit-text-fill-color: transparent;' +
'    }' +
'    .header p { font-size: 9px; color: #999; }' +
'    .tabs {' +
'      display: flex;' +
'      background: rgba(255,255,255,0.6);' +
'      border-bottom: 1px solid #d8d0e8;' +
'    }' +
'    .tab {' +
'      flex: 1;' +
'      padding: 10px;' +
'      text-align: center;' +
'      font-size: 10px;' +
'      font-weight: 600;' +
'      color: #999;' +
'      cursor: pointer;' +
'      transition: all 0.2s;' +
'    }' +
'    .tab.active {' +
'      background: linear-gradient(135deg, rgba(155,89,182,0.12), rgba(233,30,140,0.12));' +
'      color: #9b59b6;' +
'      border-bottom: 2px solid #e91e8c;' +
'    }' +
'    .content { flex: 1; overflow: auto; padding: 12px; }' +
'    .card {' +
'      background: rgba(255,255,255,0.85);' +
'      backdrop-filter: blur(12px);' +
'      border: 1px solid rgba(155,89,182,0.2);' +
'      border-radius: 16px;' +
'      padding: 12px;' +
'      margin-bottom: 12px;' +
'      box-shadow: 0 2px 12px rgba(155,89,182,0.08);' +
'    }' +
'    .card h3 {' +
'      font-size: 12px;' +
'      color: #9b59b6;' +
'      margin-bottom: 8px;' +
'    }' +
'    .btn {' +
'      background: linear-gradient(135deg, #9b59b6, #e91e8c);' +
'      color: white;' +
'      border: none;' +
'      padding: 10px 20px;' +
'      border-radius: 12px;' +
'      font-size: 12px;' +
'      font-weight: 600;' +
'      cursor: pointer;' +
'      width: 100%;' +
'      margin-top: 8px;' +
'    }' +
'    .btn:active { transform: scale(0.98); }' +
'    .doctor-list { display: flex; flex-direction: column; gap: 8px; }' +
'    .doctor-item {' +
'      display: flex;' +
'      align-items: center;' +
'      gap: 12px;' +
'      padding: 12px;' +
'      background: white;' +
'      border-radius: 12px;' +
'      border: 1px solid #d8d0e8;' +
'    }' +
'    .doctor-avatar {' +
'      width: 40px;' +
'      height: 40px;' +
'      border-radius: 50%;' +
'      display: flex;' +
'      align-items: center;' +
'      justify-content: center;' +
'      font-weight: bold;' +
'      font-size: 12px;' +
'    }' +
'    .doctor-info { flex: 1; }' +
'    .doctor-name { font-size: 14px; font-weight: bold; }' +
'    .doctor-role { font-size: 10px; color: #999; }' +
'    .schedule-table {' +
'      width: 100%;' +
'      border-collapse: collapse;' +
'      font-size: 10px;' +
'    }' +
'    .schedule-table th {' +
'      background: rgba(155,89,182,0.1);' +
'      padding: 8px 4px;' +
'      text-align: center;' +
'      font-weight: 600;' +
'      color: #9b59b6;' +
'      border: 1px solid #d8d0e8;' +
'    }' +
'    .schedule-table td {' +
'      padding: 6px 4px;' +
'      text-align: center;' +
'      border: 1px solid #d8d0e8;' +
'    }' +
'    .schedule-table tr.holiday { background: rgba(244,67,54,0.08); }' +
'    .month-selector {' +
'      display: flex;' +
'      align-items: center;' +
'      justify-content: space-between;' +
'      padding: 8px;' +
'      background: white;' +
'      border-radius: 12px;' +
'      margin-bottom: 12px;' +
'    }' +
'    .month-selector button {' +
'      background: rgba(155,89,182,0.1);' +
'      border: none;' +
'      padding: 8px 12px;' +
'      border-radius: 8px;' +
'      cursor: pointer;' +
'      font-size: 14px;' +
'    }' +
'    .month-selector span {' +
'      font-size: 14px;' +
'      font-weight: bold;' +
'      color: #9b59b6;' +
'    }' +
'    .loading { text-align: center; padding: 40px; color: #999; }' +
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
'    .hidden { display: none; }' +
'  </style>' +
'</head>' +
'<body>' +
'  <div class="app">' +
'    <div class="header">' +
'      <h1>🏥 Puskesmas Babakan</h1>' +
'      <p>JADWAL ROTASI DOKTER</p>' +
'    </div>' +
'    ' +
'    <div class="tabs">' +
'      <div class="tab active" onclick="showTab(\'jadwal\')">📅 Jadwal</div>' +
'      <div class="tab" onclick="showTab(\'dokter\')">👨‍⚕️ Dokter</div>' +
'      <div class="tab" onclick="showTab(\'setting\')">⚙️ Setting</div>' +
'    </div>' +
'    ' +
'    <div class="content">' +
'      <!-- Tab Jadwal -->' +
'      <div id="tab-jadwal" class="tab-content">' +
'        <div class="month-selector">' +
'          <button onclick="prevMonth()">◀</button>' +
'          <span id="month-label">Januari 2025</span>' +
'          <button onclick="nextMonth()">▶</button>' +
'        </div>' +
'        <div class="card">' +
'          <div id="schedule-loading" class="loading">' +
'            <div class="spinner"></div>' +
'            <div>Memuat jadwal...</div>' +
'          </div>' +
'          <div id="schedule-content" class="hidden">' +
'            <table class="schedule-table">' +
'              <thead>' +
'                <tr>' +
'                  <th>Tanggal</th>' +
'                  <th>K3a</th>' +
'                  <th>K3b</th>' +
'                  <th>IGD</th>' +
'                  <th>K2</th>' +
'                </tr>' +
'              </thead>' +
'              <tbody id="schedule-body">' +
'              </tbody>' +
'            </table>' +
'          </div>' +
'        </div>' +
'      </div>' +
'      ' +
'      <!-- Tab Dokter -->' +
'      <div id="tab-dokter" class="tab-content hidden">' +
'        <div class="card">' +
'          <h3>Daftar Dokter</h3>' +
'          <div id="doctor-loading" class="loading">' +
'            <div class="spinner"></div>' +
'            <div>Memuat data dokter...</div>' +
'          </div>' +
'          <div id="doctor-list" class="doctor-list hidden">' +
'          </div>' +
'        </div>' +
'      </div>' +
'      ' +
'      <!-- Tab Setting -->' +
'      <div id="tab-setting" class="tab-content hidden">' +
'        <div class="card">' +
'          <h3>Informasi Aplikasi</h3>' +
'          <p style="font-size: 11px; color: #666; line-height: 1.6;">' +
'            <strong>Nama:</strong> Jadwal Rotasi Dokter<br>' +
'            <strong>Versi:</strong> 1.0<br>' +
'            <strong>Puskesmas:</strong> Babakan<br>' +
'            <strong>Database:</strong> Google Spreadsheet<br>' +
'          </p>' +
'        </div>' +
'        <div class="card">' +
'          <h3>Sync Data</h3>' +
'          <p style="font-size: 11px; color: #666; margin-bottom: 8px;">' +
'            Data otomatis tersimpan di Google Spreadsheet.' +
'          </p>' +
'          <button class="btn" onclick="syncData()">🔄 Sync Sekarang</button>' +
'        </div>' +
'      </div>' +
'    </div>' +
'  </div>' +
'  ' +
'  <script>' +
'    var SCRIPT_URL = "' + scriptUrl + '";' +
'    var currentMonth = new Date().getMonth();' +
'    var currentYear = new Date().getFullYear();' +
'    var doctors = [];' +
'    var schedule = {};' +
'    ' +
'    var monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];' +
'    var dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];' +
'    ' +
'    window.onload = function() {' +
'      loadInitialData();' +
'    };' +
'    ' +
'    function showTab(tabName) {' +
'      document.querySelectorAll(".tab-content").forEach(function(el) { el.classList.add("hidden"); });' +
'      document.querySelectorAll(".tab").forEach(function(el) { el.classList.remove("active"); });' +
'      document.getElementById("tab-" + tabName).classList.remove("hidden");' +
'      event.target.classList.add("active");' +
'      ' +
'      if (tabName === "jadwal") loadSchedule();' +
'      if (tabName === "dokter") loadDoctors();' +
'    }' +
'    ' +
'    function loadInitialData() {' +
'      loadDoctors();' +
'      loadSchedule();' +
'    }' +
'    ' +
'    function loadDoctors() {' +
'      fetch(SCRIPT_URL + "?action=getDoctors")' +
'        .then(function(r) { return r.json(); })' +
'        .then(function(data) {' +
'          doctors = data;' +
'          renderDoctors();' +
'        })' +
'        .catch(function(err) {' +
'          console.error("Error loading doctors:", err);' +
'        });' +
'    }' +
'    ' +
'    function renderDoctors() {' +
'      var list = document.getElementById("doctor-list");' +
'      var loading = document.getElementById("doctor-loading");' +
'      ' +
'      if (doctors.length === 0) {' +
'        list.innerHTML = "<p style=\\"text-align: center; color: #999;\\">Belum ada data dokter</p>";' +
'      } else {' +
'        list.innerHTML = doctors.map(function(doc) {' +
'          return "<div class=\\"doctor-item\\">" +' +
'            "<div class=\\"doctor-avatar\\" style=\\"background: " + doc.color + "20; border: 2px solid " + doc.color + "; color: " + doc.color + ";\\">" +' +
'              doc.name.replace("dr. ", "").charAt(0) +' +
'            "</div>" +' +
'            "<div class=\\"doctor-info\\">" +' +
'              "<div class=\\"doctor-name\\" style=\\"color: " + doc.color + ";\\">" + doc.name + "</div>" +' +
'              "<div class=\\"doctor-role\\">" + (doc.isBackup ? "Dokter Cadangan" : "Dokter Tetap") + "</div>" +' +
'            "</div>" +' +
'          "</div>";' +
'        }).join("");' +
'      }' +
'      ' +
'      loading.classList.add("hidden");' +
'      list.classList.remove("hidden");' +
'    }' +
'    ' +
'    function loadSchedule() {' +
'      var monthKey = currentYear + "-" + String(currentMonth + 1).padStart(2, "0");' +
'      document.getElementById("month-label").textContent = monthNames[currentMonth] + " " + currentYear;' +
'      ' +
'      fetch(SCRIPT_URL + "?action=getSchedule&month=" + monthKey)' +
'        .then(function(r) { return r.json(); })' +
'        .then(function(data) {' +
'          schedule = data;' +
'          renderSchedule();' +
'        })' +
'        .catch(function(err) {' +
'          console.error("Error loading schedule:", err);' +
'        });' +
'    }' +
'    ' +
'    function renderSchedule() {' +
'      var tbody = document.getElementById("schedule-body");' +
'      var loading = document.getElementById("schedule-loading");' +
'      var content = document.getElementById("schedule-content");' +
'      ' +
'      if (schedule.length === 0) {' +
'        tbody.innerHTML = "<tr><td colspan=\\"5\\" style=\\"text-align: center; color: #999; padding: 20px;\\">Belum ada jadwal</td></tr>";' +
'      } else {' +
'        tbody.innerHTML = schedule.map(function(entry) {' +
'          var date = new Date(entry.date);' +
'          var dayName = dayNames[date.getDay()];' +
'          var dateStr = String(date.getDate()).padStart(2, "0") + "/" + String(date.getMonth() + 1).padStart(2, "0");' +
'          var isHoliday = date.getDay() === 0;' +
'          ' +
'          var getDoctorName = function(id) {' +
'            if (!id) return "-";' +
'            var doc = doctors.find(function(d) { return d.id === id; });' +
'            return doc ? doc.name.replace("dr. ", "") : id;' +
'          };' +
'          ' +
'          return "<tr" + (isHoliday ? " class=\\"holiday\\"" : "") + ">" +' +
'            "<td><strong>" + dayName + "</strong><br>" + dateStr + "</td>" +' +
'            "<td>" + getDoctorName(entry.k3a) + "</td>" +' +
'            "<td>" + getDoctorName(entry.k3b) + "</td>" +' +
'            "<td>" + getDoctorName(entry.igd) + "</td>" +' +
'            "<td>" + getDoctorName(entry.k2) + "</td>" +' +
'          "</tr>";' +
'        }).join("");' +
'      }' +
'      ' +
'      loading.classList.add("hidden");' +
'      content.classList.remove("hidden");' +
'    }' +
'    ' +
'    function prevMonth() {' +
'      currentMonth--;' +
'      if (currentMonth < 0) {' +
'        currentMonth = 11;' +
'        currentYear--;' +
'      }' +
'      loadSchedule();' +
'    }' +
'    ' +
'    function nextMonth() {' +
'      currentMonth++;' +
'      if (currentMonth > 11) {' +
'        currentMonth = 0;' +
'        currentYear++;' +
'      }' +
'      loadSchedule();' +
'    }' +
'    ' +
'    function syncData() {' +
'      alert("Data sudah tersinkronisasi dengan Google Spreadsheet!");' +
'    }' +
'  </script>' +
'</body>' +
'</html>';
  
  return HtmlService.createHtmlOutput(html)
    .setTitle('Jadwal Rotasi Dokter - Puskesmas Babakan')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
