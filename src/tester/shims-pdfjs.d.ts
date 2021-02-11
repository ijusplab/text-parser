declare module '@bundled-es-modules/pdfjs-dist/build/pdf' {
  export default pdfjs;
}

type TokenText = {
  str: string;
  transform: any[]
};

type PageText = {
  items: TokenText[];
};

type PdfPage = {
  getTextContent: () => Promise<PageText>;
};

type Pdf = {
  numPages: number;
  getPage: (pageNo: number) => Promise<PdfPage>;
};

type PDFSource = Buffer | string;
