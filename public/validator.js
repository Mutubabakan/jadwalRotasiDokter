/**
 * ============================================================================
 * VALIDATOR DATA - JADWAL ROTASI DOKTER
 * ============================================================================
 * 
 * Script ini untuk memvalidasi file export.json sebelum sync ke spreadsheet
 * 
 * CARA PAKAI:
 * 1. Upload file ini ke Apps Script editor (sebagai file terpisah)
 * 2. Jalankan fungsi validateExportFile()
 * 3. Lihat hasil validasi di sheet "Validation"
 */

/**
 * Validasi file export.json dari GitHub
 */
function validateExportFile() {
  try {
    Logger.log('🔍 Memulai validasi data...');
    
    // Fetch data dari GitHub
    const data = fetchFromGitHub();
    
    if (!data) {
      Logger.log('❌ Gagal fetch data dari GitHub');
      return { valid: false, errors: ['Data dari GitHub kosong'] };
    }
    
    // Validasi struktur data
    const result = validateDataStructure(data);
    
    // Tampilkan hasil
    showValidationResult(result);
    
    return result;
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return { valid: false, errors: [error.toString()] };
  }
}

/**
 * Validasi struktur data
 */
function validateDataStructure(data) {
  const errors = [];
  const warnings = [];
  
  // Validasi doctors
  if (!data.doctors || !Array.isArray(data.doctors)) {
    errors.push('Field "doctors" tidak ada atau bukan array');
  } else {
    if (data.doctors.length === 0) {
      warnings.push('Array "doctors" kosong');
    }
    
    data.doctors.forEach((doctor, idx) => {
      if (!doctor.id) errors.push(`Doctor[${idx}]: field "id" tidak ada`);
      if (!doctor.name) errors.push(`Doctor[${idx}]: field "name" tidak ada`);
      if (!doctor.color) errors.push(`Doctor[${idx}]: field "color" tidak ada`);
      if (doctor.color && !/^#[0-9A-Fa-f]{6}$/.test(doctor.color)) {
        errors.push(`Doctor[${idx}]: format color tidak valid (${doctor.color})`);
      }
      if (typeof doctor.isBackup !== 'boolean') {
        errors.push(`Doctor[${idx}]: field "isBackup" harus boolean`);
      }
    });
  }
  
  // Validasi schedule
  if (!data.schedule || typeof data.schedule !== 'object') {
    errors.push('Field "schedule" tidak ada atau bukan object');
  } else {
    Object.keys(data.schedule).forEach(month => {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        errors.push(`Schedule: key "${month}" format tidak valid (harus YYYY-MM)`);
      }
      
      if (!Array.isArray(data.schedule[month])) {
        errors.push(`Schedule[${month}]: bukan array`);
      } else {
        data.schedule[month].forEach((entry, idx) => {
          if (!entry.date) {
            errors.push(`Schedule[${month}][${idx}]: field "date" tidak ada`);
          } else if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
            errors.push(`Schedule[${month}][${idx}]: format date tidak valid (${entry.date})`);
          }
          
          if (!entry.ket || !Array.isArray(entry.ket)) {
            errors.push(`Schedule[${month}][${idx}]: field "ket" tidak ada atau bukan array`);
          }
        });
      }
    });
  }
  
  // Validasi holidays
  if (!data.holidays || typeof data.holidays !== 'object') {
    errors.push('Field "holidays" tidak ada atau bukan object');
  } else {
    Object.keys(data.holidays).forEach(year => {
      if (!/^\d{4}$/.test(year)) {
        errors.push(`Holidays: key "${year}" format tidak valid (harus YYYY)`);
      }
      
      if (!Array.isArray(data.holidays[year])) {
        errors.push(`Holidays[${year}]: bukan array`);
      } else {
        data.holidays[year].forEach((holiday, idx) => {
          if (!holiday.date) {
            errors.push(`Holidays[${year}][${idx}]: field "date" tidak ada`);
          } else if (!/^\d{4}-\d{2}-\d{2}$/.test(holiday.date)) {
            errors.push(`Holidays[${year}][${idx}]: format date tidak valid (${holiday.date})`);
          }
          if (!holiday.name) {
            errors.push(`Holidays[${year}][${idx}]: field "name" tidak ada`);
          }
        });
      }
    });
  }
  
  // Validasi settings
  if (!data.settings || typeof data.settings !== 'object') {
    errors.push('Field "settings" tidak ada atau bukan object');
  }
  
  // Validasi metadata
  if (!data.exportDate) {
    warnings.push('Field "exportDate" tidak ada');
  }
  
  if (!data.version) {
    warnings.push('Field "version" tidak ada');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings,
    summary: {
      doctors: data.doctors ? data.doctors.length : 0,
      scheduleMonths: data.schedule ? Object.keys(data.schedule).length : 0,
      holidayYears: data.holidays ? Object.keys(data.holidays).length : 0,
      totalScheduleEntries: data.schedule ? 
        Object.values(data.schedule).reduce((sum, arr) => sum + arr.length, 0) : 0,
      totalHolidays: data.holidays ? 
        Object.values(data.holidays).reduce((sum, arr) => sum + arr.length, 0) : 0
    }
  };
}

