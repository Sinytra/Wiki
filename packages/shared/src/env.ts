import { requireEnvVar } from './util';

function isPreview(): boolean {
  return process.env.ENABLE_LOCAL_PREVIEW === 'true';
}

function getBackendSecretApiKey(): string {
  return requireEnvVar('BACKEND_API_KEY');
}

function getPosthogEndpointURL(): string | null {
  return process.env.POSTHOG_URL ?? null;
}

function getPosthogProjectID(): string | null {
  return process.env.POSTHOG_PROJECT_ID ?? null;
}

function getPosthogAPIKey(): string | null {
  return process.env.POSTHOG_API_KEY ?? null;
}

function getPosthogPopularProjectsIndexName(): string | null {
  return process.env.POSTHOG_POPULAR_PROJECTS_INDEX ?? null;
}

function getCrowdinUrl(): string | null {
  return process.env.CROWDIN_URL ?? null;
}

const env = {
  isPreview,
  getBackendSecretApiKey,
  getPosthogEndpointURL,
  getPosthogProjectID,
  getPosthogAPIKey,
  getPosthogPopularProjectsIndexName,
  getCrowdinUrl
};

export default env;