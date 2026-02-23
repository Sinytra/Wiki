import network from "@repo/shared/network";
import {ApiCallResult, ApiRouteParameters} from '@repo/shared/commonNetwork';
import {ProjectSearchResults} from "@repo/shared/types/service";
import {time} from "@repo/shared/constants";
import {revalidateTag} from "next/cache";

const SEARCH_PROJECTS_TAG = 'search-projects';

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
      tags: [SEARCH_PROJECTS_TAG],
      revalidate: time.ONE_MINUTE * 15
    }
  }))
}

function invalidateBrowseSearch() {
  revalidateTag(SEARCH_PROJECTS_TAG);
}

export default {
  searchProjects,
  invalidateBrowseSearch
};