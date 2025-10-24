import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeUrl(url: string | undefined | null): string {
  if (!url) return "";
  
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return "";
  
  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }
  
  return `https://${trimmedUrl}`;
}
