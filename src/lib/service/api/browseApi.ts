import network, {ApiCallResult} from "@repo/shared/network";
import {ProjectSearchResults} from "@repo/shared/types/service";

interface SearchProjectsParameters extends Record<string, string | null> {
  query: string;
  page: string;
  types: string | null;
  sort: string | null;
}

async function searchProjects(parameters: SearchProjectsParameters): Promise<ApiCallResult<ProjectSearchResults>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('browse', { parameters }))
}

const browseApi = {
  searchProjects
};

export default browseApi;