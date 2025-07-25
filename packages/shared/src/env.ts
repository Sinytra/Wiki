import { requireEnvVar } from './util';

function isPreview(): boolean {
  return process.env.ENABLE_LOCAL_PREVIEW === 'true';
}

function getBackendSecretApiKey(): string {
  return requireEnvVar('BACKEND_API_KEY');
}

const env = {
  isPreview,
  getBackendSecretApiKey
};

export default env;