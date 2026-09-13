import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const PDF_SIGNATURE = "%PDF-";

type ValidationErrorCode =
  | "NO_FILE"
  | "INVALID_FILE_TYPE"
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "INVALID_PDF"
  | "VALIDATION_FAILED";

function errorResponse(
  code: ValidationErrorCode,
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploadedFile = formData.get("file");

    if (!(uploadedFile instanceof File)) {
      return errorResponse(
        "NO_FILE",
        "No CV file was provided.",
        400,
      );
    }

    if (uploadedFile.size === 0) {
      return errorResponse(
        "EMPTY_FILE",
        "The uploaded file is empty.",
        400,
      );
    }

    if (uploadedFile.size > MAX_FILE_SIZE) {
      return errorResponse(
        "FILE_TOO_LARGE",
        "The CV must be 5 MB or smaller.",
        413,
      );
    }

    if (uploadedFile.type !== "application/pdf") {
      return errorResponse(
        "INVALID_FILE_TYPE",
        "The uploaded file must be a PDF.",
        415,
      );
    }

    const signatureLength = PDF_SIGNATURE.length;
    const fileHeader = uploadedFile.slice(0, signatureLength);
    const headerBytes = await fileHeader.arrayBuffer();
    const headerText = new TextDecoder("ascii").decode(headerBytes);

    if (headerText !== PDF_SIGNATURE) {
      return errorResponse(
        "INVALID_PDF",
        "The uploaded file is not a valid PDF.",
        415,
      );
    }

    return NextResponse.json({
      success: true,
      file: {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
      },
    });
  } catch {
    return errorResponse(
      "VALIDATION_FAILED",
      "The file could not be validated.",
      500,
    );
  }
}