'use client'

import {projectUpdateSourceSchema, projectRegisterSchema, updateGameDataSchema} from "@/lib/forms/schemas";
import projectApiClient from "@/lib/service/api/projectApiClient";
import adminApiClient from "@/lib/service/api/adminApiClient";
import forms, {asFormResponse, FormActionResult} from "@/lib/forms/forms";
import {ProjectResponse} from "@/lib/service/api/projectApi";

async function handleRegisterProjectFormClient(rawData: any): Promise<FormActionResult<ProjectResponse>> {
  const data = await forms.validateProjectFormData(rawData, projectRegisterSchema);
  if (!data.success) {
    return data;
  }

  const response = await projectApiClient.registerProject(data.data);
  if (!response.success) {
    const can_verify_mr = response.type == 'known_error' ? (response.data as any).can_verify_mr : undefined;
    return {
      ...asFormResponse(response),
      can_verify_mr
    } as any;
  }

  return asFormResponse(response);
}

async function handleEditProjectFormClient(rawData: any) {
  const validated = await forms.validateProjectFormData(rawData, projectUpdateSourceSchema);
  if (!validated.success) {
    return validated;
  }

  const response = await projectApiClient.updateProject(validated.data);
  if (!response.success) {
    const can_verify_mr = response.type === 'known_error' ? (response.data as any).can_verify_mr : undefined;
    return {
      ...asFormResponse(response),
      can_verify_mr
    };
  }

  return asFormResponse(response);
}

export async function handleUpdateGameDataFormClient(rawData: any) {
  return forms.handleDataForm(updateGameDataSchema, rawData, adminApiClient.updateGameData);
}

export default {
  handleRegisterProjectFormClient,
  handleEditProjectFormClient,
  handleUpdateGameDataFormClient
}