'use server'

import {docsPageReportSchema, migrateRepositorySchema, projectRegisterSchema} from "@/lib/forms/schemas";
import {revalidatePath} from "next/cache";
import metadata, {ValidationError} from "@/lib/docs/metadata";
import database from "@/lib/database";
import {auth, isModrinthOAuthAvailable, modrinthCallbackURL, modrinthOAuthClient} from "@/lib/auth";
import cacheUtil from "@/lib/cacheUtil";
import github from "@/lib/github/github";
import email from "@/lib/email";
import modrinth from "@/lib/platforms/modrinth";
import githubFacade from "@/lib/facade/githubFacade";
import githubCache from "@/lib/github/githubCache";
import {isWikiAdmin} from "@/lib/utils";
import {DOCS_METADATA_FILE_NAME} from "@/lib/constants";
import platforms, {ModProject} from "@/lib/platforms";
import service from "@/lib/service";

export async function handleEnableProjectForm(rawData: any) {
  const validated = await validateProjectFormData(rawData);
  if ('success' in validated) {
    return validated;
  }
  const {metadata, project, data} = validated;
  const sourceRepo = `${data.owner}/${data.repo}`;

  const existing = await database.findExistingProject(metadata.id, sourceRepo, data.path);
  if (existing != null) {
    return {success: false, error: 'exists'};
  }

  await database.registerProject(metadata.id, project.name, metadata.platform, project.slug, sourceRepo, data.branch, data.path, data.is_community || false);

  return {success: true};
}

export async function handleDeleteProjectForm(id: string) {
  await database.unregisterProject(id);
  cacheUtil.clearModCaches(id);
  revalidatePath(`/[locale]/mod/${id}/[version]`, 'layout');

  return {success: true};
}

export async function handleEditProjectForm(rawData: any) {
  const validated = await validateProjectFormData(rawData);
  if ('success' in validated) {
    return validated;
  }
  const {metadata, project, data} = validated;

  await database.updateProject(metadata.id, project.name, metadata.platform, project.slug, `${data.owner}/${data.repo}`, data.branch, data.path, data.is_community || false);

  revalidatePath('/dev');
  cacheUtil.clearModCaches(metadata.id);
  revalidatePath(`/[locale]/mod/${metadata.id}/[version]`, 'layout');

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
    revalidatePath('/dev');
    return {success: true};
  }

  return {success: false, migrate_error: 'unavailable'};
}

export async function handleRevalidateDocs(id: string) {
  const session = await auth();
  if (session == null) {
    return {success: false, error: 'unauthenticated'};
  }

  const mod = await database.getProject(id);
  if (mod === null) {
    return {success: false, error: 'not_found'};
  }

  const parts = mod.source_repo.split('/');
  if (!(await githubFacade.verifyUserRepositoryOwnership(parts[0], parts[1], session.access_token))) {
    return {success: false, error: 'verification'};
  }

  cacheUtil.clearModCaches(id);
  revalidatePath(`/[locale]/(main)/mod/${id}/[version]`, 'layout');
  await service.invalidateCache(id);

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
  const user = await github.getUserProfile(session.access_token);

  if (rawData.is_community !== undefined && !isWikiAdmin(user.login)) {
    return {success: false, error: 'insufficient_perms'};
  }

  // Ensure app is installed on repository
  const installation = await githubFacade.getInstallation(data.owner, data.repo, data.branch, data.path);
  // Prompt user to install app
  if (installation && 'url' in installation) {
    return {success: false, installation_url: installation.url};
  }

  // Validate user repository access
  if (!(await githubFacade.verifyAppInstallationRepositoryOwnership(data.owner, data.repo, user.login))) {
    return {success: false, validation_error: 'access_denied'};
  }

  const branches = await githubFacade.getRepoBranches(data.owner, data.repo);
  if (!branches.some(b => b.name === data.branch)) {
    return {success: false, errors: {branch: ['no_branch']}};
  }

  // Read docs path
  const content = await githubFacade.getRepositoryContents(data.owner + '/' + data.repo, data.branch, validatedFields.data.path);

  if (content === null) {
    return {success: false, errors: {path: ['invalid_path']}};
  }

  // Parse metadata file
  let metadata = undefined
  try {
    metadata = await readMetadata(data.owner + '/' + data.repo, data.branch, validatedFields.data.path);
  } catch (e) {
    return {success: false, error: 'invalid_meta', details: e instanceof ValidationError ? e.message : undefined};
  }
  if (metadata === null) {
    return {success: false, error: 'no_meta'};
  }

  if (!process.env.CF_API_KEY) {
    return {success: false, error: 'no_cf_key'};
  }

  let project: ModProject;
  try {
    project = await platforms.getPlatformProject(metadata.platform, metadata.slug);
  } catch (e) {
    return {success: false, error: 'no_project'};
  }

  if (!process.env.NODE_ENV && !(await verifyProjectOwnership(project, data.owner, data.repo, data.mr_code))) {
    return {success: false, error: 'ownership', canVerifyModrinth: metadata.platform === 'modrinth' && isModrinthOAuthAvailable()};
  }

  return {metadata, project, data};
}

async function verifyProjectOwnership(project: ModProject, owner: string, repo: string, mr_code: string | null | undefined): Promise<boolean> {
  const baseUrl: string = `https://github.com/${owner}/${repo}`;
  if (project.source_url !== undefined && project.source_url.startsWith(baseUrl)) {
    return true;
  }

  if (mr_code && isModrinthOAuthAvailable()) {
    try {
      const oauth2Token = await modrinthOAuthClient.authorizationCode.getToken({
        code: mr_code,
        redirectUri: modrinthCallbackURL
      });

      const response = await fetch('https://api.modrinth.com/v3/user', {
        headers: {
          Authorization: oauth2Token.accessToken
        }
      });
      const body = await response.json();

      return await modrinth.isProjectMember(project, body.username);
    } catch (e) {
      console.error('Error fetching modrinth to verify project ownership', e);
    }
  }

  return false;
}

// TODO Move to BE
async function readMetadata(repo: string, branch: string, root: string) {
  const metadataPath = root + '/' + DOCS_METADATA_FILE_NAME;
  const metaFile = await githubFacade.getRepositoryContents(repo, branch, metadataPath);

  if (metaFile && 'content' in metaFile) {
    const content = Buffer.from(metaFile.content, 'base64').toString('utf-8');
    return metadata.parseMetadata(content);
  }

  return null;
}
