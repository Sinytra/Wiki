'use server'

import {
  createAccessKeySchema,
  projectEditSchema,
  projectRegisterSchema,
  projectReportSchema,
  ruleProjectReportSchema
} from "@/lib/forms/schemas";
import cacheUtil from "@/lib/cacheUtil";
import authSession from "@/lib/authSession";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import authApi from "@/lib/service/api/authApi";
import devProjectApi from "@/lib/service/api/devProjectApi";
import projectApi from "@/lib/service/api/projectApi";
import {ZodSchema} from "zod";
import moderationApi from "@/lib/service/api/moderationApi";
import adminApi from "@/lib/service/api/adminApi";

interface ValidationResult { success: boolean; }
interface ValidationSuccess<T> extends ValidationResult { success: true; data: T }
interface ValidationError extends ValidationResult { success: false; errors: unknown }

// TODO Cleanup
export async function handleRegisterProjectForm(rawData: any) {
  const data = await validateProjectFormData(rawData, projectRegisterSchema);
  if (!data.success) {
    return data;
  }

  const response = await projectApi.registerProject(data.data);

  if (!response.success) {
    const can_verify_mr = response.type == 'known_error' ? (response.data as any).can_verify_mr : undefined;
    return {
      ...response,
      can_verify_mr
    };
  }

  revalidatePath('/[locale]/(dashboard)/dev');

  return {success: true, project: response.data.project};
}

export async function handleEditProjectForm(rawData: any) {
  const validated = await validateProjectFormData(rawData, projectEditSchema);
  if (!validated.success) {
    return validated;
  }
  const response = await projectApi.updateProject(validated.data);

  if (!response.success) {
    const can_verify_mr = response.type === 'known_error' ? (response.data as any).can_verify_mr : undefined;
    const install_url = response.type === 'known_error' ? saveState((response.data as any).install_url, validated.data) : undefined;
    return {
      ...response,
      can_verify_mr,
      install_url
    };
  }

  cacheUtil.invalidateDocs(response.data.project.id);

  return {success: true};
}

export async function handleDeleteProjectForm(id: string) {
  const response = await projectApi.deleteProject(id);
  if (!response.success) {
    return response;
  }

  cacheUtil.invalidateDocs(id);

  return {success: true};
}

export async function handleRevalidateDocs(id: string) {
  const response = await devProjectApi.deployProject(id);
  if (!response.success) {
    return response;
  }
  return {success: true};
}

export async function handleCreateAccessKeyForm(rawData: any) {
  const validatedFields = createAccessKeySchema.safeParse(rawData)
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const result = await adminApi.createAccessKey(validatedFields.data);
  if (!result.success) {
    return result;
  }

  return {success: true, result: result.data};
}

export async function handleDeleteAccessKeyForm(id: number) {
  const response = await adminApi.deleteAccessKey(id);
  if (!response.success) {
    return response;
  }

  return {success: true};
}

export async function handleReportProjectForm(rawData: any) {
  const response = await authApi.getUserProfile();
  if (!response.success) {
    return {success: false, error: response.error};
  }

  const validatedFields = projectReportSchema.safeParse(rawData)
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const result = await moderationApi.submitProjectReport(validatedFields.data);
  if (!result.success) {
    return result;
  }

  return {success: true};
}

export async function handleRuleProjectReport(id: string, rawData: any) {
  const response = await authApi.getUserProfile();
  if (!response.success) {
    return {success: false, error: response.error};
  }

  const validatedFields = ruleProjectReportSchema.safeParse(rawData)
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const result = await moderationApi.ruleProjectReport(id, validatedFields.data);
  if (!result.success) {
    return result;
  }

  return {success: true};
}

export async function linkModrinthAccount() {
  const result = await authApi.linkModrinthAcount();
  if (result.type == 'redirect') {
    return redirect(result.url);
  } else {
    return {success: false};
  }
}

export async function unlinkModrinthAccount() {
  const result = await authApi.unlinkModrinthAcount();
  return result.success ? {success: true} : {success: false, error: result.error};
}

export async function deleteUserAccount() {
  const result = await authApi.deleteUserAcount();
  if (!result.success) {
    return {success: false, error: result.error};
  } else {
    return authSession.logout(); // Remove session cookie
  }
}

async function validateProjectFormData<T>(rawData: any, schema: ZodSchema<T>): Promise<ValidationSuccess<T> | ValidationError> {
  const validated = schema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors }
  }
  return { success: true, data: validated.data };
}

function saveState(url: string, state: any) {
  const serialized = btoa(JSON.stringify(state));
  return url + '?state=' + serialized;
}

export async function handleDeleteDeploymentForm(id: string) {
  const response = await devProjectApi.deleteDeployment(id);
  if (!response.success) {
    return response;
  }

  return {success: true};
}
