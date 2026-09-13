"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type UploadError = {
  message: string;
};

type ValidationResponse = {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
};

type ExtractionResponse = {
  success: boolean;
  extraction?: {
    text: string;
    pageCount: number;
    characterCount: number;
  };
  error?: {
    code: string;
    message: string;
  };
};

type ExtractionResult = {
  text: string;
  pageCount: number;
  characterCount: number;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CvUploader() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<UploadError | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);

  function validateFileOnClient(file: File): UploadError | null {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return {
        message: "Please choose a PDF file.",
      };
    }

    if (file.size === 0) {
      return {
        message: "This file is empty. Please choose another PDF.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        message: "Your CV must be 5 MB or smaller.",
      };
    }

    return null;
  }

  async function validateFileOnServer(file: File): Promise<boolean> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/cv/validate", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as ValidationResponse;

      if (!response.ok || !data.success) {
        setError({
          message:
            data.error?.message ??
            "We couldn't validate this file. Please try another PDF.",
        });

        return false;
      }

      return true;
    } catch {
      setError({
        message:
          "We couldn't validate this file. Check your connection and try again.",
      });

      return false;
    }
  }

  async function handleFile(file: File) {
    const clientValidationError = validateFileOnClient(file);

    if (clientValidationError) {
      setSelectedFile(null);
      setExtraction(null);
      setError(clientValidationError);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setError(null);
    setSelectedFile(null);
    setExtraction(null);
    setIsValidating(true);

    const isValid = await validateFileOnServer(file);

    setIsValidating(false);

    if (!isValid) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setSelectedFile(file);
    setError(null);
  }

  async function handleExtraction() {
    if (!selectedFile || isExtracting) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setError(null);
    setExtraction(null);
    setIsExtracting(true);

    try {
      const response = await fetch("/api/cv/extract", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as ExtractionResponse;

      if (!response.ok || !data.success || !data.extraction) {
        setError({
          message:
            data.error?.message ??
            "We couldn't read this CV. Please try another PDF.",
        });

        return;
      }

      setExtraction(data.extraction);
    } catch {
      setError({
        message:
          "We couldn't read this CV. Check your connection and try again.",
      });
    } finally {
      setIsExtracting(false);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    void handleFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!isValidating && !isExtracting) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (isValidating || isExtracting) {
      return;
    }

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    void handleFile(file);
  }

  function handleRemove() {
    setSelectedFile(null);
    setExtraction(null);
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function openFilePicker() {
    if (!isValidating && !isExtracting) {
      inputRef.current?.click();
    }
  }

  return (
    <section className="w-full max-w-2xl">
      <div
        className={[
          "rounded-2xl border border-dashed p-8 transition sm:p-12",
          isDragging
            ? "border-zinc-500 bg-zinc-100"
            : "border-zinc-300 bg-white",
        ].join(" ")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isValidating ? (
          <div
            className="flex flex-col items-center text-center"
            aria-live="polite"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-950" />

            <h2 className="mt-6 text-lg font-semibold text-zinc-950">
              Validating your CV
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Checking that your file is a valid PDF.
            </p>
          </div>
        ) : isExtracting ? (
          <div
            className="flex flex-col items-center text-center"
            aria-live="polite"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-950" />

            <h2 className="mt-6 text-lg font-semibold text-zinc-950">
              Reading your CV
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Extracting the readable text from your document.
            </p>
          </div>
        ) : !selectedFile ? (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-zinc-700"
              >
                <path
                  d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-zinc-950">
              Upload your CV
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Drag and drop your PDF here, or choose a file from your device.
            </p>

            <button
              type="button"
              onClick={openFilePicker}
              className="mt-6 rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
            >
              Choose PDF
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleInputChange}
              className="hidden"
            />

            <p className="mt-4 text-xs text-zinc-400">
              PDF only · Maximum file size 5 MB
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 text-white">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-3 w-3"
                >
                  <path
                    d="m5.5 10 3 3 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="text-sm font-medium text-zinc-700">
                CV validated
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-950">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  Replace
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-950"
                >
                  Remove
                </button>
              </div>
            </div>

            {!extraction ? (
              <button
                type="button"
                onClick={() => void handleExtraction()}
                className="mt-6 w-full rounded-lg bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
              >
                Continue
              </button>
            ) : (
              <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-950">
                      CV text extracted
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {extraction.pageCount}{" "}
                      {extraction.pageCount === 1 ? "page" : "pages"} ·{" "}
                      {extraction.characterCount.toLocaleString()} characters
                    </p>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4"
                    >
                      <path
                        d="m5 10 3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <details className="mt-5">
                  <summary className="cursor-pointer text-sm font-medium text-zinc-700">
                    View extracted text
                  </summary>

                  <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-4 text-xs leading-5 text-zinc-600">
                    {extraction.text}
                  </pre>
                </details>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error.message}
        </div>
      )}
    </section>
  );
}