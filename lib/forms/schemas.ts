import {z} from "zod";

export const projectRegisterSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  path: z.string()
});
