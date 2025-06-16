export function requireEnvVar(envVar: string): string {
  const value = process.env[envVar];
  if (value === null || value === undefined) {
    throw new Error(`Missing environment variable ${value}`);
  }
  return value;
}

export function serializeUrlParams(paramseters?: Record<string, string | null>) {
  const searchParams = new URLSearchParams();
  if (paramseters) {
    for (const key in paramseters) {
      if (paramseters[key] != null) {
        searchParams.set(key, paramseters[key]);
      }
    }
  }
  return searchParams.toString();
}