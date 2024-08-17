import {z} from "zod";

export const projectRegisterSchema = z.object({
  source_url: z.string().url()
});
