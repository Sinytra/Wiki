import {z} from "zod";

export const projectRegisterSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  path: z.string(),
  is_community: z.boolean().optional()
});

export const projectEditSchema = z.object({
  id: z.string(),

  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  path: z.string(),
  is_community: z.boolean().optional()
});

export const docsPageReportSchema = z.object({
  reason: z.string(),
  content: z.string(),
  email: z.string().email().optional()
});
