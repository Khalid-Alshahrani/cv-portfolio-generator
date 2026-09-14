"use client";

import { useState, type ReactNode } from "react";
import { portfolioDataSchema, type PortfolioData } from "@/lib/schema/portfolio";
import ProfilePhotoUpload from "@/components/review/ProfilePhotoUpload";

type Props = {
  initialData: PortfolioData;
  profilePhoto: File | null;
  profilePhotoUrl: string | null;
  onProfilePhotoChange: (
    file: File | null,
    previewUrl: string | null,
  ) => void;
  onBack: () => void;
  onConfirm: (data: PortfolioData) => void;
};
type FieldProps = { label: string; value: string | null; onChange: (value: string | null) => void; type?: "text" | "email" | "tel" | "url"; error?: string };
const nullIfBlank = (v: string) => v.trim() ? v : null;

export default function PortfolioReview({
  initialData,
  profilePhoto,
  profilePhotoUrl,
  onProfilePhotoChange,
  onBack,
  onConfirm,
}: Props) {
  const [data, setData] = useState<PortfolioData>(() => structuredClone(initialData));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  function confirm() {
    const result = portfolioDataSchema.safeParse(data);
    if (!result.success) {
      const next: Record<string, string> = {};
      result.error.issues.forEach((issue) => { const p = issue.path.join("."); if (p && !next[p]) next[p] = issue.message; });
      setErrors(next); setMessage("Some information needs your attention. Check the highlighted fields."); return;
    }
    setErrors({}); setMessage(null); onConfirm(result.data);
  }

  const setPersonal = (k: keyof PortfolioData["personalInformation"], v: string | null) => setData(d => ({ ...d, personalInformation: { ...d.personalInformation, [k]: v } }));

  return <section className="w-full max-w-4xl">
    <header className="mb-10"><p className="text-sm font-medium text-zinc-500">Review / Edit</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Review your information</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-600">Check the information extracted from your CV. Correct anything inaccurate and add anything you want included in your portfolio.</p></header>
    <div className="space-y-6">
      <Section title="Personal Information">
        <ProfilePhotoUpload
          photo={profilePhoto}
          photoUrl={profilePhotoUrl}
          onChange={onProfilePhotoChange}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={data.personalInformation.fullName} onChange={v => setPersonal("fullName", v)} /><Field label="Professional title" value={data.personalInformation.professionalTitle} onChange={v => setPersonal("professionalTitle", v)} /><Field label="Email" type="email" value={data.personalInformation.email} onChange={v => setPersonal("email", v)} /><Field label="Phone" type="tel" value={data.personalInformation.phone} onChange={v => setPersonal("phone", v)} /><Field label="Location" value={data.personalInformation.location} onChange={v => setPersonal("location", v)} />
        </div>
      </Section>
      <Section title="Professional Summary"><TextArea label="Summary" value={data.professionalSummary} onChange={v => setData(d => ({ ...d, professionalSummary: v }))} /></Section>
      <Section title="Education" action={<Add label="Add education" onClick={() => setData(d => ({ ...d, education: [...d.education, { institution: null, degree: null, fieldOfStudy: null, location: null, startDate: null, endDate: null, description: null }] }))} />}>{data.education.length === 0 ? <Empty /> : data.education.map((x, i) => <Card key={i} title={`Education ${i + 1}`} onDelete={() => setData(d => ({ ...d, education: d.education.filter((_, j) => j !== i) }))}><div className="grid gap-4 sm:grid-cols-2">{([['Institution', 'institution'], ['Degree', 'degree'], ['Field of study', 'fieldOfStudy'], ['Location', 'location'], ['Start date', 'startDate'], ['End date', 'endDate']] as const).map(([l, k]) => <Field key={k} label={l} value={x[k]} onChange={v => setData(d => ({ ...d, education: d.education.map((e, j) => j === i ? { ...e, [k]: v } : e) }))} />)}</div><TextArea label="Description" value={x.description} onChange={v => setData(d => ({ ...d, education: d.education.map((e, j) => j === i ? { ...e, description: v } : e) }))} /></Card>)}</Section>
      <Section title="Experience" action={<Add label="Add experience" onClick={() => setData(d => ({ ...d, experience: [...d.experience, { company: null, role: null, location: null, startDate: null, endDate: null, description: null, highlights: [] }] }))} />}>{data.experience.length === 0 ? <Empty /> : data.experience.map((x, i) => <Card key={i} title={`Experience ${i + 1}`} onDelete={() => setData(d => ({ ...d, experience: d.experience.filter((_, j) => j !== i) }))}><div className="grid gap-4 sm:grid-cols-2">{([['Company', 'company'], ['Role', 'role'], ['Location', 'location'], ['Start date', 'startDate'], ['End date', 'endDate']] as const).map(([l, k]) => <Field key={k} label={l} value={x[k]} onChange={v => setData(d => ({ ...d, experience: d.experience.map((e, j) => j === i ? { ...e, [k]: v } : e) }))} />)}</div><TextArea label="Description" value={x.description} onChange={v => setData(d => ({ ...d, experience: d.experience.map((e, j) => j === i ? { ...e, description: v } : e) }))} /><List label="Highlights" values={x.highlights} onChange={v => setData(d => ({ ...d, experience: d.experience.map((e, j) => j === i ? { ...e, highlights: v } : e) }))} /></Card>)}</Section>
      <Section title="Projects" action={<Add label="Add project" onClick={() => setData(d => ({ ...d, projects: [...d.projects, { name: null, organization: null, description: null, technologies: [], link: null, startDate: null, endDate: null, highlights: [] }] }))} />}>{data.projects.length === 0 ? <Empty /> : data.projects.map((x, i) => <Card key={i} title={`Project ${i + 1}`} onDelete={() => setData(d => ({ ...d, projects: d.projects.filter((_, j) => j !== i) }))}><div className="grid gap-4 sm:grid-cols-2">{([['Project name', 'name'], ['Organization', 'organization'], ['Start date', 'startDate'], ['End date', 'endDate']] as const).map(([l, k]) => <Field key={k} label={l} value={x[k]} onChange={v => setData(d => ({ ...d, projects: d.projects.map((e, j) => j === i ? { ...e, [k]: v } : e) }))} />)}<Field label="Project link" type="url" value={x.link} error={errors[`projects.${i}.link`]} onChange={v => setData(d => ({ ...d, projects: d.projects.map((e, j) => j === i ? { ...e, link: v } : e) }))} /></div><TextArea label="Description" value={x.description} onChange={v => setData(d => ({ ...d, projects: d.projects.map((e, j) => j === i ? { ...e, description: v } : e) }))} /><List label="Technologies" values={x.technologies} onChange={v => setData(d => ({ ...d, projects: d.projects.map((e, j) => j === i ? { ...e, technologies: v } : e) }))} /><List label="Highlights" values={x.highlights} onChange={v => setData(d => ({ ...d, projects: d.projects.map((e, j) => j === i ? { ...e, highlights: v } : e) }))} /></Card>)}</Section>
      <Section title="Skills" action={<Add label="Add skill" onClick={() => setData(d => ({ ...d, skills: [...d.skills, ""] }))} />}>{data.skills.length === 0 ? <Empty /> : <List label="Skills" values={data.skills} onChange={skills => setData(d => ({ ...d, skills }))} />}</Section>
      <Section title="Certifications / Training" action={<Add label="Add certification" onClick={() => setData(d => ({ ...d, certifications: [...d.certifications, { name: null, issuer: null, date: null, duration: null, credentialId: null, link: null }] }))} />}>{data.certifications.length === 0 ? <Empty /> : data.certifications.map((x, i) => <Card key={i} title={`Certification / Training ${i + 1}`} onDelete={() => setData(d => ({ ...d, certifications: d.certifications.filter((_, j) => j !== i) }))}><div className="grid gap-4 sm:grid-cols-2">{([['Name', 'name'], ['Issuer', 'issuer'], ['Date', 'date'], ['Duration', 'duration'], ['Credential ID', 'credentialId']] as const).map(([l, k]) => <Field key={k} label={l} value={x[k]} onChange={v => setData(d => ({ ...d, certifications: d.certifications.map((e, j) => j === i ? { ...e, [k]: v } : e) }))} />)}<Field label="Link" type="url" value={x.link} error={errors[`certifications.${i}.link`]} onChange={v => setData(d => ({ ...d, certifications: d.certifications.map((e, j) => j === i ? { ...e, link: v } : e) }))} /></div></Card>)}</Section>
      <Section title="Languages" action={<Add label="Add language" onClick={() => setData(d => ({ ...d, languages: [...d.languages, { name: null, proficiency: null }] }))} />}>{data.languages.length === 0 ? <Empty /> : data.languages.map((x, i) => <Card key={i} title={`Language ${i + 1}`} onDelete={() => setData(d => ({ ...d, languages: d.languages.filter((_, j) => j !== i) }))}><div className="grid gap-4 sm:grid-cols-2"><Field label="Language" value={x.name} onChange={v => setData(d => ({ ...d, languages: d.languages.map((e, j) => j === i ? { ...e, name: v } : e) }))} /><Field label="Proficiency" value={x.proficiency} onChange={v => setData(d => ({ ...d, languages: d.languages.map((e, j) => j === i ? { ...e, proficiency: v } : e) }))} /></div></Card>)}</Section>
      <Section title="Professional Links" action={<Add label="Add link" onClick={() => setData(d => ({ ...d, professionalLinks: [...d.professionalLinks, { label: null, url: null }] }))} />}>{data.professionalLinks.length === 0 ? <Empty /> : data.professionalLinks.map((x, i) => <Card key={i} title={`Professional Link ${i + 1}`} onDelete={() => setData(d => ({ ...d, professionalLinks: d.professionalLinks.filter((_, j) => j !== i) }))}><div className="grid gap-4 sm:grid-cols-2"><Field label="Label" value={x.label} onChange={v => setData(d => ({ ...d, professionalLinks: d.professionalLinks.map((e, j) => j === i ? { ...e, label: v } : e) }))} /><Field label="URL" type="url" value={x.url} error={errors[`professionalLinks.${i}.url`]} onChange={v => setData(d => ({ ...d, professionalLinks: d.professionalLinks.map((e, j) => j === i ? { ...e, url: v } : e) }))} /></div></Card>)}</Section>
    </div>
    {message && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>}
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-between"><button type="button" onClick={onBack} className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-medium text-zinc-700">Back</button><button type="button" onClick={confirm} className="rounded-lg bg-zinc-950 px-6 py-3 text-sm font-medium text-white">Generate Portfolio</button></div>
  </section>;
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) { return <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-5"><h2 className="text-lg font-semibold text-zinc-950">{title}</h2>{action}</div><div className="space-y-4 pt-5">{children}</div></section>; }
function Field({ label, value, onChange, type = "text", error }: FieldProps) { return <label className="block"><span className="mb-2 block text-sm font-medium text-zinc-800">{label}</span><input type={type} value={value ?? ""} aria-invalid={Boolean(error)} onChange={e => onChange(nullIfBlank(e.target.value))} className={`w-full rounded-lg bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 ${error ? "border border-red-400 focus:ring-red-100" : "border border-zinc-300 focus:ring-zinc-200"}`} />{error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}</label>; }
function TextArea({ label, value, onChange }: { label: string; value: string | null; onChange: (v: string | null) => void }) { return <label className="block"><span className="mb-2 block text-sm font-medium text-zinc-800">{label}</span><textarea rows={5} value={value ?? ""} onChange={e => onChange(nullIfBlank(e.target.value))} className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:ring-2 focus:ring-zinc-200" /></label>; }
function Card({ title, onDelete, children }: { title: string; onDelete: () => void; children: ReactNode }) { return <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5"><div className="mb-5 flex justify-between"><p className="text-sm font-semibold">{title}</p><button type="button" onClick={onDelete} className="text-xs text-zinc-500 hover:text-red-700">Delete</button></div>{children}</div>; }
function Add({ label, onClick }: { label: string; onClick: () => void }) { return <button type="button" onClick={onClick} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700">+ {label}</button>; }
function Empty() { return <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">No information added.</div>; }
function List({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) { return <div className="mt-4"><div className="mb-2 flex justify-between"><p className="text-sm font-medium text-zinc-800">{label}</p><button type="button" onClick={() => onChange([...values, ""])} className="text-xs font-medium text-zinc-600">+ Add</button></div><div className="space-y-2">{values.map((v, i) => <div key={i} className="flex gap-2"><input value={v} onChange={e => onChange(values.map((x, j) => j === i ? e.target.value : x))} className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm" /><button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-500">Remove</button></div>)}</div></div>; }
