import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getHttpErrorDetailsURL(status: number): string {
  return `https://http.cat/${status}`;
}

export function getProcessURL(): string {
  return process.env.NEXT_PUBLIC_NEXT_APP_URL || 'http://localhost:3000';
}

export function isWikiAdmin(username: string): boolean {
  const admins = (process.env.ADMIN_USERS || '').split(',').map(s => s.toLowerCase());
  return admins.includes(username.toLowerCase());
}