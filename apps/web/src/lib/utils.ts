export function trimText(str: string, len: number) {
  return str.length > len ? `${str.substring(0, len)}...` : str;
}

export function getProcessURL(): string {
  return process.env.NEXT_PUBLIC_NEXT_APP_URL || 'http://localhost:3000';
}

export async function resolveSoft<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}
