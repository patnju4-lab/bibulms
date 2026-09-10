import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface TranscriptPdfProgress {
  currentPage: number;
  totalPages: number;
  statusText: string;
  percent: number;
  stage: 'preparing' | 'rendering' | 'compiling' | 'completed' | 'error';
  errorMessage?: string;
}

export interface TranscriptPdfExportOptions {
  filename?: string;
  scale?: number;
  onProgress?: (progress: TranscriptPdfProgress) => void;
  shouldCancel?: () => boolean;
}

/**
 * Generates and downloads an official Registrar-formatted Academic Transcript PDF.
 * Uses html2canvas for high-DPI rendering and jsPDF for standard A4 document output.
 */
export async function exportTranscriptToPdf(
  containerElement: HTMLElement,
  options: TranscriptPdfExportOptions = {}
): Promise<{ success: boolean; filename: string; pageCount: number; error?: string }> {
  const {
    filename = 'BIBU_Official_Academic_Transcript.pdf',
    scale = 2,
    onProgress,
    shouldCancel
  } = options;

  try {
    onProgress?.({
      currentPage: 0,
      totalPages: 1,
      statusText: 'Initializing transcript compiler & registrar layout...',
      percent: 8,
      stage: 'preparing'
    });

    if (shouldCancel?.()) {
      return { success: false, filename, pageCount: 0, error: 'Cancelled by user' };
    }

    // Look for explicit page elements marked with .transcript-page or .page-break
    const pageBreakElements = Array.from(
      containerElement.querySelectorAll('.transcript-page, .page-break')
    ) as HTMLElement[];

    const pagesToRender: HTMLElement[] =
      pageBreakElements.length > 0 ? pageBreakElements : [containerElement];

    const totalPages = pagesToRender.length;

    // Create jsPDF A4 portrait document (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Set document properties for official archival integrity
    pdf.setProperties({
      title: 'Official Academic Transcript - Breakthrough International Bible University',
      subject: 'Certified Official Academic Record issued by the Office of the University Registrar',
      author: 'Office of the University Registrar, Breakthrough International Bible University (BIBU), Phoenix, AZ',
      keywords: 'academic transcript, university registrar, cumulative GPA, course history, theological degree',
      creator: 'BIBU Automated Registrar Transcript Engine'
    });

    const pdfPageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 297 mm
    let renderedCount = 0;

    for (let i = 0; i < pagesToRender.length; i++) {
      if (shouldCancel?.()) {
        return { success: false, filename, pageCount: renderedCount, error: 'Cancelled by user' };
      }

      const pageEl = pagesToRender[i];
      const pageNumber = i + 1;
      const progressPercent = Math.round(15 + (i / totalPages) * 70);

      onProgress?.({
        currentPage: pageNumber,
        totalPages,
        statusText: `Rendering official page ${pageNumber} of ${totalPages}...`,
        percent: progressPercent,
        stage: 'rendering'
      });

      // Capture page with html2canvas at high resolution
      const canvas = await html2canvas(pageEl, {
        scale: scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        windowWidth: 1080,
        onclone: (clonedDoc) => {
          // Hide interactive controls, buttons, toolbars from the PDF
          const noPrintEls = clonedDoc.querySelectorAll('.no-print, [data-no-print="true"]');
          noPrintEls.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
          });

          // Ensure images have crossOrigin set
          const images = clonedDoc.querySelectorAll('img');
          images.forEach((img) => {
            img.crossOrigin = 'anonymous';
          });
        }
      });

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const a4AspectRatio = pdfPageHeight / pdfPageWidth;
      const singlePageMaxCanvasHeight = canvasWidth * a4AspectRatio;

      if (canvasHeight <= singlePageMaxCanvasHeight * 1.12) {
        // Fits comfortably on a single A4 page
        if (renderedCount > 0) {
          pdf.addPage();
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const renderedHeight = (canvasHeight * pdfPageWidth) / canvasWidth;

        if (renderedHeight > pdfPageHeight) {
          const fittedWidth = (canvasWidth * pdfPageHeight) / canvasHeight;
          const xOffset = Math.max(0, (pdfPageWidth - fittedWidth) / 2);
          pdf.addImage(imgData, 'JPEG', xOffset, 0, fittedWidth, pdfPageHeight, undefined, 'FAST');
        } else {
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfPageWidth, renderedHeight, undefined, 'FAST');
        }

        renderedCount++;
      } else {
        // Multi-page slicing for longer content
        let remainingHeight = canvasHeight;
        let sourceY = 0;

        while (remainingHeight > 0) {
          const sliceHeight = Math.min(remainingHeight, singlePageMaxCanvasHeight);

          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvasWidth;
          sliceCanvas.height = sliceHeight;
          const sliceCtx = sliceCanvas.getContext('2d');

          if (sliceCtx) {
            sliceCtx.fillStyle = '#ffffff';
            sliceCtx.fillRect(0, 0, canvasWidth, sliceHeight);
            sliceCtx.drawImage(
              canvas,
              0,
              sourceY,
              canvasWidth,
              sliceHeight,
              0,
              0,
              canvasWidth,
              sliceHeight
            );

            if (renderedCount > 0) {
              pdf.addPage();
            }

            const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95);
            const renderedSliceHeight = (sliceHeight * pdfPageWidth) / canvasWidth;
            pdf.addImage(sliceData, 'JPEG', 0, 0, pdfPageWidth, renderedSliceHeight, undefined, 'FAST');
            renderedCount++;
          }

          sourceY += sliceHeight;
          remainingHeight -= sliceHeight;
        }
      }
    }

    onProgress?.({
      currentPage: totalPages,
      totalPages,
      statusText: 'Compiling registrar PDF archive and initiating download...',
      percent: 92,
      stage: 'compiling'
    });

    if (shouldCancel?.()) {
      return { success: false, filename, pageCount: renderedCount, error: 'Cancelled by user' };
    }

    // Save and download PDF
    pdf.save(filename);

    onProgress?.({
      currentPage: totalPages,
      totalPages,
      statusText: 'Official Registrar Transcript successfully downloaded!',
      percent: 100,
      stage: 'completed'
    });

    return {
      success: true,
      filename,
      pageCount: renderedCount
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    onProgress?.({
      currentPage: 0,
      totalPages: 1,
      statusText: 'PDF compilation failed',
      percent: 0,
      stage: 'error',
      errorMessage: errorMsg
    });

    return {
      success: false,
      filename,
      pageCount: 0,
      error: errorMsg
    };
  }
}
