import remoteServiceApi from "@/lib/service/remoteServiceApi";
import authSession from "@/lib/authSession";
import {UserProfile, UserRole} from "@/lib/service/types";
import {redirect} from "next/navigation";

export async function assertUserIsAdmin(): Promise<UserProfile | null> {
  const response = await remoteServiceApi.getUserProfile();
  if ('status' in response) {
    if (response.status === 401) {
      authSession.refresh();
      return null;
    }
    throw new Error("Unexpected response status: " + response.status);
  }
  if (response.role !== UserRole.ADMIN) {
    redirect('/');
  }
  return response;
}