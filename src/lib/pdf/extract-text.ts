import { PDFParse } from "pdf-parse";

const MIN_MEANINGFUL_TEXT_LENGTH = 50;

export type PdfExtractionResult = {
  text: string;
  pageCount: number;
  characterCount: number;
};

export type PdfExtractionErrorCode =
  | "PDF_UNREADABLE"
  | "NO_TEXT_FOUND"
  | "INSUFFICIENT_TEXT";

export class PdfExtractionError extends Error {
  code: PdfExtractionErrorCode;

  constructor(code: PdfExtractionErrorCode, message: string) {
    super(message);
    this.name = "PdfExtractionError";
    this.code = code;
  }
}

function normalizeExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s*--\s*\d+\s+of\s+\d+\s*--\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractTextFromPdf(
  fileBuffer: Buffer,
): Promise<PdfExtractionResult> {
  const parser = new PDFParse({
    data: fileBuffer,
  });

  try {
    const result = await parser.getText({
      parseHyperlinks: true,
    }); const text = normalizeExtractedText(result.text);

    if (text.length === 0) {
      throw new PdfExtractionError(
        "NO_TEXT_FOUND",
        "No readable text was found in this PDF.",
      );
    }

    if (text.length < MIN_MEANINGFUL_TEXT_LENGTH) {
      throw new PdfExtractionError(
        "INSUFFICIENT_TEXT",
        "The PDF does not contain enough readable text to process as a CV.",
      );
    }

    return {
      text,
      pageCount: result.total,
      characterCount: text.length,
    };
  } catch (error) {
    if (error instanceof PdfExtractionError) {
      throw error;
    }

    throw new PdfExtractionError(
      "PDF_UNREADABLE",
      "The PDF could not be read.",
    );
  } finally {
    await parser.destroy();
  }
}