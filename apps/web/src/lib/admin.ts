import {redirect} from 'next/navigation';
import {handleApiCall} from '@/lib/service/serviceUtil';
import authApi from '@/lib/service/api/authApi';
import {UserProfile} from '@sinytra/wiki-api-types';

export async function assertUserIsAdmin(): Promise<UserProfile | null> {
  const profile = handleApiCall(await authApi.getUserProfile());
  if (profile.role !== 'admin') {
    redirect('/');
  }
  return profile;
}