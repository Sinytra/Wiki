import { ServiceProviderFactory } from '@repo/shared/types/service';
import { serviceProviderFactory as remoteServiceProviderFactory } from '@/lib/service/remoteService';
import { localServiceProviderFactory } from '@/lib/previewer';

export const serviceProviders: ServiceProviderFactory[] = [localServiceProviderFactory, remoteServiceProviderFactory];
