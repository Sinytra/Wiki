'use server'

import {docsPageReportSchema, projectEditSchema, projectRegisterSchema} from "@/lib/forms/schemas";
import email from "@/lib/email";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import cacheUtil from "@/lib/cacheUtil";
import authSession from "@/lib/authSession";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function fetchProjectLog(id: string) {
  return remoteServiceApi.getProjectDevLog(id);
}

export async function handleRegisterProjectForm(rawData: any) {
  const data = await validateProjectFormData(rawData, projectRegisterSchema);
  if ('success' in data) {
    return data;
  }

  const response = await remoteServiceApi.registerProject({
    repo: `${data.owner}/${data.repo}`,
    branch: data.branch,
    path: data.path,
    is_community: data.is_community
  });

  if ('error' in response) {
    return {
      success: false,
      ...response,
      can_verify_mr: response.can_verify_mr ? response.can_verify_mr : undefined,
    };
  }

  revalidatePath('/[locale]/(dashboard)/dev');

  return {success: true, project: response.project};
}

export async function handleEditProjectForm(rawData: any) {
  const data = await validateProjectFormData(rawData, projectEditSchema);
  if ('success' in data) {
    return data;
  }

  const response = await remoteServiceApi.updateProject({
    repo: `${data.owner}/${data.repo}`,
    branch: data.branch,
    path: data.path
  });

  if ('error' in response) {
    return {
      success: false,
      ...response,
      can_verify_mr: response.can_verify_mr ? response.can_verify_mr : undefined,
      install_url: response.install_url ? saveState(response.install_url, data) : undefined
    };
  }

  cacheUtil.invalidateDocs(response.project.id);

  return {success: true};
}

export async function handleDeleteProjectForm(id: string) {
  const response = await remoteServiceApi.deleteProject(id);
  if ('error' in response) {
    return {success: false, ...response};
  }

  cacheUtil.invalidateDocs(id);

  return {success: true};
}

export async function handleRevalidateDocs(id: string) {
  const response = await remoteServiceApi.revalidateProject(id);
  if ('error' in response) {
    return {success: false, ...response};
  }

  return {success: true};
}

export async function handleReportProjectForm(projectId: string, path: string, rawData: any) {
  const response = await remoteServiceApi.getUserProfile();
  if ('status' in response) {
    return {success: false, error: 'unauthenticated'};
  }

  const validatedFields = docsPageReportSchema.safeParse(rawData)
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const sender = {
      name: response.username || 'Unknown',
      email: rawData.email || 'unknown'
    };
    // Send asynchronously
    email.submitReport(projectId, path, sender, rawData.reason, rawData.content);
  } catch (e) {
    console.error('Error submitting report', e);
    return {success: false, error: 'internal'};
  }

  return {success: true};
}

export async function linkModrinthAccount() {
  const result = await remoteServiceApi.linkModrinthAcount();
  if ('url' in result) {
    return redirect(result.url);
  } else {
    return {success: false};
  }
}

export async function unlinkModrinthAccount() {
  const result = await remoteServiceApi.unlinkModrinthAcount();
  if ('error' in result) {
    return {success: false, error: result.error};
  } else {
    return {success: true};
  }
}

export async function deleteUserAccount() {
  const result = await remoteServiceApi.deleteUserAcount();
  if ('error' in result) {
    return {success: false, error: result.error};
  } else {
    return authSession.logout(); // Remove session cookie
  }
}

async function validateProjectFormData(rawData: any, schema: any) {
  const validatedFields = schema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  return validatedFields.data;
}

function saveState(url: string, state: any) {
  const serialized = btoa(JSON.stringify(state));
  return url + '?state=' + serialized;
}
