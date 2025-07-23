import {z} from "zod";

export const projectRegisterSchema = z.object({
  repo: z.string(),
  branch: z.string(),
  path: z.string(),
  is_community: z.boolean().optional()
});

export const projectEditSchema = z.object({
  id: z.string(),

  repo: z.string(),
  branch: z.string(),
  path: z.string(),
  is_community: z.boolean().optional()
});

export const projectReportSchema = z.object({
  project_id: z.string(),
  type: z.string(),
  reason: z.string(),
  body: z.string(),
  path: z.string().optional(),
  locale: z.string().optional(),
  version: z.string().optional()
});

export const ruleProjectReportSchema = z.object({
  resolution: z.enum(['accept', 'dismiss'])
})

export const createAccessKeySchema = z.object({
  name: z.string(),
  days_valid: z.coerce.number().min(0).max(365).optional()
});