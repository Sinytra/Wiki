import {getLocalDocumentationSources} from "./localDocs";

export {serviceProviderFactory as localServiceProviderFactory} from './localService';
export {type LocalDocumentationSource} from './localDocs';

const previewer = {
  getLocalDocumentationSources
}

export default previewer;