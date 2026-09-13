import { NextResponse } from "next/server";

import {
  PdfValidationError,
  validatePdfFile,
} from "@/lib/cv/validate-pdf";
import {
  extractTextFromPdf,
  PdfExtractionError,
} from "@/lib/pdf/extract-text";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploadedFile = formData.get("file");

    const validatedPdf = await validatePdfFile(uploadedFile);

    const arrayBuffer = await validatedPdf.file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const extraction = await extractTextFromPdf(fileBuffer);

    return NextResponse.json({
      success: true,
      extraction: {
        text: extraction.text,
        pageCount: extraction.pageCount,
        characterCount: extraction.characterCount,
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

    if (error instanceof PdfExtractionError) {
      const status =
        error.code === "NO_TEXT_FOUND" ||
          error.code === "INSUFFICIENT_TEXT"
          ? 422
          : 400;

      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "EXTRACTION_FAILED",
          message: "The CV could not be processed.",
        },
      },
      { status: 500 },
    );
  }
}