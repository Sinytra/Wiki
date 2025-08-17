import {redirect} from "next/navigation";
import {handleApiCall} from "@/lib/service/serviceUtil";
import authApi from "@/lib/service/api/authApi";
import {UserProfile, UserRole} from "@repo/shared/types/api/auth";

export async function assertUserIsAdmin(): Promise<UserProfile | null> {
  const profile = handleApiCall(await authApi.getUserProfile());
  if (profile.role !== UserRole.ADMIN) {
    redirect('/');
  }
  return profile;
}