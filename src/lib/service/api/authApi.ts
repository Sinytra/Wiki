import network, {ApiCallResult} from "@repo/shared/network";
import {UserProfile} from "@repo/shared/types/api/auth";

async function getUserProfile(): Promise<ApiCallResult<UserProfile>> {
  return network.resolveApiCall<UserProfile>(() => network.sendSimpleRequest('auth/user'));
}

async function deleteUserAcount(): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest('auth/user', { method: 'DELETE' }));
}

async function linkModrinthAcount(): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest('auth/link/modrinth'));
}

async function unlinkModrinthAcount(): Promise<ApiCallResult> {
  return network.resolveApiCall(() => network.sendSimpleRequest('auth/unlink/modrinth'));
}

export default {
  getUserProfile,
  deleteUserAcount,
  linkModrinthAcount,
  unlinkModrinthAcount
}
