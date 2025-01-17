'use server'

import {
  docsPageReportSchema,
  migrateRepositorySchema,
  projectEditSchema,
  projectRegisterSchema
} from "@/lib/forms/schemas";
import {auth, isModrinthOAuthAvailable} from "@/lib/auth";
import email from "@/lib/email";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import cacheUtil from "@/lib/cacheUtil";

export async function fetchProjectLog(id: string) {
  const session = await auth();
  return remoteServiceApi.getProjectDevLog(session!.access_token, id);
}

export async function handleRegisterProjectForm(rawData: any) {
  const validated = await validateProjectFormData(rawData, projectRegisterSchema);
  if ('success' in validated) {
    return validated;
  }
  const {data, token} = validated;

  const response = await remoteServiceApi.registerProject({
    repo: `${data.owner}/${data.repo}`,
    branch: data.branch,
    path: data.path,
    is_community: data.is_community,
    mr_code: data.mr_code == null ? undefined : data.mr_code
  }, token);

  if ('error' in response) {
    return {
      success: false,
      ...response,
      can_verify_mr: response.can_verify_mr && isModrinthOAuthAvailable() ? response.can_verify_mr : undefined,
      install_url: response.install_url ? saveState(response.install_url, data) : undefined
    };
  }

  return {success: true, project: response.project};
}

export async function handleEditProjectForm(rawData: any) {
  const validated = await validateProjectFormData(rawData, projectEditSchema);
  if ('success' in validated) {
    return validated;
  }
  const {data, token} = validated;

  const response = await remoteServiceApi.updateProject({
    repo: `${data.owner}/${data.repo}`,
    branch: data.branch,
    path: data.path,
    mr_code: data.mr_code == null ? undefined : data.mr_code
  }, token);

  if ('error' in response) {
    return {
      success: false,
      ...response,
      can_verify_mr: response.can_verify_mr && isModrinthOAuthAvailable() ? response.can_verify_mr : undefined,
      install_url: response.install_url ? saveState(response.install_url, data) : undefined
    };
  }

  cacheUtil.invalidateDocs(response.project.id);

  return {success: true};
}

export async function handleDeleteProjectForm(id: string) {
  const session = await auth();
  if (session == null) {
    return {success: false, error: 'unauthenticated'};
  }

  const response = await remoteServiceApi.deleteProject(id, session.access_token);
  if ('error' in response) {
    return {success: false, ...response};
  }

  cacheUtil.invalidateDocs(id);

  return {success: true};
}

export async function handleMigrateRepositoryForm(rawData: any) {
  const validatedFields = migrateRepositorySchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {success: false, errors: validatedFields.error.flatten().fieldErrors}
  }

  const repo = `${validatedFields.data.owner}/${validatedFields.data.repo}`;

  // Get authenticated GitHub user
  const session = await auth();
  if (session == null) {
    return {success: false, error: 'unauthenticated'};
  }

  const response = await remoteServiceApi.migrateRepository(repo, session.access_token);
  if ('error' in response) {
    return {success: false, ...response};
  }

  return {success: true};
}

export async function handleRevalidateDocs(id: string) {
  const session = await auth();
  if (session == null) {
    return {success: false, error: 'unauthenticated'};
  }

  const response = await remoteServiceApi.revalidateProject(id, session.access_token);
  if ('error' in response) {
    return {success: false, ...response};
  }

  return {success: true};
}

export async function handleReportProjectForm(projectId: string, path: string, rawData: any) {
  const session = await auth();
  if (session == null) {
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
      name: session.user?.name || 'Unknown',
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

async function validateProjectFormData(rawData: any, schema: any) {
  const validatedFields = schema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const data = validatedFields.data;

  // Get authenticated GitHub user
  const session = await auth();
  if (session == null) {
    return {success: false, error: 'unauthenticated'};
  }

  return {data, token: session.access_token};
}

function saveState(url: string, state: any) {
  const serialized = btoa(JSON.stringify(state));
  return url + '?state=' + serialized;
}
