import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stripHtmlTags = (html: string | undefined) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
};
