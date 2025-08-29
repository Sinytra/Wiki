import {ZodSchema} from "zod";

export interface ValidationResult { success: boolean; }
export interface ValidationSuccess<T> extends ValidationResult { success: true; data: T }
export interface ValidationError extends ValidationResult { success: false; errors: unknown }

export async function validateProjectFormData<T>(rawData: any, schema: ZodSchema<T>): Promise<ValidationSuccess<T> | ValidationError> {
  const validated = schema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors }
  }
  return { success: true, data: validated.data };
}