/**
 * Utility to export printable reports into standalone, offline-ready HTML documents
 * compatible with MS Word, Google Docs, and web browsers.
 */
export function exportReportAsHtml(elementId: string, filename: string, title: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  const contentHtml = element.innerHTML;

  const fullHtml = `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Moul&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 12mm 15mm 12mm;
    }
    body {
      font-family: 'Kantumruy Pro', 'Khmer OS', 'Khmer OS Siemreap', sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 16px;
    }
    .font-moul {
      font-family: 'Moul', 'Khmer OS Muol Light', serif;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 12px 0;
      font-size: 10px;
    }
    th, td {
      border: 1px solid #1e293b;
      padding: 3px 4px;
      text-align: center;
    }
    th {
      background-color: #f8fafc;
      font-weight: 600;
    }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .bg-slate-50 { background-color: #f8fafc; }
    .bg-slate-100 { background-color: #f1f5f9; }
    .page-break-inside-avoid {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .no-print {
      display: none !important;
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
  ${contentHtml}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
