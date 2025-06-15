function isPreview(): boolean {
  return process.env.ENABLE_LOCAL_PREVIEW === 'true';
}

const env = {
  isPreview
}

export default env;