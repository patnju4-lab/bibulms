import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfExportProgress {
  currentPage: number;
  totalPages: number;
  pageTitle: string;
  percent: number;
  stage: 'preparing' | 'rendering' | 'compiling' | 'completed' | 'error';
  errorMessage?: string;
}

export interface PdfExportOptions {
  scale?: number; // 1.5 for fast standard, 2 for high-res print, 3 for archival
  filename?: string;
  scope?: 'full' | 'current';
  onProgress?: (progress: PdfExportProgress) => void;
  shouldCancel?: () => boolean;
}

export const BOOKLET_PAGE_TITLES: Record<number, string> = {
  1: 'Official Front Cover & University Crest',
  2: 'Table of Contents & Governing Council',
  3: 'Order of Proceedings & Programme Schedule',
  4: 'Institutional Heritage, Mission & Accreditation',
  5: "Chancellor's Convocation Charge",
  6: "Vice Chancellor's Address",
  7: "Registrar's Certification Proclamation",
  8: 'Keynote & Chief Guest Address',
  9: 'Academic Awards, Honors & Citations',
  10: 'Graduating Class Directory & Academic Roll',
  11: 'Convocation Hymns, Benediction & Back Cover'
};

/**
 * Exports the HTML Graduation Booklet to a multi-page PDF document using jsPDF & html2canvas.
 */
export async function exportBookletToPdf(
  containerElement: HTMLElement,
  options: PdfExportOptions = {}
): Promise<{ success: boolean; filename: string; pageCount: number; error?: string }> {
  const {
    scale = 2,
    filename = 'BIBU_Graduation_Booklet.pdf',
    scope = 'full',
    onProgress,
    shouldCancel
  } = options;

  try {
    onProgress?.({
      currentPage: 0,
      totalPages: 1,
      pageTitle: 'Initializing PDF export engine...',
      percent: 5,
      stage: 'preparing'
    });

    // Check cancellation
    if (shouldCancel?.()) {
      return { success: false, filename, pageCount: 0, error: 'Cancelled by user' };
    }

    // Identify all pages inside the booklet container
    // Each distinct booklet page is decorated with the class 'page-break'
    const pageBreakElements = Array.from(
      containerElement.querySelectorAll('.page-break')
    ) as HTMLElement[];

    let pagesToRender: HTMLElement[] = [];

    if (scope === 'current') {
      // If current scope, pick the first visible or only page-break
      pagesToRender = pageBreakElements.length > 0 ? [pageBreakElements[0]] : [containerElement];
    } else {
      // Full booklet: all .page-break elements or fallback to container itself
      pagesToRender = pageBreakElements.length > 0 ? pageBreakElements : [containerElement];
    }

    const totalPages = pagesToRender.length;

    // Initialize jsPDF document (Standard A4 Portrait, mm units)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfPageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    let renderedPdfPagesCount = 0;

    for (let i = 0; i < pagesToRender.length; i++) {
      if (shouldCancel?.()) {
        return { success: false, filename, pageCount: renderedPdfPagesCount, error: 'Cancelled by user' };
      }

      const pageEl = pagesToRender[i];
      const pageNum = i + 1;
      const pageTitle = BOOKLET_PAGE_TITLES[pageNum] || `Booklet Page ${pageNum}`;

      const percent = Math.round(10 + (i / totalPages) * 75);

      onProgress?.({
        currentPage: pageNum,
        totalPages,
        pageTitle,
        percent,
        stage: 'rendering'
      });

      // Capture element with html2canvas
      const canvas = await html2canvas(pageEl, {
        scale: scale,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        windowWidth: 1200,
        onclone: (clonedDoc) => {
          // Hide controls, toolbars, and scrollbars that shouldn't appear in the PDF
          const noPrintEls = clonedDoc.querySelectorAll('.no-print');
          noPrintEls.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
          });

          // Ensure images have crossOrigin set to prevent canvas tainting
          const images = clonedDoc.querySelectorAll('img');
          images.forEach((img) => {
            img.crossOrigin = 'anonymous';
          });
        }
      });

      // Calculate aspect ratio for A4
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // In A4 portrait, standard aspect ratio is 210 / 297 ≈ 0.707
      const a4Aspect = pdfPageHeight / pdfPageWidth;
      const singlePageMaxCanvasHeight = canvasWidth * a4Aspect;

      // If the page element is within normal single-page height (+ 10% allowance)
      if (canvasHeight <= singlePageMaxCanvasHeight * 1.1) {
        if (renderedPdfPagesCount > 0) {
          pdf.addPage();
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const renderedHeight = (canvasHeight * pdfPageWidth) / canvasWidth;

        // If slightly taller than A4, scale down to fit within height
        if (renderedHeight > pdfPageHeight) {
          const fittedWidth = (canvasWidth * pdfPageHeight) / canvasHeight;
          const xOffset = Math.max(0, (pdfPageWidth - fittedWidth) / 2);
          pdf.addImage(imgData, 'JPEG', xOffset, 0, fittedWidth, pdfPageHeight, undefined, 'FAST');
        } else {
          // Centered vertically if smaller, or top-aligned
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfPageWidth, renderedHeight, undefined, 'FAST');
        }

        renderedPdfPagesCount++;
      } else {
        // Multi-page content (e.g., long directory of graduands on page 10)
        // Slice the canvas vertically across multiple A4 pages
        let remainingHeight = canvasHeight;
        let sourceY = 0;

        while (remainingHeight > 0) {
          const sliceHeight = Math.min(remainingHeight, singlePageMaxCanvasHeight);

          // Create temporary slice canvas
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

            if (renderedPdfPagesCount > 0) {
              pdf.addPage();
            }

            const sliceImgData = sliceCanvas.toDataURL('image/jpeg', 0.92);
            const renderedSliceHeight = (sliceHeight * pdfPageWidth) / canvasWidth;

            pdf.addImage(sliceImgData, 'JPEG', 0, 0, pdfPageWidth, renderedSliceHeight, undefined, 'FAST');
            renderedPdfPagesCount++;
          }

          sourceY += sliceHeight;
          remainingHeight -= sliceHeight;
        }
      }
    }

    // Final compilation step
    onProgress?.({
      currentPage: totalPages,
      totalPages,
      pageTitle: 'Compiling PDF document and finalizing download...',
      percent: 92,
      stage: 'compiling'
    });

    // Check cancellation before saving
    if (shouldCancel?.()) {
      return { success: false, filename, pageCount: renderedPdfPagesCount, error: 'Cancelled by user' };
    }

    // Trigger browser download via jsPDF
    pdf.save(filename);

    onProgress?.({
      currentPage: totalPages,
      totalPages,
      pageTitle: 'PDF download initiated successfully!',
      percent: 100,
      stage: 'completed'
    });

    return {
      success: true,
      filename,
      pageCount: renderedPdfPagesCount
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    onProgress?.({
      currentPage: 0,
      totalPages: 1,
      pageTitle: 'Export failed',
      percent: 0,
      stage: 'error',
      errorMessage: message
    });
    return {
      success: false,
      filename,
      pageCount: 0,
      error: message
    };
  }
}
