import {z} from "zod";

export const projectRegisterSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  path: z.string(),
  is_community: z.boolean().optional(),

  mr_code: z.string().nullish()
});

export const projectEditSchema = z.object({
  id: z.string(),

  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  path: z.string(),
  is_community: z.boolean().optional(),

  mr_code: z.string().nullish()
});

export const docsPageReportSchema = z.object({
  reason: z.string(),
  content: z.string(),
  email: z.string().email().optional()
});

export const migrateRepositorySchema = z.object({
  owner: z.string(),
  repo: z.string()
});