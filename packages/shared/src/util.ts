export function requireEnvVar(envVar: string): string {
  const value = process.env[envVar];
  if (value === null || value === undefined) {
    throw new Error(`Missing environment variable ${envVar}`);
  }
  return value;
}

export type ParameterProcessor = (key: string, value: string) => string | undefined | null;

export function serializeUrlParams(parameters?: Record<string, string | undefined | null>, processor?: ParameterProcessor) {
  const searchParams = new URLSearchParams();
  if (parameters) {
    for (const key in parameters) {
      if (parameters[key] != null) {
        const value = processor ? processor(key, parameters[key]) : parameters[key];
        if (value) {
          searchParams.set(key, value);
        }
      }
    }
  }
  return searchParams.toString();
}

export function getGitHubAvatarUrl(username: string) {
  return `https://github.com/${username}.png`;
}