import { getLocalDocumentationSources } from './localDocsPages';

export { default as localService, serviceProviderFactory as localServiceProviderFactory } from './localService';
export { type LocalDocumentationSource } from './localDocsPages';

const previewer = {
  getLocalDocumentationSources
};

export default previewer;
