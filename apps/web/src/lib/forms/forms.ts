import { z, ZodType } from 'zod';
import { ApiCallResult, ApiErrorResponse } from '@repo/shared/commonNetwork';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';

export type FormActionResult<T = null> = FormResponseSuccess<T> | FormResponseError;

export type FormErrorTranslator = (error: string, data?: unknown) => string;

export interface FormResponse {
  success: boolean;
}

export interface FormResponseSuccess<T> extends FormResponse {
  success: true;
  data: T;
}

export interface FormResponseError extends FormResponse {
  success: false;
  data?: unknown;
  error?: string;
  errors?: Record<string, any>;
}

interface ProjectErrorBody {
  error: string;
  message: string;
}

export function asFormResponse<T = null>(result: ApiCallResult<T>): FormActionResult<T> {
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    data: (result as ApiErrorResponse).data,
    error: result.error
  };
}

async function validateProjectFormData<SCHEMA extends ZodType>(
  rawData: any,
  schema: SCHEMA
): Promise<FormActionResult<z.infer<SCHEMA>>> {
  const validated = schema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }
  return { success: true, data: validated.data };
}

async function handleDataForm<SCHEMA extends ZodType, T>(
  schema: SCHEMA,
  rawData: any,
  action: (data: z.infer<SCHEMA>) => Promise<ApiCallResult<T>>
): Promise<FormActionResult<T>> {
  const validatedFields = schema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const result = await action(validatedFields.data);
  if (!result.success) {
    return result;
  }

  return { success: true, data: result.data };
}

export function isProjectErrorBody(data: unknown): data is ProjectErrorBody {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).error === 'string' &&
    typeof (data as any).message === 'string'
  );
}

export function useFormErrorTranslator(): FormErrorTranslator {
  const t = useTranslations('FormActions');
  const p = useTranslations('ProjectError');

  return (error, data) => {
    const formKey = `errors.${error}`;
    // @ts-expect-error dynamic key
    if (t.has(formKey)) return t(formKey);
    // @ts-expect-error dynamic key
    if (isProjectErrorBody(data) && p.has(error)) return p(error);
    return t('errors.unknown');
  };
}

export function getFormErrorDetails(data: unknown): string | undefined {
  if (isProjectErrorBody(data)) return data.message;
  if (typeof data === 'object' && data !== null && typeof (data as any).details === 'string') {
    return (data as any).details;
  }
  return undefined;
}

export function useFormHandlingAction<T = never>(
  form: UseFormReturn<any, any, any>,
  formAction: (rawData: unknown) => Promise<FormActionResult<T>>,
  onSuccess?: (data: T) => void,
  onError?: (resp: FormActionResult<T>) => void
): () => void {
  const translateError = useFormErrorTranslator();

  return form.handleSubmit(async (rawData: unknown) => {
    const result = await formAction(rawData);

    if (result.success) {
      onSuccess?.((result as FormResponseSuccess<T>).data);
    } else {
      onError?.(result);
      if ('error' in result && result.error) {
        form.setError('root.custom', {
          message: translateError(result.error, result.data),
          // @ts-expect-error details
          details: getFormErrorDetails(result.data)
        });
      }
      if ('errors' in result) {
        for (const key in result.errors) {
          form.setError(key, { message: translateError(result.errors[key][0]) });
        }
      }
    }
  });
}

export default {
  validateProjectFormData,
  handleDataForm
};
