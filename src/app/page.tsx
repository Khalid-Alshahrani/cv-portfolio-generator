import CvUploader from "@/components/CvUploader";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-12">
        <header className="flex items-center">
          <p className="text-sm font-semibold tracking-tight text-zinc-950">
            CV Portfolio
          </p>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-16">
          <div className="mb-10 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium text-zinc-500">
              CV → Portfolio
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              Turn your CV into a portfolio.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-600">
              Upload your CV and review the extracted information before
              generating your portfolio.
            </p>
          </div>

          <CvUploader />

          <div className="mt-8 flex max-w-2xl items-start gap-3 text-sm leading-6 text-zinc-500">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400"
            >
              <path
                d="M12 3.5 5.5 6v5.2c0 4.1 2.6 7.8 6.5 9.3 3.9-1.5 6.5-5.2 6.5-9.3V6L12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="m9.5 12 1.6 1.6 3.5-3.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p>
              Your CV is used only to process your information. Permanent file
              storage is not part of this MVP.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}