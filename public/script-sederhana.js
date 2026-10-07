/**
 * ============================================================================
 * SCRIPT SEDERHANA - JADWAL ROTASI DOKTER
 * ============================================================================
 * 
 * CARA PAKAI (SUPER SIMPLE):
 * 1. Copy semua script ini ke Apps Script editor
 * 2. Jalankan fungsi setup() sekali
 * 3. Setiap kali mau sync:
 *    - Export data dari aplikasi (Setting → Export → Copy to Clipboard)
 *    - Jalankan fungsi pasteData() di Apps Script
 *    - Paste data JSON
 *    - Klik OK
 *    - DONE! ✅
 */

// ============================================================================
// FUNGSI UTAMA
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
  
  SpreadsheetApp.getUi().alert('✅ Setup selesai!\n\nSheet yang dibuat:\n- Dokter\n- Jadwal\n- LiburNasional\n- Settings\n\nSelanjutnya:\n1. Export data dari aplikasi\n2. Jalankan fungsi pasteData()\n3. Paste data JSON\n4. Klik OK');
}

/**
 * PASTE DATA - Fungsi utama untuk sync
 * Jalankan ini setiap kali mau sync data dari aplikasi
 */
function pasteData() {
  const ui = SpreadsheetApp.getUi();
  
  // Minta user paste data
  const response = ui.prompt(
    'Sync Data dari Aplikasi',
    '1. Buka aplikasi web\n2. Tab Setting → Export Data → Copy to Clipboard\n3. Paste data JSON di bawah ini:\n\n',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  
  const jsonData = response.getResponseText();
  
  if (!jsonData || jsonData.trim() === '') {
    ui.alert('❌ Error: Data kosong!\n\nSilakan export data dari aplikasi terlebih dahulu.');
    return;
  }
  
  try {
    // Parse JSON
    const data = JSON.parse(jsonData);
    
    // Import data ke sheet
    importData(data);
    
    ui.alert('✅ Sync berhasil!\n\nData dari aplikasi sudah masuk ke spreadsheet.\n\nLihat sheet:\n- Dokter\n- Jadwal\n- LiburNasional\n- Settings');
    
  } catch (error) {
    ui.alert('❌ Error: Format JSON tidak valid!\n\n' + error.message + '\n\nPastikan data yang di-paste adalah JSON yang valid dari aplikasi.');
  }
}

/**
 * IMPORT DATA - Proses data JSON ke sheet
 */
function importData(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Import Doctors
  if (data.doctors && data.doctors.length > 0) {
    const dokterSheet = ss.getSheetByName('Dokter');
    if (dokterSheet.getLastRow() > 1) {
      dokterSheet.getRange(2, 1, dokterSheet.getLastRow() - 1, 4).clearContent();
    }
    
    const doctorData = data.doctors.map(d => [d.id, d.name, d.color, d.isBackup]);
    dokterSheet.getRange(2, 1, doctorData.length, 4).setValues(doctorData);
  }
  
  // Import Schedule
  if (data.schedule) {
    const jadwalSheet = ss.getSheetByName('Jadwal');
    if (jadwalSheet.getLastRow() > 1) {
      jadwalSheet.getRange(2, 1, jadwalSheet.getLastRow() - 1, 6).clearContent();
    }
    
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
    }
  }
  
  // Import Holidays
  if (data.holidays) {
    const liburSheet = ss.getSheetByName('LiburNasional');
    if (liburSheet.getLastRow() > 1) {
      liburSheet.getRange(2, 1, liburSheet.getLastRow() - 1, 3).clearContent();
    }
    
    const holidayData = [];
    Object.keys(data.holidays).forEach(year => {
      data.holidays[year].forEach(h => {
        holidayData.push([parseInt(year), h.date, h.name]);
      });
    });
    
    if (holidayData.length > 0) {
      liburSheet.getRange(2, 1, holidayData.length, 3).setValues(holidayData);
    }
  }
  
  // Import Settings
  if (data.settings) {
    const settingsSheet = ss.getSheetByName('Settings');
    if (settingsSheet.getLastRow() > 1) {
      settingsSheet.getRange(2, 1, settingsSheet.getLastRow() - 1, 2).clearContent();
    }
    
    const settingsData = Object.entries(data.settings).map(([key, value]) => [key, value]);
    if (settingsData.length > 0) {
      settingsSheet.getRange(2, 1, settingsData.length, 2).setValues(settingsData);
    }
  }
}

/**
 * EXPORT DATA - Export dari spreadsheet ke JSON
 * Gunakan ini untuk backup atau sync balik ke aplikasi
 */
function exportData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = {
    doctors: [],
    schedule: {},
    holidays: {},
    settings: {},
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  // Export Doctors
  const dokterSheet = ss.getSheetByName('Dokter');
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
  const jadwalSheet = ss.getSheetByName('Jadwal');
  if (jadwalSheet && jadwalSheet.getLastRow() > 1) {
    const jadwalData = jadwalSheet.getDataRange().getValues();
    for (let i = 1; i < jadwalData.length; i++) {
      const date = jadwalData[i][0];
      const month = date.substring(0, 7);
      
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
  const liburSheet = ss.getSheetByName('LiburNasional');
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
  const settingsSheet = ss.getSheetByName('Settings');
  if (settingsSheet && settingsSheet.getLastRow() > 1) {
    const settingsData = settingsSheet.getDataRange().getValues();
    for (let i = 1; i < settingsData.length; i++) {
      data.settings[settingsData[i][0]] = settingsData[i][1];
    }
  }
  
  // Tampilkan hasil
  const json = JSON.stringify(data, null, 2);
  const ui = SpreadsheetApp.getUi();
  
  ui.alert(
    '📤 Export Data',
    'Data JSON sudah siap:\n\n' + json.substring(0, 500) + '...\n\n' +
    'Untuk copy full data, jalankan fungsi exportToClipboard()',
    ui.ButtonSet.OK
  );
  
  return data;
}

/**
 * EXPORT TO CLIPBOARD - Copy JSON ke clipboard
 */
function exportToClipboard() {
  const data = exportData();
  const json = JSON.stringify(data, null, 2);
  
  // Simpan ke file di Google Drive
  const blob = Utilities.newBlob(json, 'application/json', 'export-' + new Date().toISOString().split('T')[0] + '.json');
  const file = DriveApp.createFile(blob);
  
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '✅ Export Berhasil!',
    'File sudah disimpan ke Google Drive:\n' + file.getName() + '\n\n' +
    'URL: ' + file.getUrl() + '\n\n' +
    'Anda bisa download file ini atau copy isinya.',
    ui.ButtonSet.OK
  );
}

/**
 * CLEAR ALL DATA - Hapus semua data di sheet
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
 * MENU - Buat menu custom di spreadsheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📅 Jadwal Rotasi')
    .addItem('🔄 Sync dari Aplikasi', 'pasteData')
    .addItem('📤 Export ke File', 'exportToClipboard')
    .addSeparator()
    .addItem('⚙️ Setup Awal', 'setup')
    .addItem('🗑️ Hapus Semua Data', 'clearAllData')
    .addToUi();
}
