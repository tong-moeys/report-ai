// PDF Export utility using html2pdf.js with progress feedback
import html2pdf from 'html2pdf.js';

export interface PdfProgressInfo {
  percent: number;
  stage: string;
}

export async function exportElementToPdf(
  element: HTMLElement,
  filename: string = 'របាយការណ៍បូកសរុប_សាលាបឋមសិក្សា_២៤ទំព័រ.pdf',
  onProgress?: (progress: PdfProgressInfo) => void
): Promise<boolean> {
  try {
    onProgress?.({ percent: 15, stage: 'កំពុងរៀបចំទំព័រ និងកំណត់ខ្នាត A4...' });
    await new Promise((r) => setTimeout(r, 200));

    onProgress?.({ percent: 35, stage: 'កំពុងចាប់យករូបភាព និងតារាងខ្មែរ (Hi-Res)...' });
    await new Promise((r) => setTimeout(r, 250));

    const opt = {
      margin: [8, 8, 8, 8] as [number, number, number, number], // 8mm padding on each A4 side
      filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2, // High resolution crisp text for Khmer scripts
        useCORS: true,
        letterRendering: true,
        logging: false,
        scrollY: 0,
        windowWidth: 1200,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait' as const,
        compress: true,
      },
      pagebreak: {
        mode: ['css', 'legacy'],
        before: '.page-break-before',
        after: ['.print-page-break', '.html2pdf__page-break'],
        avoid: ['tr', 'thead', 'tfoot', '.page-break-inside-avoid'],
      },
    };

    onProgress?.({ percent: 65, stage: 'កំពុងបំបែក និងតម្រៀបទំព័រ A4 ស្វ័យប្រវត្តិ...' });
    await new Promise((r) => setTimeout(r, 200));

    onProgress?.({ percent: 85, stage: 'កំពុងបង្កើត និងបង្ហាប់ឯកសារ PDF...' });

    // Run html2pdf
    await html2pdf().set(opt).from(element).save();

    onProgress?.({ percent: 100, stage: 'ទាញយកឯកសារ PDF បានជោគជ័យ!' });
    await new Promise((r) => setTimeout(r, 400));
    return true;
  } catch (error) {
    console.error('Error in exportElementToPdf:', error);
    throw error;
  }
}
