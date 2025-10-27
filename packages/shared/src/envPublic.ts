import {requireEnvVar} from './util';

function getBackendEndpointUrl(): string {
  return requireEnvVar('NEXT_PUBLIC_BACKEND_SERVICE_URL');
}

function getDocsUrl(): string | null {
  return process.env.NEXT_PUBLIC_DOCS_URL ?? null;
}

const envPublic = {
  getBackendEndpointUrl,
  getDocsUrl
};

export default envPublic;