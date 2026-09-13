import { NextResponse } from "next/server";

import { extractCvData } from "@/lib/ai/extract-cv-data";

const MAX_CV_TEXT_LENGTH = 50_000;

type StructureRequestBody = {
  text?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StructureRequestBody;

    if (typeof body.text !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_TEXT",
            message: "CV text is required.",
          },
        },
        { status: 400 },
      );
    }

    const text = body.text.trim();

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMPTY_TEXT",
            message: "The extracted CV text is empty.",
          },
        },
        { status: 400 },
      );
    }

    if (text.length > MAX_CV_TEXT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "TEXT_TOO_LARGE",
            message: "The extracted CV text is too large to process.",
          },
        },
        { status: 413 },
      );
    }

    const portfolioData = await extractCvData(text);

    return NextResponse.json({
      success: true,
      data: portfolioData,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "AI_EXTRACTION_FAILED",
          message:
            "We couldn't organize the information in this CV. Please try again.",
        },
      },
      { status: 500 },
    );
  }
}