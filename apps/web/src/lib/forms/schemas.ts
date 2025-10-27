import {z} from "zod";

const zodStringError = (iss: any) => iss.input === undefined ? "Field is required." : undefined;

const requiredString = z.string({
  error: zodStringError
});
const allowedProtocols = process.env.NODE_ENV === 'development' ? /https|file/ : /https/;
const zodRepoUrl = z.url({ protocol: allowedProtocols, error: zodStringError });

export const projectRegisterSchema = z.object({
  repo: zodRepoUrl,
  branch: requiredString,
  path: requiredString.startsWith('/')
});

export const projectEditSchema = z.object({
  id: requiredString,

  repo: zodRepoUrl,
  branch: requiredString,
  path: requiredString.startsWith('/'),
  is_community: z.boolean().optional()
});

export const projectReportSchema = z.object({
  project_id: requiredString,
  type: requiredString,
  reason: requiredString,
  body: requiredString,

  path: z.string().optional(),
  locale: z.string().optional(),
  version: z.string().optional()
});

export const ruleProjectReportSchema = z.object({
  resolution: z.enum(['accept', 'dismiss'])
})

export const createAccessKeySchema = z.object({
  name: requiredString,
  days_valid: z.coerce.number<any>().min(0).max(365).optional()
});

export const revalidateCacheSchema = z.object({
  tag: requiredString
});