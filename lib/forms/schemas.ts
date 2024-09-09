import {z} from "zod";

export const projectRegisterSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  path: z.string()
});

export const docsPageReportSchema = z.object({
  reason: z.string(),
  content: z.string(),
  email: z.string().email().optional()
});
