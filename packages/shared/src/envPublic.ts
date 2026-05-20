import {assertEnvVar} from './util';

function getBackendEndpointUrl(): string {
  const value = process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;
  return assertEnvVar('NEXT_PUBLIC_BACKEND_SERVICE_URL', value);
}

function getDocsUrl(): string | null {
  return process.env.NEXT_PUBLIC_DOCS_URL ?? null;
}

const envPublic = {
  getBackendEndpointUrl,
  getDocsUrl
};

export default envPublic;