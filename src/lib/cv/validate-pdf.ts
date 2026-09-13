const MAX_FILE_SIZE = 5 * 1024 * 1024;
const PDF_SIGNATURE = "%PDF-";

export type PdfValidationErrorCode =
  | "NO_FILE"
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_FILE_TYPE"
  | "INVALID_PDF";

export class PdfValidationError extends Error {
  code: PdfValidationErrorCode;
  status: number;

  constructor(
    code: PdfValidationErrorCode,
    message: string,
    status: number,
  ) {
    super(message);
    this.name = "PdfValidationError";
    this.code = code;
    this.status = status;
  }
}

export type ValidatedPdf = {
  file: File;
  name: string;
  size: number;
  type: string;
};

export async function validatePdfFile(
  uploadedFile: FormDataEntryValue | null,
): Promise<ValidatedPdf> {
  if (!(uploadedFile instanceof File)) {
    throw new PdfValidationError(
      "NO_FILE",
      "No CV file was provided.",
      400,
    );
  }

  if (uploadedFile.size === 0) {
    throw new PdfValidationError(
      "EMPTY_FILE",
      "The uploaded file is empty.",
      400,
    );
  }

  if (uploadedFile.size > MAX_FILE_SIZE) {
    throw new PdfValidationError(
      "FILE_TOO_LARGE",
      "The CV must be 5 MB or smaller.",
      413,
    );
  }

  if (uploadedFile.type !== "application/pdf") {
    throw new PdfValidationError(
      "INVALID_FILE_TYPE",
      "The uploaded file must be a PDF.",
      415,
    );
  }

  const signatureBuffer = await uploadedFile
    .slice(0, PDF_SIGNATURE.length)
    .arrayBuffer();

  const signature = new TextDecoder("ascii").decode(signatureBuffer);

  if (signature !== PDF_SIGNATURE) {
    throw new PdfValidationError(
      "INVALID_PDF",
      "The uploaded file is not a valid PDF.",
      415,
    );
  }

  return {
    file: uploadedFile,
    name: uploadedFile.name,
    size: uploadedFile.size,
    type: uploadedFile.type,
  };
}