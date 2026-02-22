'use server'

import {
  addProjectMemberSchema,
  createAccessKeySchema,
  projectReportSchema,
  projectUpdateSchema,
  removeProjectMemberSchema,
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
import adminApi, {AccessKeyCreationResult} from "@/lib/service/api/adminApi";
import forms, {asFormResponse, FormActionResult} from "@/lib/forms/forms";

export async function handleDeleteProjectForm(id: string): Promise<FormActionResult> {
  const response = await projectApi.deleteProject(id);
  if (!response.success) {
    return response;
  }
  cacheUtil.invalidateDocs(id);
  return {success: true, data: null};
}

export async function handleUpdateProjectSettingsForm(id: string, rawData: any): Promise<FormActionResult> {
  return forms.handleDataForm(projectUpdateSchema, rawData, (data) => devProjectApi.updateProject(id, data));
}

export async function handleRevalidateDocs(id: string): Promise<FormActionResult> {
  const response = await devProjectApi.deployProject(id);
  return asFormResponse(response);
}

export async function handleCreateAccessKeyForm(rawData: any): Promise<FormActionResult<AccessKeyCreationResult>> {
  return forms.handleDataForm(createAccessKeySchema, rawData, adminApi.createAccessKey);
}

export async function handleDeleteAccessKeyForm(id: number): Promise<FormActionResult> {
  const response = await adminApi.deleteAccessKey(id);
  return asFormResponse(response);
}

export async function handleReportProjectForm(rawData: any): Promise<FormActionResult> {
  const response = await authApi.getUserProfile();
  if (!response.success) {
    return asFormResponse(response);
  }
  return forms.handleDataForm(projectReportSchema, rawData, moderationApi.submitProjectReport);
}

export async function handleRuleProjectReport(id: string, rawData: any): Promise<FormActionResult> {
  const response = await authApi.getUserProfile();
  if (!response.success) {
    return asFormResponse(response);
  }
  return forms.handleDataForm(ruleProjectReportSchema, rawData, data => moderationApi.ruleProjectReport(id, data));
}

export async function handleAddProjectMember(id: string, rawData: any): Promise<FormActionResult> {
  return forms.handleDataForm(addProjectMemberSchema, rawData, (data) => devProjectApi.addProjectMember(id, data));
}

export async function handleRemoveProjectMember(id: string, rawData: any): Promise<FormActionResult> {
  return forms.handleDataForm(removeProjectMemberSchema, rawData, (data) => devProjectApi.removeProjectMember(id, data));
}

export async function linkModrinthAccount(): Promise<FormActionResult> {
  const result = await authApi.linkModrinthAcount();
  if (result.type == 'redirect') {
    return redirect(result.url);
  } else {
    return {success: false};
  }
}

export async function unlinkModrinthAccount(): Promise<FormActionResult> {
  const response = await authApi.unlinkModrinthAcount();
  return asFormResponse(response);
}

export async function deleteUserAccount(): Promise<FormActionResult> {
  const response = await authApi.deleteUserAcount();
  if (response.success) {
    authSession.logout(); // Remove session cookie
  }
  return asFormResponse(response);
}

export async function handleDeleteDeploymentForm(id: string): Promise<FormActionResult> {
  const response = await devProjectApi.deleteDeployment(id);
  return asFormResponse(response) as FormActionResult;
}

export async function handleRevalidateCacheTag(rawData: any): Promise<FormActionResult> {
  const validatedFields = revalidateCacheSchema.safeParse(rawData)
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  revalidateTag(validatedFields.data.tag);
  return {success: true, data: null};
}
