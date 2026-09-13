import { z } from "zod";

const optionalText = z.string().trim().nullable();

const optionalUrl = z
  .string()
  .trim()
  .nullable()
  .refine(
    (value) => {
      if (value === null || value === "") {
        return true;
      }

      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Invalid URL.",
    },
  );

const personalInformationSchema = z.object({
  fullName: optionalText,
  professionalTitle: optionalText,
  email: optionalText,
  phone: optionalText,
  location: optionalText,
});

const educationSchema = z.object({
  institution: optionalText,
  degree: optionalText,
  fieldOfStudy: optionalText,
  location: optionalText,
  startDate: optionalText,
  endDate: optionalText,
  description: optionalText,
});

const experienceSchema = z.object({
  company: optionalText,
  role: optionalText,
  location: optionalText,
  startDate: optionalText,
  endDate: optionalText,
  description: optionalText,
  highlights: z.array(z.string().trim()),
});

const projectSchema = z.object({
  name: optionalText,
  organization: optionalText,
  description: optionalText,
  technologies: z.array(z.string().trim()),
  link: optionalUrl,
  startDate: optionalText,
  endDate: optionalText,
  highlights: z.array(z.string().trim()),
});

const certificationSchema = z.object({
  name: optionalText,
  issuer: optionalText,
  date: optionalText,
  duration: optionalText,
  credentialId: optionalText,
  link: optionalUrl,
});

const languageSchema = z.object({
  name: optionalText,
  proficiency: optionalText,
});

const professionalLinkSchema = z.object({
  label: optionalText,
  url: optionalUrl,
});

export const portfolioDataSchema = z.object({
  personalInformation: personalInformationSchema,
  professionalSummary: optionalText,

  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  skills: z.array(z.string().trim()),
  certifications: z.array(certificationSchema),
  languages: z.array(languageSchema),
  professionalLinks: z.array(professionalLinkSchema),
});

export type PortfolioData = z.infer<typeof portfolioDataSchema>;