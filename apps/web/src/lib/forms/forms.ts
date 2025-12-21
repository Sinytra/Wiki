import {z, ZodType} from "zod";
import {ApiCallResult, ApiErrorResponse} from "@repo/shared/commonNetwork";
import {useTranslations} from "next-intl";
import {UseFormReturn} from "react-hook-form";

export type FormActionResult<T = null> = FormResponseSuccess<T> | FormResponseError;

export interface FormResponse {
  success: boolean;
}

export interface FormResponseSuccess<T> extends FormResponse {
  success: true;
  data: T
}

export interface FormResponseError extends FormResponse {
  success: false;
  data?: unknown;
  error?: string;
  errors?: Record<string, any>
}

export function asFormResponse<T = null>(result: ApiCallResult<T>): FormActionResult<T> {
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, data: (result as ApiErrorResponse).data, error: result.error };
}

async function validateProjectFormData<SCHEMA extends ZodType>(rawData: any, schema: SCHEMA): Promise<FormActionResult<z.infer<SCHEMA>>> {
  const validated = schema.safeParse(rawData);
  if (!validated.success) {
    return {success: false, errors: validated.error.flatten().fieldErrors}
  }
  return {success: true, data: validated.data};
}

async function handleDataForm<SCHEMA extends ZodType, T>(schema: SCHEMA, rawData: any, action: (data: z.infer<SCHEMA>) => Promise<ApiCallResult<T>>): Promise<FormActionResult<T>> {
  const validatedFields = schema.safeParse(rawData)
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const result = await action(validatedFields.data);
  if (!result.success) {
    return result;
  }

  return {success: true, data: result.data};
}

export function useFormHandlingAction<T = never>(form: UseFormReturn<any, any, any>,
                                                 formAction: (rawData: unknown) => Promise<FormActionResult<T>>,
                                                 onSuccess?: (data: T) => void,
                                                 onError?: (resp: FormActionResult<T>) => void): () => void {
  const t = useTranslations('FormActions');

  return form.handleSubmit(async (rawData: unknown) => {
    const result = await formAction(rawData);

    if (result.success) {
      onSuccess?.((result as FormResponseSuccess<T>).data);
    } else {
      onError?.(result);
      if ('error' in result) {
        // @ts-expect-error details
        form.setError('root.custom', {message: t(`errors.${result.error}`), details: result.data?.details});
      }
      if ('errors' in result) {
        for (const key in result.errors) {
          // @ts-expect-error message
          form.setError(key, {message: t(`errors.${result.errors[key][0]}`)});
        }
      }
    }
  });
}

export default {
  validateProjectFormData,
  handleDataForm
}