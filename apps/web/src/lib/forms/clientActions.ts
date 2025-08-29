'use client'

import {projectEditSchema, projectRegisterSchema} from "@/lib/forms/schemas";
import projectApiClient from "@/lib/service/api/projectApiClient";
import {ZodSchema} from "zod";

interface ValidationResult { success: boolean; }
interface ValidationSuccess<T> extends ValidationResult { success: true; data: T }
interface ValidationError extends ValidationResult { success: false; errors: unknown }

export async function validateProjectFormData<T>(rawData: any, schema: ZodSchema<T>): Promise<ValidationSuccess<T> | ValidationError> {
  const validated = schema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors }
  }
  return { success: true, data: validated.data };
}

async function handleRegisterProjectFormClient(rawData: any) {
  const data = await validateProjectFormData(rawData, projectRegisterSchema);
  if (!data.success) {
    return data;
  }

  const response: any = await projectApiClient.registerProject(data.data);

  if (!response.success) {
    const can_verify_mr = response.type == 'known_error' ? (response.data as any).can_verify_mr : undefined;
    return {
      ...response,
      can_verify_mr
    };
  }

  return {success: true, project: response.data.project};
}

async function handleEditProjectFormClient(rawData: any) {
  const validated = await validateProjectFormData(rawData, projectEditSchema);
  if (!validated.success) {
    return validated;
  }
  const response = await projectApiClient.updateProject(validated.data);

  if (!response.success) {
    const can_verify_mr = response.type === 'known_error' ? (response.data as any).can_verify_mr : undefined;
    const install_url = response.type === 'known_error' ? saveState((response.data as any).install_url, validated.data) : undefined;
    return {
      ...response,
      can_verify_mr,
      install_url
    };
  }

  return {success: true};
}

function saveState(url: string, state: any) {
  const serialized = btoa(JSON.stringify(state));
  return url + '?state=' + serialized;
}

export default {
  handleRegisterProjectFormClient,
  handleEditProjectFormClient
}