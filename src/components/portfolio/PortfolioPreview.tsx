"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import type { PortfolioData } from "@/lib/schema/portfolio";

type PortfolioPreviewProps = {
  data: PortfolioData;
  profilePhotoUrl: string | null;
  cvDownloadUrl: string | null;
  cvFileName: string | null;
  onEdit: () => void;
  onBackToLanding: () => void;
};

function hasText(value: string | null): value is string {
  return Boolean(value?.trim());
}

function getDateRange(
  startDate: string | null,
  endDate: string | null,
) {
  if (hasText(startDate) && hasText(endDate)) {
    return `${startDate} — ${endDate}`;
  }

  return startDate || endDate || null;
}

function getInitials(name: string | null) {
  if (!hasText(name)) {
    return "CV";
  }

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function PortfolioPreview({
  data,
  profilePhotoUrl,
  cvDownloadUrl,
  cvFileName,
  onEdit,
  onBackToLanding,
}: PortfolioPreviewProps) {
  const [showReadyToast, setShowReadyToast] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowReadyToast(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  const {
    personalInformation,
    professionalSummary,
    education,
    experience,
    projects,
    skills,
    certifications,
    languages,
    professionalLinks,
  } = data;

  const validLinks = professionalLinks.filter(
    (link) => hasText(link.label) && hasText(link.url),
  );

  const initials = getInitials(personalInformation.fullName);

  return (
    <section className="fixed inset-0 z-50 overflow-y-auto bg-[#f3efe7] text-zinc-950">
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          {showReadyToast && (
            <div
              role="status"
              aria-live="polite"
              className="fixed right-5 top-5 z-[70] w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-[#d9cfbf] bg-white px-5 py-4 shadow-[0_18px_55px_rgba(58,47,36,0.16)] sm:right-8 sm:top-8"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b88746] text-sm font-bold text-white">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-semibold text-zinc-950">
                    Your portfolio is ready
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Your portfolio was generated successfully.
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* Portfolio */}
          <article className="overflow-hidden rounded-[28px] border border-[#ddd5c8] bg-[#fbfaf7] text-zinc-950 shadow-[0_24px_70px_rgba(58,47,36,0.10)]">
            {/* Unified navigation */}
            <nav className="border-b border-[#e4ddd2] bg-[#fbfaf7]">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-5 sm:px-10 lg:flex-nowrap lg:px-12">
                <a
                  href="#top"
                  className="mr-auto flex min-w-0 items-center gap-3 font-semibold tracking-tight"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d7ad6a] text-xs font-bold text-zinc-950">
                    {initials}
                  </span>

                  <span className="truncate">
                    {personalInformation.fullName ?? "Portfolio"}
                  </span>
                </a>

                <div className="order-3 flex w-full items-center justify-center gap-5 overflow-x-auto whitespace-nowrap text-sm text-zinc-500 lg:order-none lg:w-auto lg:gap-6">
                  {hasText(professionalSummary) && (
                    <a
                      href="#about"
                      className="transition hover:text-[#95672f]"
                    >
                      About
                    </a>
                  )}

                  {education.length > 0 && (
                    <a
                      href="#education"
                      className="transition hover:text-[#95672f]"
                    >
                      Education
                    </a>
                  )}

                  {experience.length > 0 && (
                    <a
                      href="#experience"
                      className="transition hover:text-[#95672f]"
                    >
                      Experience
                    </a>
                  )}

                  {projects.length > 0 && (
                    <a
                      href="#projects"
                      className="transition hover:text-[#95672f]"
                    >
                      Projects
                    </a>
                  )}

                  {(hasText(personalInformation.email) ||
                    hasText(personalInformation.phone) ||
                    validLinks.length > 0) && (
                      <a
                        href="#contact"
                        className="transition hover:text-[#95672f]"
                      >
                        Contact
                      </a>
                    )}
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={onEdit}
                    className="rounded-full border border-[#d7ad6a] bg-white px-4 py-2.5 text-sm font-semibold text-[#95672f] transition hover:bg-[#f3e7d3]"
                  >
                    Edit
                  </button>

                  {cvDownloadUrl && (
                    <a
                      href={cvDownloadUrl}
                      download={cvFileName ?? "CV.pdf"}
                      className="rounded-full bg-[#b88746] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9f733c]"
                    >
                      Download CV
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={onBackToLanding}
                    className="rounded-full border border-[#d7ad6a] bg-white px-4 py-2.5 text-sm font-semibold text-[#95672f] transition hover:bg-[#f3e7d3]"
                  >
                    Home
                  </button>
                </div>
              </div>
            </nav>

            {/* Hero */}
            <header
              id="top"
              className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:px-12 lg:py-24"
            >
              <div>
                <p className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-zinc-950" />
                  Professional Portfolio
                </p>

                {hasText(personalInformation.fullName) && (
                  <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950 sm:text-6xl lg:text-7xl">
                    {personalInformation.fullName}
                  </h1>
                )}

                {hasText(personalInformation.professionalTitle) && (
                  <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
                    {personalInformation.professionalTitle}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-zinc-500">
                  {hasText(personalInformation.location) && (
                    <span>{personalInformation.location}</span>
                  )}

                  {hasText(personalInformation.email) && (
                    <a
                      href={`mailto:${personalInformation.email}`}
                      className="transition hover:text-[#95672f]"
                    >
                      {personalInformation.email}
                    </a>
                  )}

                  {hasText(personalInformation.phone) && (
                    <a
                      href={`tel:${personalInformation.phone}`}
                      className="transition hover:text-[#95672f]"
                    >
                      {personalInformation.phone}
                    </a>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {projects.length > 0 && (
                    <a
                      href="#projects"
                      className="rounded-full bg-[#b88746] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9f733c]"
                    >
                      View My Work →
                    </a>
                  )}

                  {(hasText(personalInformation.email) ||
                    hasText(personalInformation.phone) ||
                    validLinks.length > 0) && (
                      <a
                        href="#contact"
                        className="rounded-full border border-[#b88746] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#95672f] transition hover:bg-[#b88746] hover:text-white"
                      >
                        Contact Me
                      </a>
                    )}
                </div>

                {validLinks.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {validLinks.map((link, index) => (
                      <a
                        key={`${link.label}-${index}`}
                        href={link.url!}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {profilePhotoUrl ? (
                <div className="relative min-h-[360px] overflow-hidden rounded-[32px] border border-white/10 bg-zinc-900 shadow-2xl sm:min-h-[430px]">
                  <Image src={profilePhotoUrl} alt={hasText(personalInformation.fullName) ? `${personalInformation.fullName} profile photo` : "Profile photo"} fill unoptimized priority sizes="(min-width:1024px) 430px, 100vw" className="object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-7 pb-7 pt-28 text-white">
                    {hasText(personalInformation.fullName) && <p className="text-xl font-semibold">{personalInformation.fullName}</p>}
                    {hasText(personalInformation.professionalTitle) && <p className="mt-1 text-sm text-white/75">{personalInformation.professionalTitle}</p>}
                  </div>
                </div>
              ) : (
                <div className="relative min-h-[360px] overflow-hidden rounded-[32px] border border-[#d8cdbf] bg-gradient-to-br from-[#eee7dc] via-[#dfd3c2] to-[#cdbb9f] p-9 text-zinc-950 shadow-xl sm:min-h-[430px]">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
                  <div className="relative flex min-h-[290px] flex-col justify-between sm:min-h-[350px]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-black/10 bg-white/35 text-lg font-semibold">{initials}</div>
                    <div><p className="text-3xl font-semibold tracking-[-0.04em]">Work, experience and projects in one place.</p><p className="mt-5 text-xs uppercase tracking-[0.2em] text-[#815b2e]">CV → Portfolio</p></div>
                  </div>
                </div>
              )}
            </header>

            <main className="bg-[#f4f0e8]">
              {/* About */}
              {hasText(professionalSummary) && (
                <PortfolioSection
                  id="about"
                  number="01"
                  title="About"
                  eyebrow="Profile"
                >
                  <p className="max-w-4xl text-lg leading-9 text-zinc-700 sm:text-xl">
                    {professionalSummary}
                  </p>
                </PortfolioSection>
              )}

              {/* Education — intentionally directly after About */}
              {education.length > 0 && (
                <PortfolioSection
                  id="education"
                  number="02"
                  title="Education"
                  eyebrow="Academic background"
                  muted
                >
                  <div className="divide-y divide-zinc-200 border-y border-zinc-200">
                    {education.map((item, index) => {
                      const range = getDateRange(
                        item.startDate,
                        item.endDate,
                      );

                      const hasContent =
                        hasText(item.institution) ||
                        hasText(item.degree) ||
                        hasText(item.fieldOfStudy) ||
                        hasText(item.description);

                      if (!hasContent) {
                        return null;
                      }

                      return (
                        <article
                          key={index}
                          className="grid gap-6 py-8 md:grid-cols-[1fr_2fr] md:gap-12"
                        >
                          <div className="text-sm text-zinc-500">
                            {range && <p>{range}</p>}

                            {hasText(item.location) && (
                              <p className="mt-1">{item.location}</p>
                            )}
                          </div>

                          <div>
                            {hasText(item.degree) && (
                              <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
                                {item.degree}
                                {hasText(item.fieldOfStudy)
                                  ? ` in ${item.fieldOfStudy}`
                                  : ""}
                              </h3>
                            )}

                            {!hasText(item.degree) &&
                              hasText(item.fieldOfStudy) && (
                                <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
                                  {item.fieldOfStudy}
                                </h3>
                              )}

                            {hasText(item.institution) && (
                              <p className="mt-2 font-medium text-zinc-600">
                                {item.institution}
                              </p>
                            )}

                            {hasText(item.description) && (
                              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </PortfolioSection>
              )}

              {/* Experience */}
              {experience.length > 0 && (
                <PortfolioSection
                  id="experience"
                  number="03"
                  title="Experience"
                  eyebrow="Professional history"
                >
                  <div className="relative">
                    <div className="absolute bottom-0 left-[7px] top-2 hidden w-px bg-zinc-200 md:block" />

                    <div className="space-y-10">
                      {experience.map((item, index) => {
                        const range = getDateRange(
                          item.startDate,
                          item.endDate,
                        );

                        const hasContent =
                          hasText(item.role) ||
                          hasText(item.company) ||
                          hasText(item.description) ||
                          item.highlights.some((highlight) =>
                            Boolean(highlight.trim()),
                          );

                        if (!hasContent) {
                          return null;
                        }

                        return (
                          <article
                            key={index}
                            className="relative grid gap-6 md:grid-cols-[190px_1fr] md:gap-12 md:pl-10"
                          >
                            <span className="absolute left-0 top-2 hidden h-[15px] w-[15px] rounded-full border-4 border-white bg-zinc-950 ring-1 ring-zinc-300 md:block" />

                            <div className="text-sm text-zinc-500">
                              {range && <p>{range}</p>}

                              {hasText(item.location) && (
                                <p className="mt-1">{item.location}</p>
                              )}
                            </div>

                            <div className="border-b border-zinc-200 pb-10">
                              {hasText(item.role) && (
                                <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
                                  {item.role}
                                </h3>
                              )}

                              {hasText(item.company) && (
                                <p className="mt-1 font-medium text-zinc-600">
                                  {item.company}
                                </p>
                              )}

                              {hasText(item.description) && (
                                <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-600">
                                  {item.description}
                                </p>
                              )}

                              {item.highlights.some((highlight) =>
                                Boolean(highlight.trim()),
                              ) && (
                                  <ul className="mt-6 grid gap-3">
                                    {item.highlights
                                      .filter((highlight) =>
                                        Boolean(highlight.trim()),
                                      )
                                      .map((highlight, highlightIndex) => (
                                        <li
                                          key={highlightIndex}
                                          className="flex gap-3 text-sm leading-7 text-zinc-700"
                                        >
                                          <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                                          <span>{highlight}</span>
                                        </li>
                                      ))}
                                  </ul>
                                )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </PortfolioSection>
              )}

              {/* Skills */}
              {skills.some((skill) => Boolean(skill.trim())) && (
                <PortfolioSection
                  id="skills"
                  number="04"
                  title="Skills"
                  eyebrow="Capabilities"
                  muted
                >
                  <div className="flex flex-wrap gap-3">
                    {skills
                      .filter((skill) => Boolean(skill.trim()))
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </PortfolioSection>
              )}          {/* Projects */}
              {projects.length > 0 && (
                <PortfolioSection
                  id="projects"
                  number="05"
                  title="Projects"
                  eyebrow="Selected work"
                >
                  <div className="grid gap-5 lg:grid-cols-2">
                    {projects.map((project, index) => {
                      const range = getDateRange(
                        project.startDate,
                        project.endDate,
                      );

                      const hasContent =
                        hasText(project.name) ||
                        hasText(project.description) ||
                        project.highlights.some((highlight) =>
                          Boolean(highlight.trim()),
                        );

                      if (!hasContent) {
                        return null;
                      }

                      return (
                        <article
                          key={index}
                          className="group flex min-h-[340px] flex-col justify-between rounded-[24px] border border-zinc-200 bg-[#f7f7f5] p-6 transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg sm:p-7"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-5">
                              <div>
                                {hasText(project.name) && (
                                  <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
                                    {project.name}
                                  </h3>
                                )}

                                {hasText(project.organization) && (
                                  <p className="mt-2 text-sm text-zinc-500">
                                    {project.organization}
                                  </p>
                                )}
                              </div>

                              {hasText(project.link) && (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-lg text-zinc-700 transition group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white"
                                  aria-label="Open project"
                                >
                                  ↗
                                </a>
                              )}
                            </div>

                            {range && (
                              <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                                {range}
                              </p>
                            )}

                            {hasText(project.description) && (
                              <p className="mt-5 text-sm leading-7 text-zinc-600">
                                {project.description}
                              </p>
                            )}

                            {project.highlights.some((highlight) =>
                              Boolean(highlight.trim()),
                            ) && (
                                <ul className="mt-5 space-y-3">
                                  {project.highlights
                                    .filter((highlight) =>
                                      Boolean(highlight.trim()),
                                    )
                                    .map((highlight, highlightIndex) => (
                                      <li
                                        key={highlightIndex}
                                        className="flex gap-3 text-sm leading-6 text-zinc-600"
                                      >
                                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                                        <span>{highlight}</span>
                                      </li>
                                    ))}
                                </ul>
                              )}
                          </div>

                          {project.technologies.some((technology) =>
                            Boolean(technology.trim()),
                          ) && (
                              <div className="mt-8 flex flex-wrap gap-2">
                                {project.technologies
                                  .filter((technology) =>
                                    Boolean(technology.trim()),
                                  )
                                  .map((technology, technologyIndex) => (
                                    <span
                                      key={technologyIndex}
                                      className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600"
                                    >
                                      {technology}
                                    </span>
                                  ))}
                              </div>
                            )}
                        </article>
                      );
                    })}
                  </div>
                </PortfolioSection>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <PortfolioSection
                  id="certifications"
                  number="06"
                  title="Certifications & Training"
                  eyebrow="Continuous learning"
                  muted
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {certifications.map((item, index) => {
                      const hasContent =
                        hasText(item.name) ||
                        hasText(item.issuer);

                      if (!hasContent) {
                        return null;
                      }

                      return (
                        <article
                          key={index}
                          className="rounded-[20px] border border-zinc-200 bg-white p-5 sm:p-6"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              {hasText(item.name) && (
                                <h3 className="font-semibold leading-6 text-zinc-950">
                                  {item.name}
                                </h3>
                              )}

                              {hasText(item.issuer) && (
                                <p className="mt-2 text-sm leading-6 text-zinc-500">
                                  {item.issuer}
                                </p>
                              )}
                            </div>

                            {hasText(item.link) && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
                              >
                                View
                              </a>
                            )}
                          </div>

                          {(hasText(item.date) ||
                            hasText(item.duration) ||
                            hasText(item.credentialId)) && (
                              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
                                {hasText(item.date) && (
                                  <span>{item.date}</span>
                                )}

                                {hasText(item.duration) && (
                                  <span>{item.duration}</span>
                                )}

                                {hasText(item.credentialId) && (
                                  <span>
                                    Credential {item.credentialId}
                                  </span>
                                )}
                              </div>
                            )}
                        </article>
                      );
                    })}
                  </div>
                </PortfolioSection>
              )}

              {/* Languages */}
              {languages.some((language) =>
                hasText(language.name),
              ) && (
                  <PortfolioSection
                    id="languages"
                    number="07"
                    title="Languages"
                    eyebrow="Communication"
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {languages.map((language, index) => {
                        if (!hasText(language.name)) {
                          return null;
                        }

                        return (
                          <article
                            key={index}
                            className="flex items-center justify-between gap-5 rounded-[20px] border border-zinc-200 p-5"
                          >
                            <p className="font-semibold text-zinc-950">
                              {language.name}
                            </p>

                            {hasText(language.proficiency) && (
                              <span className="rounded-full bg-[#f2f2ef] px-3 py-1.5 text-xs font-medium text-zinc-600">
                                {language.proficiency}
                              </span>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </PortfolioSection>
                )}

              {/* Contact */}
              {(hasText(personalInformation.email) ||
                hasText(personalInformation.phone) ||
                validLinks.length > 0) && (
                  <section
                    id="contact"
                    className="bg-[#40372f] px-6 py-16 text-white sm:px-10 sm:py-20 lg:px-12"
                  >
                    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                          Contact
                        </p>

                        <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">
                          Let&apos;s work together.
                        </h2>

                        {hasText(personalInformation.location) && (
                          <p className="mt-5 text-sm text-zinc-400">
                            {personalInformation.location}
                          </p>
                        )}
                      </div>

                      <div className="lg:text-right">
                        {hasText(personalInformation.email) && (
                          <a
                            href={`mailto:${personalInformation.email}`}
                            className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
                          >
                            Get in touch
                          </a>
                        )}

                        <div className="mt-6 space-y-2 text-sm text-zinc-400">
                          {hasText(personalInformation.email) && (
                            <p>
                              <a
                                href={`mailto:${personalInformation.email}`}
                                className="transition hover:text-white"
                              >
                                {personalInformation.email}
                              </a>
                            </p>
                          )}

                          {hasText(personalInformation.phone) && (
                            <p>
                              <a
                                href={`tel:${personalInformation.phone}`}
                                className="transition hover:text-white"
                              >
                                {personalInformation.phone}
                              </a>
                            </p>
                          )}
                        </div>

                        {validLinks.length > 0 && (
                          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 lg:justify-end">
                            {validLinks.map((link, index) => (
                              <a
                                key={`${link.label}-${index}`}
                                href={link.url!}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-medium text-white underline decoration-zinc-700 underline-offset-4 transition hover:decoration-white"
                              >
                                {link.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-[#51463c] bg-[#40372f] px-6 py-7 text-xs text-zinc-500 sm:px-10 lg:px-12">
              <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  {personalInformation.fullName ?? "Portfolio"}
                </p>

                <p className="flex flex-wrap items-center gap-x-1">
                  <span>Generated with CV → Portfolio · Built by</span>
                  <a
                    href="https://khalid-portfolio-tau-nine.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-zinc-300 transition hover:text-amber-300"
                  >
                    Khalid Alshahrani
                  </a>
                </p>
              </div>
            </footer>
          </article>

          <footer className="py-8 text-center text-xs leading-6 text-zinc-500">
            <p>© 2026 Khalid Alshahrani. All rights reserved.</p>
            <p>
              Designed &amp; developed by{" "}
              <a
                href="https://khalid-portfolio-tau-nine.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#95672f] hover:underline"
              >
                Khalid Alshahrani
              </a>
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}

function PortfolioSection({
  id,
  number,
  title,
  eyebrow,
  children,
  muted = false,
}: {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <section
      id={id}
      className={[
        "scroll-mt-24 px-6 py-16 sm:px-10 sm:py-20 lg:px-12",
        muted ? "bg-[#e9e2d6]" : "bg-[#f4f0e8]",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 grid gap-4 border-b border-zinc-200 pb-6 sm:grid-cols-[100px_1fr] sm:items-end">
          <div>
            <p className="font-mono text-xs text-zinc-400">
              {number}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a9783d]">
              {eyebrow}
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-4xl">
              {title}
            </h2>
          </div>
        </div>

        <div className="sm:pl-[100px]">
          {children}
        </div>
      </div>
    </section>
  );
}