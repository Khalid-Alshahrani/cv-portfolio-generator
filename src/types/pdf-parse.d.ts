declare module "pdf-parse/lib/pdf-parse.js" {
  type PdfParseResult = {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: unknown;
    text: string;
    version: string;
  };

  function pdf(
    dataBuffer: Buffer,
    options?: Record<string, unknown>,
  ): Promise<PdfParseResult>;

  export default pdf;
}