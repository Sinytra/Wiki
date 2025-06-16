import {requireEnvVar} from "./util";

function getBackendEndpointUrl(): string {
  return requireEnvVar('NEXT_PUBLIC_BACKEND_SERVICE_URL');
}

const envPublic = {
  getBackendEndpointUrl
}

export default envPublic;