import CvUploader from "@/components/CvUploader";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f3efe7] text-zinc-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-[#d7ad6a]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[#c79a5b]/10 blur-3xl" />

        {/* Navigation */}
        <nav className="relative border-b border-[#ddd5c8] bg-[#fbfaf7]/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d7ad6a] font-black text-zinc-950">
                CV
              </span>

              <div>
                <p className="font-semibold tracking-tight text-zinc-950">
                  CV → Portfolio
                </p>

                <p className="text-xs text-zinc-500">
                  AI portfolio generator
                </p>
              </div>
            </div>

            <a
              href="#generator"
              className="rounded-full bg-[#b88746] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9f733c]"
            >
              Get started
            </a>
          </div>
        </nav>

        {/* Main hero */}
        <section className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#d9c5a8] bg-[#ead7b9]/45 px-3 py-1.5 text-xs font-semibold text-[#95672f]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b88746]" />
              PDF → AI → Portfolio
            </p>

            <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950 sm:text-6xl lg:text-7xl">
              Your CV deserves
              <span className="block text-[#b88746]">
                more than a PDF.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600">
              Upload your CV, review the information extracted by AI, add your
              photo, and generate a polished personal portfolio.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#generator"
                className="rounded-full bg-[#b88746] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(184,135,70,0.20)] transition hover:bg-[#9f733c]"
              >
                Build my portfolio →
              </a>

              <a
                href="#how"
                className="rounded-full border border-[#d3c6b5] bg-[#fbfaf7] px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:border-[#b88746] hover:text-[#95672f]"
              >
                How it works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              <span>Fast</span>
              <span className="h-1 w-1 rounded-full bg-[#b88746]" />
              <span>Simple</span>
              <span className="h-1 w-1 rounded-full bg-[#b88746]" />
              <span>Professional</span>
            </div>
          </div>

          {/* Portfolio mockup */}
          <div className="relative rounded-[32px] border border-[#d8cfc2] bg-[#fbfaf7]/80 p-5 shadow-[0_30px_80px_rgba(76,62,45,0.12)] backdrop-blur">
            <div className="rounded-[24px] border border-[#ded6ca] bg-[#fffdfa] p-7">
              <div className="flex items-center justify-between border-b border-[#e5ddd2] pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a9783d]">
                    Portfolio preview
                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-950">
                    From CV to personal site
                  </p>
                </div>

                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d7ad6a] text-sm font-bold text-zinc-950">
                  YOU
                </span>
              </div>

              <div className="py-9">
                <p className="text-sm text-zinc-500">
                  Hello, I&apos;m
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                  Your Name
                </p>

                <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
                  Experience, education, projects and skills — organized into a
                  modern portfolio.
                </p>

                <div className="mt-6 flex gap-2">
                  <div className="h-2 w-24 rounded-full bg-[#d7ad6a]" />
                  <div className="h-2 w-14 rounded-full bg-[#e7dfd3]" />
                  <div className="h-2 w-20 rounded-full bg-[#e7dfd3]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["About", "Education", "Work"].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[#e0d8cd] bg-[#f5f0e8] px-3 py-4 text-center text-xs font-medium text-zinc-500"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* How it works */}
      <section
        id="how"
        className="border-y border-[#ddd5c8] bg-[#ebe5dc]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a9783d]">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-zinc-950">
              From CV to portfolio in three steps.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              [
                "01",
                "Upload",
                "Choose your CV as a PDF and let the app read the document.",
              ],
              [
                "02",
                "Review",
                "AI structures your information. You review and approve every field.",
              ],
              [
                "03",
                "Generate",
                "Add your photo and turn the approved information into your portfolio.",
              ],
            ].map(([number, title, body]) => (
              <article
                key={number}
                className="rounded-[22px] border border-[#d9d0c4] bg-[#fbfaf7] p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ead9bf] font-mono text-xs font-semibold text-[#95672f]">
                  {number}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-zinc-950">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Generator */}
      <section
        id="generator"
        className="bg-[#f3efe7] px-4 py-16 text-zinc-950 sm:px-6 sm:py-24 lg:px-8"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a9783d]">
              Start here
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Build your portfolio
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">
              Upload your CV and keep control of everything before anything is
              generated.
            </p>
          </div>

          <div className="flex justify-center">
            <CvUploader />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#51463c] bg-[#40372f] px-5 py-8 text-[#d5ccc2] sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Khalid Alshahrani. All rights reserved.
          </p>

          <p>
            Designed &amp; developed by{" "}
            <a
              href="https://khalid-portfolio-tau-nine.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#e5c28d] transition hover:text-white"
            >
              Khalid Alshahrani
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}