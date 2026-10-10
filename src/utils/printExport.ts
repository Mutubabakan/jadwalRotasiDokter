import type { KopImage } from './types';
import { getDoctors, getMonthSchedule, isHoliday, getHolidayName } from './storage';

export const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export interface PrintRow {
  hari: string;
  tgl: string; // dd/mm
  k3a: string;
  k3b: string;
  igd: string;
  k2: string;
  ketLines: string[];
  libur: boolean;
}

export interface PrintDocData {
  puskesmasName: string;
  year: number;
  month: number; // 0-11
  rows: PrintRow[];
  showLegend: boolean;
  lokasi: string;
  tanggalDibuat: string; // YYYY-MM-DD
  namaKepala: string;
  nipKepala: string;
  kopMode: 'gambar' | 'teks' | 'tanpa';
  kopImage: KopImage | null;
  kopTeks: string;
}

export function formatTanggalID(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS_ID[m - 1]} ${y}`;
}

export function cleanNip(nip: string): string {
  return nip.trim().replace(/^nip\.?\s*/i, '');
}

const STATUS_LETTER: Record<string, string> = { izin: 'I', sakit: 'S', tugas: 'T' };

function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** Baris tabel untuk satu bulan, memakai aturan yang sama dengan tab Jadwal. */
export function buildRows(year: number, month: number): { rows: PrintRow[]; filled: number; showLegend: boolean } {
  const doctors = getDoctors();
  const stored = getMonthSchedule(year, month);
  const byDate = new Map(stored.map(e => [e.date, e]));
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const nameOf = (id?: string) => (id ? doctors.find(d => d.id === id)?.name || '' : '');

  let filled = 0;
  let showLegend = false;
  const rows: PrintRow[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const entry = byDate.get(date) || { date, ket: [] };
    const ket = entry.ket || [];
    const dateObj = new Date(date + 'T00:00:00');

    const cell = (id?: string): string => {
      if (!id) return '';
      const name = nameOf(id);
      if (!name) return '';
      const k = ket.find(x => x.doctorId === id);
      const letter = k && k.status ? STATUS_LETTER[k.status] : '';
      if (letter) showLegend = true;
      return letter ? `${name} (${letter})` : name;
    };

    const k3a = cell(entry.k3a);
    const k3b = cell(entry.k3b);
    const igd = cell(entry.igd);
    const k2 = cell(entry.k2);
    if (k3a || k3b || igd || k2) filled++;

    const ketLines: string[] = [];
    const nat = getHolidayName(date);
    if (nat) ketLines.push(nat);
    const manualHolidays = ket.filter(k => k.type === 'holiday');
    manualHolidays.forEach(k => {
      if (k.label && !ketLines.some(l => l.toLowerCase() === k.label.toLowerCase())) ketLines.push(k.label);
    });
    ket.filter(k => k.type !== 'holiday').forEach(k => {
      const status = k.status === 'tugas' ? k.tugasLabel || 'Tugas' : cap(k.status || '');
      ketLines.push(status ? `${k.label} (${status})` : k.label);
    });

    rows.push({
      hari: DAYS_ID[dateObj.getDay()],
      tgl: `${String(d).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}`,
      k3a,
      k3b,
      igd,
      k2,
      ketLines,
      libur: isHoliday(date) || manualHolidays.length > 0,
    });
  }
  return { rows, filled, showLegend };
}

export function makeFileName(year: number, month: number, ext: 'pdf' | 'docx'): string {
  return `Jadwal-Rotasi-Dokter-${MONTHS_ID[month]}-${year}.${ext}`;
}

// ---------------------------------------------------------------------------
// Pembagian lebar kolom (mm) untuk A4 portrait dengan margin kiri/kanan 15 mm
// ---------------------------------------------------------------------------
const COLS_MM = { hari: 20, tgl: 13, k3a: 24, k3b: 24, igd: 24, k2: 24, ket: 51 };
const HEAD = ['Hari', 'Tgl', 'K3a', 'K3b', 'IGD', 'K2', 'Ket'];

function kopLines(text: string): string[] {
  return text.split('\n').map(l => l.trim()).filter(Boolean);
}

function signatureTexts(d: PrintDocData) {
  const tanggal = formatTanggalID(d.tanggalDibuat);
  const lokasi = d.lokasi.trim();
  const nip = cleanNip(d.nipKepala);
  return {
    lokasiTanggal: lokasi ? `${lokasi}, ${tanggal}` : tanggal,
    nama: d.namaKepala.trim() || '..............................',
    nip: `NIP. ${nip || '..............................'}`,
  };
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const b64 = dataUrl.split(',')[1] || '';
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function imageKind(dataUrl: string): 'png' | 'jpg' {
  return dataUrl.startsWith('data:image/png') ? 'png' : 'jpg';
}

/** Ukuran gambar kop: lebar maks 180 mm, tinggi maks 32 mm, proporsi tetap. */
function kopSizeMm(img: KopImage): { w: number; h: number } {
  const ratio = img.width / img.height || 1;
  const w = Math.min(180, 32 * ratio);
  return { w, h: w / ratio };
}

// jsPDF memakai font bawaan (WinAnsi); buang karakter di luar itu (mis. emoji)
function pdfSafe(s: string): string {
  return s.replace(/[^\x20-\x7E\u00A0-\u00FF\u2013\u2014\u2018\u2019\u201C\u201D\u2022]/g, '');
}

// ===========================================================================
// PDF
// ===========================================================================
export async function generatePdf(d: PrintDocData): Promise<Blob> {
  const [{ jsPDF }, atMod] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const autoTable = atMod.default;

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const PW = 210;
  const PH = 297;
  const ML = 15;
  const MT = 12;
  const MB = 12;
  const CW = PW - ML * 2;
  let y = MT;

  // ---- KOP
  if (d.kopMode === 'gambar' && d.kopImage) {
    const { w, h } = kopSizeMm(d.kopImage);
    const fmt = imageKind(d.kopImage.dataUrl) === 'png' ? 'PNG' : 'JPEG';
    pdf.addImage(d.kopImage.dataUrl, fmt, ML + (CW - w) / 2, y, w, h);
    y += h + 4;
  } else if (d.kopMode === 'teks') {
    const lines = kopLines(d.kopTeks);
    lines.forEach((line, i) => {
      const small = lines.length > 1 && i === lines.length - 1;
      pdf.setFont('times', small ? 'normal' : 'bold');
      pdf.setFontSize(small ? 9 : lines.length === 1 ? 13 : 12.5);
      y += small ? 4 : 5.2;
      pdf.text(pdfSafe(line), PW / 2, y, { align: 'center' });
    });
    if (lines.length > 0) {
      y += 1.8;
      pdf.setLineWidth(0.7);
      pdf.line(ML, y, ML + CW, y);
      y += 0.9;
      pdf.setLineWidth(0.25);
      pdf.line(ML, y, ML + CW, y);
      y += 4;
    }
  }

  // ---- JUDUL
  pdf.setFont('times', 'bold');
  pdf.setFontSize(13);
  y += 4.5;
  pdf.text('Jadwal Rotasi Dokter', PW / 2, y, { align: 'center' });
  pdf.setFontSize(12);
  y += 5.2;
  pdf.text(pdfSafe(d.puskesmasName), PW / 2, y, { align: 'center' });
  pdf.setFontSize(11);
  y += 5.2;
  pdf.text(`Bulan ${MONTHS_ID[d.month]} Tahun ${d.year}`, PW / 2, y, { align: 'center' });
  y += 4;

  // ---- TABEL
  const body = d.rows.map(r => [
    r.hari, r.tgl, pdfSafe(r.k3a), pdfSafe(r.k3b), pdfSafe(r.igd), pdfSafe(r.k2),
    pdfSafe(r.ketLines.join('\n')),
  ]);

  autoTable(pdf, {
    startY: y,
    margin: { left: ML, right: ML, top: MT, bottom: MB },
    head: [HEAD],
    body,
    theme: 'grid',
    rowPageBreak: 'avoid',
    styles: {
      font: 'times',
      fontSize: 8.5,
      cellPadding: { top: 0.9, bottom: 0.9, left: 1, right: 1 },
      lineColor: [90, 90, 90],
      lineWidth: 0.2,
      textColor: 0,
      valign: 'middle',
      overflow: 'linebreak',
    },
    headStyles: { fillColor: [225, 225, 225], textColor: 0, fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { cellWidth: COLS_MM.hari, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: COLS_MM.tgl, halign: 'center' },
      2: { cellWidth: COLS_MM.k3a, halign: 'center' },
      3: { cellWidth: COLS_MM.k3b, halign: 'center' },
      4: { cellWidth: COLS_MM.igd, halign: 'center' },
      5: { cellWidth: COLS_MM.k2, halign: 'center' },
      6: { cellWidth: COLS_MM.ket, halign: 'left' },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    didParseCell: (h: any) => {
      if (h.section !== 'body') return;
      const r = d.rows[h.row.index];
      if (r && r.libur) {
        h.cell.styles.fillColor = [252, 232, 232];
        if (h.column.index <= 1) h.cell.styles.textColor = [170, 0, 0];
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (pdf as any).lastAutoTable.finalY as number;

  // ---- KETERANGAN SINGKATAN
  if (d.showLegend) {
    pdf.setFont('times', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(60);
    pdf.text('Keterangan: I = Izin, S = Sakit, T = Tugas luar', ML, y + 4);
    pdf.setTextColor(0);
    y += 5;
  }

  // ---- TANDA TANGAN (pojok kanan bawah)
  const sig = signatureTexts(d);
  const blockW = 70;
  const blockH = 38;
  if (y + 6 + blockH > PH - MB) {
    pdf.addPage();
    y = MT + 4;
  } else {
    y += 6;
  }
  const bx = PW - ML - blockW;
  pdf.setFont('times', 'normal');
  pdf.setFontSize(11);
  pdf.text(pdfSafe(sig.lokasiTanggal), bx, y + 4);
  pdf.setFont('times', 'bold');
  pdf.text(pdfSafe(sig.nama), bx, y + 4 + 22);
  pdf.setFont('times', 'normal');
  pdf.text(pdfSafe(sig.nip), bx, y + 4 + 27.5);

  pdf.setProperties({ title: `Jadwal Rotasi Dokter ${MONTHS_ID[d.month]} ${d.year}` });
  return pdf.output('blob');
}

// ===========================================================================
// DOCX
// ===========================================================================
const mmToTwip = (mm: number) => Math.round(mm * 56.6929);

export async function generateDocx(d: PrintDocData): Promise<Blob> {
  const docx = await import('docx');
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType,
    BorderStyle, ShadingType, ImageRun, VerticalAlign, TableLayoutType,
  } = docx;

  const FONT = 'Times New Roman';
  const colTw = [COLS_MM.hari, COLS_MM.tgl, COLS_MM.k3a, COLS_MM.k3b, COLS_MM.igd, COLS_MM.k2, COLS_MM.ket].map(mmToTwip);
  const PAGE_W = 11906;
  const MARGIN_LR = mmToTwip(15);
  const CONTENT_W = PAGE_W - MARGIN_LR * 2;
  // pastikan jumlah kolom tepat sama dengan lebar konten (koreksi pembulatan di kolom Ket)
  colTw[6] += CONTENT_W - colTw.reduce((a, b) => a + b, 0);

  const children: (InstanceType<typeof Paragraph> | InstanceType<typeof Table>)[] = [];

  // ---- KOP
  if (d.kopMode === 'gambar' && d.kopImage) {
    const { w, h } = kopSizeMm(d.kopImage);
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [new ImageRun({
        type: imageKind(d.kopImage.dataUrl),
        data: dataUrlToBytes(d.kopImage.dataUrl),
        transformation: { width: Math.round((w / 25.4) * 96), height: Math.round((h / 25.4) * 96) },
        altText: { title: 'Kop', description: 'Kop surat', name: 'Kop' },
      })],
    }));
  } else if (d.kopMode === 'teks') {
    const lines = kopLines(d.kopTeks);
    lines.forEach((line, i) => {
      const small = lines.length > 1 && i === lines.length - 1;
      const last = i === lines.length - 1;
      children.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        border: last ? { bottom: { style: BorderStyle.DOUBLE, size: 6, space: 2, color: '000000' } } : undefined,
        spacing: { after: last ? 120 : 0 },
        children: [new TextRun({
          text: line, bold: !small, font: FONT,
          size: small ? 18 : lines.length === 1 ? 26 : 25,
        })],
      }));
    });
  }

  // ---- JUDUL
  const title = (text: string, size: number, before = 0) => new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before, after: 40 },
    children: [new TextRun({ text, bold: true, size, font: FONT })],
  });
  children.push(title('Jadwal Rotasi Dokter', 26, 120));
  children.push(title(d.puskesmasName, 24));
  children.push(title(`Bulan ${MONTHS_ID[d.month]} Tahun ${d.year}`, 22));
  children.push(new Paragraph({ spacing: { after: 80 }, children: [] }));

  // ---- TABEL
  const line = { style: BorderStyle.SINGLE, size: 4, color: '5A5A5A' };
  const borders = { top: line, bottom: line, left: line, right: line };
  const margins = { top: 45, bottom: 45, left: 60, right: 60 };

  const mkCell = (
    lines: string[], idx: number,
    opt: { bold?: boolean; fill?: string; color?: string; align?: (typeof AlignmentType)[keyof typeof AlignmentType] },
  ) => new TableCell({
    width: { size: colTw[idx], type: WidthType.DXA },
    borders,
    margins,
    verticalAlign: VerticalAlign.CENTER,
    shading: opt.fill ? { type: ShadingType.CLEAR, fill: opt.fill, color: 'auto' } : undefined,
    children: (lines.length ? lines : ['']).map(t => new Paragraph({
      alignment: opt.align ?? AlignmentType.CENTER,
      children: [new TextRun({ text: t, bold: opt.bold, color: opt.color, size: 17, font: FONT })],
    })),
  });

  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: HEAD.map((t, i) => mkCell([t], i, { bold: true, fill: 'E1E1E1' })),
  });

  const bodyRows = d.rows.map(r => {
    const fill = r.libur ? 'FCE8E8' : undefined;
    const red = r.libur ? 'AA0000' : undefined;
    return new TableRow({
      cantSplit: true,
      children: [
        mkCell([r.hari], 0, { bold: true, fill, color: red }),
        mkCell([r.tgl], 1, { fill, color: red }),
        mkCell([r.k3a], 2, { fill }),
        mkCell([r.k3b], 3, { fill }),
        mkCell([r.igd], 4, { fill }),
        mkCell([r.k2], 5, { fill }),
        mkCell(r.ketLines, 6, { fill, align: AlignmentType.LEFT }),
      ],
    });
  });

  children.push(new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colTw,
    layout: TableLayoutType.FIXED,
    rows: [headerRow, ...bodyRows],
  }));

  // ---- KETERANGAN SINGKATAN
  if (d.showLegend) {
    children.push(new Paragraph({
      spacing: { before: 60 },
      children: [new TextRun({ text: 'Keterangan: I = Izin, S = Sakit, T = Tugas luar', italics: true, size: 16, font: FONT })],
    }));
  }

  // ---- TANDA TANGAN (blok di kanan)
  const sig = signatureTexts(d);
  const indent = CONTENT_W - mmToTwip(70);
  const sigPara = (text: string, o: { bold?: boolean; before?: number }) => new Paragraph({
    indent: { left: indent },
    keepNext: true,
    keepLines: true,
    spacing: { before: o.before ?? 0 },
    children: [new TextRun({ text, bold: o.bold, size: 22, font: FONT })],
  });
  children.push(sigPara(sig.lokasiTanggal, { before: 340 }));
  children.push(sigPara(sig.nama, { bold: true, before: 1050 }));
  children.push(new Paragraph({
    indent: { left: indent },
    keepLines: true,
    children: [new TextRun({ text: sig.nip, size: 22, font: FONT })],
  }));

  const doc = new Document({
    creator: d.puskesmasName,
    title: `Jadwal Rotasi Dokter ${MONTHS_ID[d.month]} ${d.year}`,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 17 },
          paragraph: { spacing: { before: 0, after: 0 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: 16838 },
          margin: { top: mmToTwip(12), bottom: mmToTwip(12), left: MARGIN_LR, right: MARGIN_LR },
        },
      },
      children,
    }],
  });

  return Packer.toBlob(doc);
}
