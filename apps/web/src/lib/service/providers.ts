import { ServiceProviderFactory } from '@repo/shared/types/service';
import { serviceProviderFactory as remoteServiceProviderFactory } from '@/lib/service/remoteService';

export const serviceProviders: ServiceProviderFactory[] = [remoteServiceProviderFactory];
