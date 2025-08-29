'use client'

import {validateProjectFormData} from "@/lib/forms/commonActions";
import {projectRegisterSchema} from "@/lib/forms/schemas";
import projectApiClient from "@/lib/service/api/projectApiClient";

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

export default {
  handleRegisterProjectFormClient
}