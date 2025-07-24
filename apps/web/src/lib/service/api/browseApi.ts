import network, {ApiCallResult, ApiRouteParameters} from "@repo/shared/network";
import {ProjectSearchResults} from "@repo/shared/types/service";

interface SearchProjectsParameters extends ApiRouteParameters {
  query: string;
  page: string;
  types: string | null;
  sort: string | null;
}

async function searchProjects(parameters: SearchProjectsParameters): Promise<ApiCallResult<ProjectSearchResults>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('browse', { parameters }))
}

export default {
  searchProjects
};