/**
 * Tampilkan hasil validasi
 */
function showValidationResult(result) {
  const ss = getSpreadsheet();
  let validationSheet = ss.getSheetByName('Validation');
  
  if (!validationSheet) {
    validationSheet = ss.insertSheet('Validation');
    validationSheet.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#9b59b6').setFontColor('#ffffff');
  }
  
  // Clear sheet
  validationSheet.clear();
  
  // Header
  validationSheet.getRange(1, 1, 1, 2).setValues([['Field', 'Value']]);
  
  // Result
  const data = [
    ['Status', result.valid ? '✅ VALID' : '❌ INVALID'],
    ['', ''],
    ['=== SUMMARY ===', ''],
    ['Jumlah Dokter', result.summary.doctors],
    ['Jumlah Bulan Jadwal', result.summary.scheduleMonths],
    ['Total Entry Jadwal', result.summary.totalScheduleEntries],
    ['Jumlah Tahun Libur', result.summary.holidayYears],
    ['Total Hari Libur', result.summary.totalHolidays],
    ['', ''],
    ['=== ERRORS ===', ''],
  ];
  
  if (result.errors.length === 0) {
    data.push(['Tidak ada error', '']);
  } else {
    result.errors.forEach((error, idx) => {
      data.push([`Error ${idx + 1}`, error]);
    });
  }
  
  data.push(['', '']);
  data.push(['=== WARNINGS ===', '']);
  
  if (result.warnings.length === 0) {
    data.push(['Tidak ada warning', '']);
  } else {
    result.warnings.forEach((warning, idx) => {
      data.push([`Warning ${idx + 1}`, warning]);
    });
  }
  
  // Write data
  validationSheet.getRange(2, 1, data.length, 2).setValues(data);
  
  // Auto-resize columns
  validationSheet.autoResizeColumns(1, 2);
  
  // Show alert
  const message = result.valid 
    ? `✅ Data VALID!\n\nSummary:\n- Doctors: ${result.summary.doctors}\n- Schedule: ${result.summary.totalScheduleEntries} entries\n- Holidays: ${result.summary.totalHolidays} days`
    : `❌ Data INVALID!\n\n${result.errors.length} error ditemukan.\n\nLihat sheet "Validation" untuk detail.`;
  
  SpreadsheetApp.getUi().alert(message);
  
  // Switch to validation sheet
  ss.setActiveSheet(validationSheet);
}

/**
 * Validasi file JSON dari clipboard
 */
function validateFromClipboard() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Validasi dari Clipboard',
    'Paste data JSON di bawah:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  
  const text = response.getResponseText();
  
  try {
    const data = JSON.parse(text);
    const result = validateDataStructure(data);
    showValidationResult(result);
  } catch (error) {
    ui.alert('❌ Error: Format JSON tidak valid\n\n' + error.message);
  }
}

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
 * Fetch data dari GitHub (reuse dari script utama)
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
  
  if (CONFIG.GITHUB_TOKEN) {
    options.headers['Authorization'] = `token ${CONFIG.GITHUB_TOKEN}`;
  }
  
  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());
  
  const content = Utilities.base64Decode(json.content);
  const text = Utilities.newBlob(content).getDataAsString();
  
  return JSON.parse(text);
}
