import network from "@repo/shared/network";
import {ApiCallResult, ApiRouteParameters} from '@repo/shared/commonNetwork';
import {ProjectSearchResults} from "@repo/shared/types/service";
import {time} from "@repo/shared/constants";

interface SearchProjectsParameters extends ApiRouteParameters {
  query: string;
  page: string;
  types: string | null;
  sort: string | null;
}

async function searchProjects(parameters: SearchProjectsParameters): Promise<ApiCallResult<ProjectSearchResults>> {
  return network.resolveApiCall(() => network.sendSimpleRequest('browse', {
    parameters,
    userAuth: false,
    cache: {
      tags: ['search-projects'],
      revalidate: time.ONE_MINUTE * 15
    }
  }))
}

export default {
  searchProjects
};