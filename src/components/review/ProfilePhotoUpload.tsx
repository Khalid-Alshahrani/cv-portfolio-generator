"use client";

import Image from "next/image";
import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

type ProfilePhotoUploadProps = {
  photo: File | null;
  photoUrl: string | null;
  onChange: (
    file: File | null,
    previewUrl: string | null,
  ) => void;
};

function formatFileSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ProfilePhotoUpload({
  photo,
  photoUrl,
  onChange,
}: ProfilePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [error, setError] =
    useState<string | null>(null);

  function validatePhoto(
    file: File,
  ): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Please choose a JPG, PNG, or WebP image.";
    }

    if (file.size === 0) {
      return "This image is empty. Please choose another image.";
    }

    if (file.size > MAX_PHOTO_SIZE) {
      return "Your profile photo must be 5 MB or smaller.";
    }

    return null;
  }

  function handleFile(file: File) {
    const validationError =
      validatePhoto(file);

    if (validationError) {
      setError(validationError);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      return;
    }

    setError(null);

    const previewUrl =
      URL.createObjectURL(file);

    onChange(file, previewUrl);
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    handleFile(file);
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  function removePhoto() {
    setError(null);
    onChange(null, null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-zinc-800">
        Profile photo
      </p>

      <div className="flex flex-col gap-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center">
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Profile preview"
              fill
              unoptimized
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-9 w-9 text-zinc-300"
            >
              <path
                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />

              <path
                d="M4.5 20c.7-3.4 3.5-5.5 7.5-5.5s6.8 2.1 7.5 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {photo ? (
            <>
              <p className="truncate text-sm font-semibold text-zinc-900">
                {photo.name}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {formatFileSize(photo.size)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                >
                  Replace photo
                </button>

                <button
                  type="button"
                  onClick={removePhoto}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-red-50 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-zinc-900">
                Add a profile photo
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Optional. JPG, PNG or WebP. Maximum 5 MB.
              </p>

              <button
                type="button"
                onClick={openFilePicker}
                className="mt-4 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
              >
                Choose photo
              </button>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-2 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}