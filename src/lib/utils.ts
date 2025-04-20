import { clsx, type ClassValue } from "clsx"
import { franc } from "franc";
import { twMerge } from "tailwind-merge"

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTextDirection(text: string) {
  const rtlLanguages = ["prs", "pes", "arb", "urd"];
  const detectedLanguage = franc(text);
  return rtlLanguages.includes(detectedLanguage) ? "rtl" : "ltr";
}
