'use server'

import {docsPageReportSchema, migrateRepositorySchema, projectRegisterSchema} from "@/lib/forms/schemas";
import database from "@/lib/database";
import {auth} from "@/lib/auth";
import github from "@/lib/github/github";
import email from "@/lib/email";
import githubFacade from "@/lib/facade/githubFacade";
import githubCache from "@/lib/github/githubCache";
import remoteServiceApi from "@/lib/service/remoteServiceApi";
import cacheUtil from "@/lib/cacheUtil";

export async function handleRegisterProjectForm(rawData: any) {
  const validated = await validateProjectFormData(rawData);
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
    return {success: false, ...response};
  }

  return {success: true};
}

export async function handleEditProjectForm(rawData: any) {
  const validated = await validateProjectFormData(rawData);
  if ('success' in validated) {
    return validated;
  }
  const {data, token} = validated;

  const response = await remoteServiceApi.updateProject({
    repo: `${data.owner}/${data.repo}`,
    branch: data.branch,
    path: data.path,
  }, token);

  if ('error' in response) {
    return {success: false, ...response};
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
  const user = await github.getUserProfile(session.access_token);

  // Ensure app is installed on repository
  const installation = await githubFacade.getInstallation(data.new_owner, data.repo, null, null);
  // Prompt user to install app
  if (installation && 'url' in installation) {
    return {success: false, installation_url: installation.url};
  }

  // Validate user repository access
  if (!(await githubFacade.verifyAppInstallationRepositoryOwnership(data.new_owner, data.repo, user.login))) {
    return {success: false, validation_error: 'access_denied'};
  }

  const repo = await githubFacade.getRepository(data.owner, data.repo);

  // Check if repo has moved
  if ('id' in repo && data.owner.toLowerCase() !== repo.owner.login.toLowerCase() && data.repo.toLowerCase() === repo.name.toLowerCase()) {
    await database.migrateRepository(`${data.owner}/${data.repo}`, repo.full_name);

    githubCache.getUserAccessibleInstallations.invalidate(data.owner, data.repo);
    return {success: true};
  }

  return {success: false, migrate_error: 'unavailable'};
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

async function validateProjectFormData(rawData: any) {
  const validatedFields = projectRegisterSchema.safeParse(rawData);

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
