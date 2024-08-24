'use server'

import {projectRegisterSchema} from "@/lib/forms/schemas";
import {revalidatePath} from "next/cache";
import githubApp from "@/lib/github/githubApp";
import metadata from "@/lib/docs/metadata";
import platforms, {ModProject} from "@/lib/platforms";
import {Octokit} from "octokit";
import database from "@/lib/database";
import {signOut} from "@/lib/auth";
import cacheUtil from "@/lib/cacheUtil";

export async function handleSignOut() {
  await signOut({redirectTo: '/'});
}

export async function handleEnableProjectForm(rawData: any) {
  const validated = await validateProjectFormData(rawData);
  if ('success' in validated) {
    return validated;
  }
  const {metadata, project, data} = validated;

  await database.registerProject(metadata.id, project.name, metadata.platform, project.slug, `${data.owner}/${data.repo}`, data.branch, data.path);
  revalidatePath('/dev');

  return {success: true};
}

export async function handleDeleteProjectForm(id: string) {

  await database.unregisterProject(id);

  revalidatePath('/dev');

  return {success: true};
}

export async function handleEditProjectForm(rawData: any) {
  const validated = await validateProjectFormData(rawData);
  if ('success' in validated) {
    return validated;
  }
  const {metadata, project, data} = validated;
  await database.updateProject(metadata.id, project.name, metadata.platform, project.slug, `${data.owner}/${data.repo}`, data.branch, data.path);
  revalidatePath('/dev');
  cacheUtil.clearModCaches(metadata.id);

  return {success: true};
}

async function validateProjectFormData(rawData: any) {
  const validatedFields = projectRegisterSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const data = validatedFields.data;

  // Ensure app is installed on repository
  const installation = await githubApp.getInstallation(data.owner, data.repo, data.branch, data.path);
  // Prompt user to install app
  if (installation && 'url' in installation) {
    return {success: false, installation_url: installation.url};
  }

  // Create auth instance
  const octokit = await githubApp.createInstance(installation!.id);

  const branches = await githubApp.getRepoBranches(octokit, data.owner, data.repo);
  if (!branches.some(b => b.name === data.branch)) {
    return {success: false, errors: {branch: ['Branch does not exist']}};
  }

  // Read docs path
  const content = await githubApp.getRepoContents(octokit, data.owner, data.repo, data.branch, validatedFields.data.path);

  if (content === null) {
    return {success: false, errors: {path: ['Invalid path provided']}};
  }

  // Parse metadata file
  const metadata = await readMetadata(octokit, data.owner, data.repo, data.branch, validatedFields.data.path);
  if (metadata === null) {
    return {success: false, error: 'Metadata file not found'};
  }

  const project = await platforms.getPlatformProject(metadata.platform, metadata.slug);

  // TODO Validate ownership n' stuff
  if (!process.env.NODE_ENV && !verifyProjectOwnership(project, data.owner, data.repo)) {
    return {success: false, error: 'Failed to verify project ownership'};
  }

  return {metadata, project, data};
}

function verifyProjectOwnership(project: ModProject, owner: string, repo: string): boolean {
  const baseUrl: string = `https://github.com/${owner}/${repo}`;
  return project.source_url !== undefined && project.source_url.startsWith(baseUrl);
}

async function readMetadata(octokit: Octokit, owner: string, repo: string, branch: string, root: string) {
  const metadataPath = root + '/' + metadata.metadataFileName;
  const metaFile = await githubApp.getRepoContents(octokit, owner, repo, branch, metadataPath);

  if (metaFile && 'content' in metaFile) {
    const content = Buffer.from(metaFile.content, 'base64').toString('utf-8');
    return metadata.parseMetadata(content);
  }

  return null;
}