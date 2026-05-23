import {z} from 'zod';
import {projectUpdateSourceSchema, projectRegisterSchema} from '@/lib/forms/schemas';
import commonNetwork, {ApiCallResult} from '@repo/shared/commonNetwork';
import {MessageResponse, ProjectCreatedResponse} from '@sinytra/wiki-api-types';

async function registerProject(body: z.infer<typeof projectRegisterSchema>): Promise<ApiCallResult<ProjectCreatedResponse>> {
  return commonNetwork.resolveApiCall(() => commonNetwork.sendDataRequest('dev/projects', {
    body,
    includeCredentials: true
  }));
}

async function updateProject(body: z.infer<typeof projectUpdateSourceSchema>): Promise<ApiCallResult<MessageResponse>> {
  return commonNetwork.resolveApiCall(() => commonNetwork.sendDataRequest('dev/projects', {
    method: 'PUT',
    body,
    includeCredentials: true
  }));
}

export default {
  registerProject,
  updateProject
};