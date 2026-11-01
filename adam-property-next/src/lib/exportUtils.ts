import * as XLSX from 'xlsx';

export interface ExportDataConfig {
  filename: string;
  title: string;
  subtitle?: string;
  category?: string;
  headers: string[];
  rows: (string | number | null | undefined)[][];
  summary?: { label: string; value: string }[];
  orientation?: 'portrait' | 'landscape';
  printedBy?: string;
}

/**
 * Export data directly to a formatted Excel (.xlsx) file.
 */
export function exportToExcel(config: ExportDataConfig) {
  const { filename, title, subtitle, headers, rows, summary } = config;
  const wb = XLSX.utils.book_new();
  const data: (string | number)[][] = [];

  // Header info
  data.push(['PT ADAM PROPERTY INDONESIA']);
  data.push([title.toUpperCase()]);
  if (subtitle) data.push([subtitle]);
  data.push([`Tanggal Export: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`]);
  data.push([]); // blank line

  // Table Headers
  data.push(headers);

  // Table Rows
  rows.forEach(r => {
    data.push(r.map(val => (val !== null && val !== undefined ? val : '-')));
  });

  // Summary section if provided
  if (summary && summary.length > 0) {
    data.push([]);
    data.push(['--- RINGKASAN DATA ---']);
    summary.forEach(s => {
      data.push([s.label, s.value]);
    });
  }

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Calculate column widths
  const colWidths = headers.map((h, i) => {
    let maxLen = h.length;
    rows.forEach(r => {
      const valStr = String(r[i] ?? '');
      if (valStr.length > maxLen) maxLen = valStr.length;
    });
    return { wch: Math.min(Math.max(maxLen + 4, 12), 48) };
  });
  ws['!cols'] = colWidths;

  const sheetName = title.slice(0, 28) || 'Data';
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const cleanFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(wb, cleanFilename);
}

/**
 * Export data to an official, print-ready PDF with PT Adam Property Indonesia Letterhead.
 */
