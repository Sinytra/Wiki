'use server'

import {
  addProjectMemberSchema,
  createAccessKeySchema,
  projectReportSchema, removeProjectMemberSchema,
  revalidateCacheSchema,
  ruleProjectReportSchema
} from "@/lib/forms/schemas";
import cacheUtil from "@/lib/cacheUtil";
import authSession from "@/lib/authSession";
import {revalidateTag} from "next/cache";
import {redirect} from "next/navigation";
import authApi from "@/lib/service/api/authApi";
import devProjectApi from "@/lib/service/api/devProjectApi";
import projectApi from "@/lib/service/api/projectApi";
import moderationApi from "@/lib/service/api/moderationApi";
import adminApi from "@/lib/service/api/adminApi";
import {z, ZodType} from "zod";
import {ApiCallResult} from "@repo/shared/commonNetwork";

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
  return handleDataForm(createAccessKeySchema, rawData, adminApi.createAccessKey);
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
  return handleDataForm(projectReportSchema, rawData, moderationApi.submitProjectReport);
}

export async function handleRuleProjectReport(id: string, rawData: any) {
  const response = await authApi.getUserProfile();
  if (!response.success) {
    return {success: false, error: response.error};
  }
  return handleDataForm(ruleProjectReportSchema, rawData, data => moderationApi.ruleProjectReport(id, data));
}

export async function handleAddProjectMember(id: string, rawData: any) {
  return handleDataForm(addProjectMemberSchema, rawData, (data) => devProjectApi.addProjectMember(id, data));
}

export async function handleRemoveProjectMember(id: string, rawData: any) {
  return handleDataForm(removeProjectMemberSchema, rawData, (data) => devProjectApi.removeProjectMember(id, data));
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

export async function handleDeleteDeploymentForm(id: string) {
  const response = await devProjectApi.deleteDeployment(id);
  if (!response.success) {
    return response;
  }
  return {success: true};
}

export async function handleRevalidateCacheTag(rawData: any) {
  const validatedFields = revalidateCacheSchema.safeParse(rawData)
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  revalidateTag(validatedFields.data.tag);
  return {success: true};
}

async function handleDataForm<SCHEMA extends ZodType, T>(schema: SCHEMA, rawData: any, action: (data: z.infer<SCHEMA>) => Promise<ApiCallResult<T>>) {
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

  return {success: true, result: result.data};
}