import remoteServiceApi from "@/lib/service/remoteServiceApi";
import {UserProfile, UserRole} from "@/lib/service/types";
import {redirect} from "next/navigation";
import {handleApiResponse} from "@/lib/service/serviceUtil";

export async function assertUserIsAdmin(): Promise<UserProfile | null> {
  const response = handleApiResponse(await remoteServiceApi.getUserProfile());
  if (response.role !== UserRole.ADMIN) {
    redirect('/');
  }
  return response;
}