export function exportToPdf(config: ExportDataConfig) {
  const {
    title,
    subtitle = 'Cluster Baitul Makmur, Kromengan, Kab. Malang',
    category = 'LAPORAN RESMI PERUSAHAAN',
    headers,
    rows,
    summary,
    orientation = 'landscape',
    printedBy = 'Administrator'
  } = config;

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const printWindow = window.open('', '_blank', 'width=1100,height=850');
  if (!printWindow) {
    alert('Gagal membuka jendela cetak. Pastikan pop-up diizinkan oleh browser Anda.');
    return;
  }

  const tableRowsHtml = rows
    .map(
      (row, idx) => `
      <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}">
        <td class="text-center font-bold text-slate-500 py-2 px-3 border border-slate-300 text-xs">${idx + 1}</td>
        ${row
          .map(cell => {
            const val = cell !== null && cell !== undefined ? String(cell) : '-';
            const isNumber = !isNaN(Number(val.replace(/[^0-9.-]+/g, ''))) && val.includes('Rp');
            return `
              <td class="py-2 px-3 border border-slate-300 text-xs ${isNumber ? 'text-right font-mono font-medium' : 'text-left'} text-slate-800">
                ${val}
              </td>
            `;
          })
          .join('')}
      </tr>
    `
    )
    .join('');

  const summaryHtml = summary && summary.length > 0
    ? `
      <div class="mt-6 mb-6 p-4 rounded-xl border border-slate-300 bg-slate-50">
        <div class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Ringkasan Eksekutif:</div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          ${summary
            .map(
              s => `
              <div class="bg-white p-3 rounded-lg border border-slate-200">
                <div class="text-[10px] uppercase font-bold text-slate-500">${s.label}</div>
                <div class="text-sm font-black text-slate-900 mt-1">${s.value}</div>
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    `
    : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${title} - PT Adam Property Indonesia</title>
      <style>
        @page {
          size: A4 ${orientation};
          margin: 12mm 15mm;
        }
        * {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        body {
          margin: 0;
          padding: 20px;
          color: #0f172a;
          background: #fff;
          font-size: 12px;
        }
        .header-kop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px double #0f172a;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .kop-logo {
          width: 50px;
          height: 50px;
          object-fit: contain;
        }
        .kop-brand {
          flex: 1;
          margin-left: 14px;
        }
        .company-name {
          font-size: 17px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: #091220;
          text-transform: uppercase;
        }
        .company-tagline {
          font-size: 11px;
          font-weight: 700;
          color: #047857;
          margin-top: 1px;
        }
        .company-address {
          font-size: 10px;
          color: #64748b;
          margin-top: 2px;
        }
        .doc-meta {
          text-align: right;
          font-size: 10px;
          color: #64748b;
        }
        .doc-title-box {
          text-align: center;
          margin: 14px 0 16px;
        }
        .doc-badge {
          display: inline-block;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 3px 8px;
          background: #ecfdf5;
          color: #065f46;
          border-radius: 4px;
          border: 1px solid #a7f3d0;
          margin-bottom: 4px;
        }
        .doc-title {
          font-size: 15px;
          font-weight: 900;
          color: #091220;
          text-transform: uppercase;
          letter-spacing: -0.3px;
          margin: 2px 0;
        }
        .doc-subtitle {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }
        th {
          background-color: #091220;
          color: #ffffff;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.5px;
          padding: 8px 10px;
          border: 1px solid #091220;
          text-align: left;
        }
        td {
          padding: 6px 10px;
          border: 1px solid #cbd5e1;
          font-size: 11px;
        }
        tr:nth-child(even) {
          background-color: #f8fafc;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
        .summary-box {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin: 16px 0;
        }
        .summary-card {
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          padding: 8px 14px;
          border-radius: 8px;
          text-align: right;
        }
        .summary-card-title {
          font-size: 9px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }
        .summary-card-value {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          margin-top: 2px;
        }
        .signature-section {
          margin-top: 36px;
          display: flex;
          justify-content: space-between;
          page-break-inside: avoid;
        }
        .signature-box {
          text-align: center;
          width: 28%;
        }
        .signature-role {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }
        .signature-space {
          height: 60px;
        }
        .signature-name {
          font-size: 12px;
          font-weight: 800;
          color: #0f172a;
          border-top: 1px solid #0f172a;
          padding-top: 4px;
        }
        .signature-title {
          font-size: 10px;
          color: #64748b;
        }
        .footer-print {
          margin-top: 24px;
          padding-top: 8px;
          border-top: 1px dashed #cbd5e1;
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: #94a3b8;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 16px; padding: 10px 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 12px; color: #1e40af; font-weight: 600;">
          Dokumen siap dicetak atau disimpan sebagai PDF.
        </span>
        <div>
          <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;">
            🖨️ Cetak / Simpan PDF
          </button>
          <button onclick="window.close()" style="background: #94a3b8; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px; margin-left: 8px;">
            Tutup
          </button>
        </div>
      </div>

      <!-- KOP SURAT RESMI -->
      <div class="header-kop">
        <div style="display: flex; align-items: center;">
          <img src="/assets/logo-icon.svg" class="kop-logo" alt="Logo PT Adam Property" />
          <div class="kop-brand">
            <div class="company-name">PT ADAM PROPERTY INDONESIA</div>
            <div class="company-tagline">DEVELOPER UTAMA PERUMAHAN & TANAH KAVLING TERPERCAYA</div>
            <div class="company-address">Jl. Punden Gg 3 RT 42 RW 03, Jatikerto, Kec. Kromengan, Kab. Malang, Jawa Timur</div>
          </div>
        </div>
        <div class="doc-meta">
          <div>Tanggal: <strong>${currentDate}</strong></div>
          <div>Dicetak Oleh: <strong>${printedBy}</strong></div>
          <div>Status: <strong style="color: #047857;">Dokumen Resmi</strong></div>
        </div>
      </div>

      <!-- TITLE -->
      <div class="doc-title-box">
        <div class="doc-badge">${category}</div>
        <div class="doc-title">${title}</div>
        <div class="doc-subtitle">${subtitle}</div>
      </div>

      <!-- SUMMARY CARDS IF ANY -->
      ${
        summary && summary.length > 0
          ? `
        <div class="summary-box">
          ${summary
            .map(
              s => `
            <div class="summary-card">
              <div class="summary-card-title">${s.label}</div>
              <div class="summary-card-value">${s.value}</div>
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }

      <!-- TABLE -->
      <table>
        <thead>
          <tr>
            <th style="width: 36px;" class="text-center">No</th>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <!-- SIGNATURE BLOCK -->
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-role">Disiapkan Oleh,</div>
          <div class="signature-space"></div>
          <div class="signature-name">${printedBy}</div>
          <div class="signature-title">Staff Keuangan / Admin</div>
        </div>

        <div class="signature-box">
          <div class="signature-role">Diperiksa Oleh,</div>
          <div class="signature-space"></div>
          <div class="signature-name">Faruq Adrean</div>
          <div class="signature-title">Head of IT & Administrator</div>
        </div>

        <div class="signature-box">
          <div class="signature-role">Disetujui Oleh,</div>
          <div class="signature-space"></div>
          <div class="signature-name">Management</div>
          <div class="signature-title">Direksi & Pengawas</div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="footer-print">
        <div>Sistem Manajemen PT Adam Property Indonesia &bull; Dokumen Rahasia Perusahaan</div>
        <div>Dicetak Otomatis pada ${new Date().toLocaleString('id-ID')}</div>
      </div>

      <script>
        window.onload = function() {
          // Delay to ensure styles and fonts render before print dialog
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
