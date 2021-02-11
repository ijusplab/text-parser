// https://stackoverflow.com/questions/40635979/how-to-correctly-extract-text-from-a-pdf-using-pdf-js

import PDFJS from '@bundled-es-modules/pdfjs-dist/build/pdf';

PDFJS.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/build/pdf.worker.min.js";
PDFJS.disableTextLayer = true;
PDFJS.disableWorker = true;

export default async function getPDFText(source: PDFSource): Promise<string> {
  const pdf: Pdf = await PDFJS.getDocument(source).promise;
  const maxPages = pdf.numPages;
  const pageTextPromises = [];
  for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
    pageTextPromises.push(getPageText(pdf, pageNo));
  }
  const pageTexts = await Promise.all(pageTextPromises);
  return pageTexts.join('');
}

async function getPageText(pdf: Pdf, pageNo: number) {
  const page = await pdf.getPage(pageNo);
  const tokenizedText = await page.getTextContent();
  // https://stackoverflow.com/questions/54645206/pdfjs-get-raw-text-from-pdf-with-correct-newline-withespace
  // https://stackoverflow.com/questions/44376415/display-line-breaks-as-n-in-pdf-to-text-conversion-using-pdf-js
  let lastY = -1;
  const pageText = tokenizedText.items.map((token) => {
    let str = '';
    if (lastY < 0) lastY = token.transform[5];
    if (lastY != token.transform[5]) str += '\n';
    str += token.str;
    lastY = token.transform[5];
    return str;
  })
  .join(' ')
  .split('\n')
  .map((line) => line.trim())
  .join('\n')
  .trim();
  return pageText;
}
