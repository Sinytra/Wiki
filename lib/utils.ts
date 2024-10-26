import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getHttpErrorDetailsURL(status: number): string {
  return `https://http.cat/${status}`;
}

export function getProcessURL(): string {
  return process.env.NEXT_APP_URL || 'http://localhost:3000';
}