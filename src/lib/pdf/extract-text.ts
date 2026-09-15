import {
  extractLinks,
  extractText,
  getDocumentProxy,
} from "unpdf";

const MIN_MEANINGFUL_TEXT_LENGTH = 50;

export type PdfExtractionResult = {
  text: string;
  pageCount: number;
  characterCount: number;
  links: string[];
};

export type PdfExtractionErrorCode =
  | "PDF_UNREADABLE"
  | "NO_TEXT_FOUND"
  | "INSUFFICIENT_TEXT";

export class PdfExtractionError extends Error {
  code: PdfExtractionErrorCode;

  constructor(
    code: PdfExtractionErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "PdfExtractionError";
    this.code = code;
  }
}

function normalizeExtractedText(
  text: string,
): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractTextFromPdf(
  fileBuffer: Buffer,
): Promise<PdfExtractionResult> {
  try {
    const pdf = await getDocumentProxy(
      new Uint8Array(fileBuffer),
    );

    const textResult = await extractText(
      pdf,
      {
        mergePages: true,
      },
    );

    const linkResult = await extractLinks(
      pdf,
    );

    const text = normalizeExtractedText(
      textResult.text,
    );

    if (text.length === 0) {
      throw new PdfExtractionError(
        "NO_TEXT_FOUND",
        "No readable text was found in this PDF.",
      );
    }

    if (
      text.length <
      MIN_MEANINGFUL_TEXT_LENGTH
    ) {
      throw new PdfExtractionError(
        "INSUFFICIENT_TEXT",
        "The PDF does not contain enough readable text to process as a CV.",
      );
    }

    const links = Array.from(
      new Set(
        linkResult.links
          .map((link) => link.trim())
          .filter(
            (link) =>
              link.startsWith("https://") ||
              link.startsWith("http://"),
          ),
      ),
    );

    return {
      text,
      pageCount: pdf.numPages,
      characterCount: text.length,
      links,
    };
  } catch (error) {
    if (
      error instanceof PdfExtractionError
    ) {
      throw error;
    }

    console.error(
      "PDF extraction failed:",
      error,
    );

    throw new PdfExtractionError(
      "PDF_UNREADABLE",
      "The PDF could not be read.",
    );
  }
}