import { NextResponse } from "next/server";

import {
  PdfValidationError,
  validatePdfFile,
} from "@/lib/cv/validate-pdf";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploadedFile = formData.get("file");

    const validatedPdf = await validatePdfFile(uploadedFile);

    return NextResponse.json({
      success: true,
      file: {
        name: validatedPdf.name,
        size: validatedPdf.size,
        type: validatedPdf.type,
      },
    });
  } catch (error) {
    if (error instanceof PdfValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_FAILED",
          message: "The file could not be validated.",
        },
      },
      { status: 500 },
    );
  }
}